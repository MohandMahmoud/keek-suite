# 1. Architecture

KEEK is one UI that runs in two hosts. The original single-file app is kept almost untouched; a thin
layer (`keekx.js`) adds the new capabilities, and a per-host **platform adapter** (`platform.js`)
provides storage, AI and audio capture.

```
                       ┌────────────────────────── shared/app ──────────────────────────┐
                       │ index.html + app.js (original KEEK UI, 11 small hooks)        │
                       │ keekx.js  – AI settings, capture, live STT, file STT, commands │
                       └───────────────▲────────────────────────────▲───────────────────┘
                                       │ window.claude + KEEK_PLATFORM
              ┌────────────────────────┴───────┐        ┌───────────┴─────────────────────────┐
              │ desktop/renderer/platform.js   │        │ extension/app/platform.js           │
              │  → IPC (preload: keekNative)   │        │  → chrome.storage + KeekNLP in-page │
              └────────────────────────┬───────┘        │  → chrome.tabCapture (meeting tab)  │
                                       │                └───────────┬─────────────────────────┘
        ┌──────────────────────────────▼──────────┐                 │
        │ Electron main (desktop/src)             │                 │ fetch (host_permissions)
        │  store.js   JSON files in userData/data │                 ▼
        │  config.js  settings + safeStorage keys │        ┌──────────────────────┐
        │  keek-nlp.js ─────────────────────────────────► │ Groq  api.groq.com    │
        │  setDisplayMediaRequestHandler          │        │ Gemini googleapis.com │
        │     (screen + audio:'loopback')         │        └──────────────────────┘
        │  bridge.js  http://127.0.0.1:47821  ◄───────────┐
        └─────────────────────────────────────────┘      │ pairing code (Bearer)
                                                ┌────────┴────────────────────────────┐
                                                │ extension background.js (MV3 SW)    │
                                                │  meeting registry, badge, bridge    │
                                                │ content.js on Meet / Zoom / Teams   │
                                                │ popup: record tab · control desktop │
                                                └─────────────────────────────────────┘
```

## Data flow of a recording

1. **Capture** — `KEEKX.captureStream()` gets the meeting audio first (desktop: `getDisplayMedia`,
   answered by the main process with *whole screen + system-audio loopback*, no picker; extension:
   `chrome.tabCapture` stream of the meeting tab, played back so you still hear it; or any input
   device), then the mic, and mixes both in a Web Audio graph into one `MediaStream`.
2. **Record** — the app’s own `MediaRecorder` keeps the full recording for playback.
3. **Live transcription** — `KEEKX.stt` runs a second `MediaRecorder` that restarts every *N* seconds,
   so each chunk is a standalone file. Each chunk is decoded, resampled to 16 kHz mono WAV, skipped if
   silent, and sent to `transcribe()`. Segments come back with timestamps offset to the meeting clock.
   The last ~200 characters are passed as a Whisper prompt for continuity.
4. **Review** — on stop, pending chunks finish, the transcript is editable, then **Save and process**.
5. **Analysis** — the app’s original prompt (strict: only what was said, every item must cite line
   ids) goes through `complete({json:true})`. Short transcripts → Groq; long → Gemini; fallback either way.
6. **Storage** — desktop: one JSON file per document under `userData/data/…`; extension:
   `chrome.storage.local` (`unlimitedStorage`).

## Why this shape

- **Original app untouched where possible** — `tools/extract_app.py` re-applies the hooks to a newer
  `keek.html`; each hook must match exactly once, so changes fail loudly.
- **Keys never in the desktop page** — AI calls run in the Electron main process; the renderer only
  sees masked hints (`…1234`).
- **No server** — the only network traffic is to the AI providers you configure (and fonts).
- **Bridge, not Native Messaging** — a localhost HTTP bridge needs no per-browser host registration,
  works for Chrome/Edge/Brave alike, and is locked down by Origin, Host and a pairing code.

## Hooks applied to the original app (`tools/extract_app.py`)

| Hook | Purpose |
|---|---|
| `KEEKX.init()` before storage loads | load AI config + platform info |
| `KEEKX.install()` before boot | wrap recorder, settings, notifications, AI errors |
| `KEEKX.afterBoot()` | run queued commands (e.g. start recording from the extension) |
| `desktopOption()` | live "Record with the desktop app" option |
| `uploadSttBlock()` / `uploadBtn()` | automatic file transcription in the upload sheet |
| import textarea pre-fill | machine transcript lands in the import sheet for review |
| `captureNote()` / `sourcePicker()` | meeting-audio + microphone selectors, accurate notes |
| `autoLangOption()` | "Auto / mixed Arabic–English" spoken language |
| `captureStream()` | mixed capture instead of mic-only `getUserMedia` |
| `appCards()` | live status cards on the Integrations page |
| desktop notifications toggle | real OS notifications on desktop |
