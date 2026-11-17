# 5. KEEK NLP module (`shared/nlp/keek-nlp.js`)

A single file, no dependencies. Works in Node 18+/Electron main (`require`), browser pages and
extension pages (`<script>` → `window.KeekNLP`). Uses only `fetch`, `FormData`, `Blob`.

```js
const KeekNLP = require('./keek-nlp.js');           // or window.KeekNLP
const nlp = KeekNLP.create({ groqKey: 'gsk_…', geminiKey: 'AIza…' });

const text = await nlp.complete('Summarise: …');                  // string
const data = await nlp.json('Return {"topics":[…]} for: …');      // parsed object
await nlp.complete('Answer…', { onText: soFar => render(soFar) }); // streaming

const r = await nlp.transcribe({ data: uint8Array, mimeType: 'audio/wav', language: 'ar', offsetMs: 20000 });
// → { provider:'groq', language:'ar', segments:[{ start: 20500, end: 22000, text:'…', speaker:null }] }

await nlp.test('groq');   // { ok:true, models:[…] }  or { ok:false, error:{code,message} }
```

## Options (`create(config)` / `configure(patch)`)

| Key | Default | Meaning |
|---|---|---|
| `provider` | `auto` | `auto` · `groq` · `gemini` for text |
| `sttProvider` | `auto` | `auto` (Groq → Gemini) · `groq` · `gemini` |
| `groqKey`, `geminiKey` | — | API keys |
| `groqModel` | `openai/gpt-oss-120b` | Groq chat model (auto-replaced if Groq retires it) |
| `groqSttModel` | `whisper-large-v3` | or `whisper-large-v3-turbo` (faster) |
| `geminiModel`, `geminiSttModel` | `gemini-3.8-flash` | any `generateContent` model your key can use |
| `geminiThinking` | `low` | Gemini 3.x thinking level (`low`/`medium`/`high`/`default`) |
| `groqMaxPromptTokens` | `9000` | above this (estimated) size, `auto` tries Gemini first |
| `temperature` | `0.2` | sent to Groq and Gemini 2.x only |
| `timeoutMs` | `180000` | per request |
| `maxRetryWaitSec` | `15` | retry once on 429 if the provider asks to wait ≤ this |

Other methods: `remove(['groqKey'])`, `config()` (keys masked as `…1234`), `hasKey(p?)`,
`stats()` (`{groq:{requests,errors,lastError}, gemini:{…}}`), `route(prompt)` (provider order).

`create(config, { fetch, log })` lets you inject a fetch (tests) and a logger.

## Routing & fallback

```
complete(prompt):
  providers with keys → if provider forced: [it]
  else if estimateTokens(prompt) > groqMaxPromptTokens: [gemini, groq] else [groq, gemini]
  for each: request (retry once on short 429) → JSON parse if json:true
           on any failure except cancel → next provider
```
Arabic is estimated at ~1.8 chars/token, other text ~3.6 chars/token.

## Errors

All errors are `KeekNLP.NLPError` with `code`:
`no_key` · `auth` · `rate_limited` · `too_large` · `server` · `network` · `timeout` · `bad_request` ·
`bad_response` (no/invalid JSON) · `blocked` (Gemini safety) · `unsupported_format` · `aborted`,
plus `provider`, `status`, `retryAfter`.

## Speech-to-text details

- **Groq**: `POST /openai/v1/audio/transcriptions`, `verbose_json`, temperature 0, optional
  `language` and `prompt` (last 200 chars for continuity). Segments with high `no_speech_prob` and
  low `avg_logprob` are dropped, as are known Whisper hallucinations on silence
  ("Thank you.", "اشتركوا في القناة", "ترجمة نانسي قنقر", …). Accepts MP3, MP4/M4A, WAV, WebM, OGG, FLAC up to 25 MB.
- **Gemini**: audio sent inline (WAV, MP3, AAC, OGG, FLAC, AIFF; up to ~15 MB per request) with a
  prompt asking for verbatim, untranslated JSON segments `{start:"mm:ss", speaker, text}`;
  optional speaker labels (`diarize:true`). WebM is not accepted — the app converts to WAV first.
- Gemini 3.x requests send `thinkingConfig.thinkingLevel` and no temperature; if Google rejects an
  optional field, the request is retried once with the minimum config.

## Prompts used by the app

The analysis, section-regeneration, project-overview and search prompts live in `shared/app/app.js`
(unchanged from the original KEEK). They require: use only the transcript, never invent owners or
dates, cite line ids in `refs`, write in the transcript’s language, return strict JSON. Search answers
cite numbered sources `[3]` and end with `CONFIDENCE: high|medium|low`.

## Tests

`node --test shared/nlp/keek-nlp.test.js` — 14 tests with a mocked fetch: routing, fallback, retry,
streaming (Groq + Gemini SSE), JSON repair, Whisper filtering, Gemini clock parsing, format checks,
key masking, Gemini optional-field retry.
