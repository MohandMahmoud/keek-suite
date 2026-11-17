/*!
 * KEEK NLP — one small module that talks to the FREE tiers of Groq and Google Gemini.
 *
 *  - complete(prompt, {json, onText})  → text or parsed JSON (chat / analysis / search answers)
 *  - transcribe({data, mimeType, ...}) → [{start, end, text, speaker}] (speech-to-text)
 *  - test(provider)                    → validates a key and lists models
 *
 * Works unchanged in: Node 18+ / Electron main process (require), Chrome extension pages and
 * service workers (<script src>), and any modern browser page. No dependencies.
 *
 * Routing ("auto"): short prompts go to Groq (very fast), long prompts go to Gemini (1M-token
 * context, generous free tier). If the first provider fails (rate limit, too large, outage,
 * bad JSON, bad key) the other one is tried automatically.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.KeekNLP = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = '1.0.0';
  const GROQ_BASE = 'https://api.groq.com/openai/v1';
  const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

  const DEFAULTS = {
    provider: 'auto',            // 'auto' | 'groq' | 'gemini'   (text analysis)
    sttProvider: 'auto',         // 'auto' | 'groq' | 'gemini'   (speech-to-text)
    groqKey: '',
    geminiKey: '',
    groqModel: 'openai/gpt-oss-120b',      // if Groq retires it, an available chat model is picked automatically
    groqSttModel: 'whisper-large-v3',      // best Arabic accuracy; 'whisper-large-v3-turbo' is faster
    geminiModel: 'gemini-3.8-flash',       // free-tier Flash model as of late 2026; change in Settings if Google moves on
    geminiSttModel: 'gemini-3.8-flash',
    geminiThinking: 'low',                 // 'low' | 'medium' | 'high' | 'default' (Gemini 3.x thinking level; low = faster, fewer tokens)
    groqMaxPromptTokens: 9000,   // Groq free tier allows ~12k tokens/min on 70B models; bigger prompts go to Gemini
    temperature: 0.2,
    timeoutMs: 180000,
    maxRetryWaitSec: 15
  };

  // Audio formats each provider accepts directly.
  const GROQ_AUDIO = /^(audio\/(mpeg|mp3|mp4|m4a|x-m4a|wav|x-wav|wave|webm|ogg|flac|x-flac|mpga)|video\/(mp4|webm))$/;
  const GEMINI_AUDIO = /^audio\/(wav|x-wav|wave|mp3|mpeg|aiff|aac|ogg|flac|x-flac)$/;

  // Whisper sometimes "hears" these on silence. Drop segments that consist only of them.
  const HALLUCINATIONS = [
    /^(thank you|thanks)( (so much|for watching|for listening))?[.!]*$/i,
    /^(please )?(like and )?subscribe.*$/i,
    /^you$/i, /^bye[.!]*$/i, /^\.+$/,
    /اشتركوا? في القناة/, /^شكرا(ً)? (لكم|للمشاهدة|على المشاهدة)[.!]*$/, /^ترجمة نانسي قنقر$/, /^نانسي قنقر$/, /^موسيقى$/, /^\[?موسيقى\]?$/
  ];

  class NLPError extends Error {
    constructor(code, message, extra) {
      super(message);
      this.name = 'NLPError';
      this.code = code; // no_key | auth | rate_limited | too_large | server | network | timeout | bad_request | bad_response | blocked | unsupported_format | aborted
      if (extra) Object.assign(this, extra);
    }
    toJSON() { return { code: this.code, message: this.message, provider: this.provider, status: this.status, retryAfter: this.retryAfter }; }
  }

  /* ---------------- helpers ---------------- */
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function estimateTokens(s) {
    s = String(s || '');
    const ar = (s.match(/[؀-ۿ]/g) || []).length;
    return Math.ceil((s.length - ar) / 3.6 + ar / 1.8);
  }

  function baseMime(m) { return String(m || '').split(';')[0].trim().toLowerCase(); }

  function extFor(mime) {
    const m = baseMime(mime);
    return ({ 'audio/webm': '.webm', 'video/webm': '.webm', 'audio/ogg': '.ogg', 'audio/wav': '.wav', 'audio/x-wav': '.wav', 'audio/wave': '.wav',
      'audio/mpeg': '.mp3', 'audio/mp3': '.mp3', 'audio/mp4': '.m4a', 'audio/x-m4a': '.m4a', 'audio/m4a': '.m4a', 'video/mp4': '.mp4',
      'audio/flac': '.flac', 'audio/x-flac': '.flac', 'audio/aac': '.aac' })[m] || '.webm';
  }

  function toBase64(bytes) {
    if (typeof Buffer !== 'undefined') return Buffer.from(bytes.buffer ? bytes : new Uint8Array(bytes)).toString('base64');
    let s = ''; const CH = 0x8000;
    for (let i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return btoa(s);
  }

  async function toBytes(data) {
    if (data == null) throw new NLPError('bad_request', 'No audio data');
    if (data instanceof Uint8Array) return data;
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    if (typeof Blob !== 'undefined' && data instanceof Blob) return new Uint8Array(await data.arrayBuffer());
    if (Array.isArray(data)) return Uint8Array.from(data);
    throw new NLPError('bad_request', 'Unsupported audio data type');
  }

  /** Lenient JSON extraction: handles ```json fences and stray text around the object. */
  function parseJSON(text) {
    let s = String(text || '').trim();
    const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) s = fence[1].trim();
    try { return JSON.parse(s); } catch (e) { /* keep trying */ }
    for (const [o, c] of [['{', '}'], ['[', ']']]) {
      const a = s.indexOf(o), b = s.lastIndexOf(c);
      if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { /* next */ } }
    }
    throw new NLPError('bad_response', 'The model did not return valid JSON');
  }

  /** "mm:ss", "h:mm:ss", "75.5", 75 → milliseconds */
  function parseClock(v) {
    if (v == null || v === '') return null;
    if (typeof v === 'number') return Math.round(v * 1000);
    const s = String(v).trim().replace(/[\[\]()]/g, '');
    if (/^\d+(\.\d+)?$/.test(s)) return Math.round(parseFloat(s) * 1000);
    const p = s.split(':').map(Number);
    if (p.some(isNaN)) return null;
    const sec = p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p.length === 2 ? p[0] * 60 + p[1] : p[0];
    return Math.round(sec * 1000);
  }

  function isHallucination(text) {
    const t = String(text || '').trim();
    return !t || HALLUCINATIONS.some(re => re.test(t));
  }

  async function readSSE(res, onData) {
    if (!res.body || !res.body.getReader) { // no streaming support: parse everything at once
      const all = await res.text();
      all.split(/\r?\n/).forEach(l => { if (l.startsWith('data:')) onData(l.slice(5).trim()); });
      return;
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).replace(/\r$/, '');
        buf = buf.slice(i + 1);
        if (line.startsWith('data:')) { const d = line.slice(5).trim(); if (d) onData(d); }
      }
    }
    if (buf.startsWith('data:')) onData(buf.slice(5).trim());
  }

  async function httpError(provider, res) {
    let body = '';
    try { body = await res.text(); } catch (e) { /* ignore */ }
    let msg = body;
    try { const j = JSON.parse(body); msg = (j.error && (j.error.message || j.error.status)) || j.message || body; } catch (e) { /* not json */ }
    msg = String(msg || res.statusText || '').slice(0, 400);
    const ra = parseFloat(res.headers && res.headers.get && res.headers.get('retry-after')) || null;
    let code = 'bad_request';
    if (res.status === 401 || res.status === 403) code = 'auth';
    else if (res.status === 400 && /api[ _-]?key|API_KEY_INVALID|permission/i.test(msg)) code = 'auth';
    else if (res.status === 429) code = /request too large|too large/i.test(msg) ? 'too_large' : 'rate_limited';
    else if (res.status === 413) code = 'too_large';
    else if (res.status === 400 && /context|too long|token|too large|exceed/i.test(msg)) code = 'too_large';
    else if (res.status >= 500) code = 'server';
    return new NLPError(code, provider + ' ' + res.status + ': ' + msg, { provider, status: res.status, retryAfter: ra });
  }

  /* ---------------- the client ---------------- */
  function createNLP(userConfig, opts) {
    opts = opts || {};
    const fetchFn = opts.fetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    if (!fetchFn) throw new Error('KeekNLP needs a global fetch (Node 18+, Electron, or a browser).');
    let cfg = Object.assign({}, DEFAULTS, clean(userConfig));
    const stats = { groq: { requests: 0, errors: 0, lastError: null }, gemini: { requests: 0, errors: 0, lastError: null } };
    const log = opts.log || (() => {});

    function clean(c) {
      const o = {};
      for (const k in (c || {})) if (c[k] !== undefined && c[k] !== null && c[k] !== '') o[k] = c[k];
      if (o.geminiModel) o.geminiModel = String(o.geminiModel).replace(/^models\//, '');
      if (o.geminiSttModel) o.geminiSttModel = String(o.geminiSttModel).replace(/^models\//, '');
      return o;
    }

    async function xfetch(url, init, signal) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(new Error('timeout')), cfg.timeoutMs);
      const onAbort = () => ctrl.abort(new Error('aborted'));
      if (signal) { if (signal.aborted) onAbort(); else signal.addEventListener('abort', onAbort, { once: true }); }
      try {
        return await fetchFn(url, Object.assign({}, init, { signal: ctrl.signal }));
      } catch (e) {
        if (signal && signal.aborted) throw new NLPError('aborted', 'Request cancelled');
        if (ctrl.signal.aborted) throw new NLPError('timeout', 'The AI provider took too long to respond');
        throw new NLPError('network', 'Network error: ' + (e && e.message || e));
      } finally {
        clearTimeout(timer);
        if (signal) signal.removeEventListener('abort', onAbort);
      }
    }

    const has = p => p === 'groq' ? !!cfg.groqKey : p === 'gemini' ? !!cfg.geminiKey : false;

    function route(prompt) {
      const avail = ['groq', 'gemini'].filter(has);
      if (!avail.length) throw new NLPError('no_key', 'No AI key configured. Add a free Groq or Gemini API key in Settings → AI.');
      if (cfg.provider === 'groq' || cfg.provider === 'gemini') {
        if (!has(cfg.provider)) throw new NLPError('no_key', 'The selected provider (' + cfg.provider + ') has no API key.');
        return [cfg.provider];
      }
      if (avail.length === 1) return avail;
      return estimateTokens(prompt) > cfg.groqMaxPromptTokens ? ['gemini', 'groq'] : ['groq', 'gemini'];
    }

    async function withRetry(provider, fn) {
      try {
        stats[provider].requests++;
        return await fn();
      } catch (e) {
        if (e.code === 'rate_limited' && (e.retryAfter == null || e.retryAfter <= cfg.maxRetryWaitSec)) {
          const wait = Math.max(1, e.retryAfter || 3) * 1000;
          log('rate limited by ' + provider + ', retrying in ' + wait + 'ms');
          await sleep(wait);
          stats[provider].requests++;
          return await fn();
        }
        throw e;
      }
    }

    /* ----- Groq (OpenAI-compatible) ----- */
    function isGroqModelGone(err) {
      return (err.status === 404 || err.status === 400) && /model_not_found|decommissioned|does not exist|no longer supported|not have access/i.test(err.message);
    }

    // Chat models in order of preference; anything else that isn't audio/guard/tts is the last resort.
    const GROQ_PREFS = [/gpt-oss-120b/i, /llama-4-maverick/i, /kimi-k2/i, /llama.*70b/i, /qwen.*32b/i, /llama-4-scout/i, /gpt-oss/i, /llama/i];
    const GROQ_NON_CHAT = /whisper|guard|tts|playai|orpheus|distil|embed|compound/i;

    async function pickGroqModel(bad) {
      try {
        const res = await xfetch(GROQ_BASE + '/models', { headers: { Authorization: 'Bearer ' + cfg.groqKey } });
        if (!res.ok) return null;
        const j = await res.json();
        const ids = (j.data || []).filter(m => m.active !== false).map(m => m.id).filter(id => id && id !== bad && !GROQ_NON_CHAT.test(id));
        for (const re of GROQ_PREFS) { const hit = ids.find(id => re.test(id)); if (hit) return hit; }
        return ids[0] || null;
      } catch (e) { return null; }
    }

    async function groqChat(p) {
      const msgs = [];
      if (p.json) msgs.push({ role: 'system', content: 'You are a careful assistant. Reply with one valid JSON object only, no markdown fences.' });
      msgs.push({ role: 'user', content: p.prompt });
      const stream = !!p.onText && !p.json;
      const body = { model: p.model || cfg.groqModel, messages: msgs, temperature: cfg.temperature };
      if (p.json) body.response_format = { type: 'json_object' };
      if (stream) body.stream = true;
      const send = () => xfetch(GROQ_BASE + '/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + cfg.groqKey },
        body: JSON.stringify(body)
      }, p.signal);
      let res = await send();
      if (!res.ok) {
        const err = await httpError('Groq', res);
        // Groq retires models regularly. If the configured one is gone, switch to an available one and retry once.
        if (!p.model && isGroqModelGone(err)) {
          const next = await pickGroqModel(body.model);
          if (!next) throw err;
          log('Groq model ' + body.model + ' unavailable, switching to ' + next);
          cfg.groqModel = next; body.model = next;
          res = await send();
          if (!res.ok) throw await httpError('Groq', res);
        } else throw err;
      }
      if (stream) {
        let text = '';
        await readSSE(res, d => {
          if (d === '[DONE]') return;
          let j; try { j = JSON.parse(d); } catch (e) { return; }
          const piece = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
          if (piece) { text += piece; p.onText(text); }
        });
        return text;
      }
      const j = await res.json();
      return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
    }

    /* ----- Gemini ----- */
    async function geminiGenerate(p) {
      const model = String(p.model || cfg.geminiModel).replace(/^models\//, '');
      const stream = !!p.onText && !p.json;
      const url = GEMINI_BASE + '/models/' + encodeURIComponent(model) + (stream ? ':streamGenerateContent?alt=sse' : ':generateContent');
      // Gemini 3.x: Google recommends default sampling, and supports thinking levels. 2.x: classic temperature.
      const gen3 = /^gemini-([3-9]|\d{2})/.test(model);
      const full = {};
      if (!gen3) full.temperature = cfg.temperature;
      if (gen3 && cfg.geminiThinking && cfg.geminiThinking !== 'default') full.thinkingConfig = { thinkingLevel: cfg.geminiThinking };
      if (p.json) full.responseMimeType = 'application/json';
      const send = generationConfig => xfetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': cfg.geminiKey },
        body: JSON.stringify({ contents: [{ role: 'user', parts: p.parts || [{ text: p.prompt }] }], generationConfig })
      }, p.signal);
      let res = await send(full);
      if (res.status === 400 && (full.temperature != null || full.thinkingConfig)) {
        // An optional field was rejected (model/API changed) — retry once with the minimum.
        const err = await httpError('Gemini', res);
        if (err.code === 'auth' || !/thinking|temperature|generation_?config|unknown name|invalid json payload|not supported/i.test(err.message)) throw err;
        res = await send(p.json ? { responseMimeType: 'application/json' } : {});
      }
      if (!res.ok) throw await httpError('Gemini', res);
      const pick = j => {
        const c = j.candidates && j.candidates[0];
        if (!c) {
          if (j.promptFeedback && j.promptFeedback.blockReason) throw new NLPError('blocked', 'Gemini blocked the request: ' + j.promptFeedback.blockReason, { provider: 'Gemini' });
          return '';
        }
        return ((c.content && c.content.parts) || []).filter(x => !x.thought).map(x => x.text || '').join('');
      };
      if (stream) {
        let text = '';
        await readSSE(res, d => {
          let j; try { j = JSON.parse(d); } catch (e) { return; }
          const piece = pick(j);
          if (piece) { text += piece; p.onText(text); }
        });
        return text;
      }
      return pick(await res.json());
    }

    /**
     * Text completion. With {json:true} the parsed object is returned.
     * onText(fullTextSoFar) is called while streaming (text mode only).
     */
    async function complete(prompt, o) {
      o = o || {};
      prompt = String(prompt || '');
      const order = route(prompt);
      let lastErr = null;
      for (const p of order) {
        try {
          const run = () => p === 'groq' ? groqChat(Object.assign({ prompt }, o)) : geminiGenerate(Object.assign({ prompt }, o));
          const out = await withRetry(p, run);
          if (!o.json) {
            if (!out.trim()) throw new NLPError('bad_response', 'Empty response', { provider: p });
            return out;
          }
          try { return parseJSON(out); } catch (e) { e.provider = p; throw e; }
        } catch (e) {
          if (!(e instanceof NLPError)) e = new NLPError('network', String(e && e.message || e), { provider: p });
          stats[p].errors++; stats[p].lastError = e.message;
          log(p + ' failed: ' + e.code + ' ' + e.message);
          lastErr = e;
          if (e.code === 'aborted') throw e;
        }
      }
      throw lastErr;
    }

    /* ----- Speech to text ----- */
    function sttOrder(mime) {
      const m = baseMime(mime);
      let order = cfg.sttProvider === 'groq' ? ['groq'] : cfg.sttProvider === 'gemini' ? ['gemini'] : ['groq', 'gemini'];
      order = order.filter(has);
      if (!order.length) throw new NLPError('no_key', 'Transcription needs a free Groq or Gemini API key (Settings → AI).');
      const fits = order.filter(p => p === 'groq' ? GROQ_AUDIO.test(m) : GEMINI_AUDIO.test(m));
      if (!fits.length) throw new NLPError('unsupported_format', 'Audio format ' + m + ' is not accepted by the configured provider. Convert to WAV/MP3 first.');
      return fits;
    }

    async function groqTranscribe(bytes, o) {
      const fd = new FormData();
      const mime = baseMime(o.mimeType) || 'audio/webm';
      fd.append('file', new Blob([bytes], { type: mime }), o.filename || ('audio' + extFor(mime)));
      fd.append('model', o.model || cfg.groqSttModel);
      fd.append('response_format', 'verbose_json');
      fd.append('temperature', '0');
      if (o.language) fd.append('language', o.language);
      if (o.prompt) fd.append('prompt', String(o.prompt).slice(-200));
      const res = await xfetch(GROQ_BASE + '/audio/transcriptions', {
        method: 'POST', headers: { Authorization: 'Bearer ' + cfg.groqKey }, body: fd
      }, o.signal);
      if (!res.ok) throw await httpError('Groq', res);
      const j = await res.json();
      let segs = (j.segments || [])
        .filter(s => !(s.no_speech_prob > 0.6 && (s.avg_logprob == null || s.avg_logprob < -0.6)))
        .map(s => ({ start: Math.round((s.start || 0) * 1000), end: Math.round((s.end || 0) * 1000), text: String(s.text || '').trim(), speaker: null }));
      if (!segs.length && j.text && !(j.segments && j.segments.length)) segs = [{ start: 0, end: null, text: String(j.text).trim(), speaker: null }];
      return { language: j.language || o.language || null, segments: segs.filter(s => !isHallucination(s.text)) };
    }

    async function geminiTranscribe(bytes, o) {
      const lang = o.language === 'ar' ? 'Arabic (often Egyptian dialect, may switch to English mid-sentence)' : o.language === 'en' ? 'English' : 'auto-detect (commonly Arabic incl. Egyptian dialect, English, or a mix)';
      const prompt = [
        'Transcribe this audio verbatim. Language: ' + lang + '.',
        'Do NOT translate. Keep English words that are spoken in English, in Latin letters.',
        o.diarize ? 'Label speakers consistently as "Speaker 1", "Speaker 2", … based on voice.' : 'Set "speaker" to null.',
        'Split into short segments (one sentence or one speaker turn). "start" is the time the segment begins, formatted "mm:ss" (or "h:mm:ss"), relative to the start of this clip.',
        'If there is no intelligible speech, return {"segments":[]}. Never invent words.',
        'Return ONLY JSON: {"segments":[{"start":"00:00","speaker":null,"text":""}]}'
      ].join('\n');
      const parts = [{ inline_data: { mime_type: baseMime(o.mimeType), data: toBase64(bytes) } }, { text: prompt }];
      const out = await geminiGenerate({ parts, json: true, model: o.model || cfg.geminiSttModel, signal: o.signal });
      const j = parseJSON(out);
      const arr = Array.isArray(j) ? j : (j.segments || []);
      const segs = arr.map(s => ({ start: parseClock(s.start) || 0, end: parseClock(s.end), text: String(s.text || '').trim(), speaker: s.speaker ? String(s.speaker) : null }))
        .filter(s => !isHallucination(s.text));
      return { language: o.language || null, segments: segs };
    }

    /**
     * transcribe({data, mimeType, filename, language:'ar'|'en'|undefined, prompt, diarize, offsetMs})
     * → { provider, language, segments:[{start,end,text,speaker}] }  (times in ms, offset applied)
     */
    async function transcribe(o) {
      o = o || {};
      const bytes = await toBytes(o.data);
      if (bytes.byteLength < 1000) return { provider: null, language: o.language || null, segments: [] };
      const order = sttOrder(o.mimeType);
      const limit = { groq: 25 * 1024 * 1024, gemini: 15 * 1024 * 1024 };
      let lastErr = null;
      for (const p of order) {
        if (bytes.byteLength > limit[p]) { lastErr = new NLPError('too_large', 'Audio chunk is larger than ' + Math.round(limit[p] / 1048576) + ' MB for ' + p, { provider: p }); continue; }
        try {
          const r = await withRetry(p, () => p === 'groq' ? groqTranscribe(bytes, o) : geminiTranscribe(bytes, o));
          const off = o.offsetMs || 0;
          r.segments.forEach(s => { s.start += off; if (s.end != null) s.end += off; });
          r.provider = p;
          return r;
        } catch (e) {
          if (!(e instanceof NLPError)) e = new NLPError('network', String(e && e.message || e), { provider: p });
          stats[p].errors++; stats[p].lastError = e.message;
          log('stt ' + p + ' failed: ' + e.code + ' ' + e.message);
          lastErr = e;
          if (e.code === 'aborted') throw e;
        }
      }
      throw lastErr;
    }

    /** Validates a key by listing models. → {ok, models:[...]} or {ok:false, error} */
    async function test(provider) {
      try {
        if (!has(provider)) throw new NLPError('no_key', 'No key saved for ' + provider);
        if (provider === 'groq') {
          const res = await xfetch(GROQ_BASE + '/models', { headers: { Authorization: 'Bearer ' + cfg.groqKey } });
          if (!res.ok) throw await httpError('Groq', res);
          const j = await res.json();
          return { ok: true, models: (j.data || []).map(m => m.id).sort() };
        }
        const res = await xfetch(GEMINI_BASE + '/models?pageSize=200', { headers: { 'x-goog-api-key': cfg.geminiKey } });
        if (!res.ok) throw await httpError('Gemini', res);
        const j = await res.json();
        return { ok: true, models: (j.models || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent')).map(m => m.name.replace(/^models\//, '')).sort() };
      } catch (e) {
        return { ok: false, error: { code: e.code || 'network', message: e.message } };
      }
    }

    const api = {
      version: VERSION,
      complete,
      json: (prompt, o) => complete(prompt, Object.assign({}, o, { json: true })),
      transcribe,
      test,
      /** Merge new settings. Empty strings are ignored, so pass {groqKey:null} via remove() to clear. */
      configure(patch) { cfg = Object.assign({}, cfg, clean(patch)); return api.config(); },
      remove(keys) { [].concat(keys).forEach(k => { cfg[k] = DEFAULTS[k]; }); return api.config(); },
      /** Settings with keys masked — safe to show in a UI. */
      config() { const c = Object.assign({}, cfg); c.groqKey = c.groqKey ? '…' + c.groqKey.slice(-4) : ''; c.geminiKey = c.geminiKey ? '…' + c.geminiKey.slice(-4) : ''; return c; },
      hasKey: p => p ? has(p) : (has('groq') || has('gemini')),
      stats: () => JSON.parse(JSON.stringify(stats)),
      route: prompt => { try { return route(prompt); } catch (e) { return []; } }
    };
    return api;
  }

  return {
    VERSION, DEFAULTS, NLPError, create: createNLP,
    utils: { estimateTokens, parseJSON, parseClock, isHallucination, extFor, baseMime, GROQ_AUDIO, GEMINI_AUDIO }
  };
});
