# 6. Extension ↔ Desktop bridge protocol

KEEK Desktop runs a tiny HTTP server for the extension (`desktop/src/bridge.js`).

- Address: `http://127.0.0.1:47821` (if busy: 47822 … 47825). The extension pings each port.
- Only loopback; `Host` must be `127.0.0.1` or `localhost` (blocks DNS rebinding).
- Requests carrying an `Origin` header must come from `chrome-extension://`, `moz-extension://` or
  `safari-web-extension://` — ordinary web pages get `403`.
- All endpoints except `/v1/ping` need `Authorization: Bearer <PAIRING-CODE>` (case-insensitive,
  compared in constant time). The code is 12 characters from an unambiguous alphabet, e.g.
  `K7QM-2XWD-PH9R`, created on first launch and rotated with *New code*.
- Bodies are JSON, max 64 KB.

## Endpoints

| Method & path | Body | Response |
|---|---|---|
| `GET /v1/ping` | — | `200 {"app":"keek-desktop","version":"1.0.0"}` |
| `GET /v1/status` | — | `200 {"app","version","recording":{"state":"idle|starting|recording|paused|stopped","elapsedMs","title","live":"cloud|browser|none"}}` |
| `POST /v1/record/start` | `{"consent":true,"meeting":{"title","url","platform"}}` | `202 {"ok":true}` · `400 consent_required` |
| `POST /v1/record/prepare` | `{"meeting":{…}}` | `202` — opens the recorder pre-filled, no auto-start |
| `POST /v1/record/stop` | `{}` | `202` — stops; the user reviews and saves in the app |
| `POST /v1/open` | `{"route":"dashboard|meetings|search|tasks|settings"}` | `202` |

Errors: `401 unauthorized`, `403 forbidden_origin|forbidden_host`, `404 not_found`, `413`, `400 invalid JSON`.

`meeting.platform` ∈ `meet · zoom · teams · inperson · other`; `url` must be `https://`;
`title` ≤ 200 chars. `start` brings the KEEK window to the front.

## Example (curl)

```bash
CODE=K7QM-2XWD-PH9R
curl -s http://127.0.0.1:47821/v1/ping
curl -s -H "Authorization: Bearer $CODE" http://127.0.0.1:47821/v1/status
curl -s -X POST -H "Authorization: Bearer $CODE" -H 'Content-Type: application/json' \
     -d '{"consent":true,"meeting":{"title":"Weekly sync","platform":"zoom"}}' \
     http://127.0.0.1:47821/v1/record/start
```

## Inside the desktop app

`bridge.js` → `main.js sendCommand()` → IPC `bridge:command` → `preload.js` (buffers until the page is
ready) → `KEEKX.command()`:

| Command | Effect |
|---|---|
| `startRecord` | fills the recorder from `meeting`, consent ticked, meeting audio = loopback, starts |
| `prepareRecord` | same, without starting |
| `stopRecord` / `toggleRecord` | stops a running recording and shows the review |
| `open` | navigates |

Commands never discard a recording waiting for review. The renderer reports its state once a second
(`bridge:state`) — that is what `/v1/status` returns, and it updates the window title (● KEEK — Recording).

The extension’s own app tab uses the same command format via `chrome.tabs.sendMessage`
(`{type:'keek:command', cmd}`) or the URL hash `#cmd=<json>`.
