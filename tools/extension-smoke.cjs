// Loads the unpacked extension in Chrome and tests: install → app tab, meeting detection on a
// (mocked) Google Meet page, the in-extension app with a mocked Groq key, and pairing + remote
// start/stop against the REAL desktop bridge server (desktop/src/bridge.js) running in this process.
//   npm i -D playwright && node tools/extension-smoke.cjs
const { chromium } = require('playwright');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { startBridge } = require('../desktop/src/bridge.js');

const EXT = path.join(__dirname, '..', 'extension');
const SHOTS = process.env.SHOTS || path.join(__dirname, 'screens');
fs.mkdirSync(SHOTS, { recursive: true });

(async () => {
  const errors = [];
  const cmds = [];
  let recState = { state: 'idle' };
  const bridge = await startBridge({ getToken: () => 'TEST-CODE-2345', onCommand: c => { cmds.push(c); if (c.cmd === 'startRecord') recState = { state: 'recording', title: c.meeting.title }; if (c.cmd === 'stopRecord') recState = { state: 'stopped' }; }, getState: () => recState, version: 'test', log: () => {} });
  if (!bridge) throw new Error('bridge did not start');

  const ctx = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(), 'keek-ext-')), {
    executablePath: process.env.CHROME || undefined, headless: true,
    args: ['--disable-extensions-except=' + EXT, '--load-extension=' + EXT, '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  const step = async (n, f) => { process.stdout.write('• ' + n + ' … '); await f(); console.log('ok'); };

  let sw = ctx.serviceWorkers()[0] || await ctx.waitForEvent('serviceworker', { timeout: 15000 });
  const id = new URL(sw.url()).host;
  const watch = p => { p.on('pageerror', e => errors.push(p.url() + ' pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts\.g|net::|Failed to load resource/.test(m.text())) errors.push(p.url() + ' console: ' + m.text()); }); };
  ctx.pages().forEach(watch); ctx.on('page', watch);

  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' };
  await ctx.route('https://api.groq.com/**', r => r.request().url().endsWith('/models')
    ? r.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: '{"data":[{"id":"llama-3.3-70b-versatile"}]}' })
    : r.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: 'ok' } }] }) }));
  await ctx.route('https://meet.google.com/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: '<html><head><title>Meet - abc-defg-hij</title></head><body>fake meet</body></html>' }));

  await step('install opens the KEEK app tab (extension platform)', async () => {
    let app = ctx.pages().find(p => p.url().includes('/app/index.html'));
    if (!app) app = await ctx.waitForEvent('page', { predicate: p => p.url().includes('/app/index.html'), timeout: 10000 });
    await app.waitForSelector('[data-act="onbNext"]');
    const kind = await app.evaluate(() => KEEK_PLATFORM.kind);
    if (kind !== 'extension') throw new Error('kind=' + kind);
    await app.click('[data-act="onbLang"][data-v="en"]');
    for (let i = 0; i < 3; i++) await app.click('[data-act="onbNext"]');
    await app.click('[data-act="onbFinish"][data-v="sample"]');
    await app.waitForSelector('.strip');
    await app.evaluate(() => go('settings', {}, 'ai'));
    await app.fill('#kxKey_groq', 'gsk_ext_7777');
    await app.click('[data-act="kxAiSave"]');
    await app.waitForFunction(() => document.body.innerText.includes('…7777'));
    const stored = await sw.evaluate(async () => (await chrome.storage.local.get('keek-config'))['keek-config'].groqKey);
    if (stored !== 'gsk_ext_7777') throw new Error('key not in chrome.storage');
    await app.waitForTimeout(1600); // the app debounces saves by 1.2 s
    const docs = await sw.evaluate(async () => Object.keys(await chrome.storage.local.get(null)).filter(k => k.startsWith('db|')).length);
    if (docs < 2) throw new Error('workspace not persisted in chrome.storage (' + docs + ')');
    await app.screenshot({ path: path.join(SHOTS, 'e1-app.png') });
  });

  await step('content script detects a Google Meet call', async () => {
    const meet = await ctx.newPage();
    await meet.goto('https://meet.google.com/abc-defg-hij');
    await meet.waitForTimeout(1200);
    const all = await sw.evaluate(async () => chrome.storage.session.get(null));
    const m = Object.values(all).find(v => v && v.platform === 'meet');
    if (!m || !m.inCall || m.title !== 'Google Meet abc-defg-hij' || m.url !== 'https://meet.google.com/abc-defg-hij') throw new Error(JSON.stringify(all));
  });

  await step('popup: desktop found but not paired → pair with code', async () => {
    const pop = await ctx.newPage();
    await pop.goto(`chrome-extension://${id}/popup/popup.html`);
    await pop.waitForFunction(() => !document.getElementById('pairBox').classList.contains('hidden'), null, { timeout: 8000 });
    await pop.fill('#pairCode', 'wrong-code-0000');
    await pop.click('#pairBtn');
    await pop.waitForFunction(() => document.getElementById('deskStatus').innerText.includes('didn'));
    await pop.fill('#pairCode', 'test code 2345'.replace(/ /g, ''));
    await pop.click('#pairBtn');
    await pop.waitForFunction(() => document.getElementById('deskStatus').innerText.includes('Connected'), null, { timeout: 8000 });
    await pop.screenshot({ path: path.join(SHOTS, 'e2-popup.png') });

    // consent is required
    await pop.click('#deskActions .btn.primary');
    await pop.waitForFunction(() => document.getElementById('deskHint').className.includes('err'));
    if (cmds.length) throw new Error('started without consent');
    await pop.check('#consent');
    await pop.click('#deskActions .btn.primary');
    await pop.waitForFunction(() => document.getElementById('deskStatus').innerText.includes('Recording'), null, { timeout: 8000 });
    await pop.click('#deskActions .btn.danger');
    await pop.waitForTimeout(800);
    if (cmds.map(c => c.cmd).join(',') !== 'startRecord,stopRecord') throw new Error(JSON.stringify(cmds));
    await pop.close();
  });

  await step('"record this tab" opens/reuses the app tab with the meeting pre-filled', async () => {
    const app = ctx.pages().find(p => p.url().includes('/app/index.html'));
    // send exactly the message the popup's "Record this tab" button sends
    const pop = await ctx.newPage();
    await pop.goto(`chrome-extension://${id}/popup/popup.html`);
    await pop.evaluate(async () => {
      const all = await chrome.storage.session.get(null);
      const m = Object.values(all).find(v => v && v.platform === 'meet');
      await chrome.runtime.sendMessage({ type: 'keek:openApp', cmd: { cmd: 'prepareRecord', tabId: m.tabId, sys: 'tab', consent: true, meeting: { title: m.title, url: m.url, platform: m.platform } } });
    });
    await pop.close();
    await app.waitForFunction(() => UI.route === 'record' && REC.form && REC.form.title === 'Google Meet abc-defg-hij' && REC.form.sys === 'tab' && REC.form.consent === true, null, { timeout: 8000 });
    const opts = await app.$$eval('[data-kx="sys"] option', os => os.map(o => o.value));
    if (!opts.includes('tab')) throw new Error('tab source missing: ' + opts);
    await app.screenshot({ path: path.join(SHOTS, 'e3-record-tab.png') });
  });

  await ctx.close();
  bridge.server.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log('EXTENSION SMOKE PASSED');
})().catch(e => { console.error('FAILED:', e); process.exit(1); });
