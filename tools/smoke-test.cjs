// End-to-end smoke test of the KEEK app (web/extension build) in headless Chrome.
// Groq is mocked, so no API key or network is needed.
//   npm i -D playwright && node tools/smoke-test.cjs   (set CHROME=/path/to/chrome to use a local Chrome)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const OUT = process.env.SHOTS || path.join(ROOT, 'tools', 'screens');
fs.mkdirSync(OUT, { recursive: true });

function wavBytes(sec = 3, rate = 16000) {
  const n = sec * rate, b = Buffer.alloc(44 + n * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(Math.sin(i / rate * 2 * Math.PI * 440) * 8000), 44 + i * 2);
  return b;
}

const ANALYSIS = {
  overview: 'اجتماع لمراجعة خطة الإطلاق. اتفق الفريق على موعد الإطلاق وتوزيع المهام.',
  topics: ['الإطلاق', 'التسويق'],
  points: [{ title: 'موعد الإطلاق', detail: 'الإطلاق يوم ١ ديسمبر.', refs: [1] }],
  decisions: [{ title: 'الإطلاق يوم ١ ديسمبر', description: 'تم الاتفاق صراحة.', refs: [1, 2], confidence: 'high' }],
  actions: [{ title: 'تجهيز حملة التسويق', description: '', owner: 'Mona', due_text: 'next week', due_iso: null, refs: [3], confidence: 'high' }],
  questions: [{ text: 'هل نحتاج نسخة iOS؟', refs: [4] }],
  risks: [], followup: { subject: 'ملخص', body: 'شكراً للجميع.' }
};

(async () => {
  const errors = [];
  const browser = await chromium.launch({
    executablePath: process.env.CHROME || undefined,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required']
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_NAME|ERR_INTERNET|net::/.test(m.text())) errors.push('console: ' + m.text()); });

  const calls = { chat: 0, stt: 0, models: 0 };
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
  await page.route('https://api.groq.com/**', async route => {
    const req = route.request(), url = req.url();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (url.endsWith('/models')) { calls.models++; return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'llama-3.3-70b-versatile' }, { id: 'whisper-large-v3' }] }) }); }
    if (url.includes('/audio/transcriptions')) {
      calls.stt++;
      return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ language: 'arabic', segments: [{ start: 0.5, end: 2, text: ' أهلاً بكم في الاجتماع', no_speech_prob: 0.01, avg_logprob: -0.2 }, { start: 2, end: 3, text: ' The launch is on track', no_speech_prob: 0.01, avg_logprob: -0.2 }] }) });
    }
    if (url.includes('/chat/completions')) {
      calls.chat++;
      const body = JSON.parse(req.postData() || '{}');
      if (body.stream) {
        const parts = ['تم الاتفاق على الإطلاق ', 'يوم ١ ديسمبر [1].', '\nCONFIDENCE: high'];
        const sse = parts.map(p => 'data: ' + JSON.stringify({ choices: [{ delta: { content: p } }] }) + '\n\n').join('') + 'data: [DONE]\n\n';
        return route.fulfill({ status: 200, headers: cors, contentType: 'text/event-stream', body: sse });
      }
      return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: JSON.stringify(ANALYSIS) } }] }) });
    }
    return route.fulfill({ status: 404, headers: cors, body: '{}' });
  });

  const step = async (name, fn) => { process.stdout.write('• ' + name + ' … '); await fn(); console.log('ok'); };
  const click = sel => page.click(sel);

  await page.goto('file://' + path.join(ROOT, 'extension', 'app', 'index.html'));

  await step('onboarding → sample workspace', async () => {
    await page.waitForSelector('[data-act="onbNext"]');
    await click('[data-act="onbNext"]');
    await page.fill('#onbName', 'سارة عادل');
    await click('[data-act="onbNext"]');
    await click('[data-act="onbNext"]');
    await click('[data-act="onbFinish"][data-v="sample"]');
    await page.waitForSelector('.strip');
    await page.screenshot({ path: path.join(OUT, '1-dashboard.png') });
  });

  await step('AI setup banner points to settings', async () => {
    await click('[data-act="nav"][data-to="search"]');
    await page.waitForSelector('[data-act="kxOpenAi"]');
    await click('[data-act="kxOpenAi"]');
    await page.waitForSelector('#kxKey_groq');
  });

  await step('save Groq key, auto-test lists models', async () => {
    await page.fill('#kxKey_groq', 'gsk_test_abcd1234');
    await page.fill('#kxChunk', '8');
    await page.selectOption('#kxLive', 'cloud');
    await click('[data-act="kxAiSave"]');
    await page.waitForFunction(() => document.body.innerText.includes('…1234'));
    await page.waitForFunction(() => /نموذج متاح|models available/.test(document.body.innerText));
    await page.screenshot({ path: path.join(OUT, '2-ai-settings.png'), fullPage: true });
  });

  await step('import transcript → analysis completes with decisions & tasks', async () => {
    await click('[data-act="nav"][data-to="meetings"]');
    await click('.col-head [data-act="newMeeting"]');
    await click('[data-act="importModal"]');
    await page.fill('#imTitle', 'خطة الإطلاق');
    await page.fill('#imText', '[00:01] Omar: Let us launch on December 1st.\n[00:10] Mona: موافقة، الإطلاق يوم ١ ديسمبر.\n[00:20] Omar: Mona please prepare the marketing campaign next week.\n[00:30] Mona: هل نحتاج نسخة iOS؟');
    await click('[data-act="saveImport"]');
    await page.waitForFunction(() => document.querySelector('.pipeline') && !document.querySelector('.pipeline .now') && document.querySelector('.strip'), null, { timeout: 15000 });
    const txt = await page.innerText('#splitDetail');
    if (!txt.includes('الإطلاق يوم ١ ديسمبر')) throw new Error('decision missing');
    await page.screenshot({ path: path.join(OUT, '3-meeting.png') });
  });

  await step('AI search streams an answer with a source chip', async () => {
    await click('[data-act="nav"][data-to="search"]');
    await page.fill('#sInput', 'متى الإطلاق؟');
    await click('[data-act="runSearch"]');
    await page.waitForFunction(() => document.querySelector('#answerBox .src') && document.body.innerText.includes('ديسمبر'), null, { timeout: 10000 });
    await page.screenshot({ path: path.join(OUT, '4-search.png') });
  });

  await step('upload audio → automatic transcription → import sheet prefilled', async () => {
    await click('[data-act="nav"][data-to="meetings"]');
    await click('.col-head [data-act="newMeeting"]');
    await click('[data-act="uploadModal"]');
    await page.setInputFiles('#audioFile', { name: 'call.wav', mimeType: 'audio/wav', buffer: wavBytes(3) });
    await page.waitForSelector('[data-act="uploadTranscribe"]:not([disabled])');
    await page.screenshot({ path: path.join(OUT, '5-upload.png') });
    await click('[data-act="uploadTranscribe"]');
    await page.waitForFunction(() => { const t = document.querySelector('#imText'); return t && t.value.includes('أهلاً بكم'); }, null, { timeout: 10000 });
    const v = await page.inputValue('#imText');
    if (!/^\[00:00\] أهلاً بكم في الاجتماع\n\[00:02\] The launch is on track$/.test(v)) throw new Error('unexpected transcript: ' + v);
    await click('[data-act="modalClose"]');
  });

  await step('record with fake mic → live cloud chunks → review text', async () => {
    await click('[data-act="nav"][data-to="meetings"]');
    await click('.col-head [data-act="newMeeting"]');
    await click('[data-act="goRecord"]');
    await page.waitForSelector('[data-kx="sys"]');
    await page.check('.consent input');
    await click('[data-act="recStart"]');
    await page.waitForSelector('[data-act="recStop"]');
    await page.waitForTimeout(9500);
    await page.screenshot({ path: path.join(OUT, '6-recording.png') });
    await click('[data-act="recStop"]');
    await page.waitForFunction(() => { const t = document.querySelector('#recText'); return t && t.value.includes('أهلاً بكم'); }, null, { timeout: 15000 });
    await page.screenshot({ path: path.join(OUT, '7-review.png') });
  });

  await step('integrations: connect Slack + Linear, send a meeting from Share', async () => {
    const hits = { slack: [], linear: [] };
    await page.route('https://hooks.slack.com/**', route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      hits.slack.push(JSON.parse(route.request().postData() || '{}'));
      return route.fulfill({ status: 200, headers: cors, body: 'ok' });
    });
    await page.route('https://api.linear.app/**', route => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      const b = JSON.parse(route.request().postData() || '{}');
      hits.linear.push(b);
      const data = b.query.includes('viewer')
        ? { viewer: { name: 'Sara' }, teams: { nodes: [{ id: 'a', key: 'ENG', name: 'Engineering' }, { id: 'b', key: 'DES', name: 'Design' }] } }
        : { issueCreate: { success: true, issue: { id: 'i1', identifier: 'ENG-7', url: 'https://linear.app/acme/issue/ENG-7' } } };
      return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ data }) });
    });
    await click('[data-act="nav"][data-to="integrations"]');
    await click('[data-act="kxIntEdit"][data-k="slack"]');
    await page.fill('[data-kxi="slack:url"]', 'https://hooks.slack.com/services/T0/B0/abc123');
    await click('[data-act="kxIntConnect"][data-k="slack"]');
    await page.waitForSelector('[data-act="kxIntRemove"][data-k="slack"]');
    await click('[data-act="kxIntEdit"][data-k="linear"]');
    await page.fill('[data-kxi="linear:apiKey"]', 'lin_api_test');
    await click('[data-act="kxIntConnect"][data-k="linear"]');
    await page.waitForSelector('select[data-kxi="linear:teamId"]');           // two teams → choose one
    await page.selectOption('select[data-kxi="linear:teamId"]', 'a');
    await click('[data-act="kxIntConnect"][data-k="linear"]');
    await page.waitForSelector('[data-act="kxIntRemove"][data-k="linear"]');
    await page.screenshot({ path: path.join(OUT, '8a-integrations.png'), fullPage: true });

    await page.evaluate(() => { const m = S.meetings.find(x => x.title === 'خطة الإطلاق'); go('meeting', { id: m.id }); });
    await click('[data-act="shareModal"]');
    await click('[data-act="kxIntSend"][data-k="slack"]');
    await page.waitForFunction(() => document.querySelector('.modal') && document.querySelector('.modal').innerText.includes('✓'), null, { timeout: 8000 });
    await click('[data-act="kxIntSend"][data-k="linear"]');
    await page.waitForFunction(() => document.querySelector('.modal') && document.querySelector('.modal').innerText.includes('ENG-7'), null, { timeout: 8000 });
    await page.screenshot({ path: path.join(OUT, '8b-share.png') });
    const last = hits.slack.at(-1);
    if (!last || !last.text.includes('الإطلاق يوم ١ ديسمبر')) throw new Error('Slack message missing the decision: ' + JSON.stringify(last));
    const create = hits.linear.find(b => b.query.includes('issueCreate'));
    if (!create || create.variables.input.teamId !== 'a' || create.variables.input.title !== 'تجهيز حملة التسويق') throw new Error('Linear issue not created as expected');
    const sent = await page.evaluate(() => S.tasks.filter(x => x.ext && x.ext.linear).map(x => x.ext.linear.key));
    if (sent.join() !== 'ENG-7') throw new Error('task not marked as sent: ' + sent);
    if (!(await page.$('[data-act="kxIntSend"][data-k="linear"][disabled]'))) throw new Error('Linear send should be disabled once everything is sent');
    await click('[data-act="modalClose"]');
  });

  await step('calendar + Zoom: upcoming meetings on the dashboard, record one, import a Zoom transcript', async () => {
    const z = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const t0 = new Date(Date.now() + 2 * 36e5), t1 = new Date(t0.getTime() + 30 * 6e4);
    const ics = ['BEGIN:VCALENDAR', 'X-WR-CALNAME:Work', 'BEGIN:VEVENT', 'UID:e1', 'SUMMARY:Client sync', 'DTSTART:' + z(t0), 'DTEND:' + z(t1),
      'DESCRIPTION:Join https://meet.google.com/abc-defg-hij', 'ATTENDEE;CN=Nour:mailto:n@x.co', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    await page.route('https://calendar.google.com/**', route => route.fulfill({ status: 200, headers: cors, contentType: 'text/calendar', body: ics }));
    const zs = new Date(Date.now() + 26 * 36e5).toISOString();
    await page.route(/https:\/\/(api\.)?zoom\.us\/.*/, route => {
      const req = route.request(), url = req.url();
      if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      const j = body => route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify(body) });
      if (url.includes('/oauth/token')) return j({ access_token: 'tok', expires_in: 3600 });
      if (url.includes('/rec/download')) return route.fulfill({ status: 200, headers: cors, contentType: 'text/vtt', body: 'WEBVTT\n\n1\n00:00:04.000 --> 00:00:06.000\nNour: Budget is approved.\n' });
      if (/\/users\/[^/]+$/.test(url.split('?')[0])) return j({ display_name: 'Sara', email: 's@x.co' });
      if (url.includes('/meetings?type=upcoming')) return j({ meetings: [{ id: 5, topic: 'Zoom standup', start_time: zs, duration: 15, join_url: 'https://zoom.us/j/5' }] });
      if (url.includes('/recordings?')) return j({ meetings: [{ uuid: 'u1==', topic: 'Budget review', start_time: '2026-11-10T10:00:00Z', duration: 40, recording_files: [{ file_type: 'TRANSCRIPT' }] }] });
      if (url.includes('/meetings/u1%3D%3D/recordings')) return j({ topic: 'Budget review', start_time: '2026-11-10T10:00:00Z', recording_files: [{ file_type: 'TRANSCRIPT', download_url: 'https://zoom.us/rec/download/abc' }] });
      return route.fulfill({ status: 404, headers: cors, body: '{}' });
    });
    await click('[data-act="nav"][data-to="integrations"]');
    await click('[data-act="kxIntEdit"][data-k="gcal"]');
    await page.fill('[data-kxi="gcal:url"]', 'https://calendar.google.com/calendar/ical/x/private-y/basic.ics');
    await click('[data-act="kxIntConnect"][data-k="gcal"]');
    await page.waitForSelector('[data-act="kxIntRemove"][data-k="gcal"]');
    await click('[data-act="kxIntEdit"][data-k="zoom"]');
    await page.fill('[data-kxi="zoom:accountId"]', 'acc');
    await page.fill('[data-kxi="zoom:clientId"]', 'cid');
    await page.fill('[data-kxi="zoom:clientSecret"]', 'csec');
    await page.fill('[data-kxi="zoom:user"]', 's@x.co');
    await click('[data-act="kxIntConnect"][data-k="zoom"]');
    await page.waitForSelector('[data-act="kxIntRemove"][data-k="zoom"]');

    // an earlier step left a recording in review; discard it so "Record" can start a new one
    await page.evaluate(() => { if (REC.state === 'stopped') CONFIRM.discardRecording(); });
    await click('[data-act="nav"][data-to="dashboard"]');
    await page.waitForFunction(() => document.body.innerText.includes('Client sync') && document.body.innerText.includes('Zoom standup'), null, { timeout: 8000 });
    await page.screenshot({ path: path.join(OUT, '8c-upcoming.png') });
    await click('[data-act="kxRecEvent"][data-i="0"]');
    await page.waitForSelector('[data-act="recStart"]');
    const form = await page.evaluate(() => ({ title: REC.form.title, url: REC.form.url, platform: REC.form.platform, ppl: REC.form.participants }));
    if (form.title !== 'Client sync' || form.platform !== 'meet' || form.url !== 'https://meet.google.com/abc-defg-hij' || form.ppl !== 'Nour') throw new Error('record form not prefilled: ' + JSON.stringify(form));

    await click('[data-act="nav"][data-to="integrations"]');
    await click('[data-act="kxZoomRecs"]');
    await page.waitForSelector('[data-act="kxZoomImport"]');
    await click('[data-act="kxZoomImport"][data-i="0"]');
    await page.waitForFunction(() => { const t = document.querySelector('#imText'); return t && t.value.includes('Budget is approved'); }, null, { timeout: 8000 });
    if ((await page.inputValue('#imText')) !== '[00:04] Nour: Budget is approved.') throw new Error('zoom transcript not prefilled');
    if ((await page.inputValue('#imTitle')) !== 'Budget review') throw new Error('zoom title not prefilled');
    await click('[data-act="modalClose"]');
  });

  await step('English UI + dark theme render', async () => {
    await click('[data-act="setLang"]');
    await click('[data-act="nav"][data-to="integrations"]');
    await page.waitForFunction(() => document.body.innerText.includes('AI (Groq + Gemini)'));
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.screenshot({ path: path.join(OUT, '8-integrations-en-dark.png') });
  });

  console.log('calls:', JSON.stringify(calls));
  await browser.close();
  if (errors.length) { console.error('Errors:\n' + errors.join('\n')); process.exit(1); }
  console.log('ALL SMOKE TESTS PASSED');
})().catch(e => { console.error('FAILED:', e); process.exit(1); });
