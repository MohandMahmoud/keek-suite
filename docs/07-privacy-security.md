# 7. Privacy & security

## What leaves your device

| Data | Goes to | When |
|---|---|---|
| Audio chunks (16 kHz WAV) or uploaded files | Groq and/or Google Gemini | live transcription, *Transcribe automatically*, *Transcribe the recording* |
| Transcript text + meeting title/participants | Groq and/or Google Gemini | analysis, regenerate section, project overview, AI search |
| Nothing | KEEK | there is no KEEK server, telemetry or account |
| Font files request | fonts.googleapis.com | loading the UI (falls back to system fonts offline) |

Each provider processes data under **its own terms, with your key**:
- **Groq** — see <https://console.groq.com/docs/your-data> and Groq’s privacy policy.
- **Google Gemini API** — on the **free tier**, Google may use submitted content and responses to
  improve its products and human reviewers may read them; paid tiers have different terms. In the
  EEA, Switzerland and the UK, Google only allows offering API-based products to end users on paid
  services. Read <https://ai.google.dev/gemini-api/terms> before processing confidential meetings.

If a meeting is confidential, either force *Groq only* (after checking Groq’s terms fit your needs),
use a paid tier, or don’t send it to any AI.

## Consent

Recording laws differ by country (one-party vs all-party consent). KEEK requires you to confirm that
participants were told **every time** a recording starts — in the recorder and in the extension popup —
and the bridge API refuses to start without `consent:true`.

## Keys

- **Desktop**: encrypted with Electron `safeStorage` (macOS Keychain, Windows DPAPI, Linux
  libsecret/kwallet; if Linux has no keyring, Electron may fall back to a weak built-in key) in
  `keek-config.json` (file mode 600). Keys stay in the main process; the page only gets `…1234`.
- **Extension / web**: stored in `chrome.storage.local` / `localStorage` unencrypted, readable by
  anyone with access to the browser profile.
- Remove a key any time: *Settings → AI → Remove*. Revoke it at the provider if it may have leaked.

## Desktop hardening

- `contextIsolation`, `sandbox`, no `nodeIntegration`; a narrow preload API; IPC rejects senders that
  are not the app’s own `file://` page.
- Content-Security-Policy: scripts only from the app; network only over https (AI providers and the integrations you connect), localhost, and blob/data URLs.
- Integration tokens (Slack, Notion, Linear, Jira, webhooks) stay in the main process, encrypted with `safeStorage`; the page only sees whether each one is connected — [docs/10](10-integrations.md).
- External links open in the system browser; in-app navigation away from the app is blocked.
- Permissions granted only to the app page: microphone, screen/system-audio capture, notifications, clipboard.
- Local storage path segments are sanitised; writes are atomic.

## Bridge hardening

127.0.0.1 only · Host check · extension-only Origin · pairing code required (constant-time compare,
rotate any time) · 64 KB body limit · consent required to start · inputs whitelisted and truncated.
Any local program that knows the pairing code can start/stop recording — treat it like a password.

## Extension hardening

MV3, no remote code, `script-src 'self'`; the content script reads only title, path and a call
indicator (query strings — e.g. Zoom passcodes — are stripped); tab capture only for the tab you
clicked KEEK on.

## Your rights over your data

*Settings → Privacy*: export everything as JSON, remove sample data, delete all data. On desktop you
can also delete the data folder listed on the Integrations page.
