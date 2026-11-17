// Run: node --test shared/nlp/keek-nlp.test.js   (no network, no API keys needed)
const test = require('node:test');
const assert = require('node:assert/strict');
const KeekNLP = require('./keek-nlp.js');

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: Object.assign({ 'content-type': 'application/json' }, headers) });
}
function sse(chunks) {
  const enc = new TextEncoder();
  return new Response(new ReadableStream({
    start(c) { chunks.forEach(x => c.enqueue(enc.encode('data: ' + x + '\n\n'))); c.close(); }
  }), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}
function mockFetch(handler) {
  const calls = [];
  const f = async (url, init) => { calls.push({ url: String(url), init }); return handler(String(url), init, calls.length); };
  f.calls = calls;
  return f;
}
const groqOk = text => json({ choices: [{ message: { content: text } }] });
const gemOk = text => json({ candidates: [{ content: { parts: [{ text }] } }] });

test('no keys → no_key error', async () => {
  const nlp = KeekNLP.create({}, { fetch: mockFetch(() => groqOk('x')) });
  await assert.rejects(nlp.complete('hi'), e => e.code === 'no_key');
});

test('auto: short prompt goes to Groq first', async () => {
  const f = mockFetch(url => url.includes('groq') ? groqOk('hello') : gemOk('nope'));
  const nlp = KeekNLP.create({ groqKey: 'g', geminiKey: 'm' }, { fetch: f });
  assert.equal(await nlp.complete('hi'), 'hello');
  assert.match(f.calls[0].url, /api\.groq\.com\/openai\/v1\/chat\/completions/);
  assert.equal(f.calls[0].init.headers.Authorization, 'Bearer g');
});

test('auto: long prompt goes to Gemini first', async () => {
  const f = mockFetch(url => url.includes('generativelanguage') ? gemOk('long ok') : groqOk('no'));
  const nlp = KeekNLP.create({ groqKey: 'g', geminiKey: 'm' }, { fetch: f });
  assert.equal(await nlp.complete('word '.repeat(20000)), 'long ok');
  assert.match(f.calls[0].url, /gemini-3\.8-flash:generateContent/);
  assert.equal(f.calls[0].init.headers['x-goog-api-key'], 'm');
  const gc = JSON.parse(f.calls[0].init.body).generationConfig;
  assert.deepEqual(gc, { thinkingConfig: { thinkingLevel: 'low' } }); // no temperature on 3.x
});

test('Gemini: rejected optional field → retried once with minimal config', async () => {
  const f = mockFetch((url, init, n) => n === 1
    ? json({ error: { message: 'Invalid JSON payload received. Unknown name "thinkingLevel" at generation_config.thinking_config' } }, 400)
    : gemOk('{"ok":1}'));
  const nlp = KeekNLP.create({ geminiKey: 'm' }, { fetch: f });
  assert.deepEqual(await nlp.json('x'), { ok: 1 });
  assert.equal(f.calls.length, 2);
  assert.deepEqual(JSON.parse(f.calls[1].init.body).generationConfig, { responseMimeType: 'application/json' });
  // Gemini 2.x keeps temperature and gets no thinking config
  const f2 = mockFetch(() => gemOk('hi'));
  await KeekNLP.create({ geminiKey: 'm', geminiModel: 'gemini-2.5-flash' }, { fetch: f2 }).complete('x');
  assert.deepEqual(JSON.parse(f2.calls[0].init.body).generationConfig, { temperature: 0.2 });
});

test('fallback: Groq 413 → Gemini', async () => {
  const f = mockFetch(url => url.includes('groq') ? json({ error: { message: 'Request too large for model' } }, 413) : gemOk('{"a":1}'));
  const nlp = KeekNLP.create({ groqKey: 'g', geminiKey: 'm' }, { fetch: f });
  assert.deepEqual(await nlp.json('give json'), { a: 1 });
  const s = nlp.stats();
  assert.equal(s.groq.errors, 1);
  assert.equal(s.gemini.requests, 1);
});

test('rate limit with short retry-after is retried on same provider', async () => {
  const f = mockFetch((url, init, n) => n === 1 ? json({ error: { message: 'Rate limit' } }, 429, { 'retry-after': '1' }) : groqOk('after retry'));
  const nlp = KeekNLP.create({ groqKey: 'g' }, { fetch: f });
  assert.equal(await nlp.complete('x'), 'after retry');
  assert.equal(f.calls.length, 2);
});

test('Groq: retired model → picks an available chat model and retries', async () => {
  const f = mockFetch((url, init) => {
    if (url.endsWith('/models')) return json({ data: [{ id: 'whisper-large-v3' }, { id: 'llama-guard-4-12b' }, { id: 'openai/gpt-oss-120b' }] });
    const model = JSON.parse(init.body).model;
    return model === 'llama-3.3-70b-versatile'
      ? json({ error: { message: 'The model `llama-3.3-70b-versatile` does not exist or you do not have access to it.', code: 'model_not_found' } }, 404)
      : groqOk('ok from ' + model);
  });
  const nlp = KeekNLP.create({ groqKey: 'g', groqModel: 'llama-3.3-70b-versatile' }, { fetch: f });
  assert.equal(await nlp.complete('hi'), 'ok from openai/gpt-oss-120b');
  assert.equal(nlp.config().groqModel, 'openai/gpt-oss-120b');
});

test('bad key → auth error surfaces when no fallback', async () => {
  const f = mockFetch(() => json({ error: { message: 'Invalid API Key' } }, 401));
  const nlp = KeekNLP.create({ groqKey: 'bad', provider: 'groq' }, { fetch: f });
  await assert.rejects(nlp.complete('x'), e => e.code === 'auth');
});

test('JSON mode: fenced / wrapped JSON is repaired; invalid JSON falls back', async () => {
  const f1 = mockFetch(() => groqOk('Sure!\n```json\n{"ok":true}\n```'));
  assert.deepEqual(await KeekNLP.create({ groqKey: 'g' }, { fetch: f1 }).json('x'), { ok: true });
  const f2 = mockFetch(url => url.includes('groq') ? groqOk('not json at all') : gemOk('{"from":"gemini"}'));
  assert.deepEqual(await KeekNLP.create({ groqKey: 'g', geminiKey: 'm' }, { fetch: f2 }).json('x'), { from: 'gemini' });
  const body = JSON.parse(f2.calls[0].init.body);
  assert.deepEqual(body.response_format, { type: 'json_object' });
});

test('streaming: Groq SSE and Gemini SSE both deliver incremental text', async () => {
  const seen = [];
  const f = mockFetch(() => sse([JSON.stringify({ choices: [{ delta: { content: 'Hel' } }] }), JSON.stringify({ choices: [{ delta: { content: 'lo' } }] }), '[DONE]']));
  const out = await KeekNLP.create({ groqKey: 'g' }, { fetch: f }).complete('x', { onText: t => seen.push(t) });
  assert.equal(out, 'Hello');
  assert.deepEqual(seen, ['Hel', 'Hello']);
  const seen2 = [];
  const f2 = mockFetch(() => sse([JSON.stringify({ candidates: [{ content: { parts: [{ text: 'مرح' }] } }] }), JSON.stringify({ candidates: [{ content: { parts: [{ text: 'با' }] } }] })]));
  const out2 = await KeekNLP.create({ geminiKey: 'm' }, { fetch: f2 }).complete('x', { onText: t => seen2.push(t) });
  assert.equal(out2, 'مرحبا');
  assert.match(f2.calls[0].url, /streamGenerateContent\?alt=sse/);
});

test('transcribe via Groq Whisper: segments, offset, silence & hallucination filtering', async () => {
  const f = mockFetch(() => json({
    language: 'arabic', text: '...', segments: [
      { start: 0, end: 2.5, text: ' صباح الخير يا جماعة', no_speech_prob: 0.01, avg_logprob: -0.2 },
      { start: 2.5, end: 4, text: ' Thank you.', no_speech_prob: 0.1, avg_logprob: -0.3 },
      { start: 4, end: 6, text: ' noise', no_speech_prob: 0.9, avg_logprob: -1.2 },
      { start: 6, end: 8, text: ' The designs are ready', no_speech_prob: 0.02, avg_logprob: -0.1 }
    ]
  }));
  const nlp = KeekNLP.create({ groqKey: 'g' }, { fetch: f });
  const r = await nlp.transcribe({ data: new Uint8Array(5000), mimeType: 'audio/wav', language: 'ar', offsetMs: 20000 });
  assert.equal(r.provider, 'groq');
  assert.deepEqual(r.segments.map(s => [s.start, s.text]), [[20000, 'صباح الخير يا جماعة'], [26000, 'The designs are ready']]);
  const fd = f.calls[0].init.body;
  assert.equal(fd.get('model'), 'whisper-large-v3');
  assert.equal(fd.get('language'), 'ar');
  assert.equal(fd.get('response_format'), 'verbose_json');
  assert.equal(fd.get('file').name, 'audio.wav');
});

test('transcribe via Gemini: inline audio + JSON segments with clock times', async () => {
  const f = mockFetch(() => gemOk(JSON.stringify({ segments: [{ start: '00:03', speaker: 'Speaker 1', text: 'Hello' }, { start: '1:02:05', speaker: 'Speaker 2', text: 'أهلاً' }] })));
  const nlp = KeekNLP.create({ geminiKey: 'm' }, { fetch: f });
  const r = await nlp.transcribe({ data: new Uint8Array(5000), mimeType: 'audio/wav', diarize: true });
  assert.equal(r.provider, 'gemini');
  assert.deepEqual(r.segments.map(s => [s.start, s.speaker, s.text]), [[3000, 'Speaker 1', 'Hello'], [3725000, 'Speaker 2', 'أهلاً']]);
  const body = JSON.parse(f.calls[0].init.body);
  assert.equal(body.contents[0].parts[0].inline_data.mime_type, 'audio/wav');
  assert.equal(body.generationConfig.responseMimeType, 'application/json');
});

test('transcribe: webm is not sent to Gemini (unsupported format)', async () => {
  const nlp = KeekNLP.create({ geminiKey: 'm' }, { fetch: mockFetch(() => gemOk('{}')) });
  await assert.rejects(nlp.transcribe({ data: new Uint8Array(5000), mimeType: 'audio/webm;codecs=opus' }), e => e.code === 'unsupported_format');
});

test('test(): lists models; config() masks keys', async () => {
  const f = mockFetch(url => url.includes('groq') ? json({ data: [{ id: 'whisper-large-v3' }, { id: 'llama-3.3-70b-versatile' }] }) : json({ models: [{ name: 'models/gemini-2.5-flash', supportedGenerationMethods: ['generateContent'] }, { name: 'models/embedding-001', supportedGenerationMethods: ['embedContent'] }] }));
  const nlp = KeekNLP.create({ groqKey: 'gsk_secret1234', geminiKey: 'AIza_secret9876' }, { fetch: f });
  assert.deepEqual((await nlp.test('groq')).models, ['llama-3.3-70b-versatile', 'whisper-large-v3']);
  assert.deepEqual((await nlp.test('gemini')).models, ['gemini-2.5-flash']);
  const c = nlp.config();
  assert.equal(c.groqKey, '…1234');
  assert.equal(c.geminiKey, '…9876');
  nlp.remove('groqKey');
  assert.equal(nlp.hasKey('groq'), false);
});

test('utils: parseClock and estimateTokens', () => {
  const u = KeekNLP.utils;
  assert.equal(u.parseClock('02:05'), 125000);
  assert.equal(u.parseClock('1:00:00'), 3600000);
  assert.equal(u.parseClock(1.5), 1500);
  assert.ok(u.estimateTokens('مرحبا بكم') > u.estimateTokens('hello you'));
});
