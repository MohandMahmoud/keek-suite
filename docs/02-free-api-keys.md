# 2. Free API keys & limits

KEEK uses **your own** keys. You need at least one; with both, KEEK routes each job to the better
provider and falls back automatically.

## Groq (recommended first)

1. Sign in at <https://console.groq.com> (email, Google or GitHub; no card needed for the free tier).
2. **API Keys → Create API key** → copy the key (starts with `gsk_`).
3. KEEK → **Settings → AI → Groq API key** → paste → **Save settings**. KEEK tests it and lists your models.

Used for: live and file transcription (`whisper-large-v3`), fast analysis of short/medium meetings
(`openai/gpt-oss-120b` by default; if Groq retires a model, KEEK switches to an available one), streamed search answers.

Free-tier limits seen in public listings in 2026 (check *Settings → Limits* in the Groq console for your real numbers):

| Model | Requests/min | Requests/day | Other |
|---|---|---|---|
| `llama-3.3-70b-versatile` (retired) | 30 | ~1,000 | **~12,000 tokens/min** — one long transcript can exceed this |
| `whisper-large-v3` / `-turbo` | 20 | 2,000 | 7,200 audio-seconds/hour |

That tokens-per-minute ceiling is why KEEK sends prompts larger than **9,000 tokens** (Settings → AI →
*Max prompt size for Groq*) to Gemini instead.

## Google Gemini

1. Open <https://aistudio.google.com/apikey> and sign in with a Google account.
2. **Create API key** → copy it (starts with `AIza`).
3. KEEK → **Settings → AI → Google Gemini API key** → paste → **Save settings**.

Used for: long meetings (1M-token context), speaker labelling when transcribing files, and as the
fallback for everything else.

Notes (late 2026):
- Google has tightened the free tier several times and no longer publishes fixed free-tier numbers;
  see your project’s limits in AI Studio. Limits are per Google Cloud project, not per key.
- KEEK’s default model is **`gemini-3.8-flash`** (GA September 2026, accepts audio). If your project
  can’t use it on the free tier, click **Test** next to the key and pick another listed Flash /
  Flash-Lite model in *Settings → AI → Models* (e.g. `gemini-3.5-flash-lite`).
- **Data use:** on the free tier Google may use submitted content and responses to improve its
  products, and human reviewers may see it. In the EEA, Switzerland and the UK, Google only allows
  offering API-based products to end users on paid tiers. See [07-privacy-security.md](07-privacy-security.md).

## Which provider does what

| Job | Auto choice | Fallback |
|---|---|---|
| Meeting analysis, ≤ 9k tokens | Groq Llama 3.3 70B | Gemini |
| Meeting analysis, > 9k tokens | Gemini | Groq |
| AI search answer (streamed) | same rule by prompt size | the other |
| Live transcription chunks | Groq Whisper | Gemini |
| File transcription | Groq Whisper (≤ 24 MB sent as-is; larger → 5-min WAV chunks) | Gemini (WAV chunks) |
| Speaker labels | Gemini only (*Transcription provider → Gemini*) | — |

Force a single provider in **Settings → AI → Routing**.

## Staying inside free limits

- Live chunk length 20 s (default) ≈ 3 requests/min — well within Whisper’s 20 RPM.
- Silent chunks are never sent.
- A one-hour meeting ≈ 180 live chunks + 1 analysis request.
- If you hit a limit, KEEK waits and retries once (when the provider says ≤ 15 s), then switches provider, then shows the error. Audio is never lost — you can transcribe the full recording again from the review screen.
