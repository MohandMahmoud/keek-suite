# 8. Troubleshooting

| Problem | Fix |
|---|---|
| "No AI key" / analysis fails immediately | Settings → AI → paste a key → **Save settings**; the badge must say *Saved (…xxxx)* and **Test** must say *Works*. |
| `Groq 401` / `Gemini 400 API key not valid` | Key mistyped or revoked → create a new one ([02](02-free-api-keys.md)). |
| `429` / "Too many requests" | Free-tier limit. KEEK already retried and tried the other provider. Wait a minute, add the second provider’s key, or raise *Live chunk length*. |
| `Request too large` on Groq | Long transcript. Keep *Analysis provider = Auto* (sends it to Gemini) or lower *Max prompt size for Groq*. |
| Gemini `404 model not found` / not available on free tier | Settings → AI → **Test** the Gemini key → pick a listed Flash/Flash-Lite model in *Gemini model* → Save. |
| Live transcript stays empty | Check the note under the timer: it says which engine is used. Without a key there’s no live text — after stopping, use **Transcribe the recording with AI**. Very quiet audio is treated as silence. |
| Arabic transcribed as English (or vice-versa) | Choose the spoken language explicitly; use *Auto / mixed* for code-switching. |
| Repeated phrases like "Thank you." / "اشتركوا في القناة" | Whisper hallucinations on silence — KEEK filters the common ones; delete others while reviewing. |
| Desktop: "Couldn’t capture meeting audio" | Windows: check the output device isn’t exclusive-mode. macOS: allow Screen & System Audio Recording, restart KEEK, or use BlackHole ([03](03-desktop-app.md#macos-system-audio)). Linux: PipeWire/PulseAudio monitor must exist. |
| Desktop: echo / doubled voices | Use headphones. |
| Extension: "Tab capture was refused" | Click the KEEK icon **on the meeting tab**, then **Record this tab**, then Start. Chrome’s own pages (`chrome://`) and the Web Store can’t be captured. |
| Extension: can’t hear the meeting while recording | Reload the KEEK tab and start again; KEEK plays the captured tab back to you. |
| Popup: Desktop "Not running" though it is | The bridge may have moved to port 47822–47825 or be blocked by a firewall/proxy for `127.0.0.1`. Restart KEEK Desktop; check the port on Integrations (Desktop console shows `[bridge] listening on …`). |
| Popup: "That code didn’t work" | Copy the current code from Desktop → Integrations (it changes when you press *New code*). |
| Upload: "Couldn’t read audio from this file" | Convert to MP3/WAV/M4A. Files > 300 MB aren’t transcribed in-app. |
| macOS: "KEEK is damaged / can’t be opened" | Unsigned build → right-click → Open, or sign & notarise ([03](03-desktop-app.md#build-installers)). |
| Windows SmartScreen warning | Unsigned build → *More info → Run anyway*, or sign it. |
| Data looks gone after reinstall (extension) | Removing an extension deletes its storage. Export before uninstalling. |

**Logs**: Desktop → `npm run dev` (DevTools + AI routing logs). Extension → `chrome://extensions` →
KEEK → *service worker* (background) and right-click the KEEK tab → Inspect.
