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
