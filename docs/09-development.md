# 9. Development, testing & packaging

## Where to edit

| You want to change… | Edit | Then |
|---|---|---|
| UI / app logic | `shared/app/app.js` (or the original `shared/original/keek.html` + re-extract) | `node tools/sync.mjs` |
| AI settings, capture, live STT, commands | `shared/app/keekx.js` | `node tools/sync.mjs` |
| AI providers / routing | `shared/nlp/keek-nlp.js` | `node tools/sync.mjs` |
| Desktop main process | `desktop/src/*.js` (not `keek-nlp.js`, it’s synced) | — |
| Desktop renderer adapter | `desktop/renderer/platform.js` | — |
| Extension | `extension/background.js`, `content.js`, `popup/*` | reload in `chrome://extensions` |

`tools/sync.mjs` copies `shared/app/*` and `shared/nlp/keek-nlp.js` into `desktop/renderer/`,
`desktop/src/` and `extension/app/`. **Don’t edit the synced copies.**

### Updating from a new version of the single-file KEEK app

```bash
cp new-keek.html shared/original/keek.html
python3 tools/extract_app.py      # re-applies the 11 hooks; fails loudly if one no longer matches
node tools/sync.mjs
```

## Tests

```bash
# Unit (no network, no browser): NLP module + desktop store/config/bridge
node --test shared/nlp/keek-nlp.test.js desktop/test/main-modules.test.js

# End-to-end in headless Chrome (Groq mocked):
npm i -D playwright && npx playwright install chromium   # or set CHROME=/path/to/chrome
node tools/smoke-test.cjs             # web/extension app: onboarding, key, import→analysis, search, upload STT, live recording
node tools/desktop-renderer-smoke.cjs # desktop renderer with simulated IPC: pairing code, remote start/stop, analysis
node tools/extension-smoke.cjs        # real extension + real bridge: install, Meet detection, pairing, consent, record-tab
```
Screenshots go to `tools/screens/` (or `$SHOTS`).

What the E2E tests can’t cover automatically: real Electron loopback audio, real tab-capture audio
(Chrome requires a real toolbar click), and real provider responses. Check those by hand:
1. Desktop: play a YouTube video, record 30 s with *All computer audio* → live text appears.
2. Extension: join a test Meet, click KEEK on that tab → *Record this tab* → Start → speak.
3. Upload a 2-minute Arabic MP3 → *Transcribe automatically* → review → Save → summary in Arabic.

## Packaging

- Desktop installers: `cd desktop && npm run dist` ([03](03-desktop-app.md#build-installers)).
- Extension: zip the **contents** of `extension/` for the Chrome Web Store.
- Version numbers: `desktop/package.json` and `extension/manifest.json`.

## Roadmap ideas

- Save original audio on desktop (per-meeting files + playback across sessions, DOCX/PDF export).
- Calendar integration (Google/Outlook) to auto-title and auto-prompt recordings.
- Per-chunk speaker diarisation that stays consistent across chunks.
- Local Whisper (whisper.cpp) for fully offline transcription.
- Firefox build of the extension (`moz-extension` origin already allowed by the bridge).
- Native Messaging transport as an alternative to the localhost bridge.
