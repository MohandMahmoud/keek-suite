// Runs the DESKTOP renderer (desktop/renderer) in headless Chrome with a simulated preload/main
// (window.keekNative), to check the IPC contract, remote record commands and system-audio fallback.
//   npm i -D playwright && node tools/desktop-renderer-smoke.cjs
const { chromium } = require('playwright');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SHOTS = process.env.SHOTS || path.join(__dirname, 'screens');
require('fs').mkdirSync(SHOTS, { recursive: true });

const FAKE_NATIVE = `
window.keekNative = (() => {
  const db = new Map(); let cfg = { liveEngine: 'auto', chunkSec: 8 }; let nlp = null, chunk = null;
  const N = () => nlp || (nlp = KeekNLP.create(cfg));
  const wrap = async f => { try { return { ok: true, value: await f() } } catch (e) { return { ok: false, error: { code: e.code || 'error', message: e.message, provider: e.provider } } } };
  const pub = () => ({ provider: cfg.provider || 'auto', sttProvider: 'auto', liveEngine: cfg.liveEngine, chunkSec: cfg.chunkSec, groqModel: 'llama-3.3-70b-versatile', groqSttModel: 'whisper-large-v3', geminiModel: 'gemini-3.8-flash', groqMaxPromptTokens: 9000, hasGroqKey: !!cfg.groqKey, hasGeminiKey: !!cfg.geminiKey, groqKeyHint: cfg.groqKey ? '…' + cfg.groqKey.slice(-4) : '', geminiKeyHint: '', encrypted: true, stats: nlp ? nlp.stats() : {} });
  window.__ipc = [];
  return {
    dbList: p => wrap(() => [...db].filter(([k]) => k.startsWith(p + '|')).map(([k, v]) => ({ id: k.slice(p.length + 1), data: JSON.parse(v) }))),
    dbSet: (p, id, d) => wrap(() => { db.set(p + '|' + id, JSON.stringify(d)); }),
    dbDel: (p, id) => wrap(() => { db.delete(p + '|' + id); }),
    cfgGet: () => wrap(pub),
    cfgSet: patch => wrap(() => { for (const k in patch) { if (patch[k] === null) delete cfg[k]; else if (patch[k] !== '') cfg[k] = patch[k]; } nlp = null; return pub(); }),
    cfgTest: p => wrap(() => N().test(p)),
    complete: (id, prompt, o) => wrap(() => { window.__ipc.push('complete'); return N().complete(prompt, { json: o.json, onText: o.stream ? t => chunk && chunk(id, t) : undefined }); }),
    transcribe: (b, o) => wrap(() => { window.__ipc.push('transcribe:' + (b instanceof Uint8Array)); return N().transcribe(Object.assign({}, o, { data: b })); }),
    saveFile: () => wrap(() => true),
    appInfo: () => wrap(() => ({ version: '1.0.0', dataPath: '/home/user/.config/KEEK/data', token: 'ABCD-EFGH-JKLM', port: 47821 })),
    regenToken: () => wrap(() => ({ version: '1.0.0', dataPath: '/home/user/.config/KEEK/data', token: 'WXYZ-2345-6789', port: 47821 })),
    onChunk: f => { chunk = f; },
    onCommand: f => { window.__cmd = f; },
    reportState: s => { window.__state = s; },
    openExternal: () => {},
    notify: (t, b) => { (window.__notified = window.__notified || []).push(b); }
  };
})();`;

(async () => {
  const errors = [];
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|net::/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.addInitScript(FAKE_NATIVE);
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' };
  await page.route('https://api.groq.com/**', route => {
    const url = route.request().url();
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (url.endsWith('/models')) return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: '{"data":[{"id":"whisper-large-v3"}]}' });
    if (url.includes('/audio/transcriptions')) return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ segments: [{ start: 1, end: 3, text: ' Omar: we ship on Friday', no_speech_prob: 0, avg_logprob: -0.1 }] }) });
    return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: JSON.stringify({ overview: 'Weekly sync. Shipping Friday.', topics: ['release'], points: [], decisions: [{ title: 'Ship on Friday', description: '', refs: [0], confidence: 'high' }], actions: [], questions: [], risks: [], followup: { subject: '', body: '' } }) } }] }) });
  });
  const step = async (n, f) => { process.stdout.write('• ' + n + ' … '); await f(); console.log('ok'); };

  await page.goto('file://' + path.join(ROOT, 'desktop', 'renderer', 'index.html'));

  await step('onboarding shows desktop-specific copy', async () => {
    await page.click('[data-act="onbLang"][data-v="en"]');
    await page.click('[data-act="onbNext"]'); await page.click('[data-act="onbNext"]');
    await page.waitForFunction(() => document.body.innerText.includes('Installed and running'));
    await page.click('[data-act="onbNext"]');
    await page.click('[data-act="onbFinish"][data-v="empty"]');
    await page.waitForSelector('.strip');
  });

  await step('save key through IPC; new-meeting sheet offers desktop capture', async () => {
    await page.evaluate(() => { go('settings', {}, 'ai'); });
    await page.fill('#kxKey_groq', 'gsk_desktop_9999');
    await page.click('[data-act="kxAiSave"]');
    await page.waitForFunction(() => document.body.innerText.includes('…9999'));
    await page.evaluate(() => A.newMeeting());
    await page.waitForSelector('[data-act="goRecordSys"]');
    await page.click('[data-act="modalClose"]');
  });

  await step('integrations shows pairing code and regenerates it', async () => {
    await page.evaluate(() => go('integrations'));
    await page.waitForFunction(() => document.body.innerText.includes('ABCD-EFGH-JKLM'));
    await page.click('[data-act="kxNewCode"]');
    await page.waitForFunction(() => document.body.innerText.includes('WXYZ-2345-6789'));
    await page.screenshot({ path: path.join(SHOTS, 'd1-integrations.png') });
  });

  await step('extension "startRecord" command → records (fallback to mic if no loopback) → state reported', async () => {
    await page.evaluate(() => window.__cmd({ cmd: 'startRecord', consent: true, meeting: { title: 'Weekly sync', platform: 'meet', url: 'https://meet.google.com/abc-defg-hij' } }));
    await page.waitForFunction(() => window.__state && window.__state.state === 'recording', null, { timeout: 10000 });
    const st = await page.evaluate(() => window.__state);
    if (st.title !== 'Weekly sync' || st.live !== 'cloud') throw new Error('bad state ' + JSON.stringify(st));
    await page.waitForTimeout(9000);
    await page.screenshot({ path: path.join(SHOTS, 'd2-recording.png') });
  });

  await step('"stopRecord" command → review → save → analysis via IPC', async () => {
    await page.evaluate(() => window.__cmd({ cmd: 'stopRecord' }));
    await page.waitForFunction(() => { const t = document.querySelector('#recText'); return t && t.value.includes('we ship on Friday'); }, null, { timeout: 15000 });
    await page.waitForSelector('[data-act="recSave"]:not([disabled])');
    await page.click('[data-act="recSave"]');
    await page.waitForFunction(() => document.body.innerText.includes('Ship on Friday'), null, { timeout: 15000 });
    const m = await page.evaluate(() => S.meetings[0]);
    if (m.source !== 'desktop' || m.url !== 'https://meet.google.com/abc-defg-hij' || m.platform !== 'meet') throw new Error('meeting fields ' + JSON.stringify({ s: m.source, u: m.url, p: m.platform }));
    const ipc = await page.evaluate(() => window.__ipc);
    if (!ipc.includes('transcribe:true') || !ipc.includes('complete')) throw new Error('ipc ' + ipc);
    await page.screenshot({ path: path.join(SHOTS, 'd3-meeting.png') });
  });

  await browser.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log('DESKTOP RENDERER SMOKE PASSED');
})().catch(e => { console.error('FAILED:', e); process.exit(1); });
