// KEEK Desktop — Electron main process.
// Window + security, local storage, AI (KeekNLP with Groq/Gemini), system-audio capture handler,
// and the localhost bridge used by the browser extension.
const { app, BrowserWindow, ipcMain, dialog, shell, session, desktopCapturer, safeStorage, Notification, globalShortcut, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const KeekNLP = require('./keek-nlp.js');
const KeekIntegrations = require('./keek-integrations.js');
const createStore = require('./store.js');
const createConfig = require('./config.js');
const { startBridge } = require('./bridge.js');

const RENDERER = path.join(__dirname, '..', 'renderer');
const DEV = process.argv.includes('--dev');
let win = null, store, config, nlp, integrations, bridge = null;
let recState = { state: 'idle', elapsedMs: 0, title: '' };

if (!app.requestSingleInstanceLock()) { app.quit(); }
else app.on('second-instance', () => showWindow());

/* ---------------- window ---------------- */
function createWindow() {
  win = new BrowserWindow({
    width: 1320, height: 860, minWidth: 860, minHeight: 600, show: false, title: 'KEEK',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#0B0B0B' : '#F2F2EF',
    icon: path.join(RENDERER, 'logo.jpg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, sandbox: true, nodeIntegration: false,
      backgroundThrottling: false, // keep live transcription timers running while minimised
      spellcheck: true
    }
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(RENDERER, 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https:\/\//.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file://')) { e.preventDefault(); if (/^https:\/\//.test(url)) shell.openExternal(url); } });
  // The page blocks unload while recording; ask the user instead of silently refusing to close.
  win.webContents.on('will-prevent-unload', e => {
    const choice = dialog.showMessageBoxSync(win, {
      type: 'warning', buttons: ['Keep recording', 'Quit and discard'], defaultId: 0, cancelId: 0,
      message: 'A recording is in progress.', detail: 'Stop and save it first, or quit and lose the unsaved recording.'
    });
    if (choice === 1) e.preventDefault();
  });
  if (DEV) win.webContents.openDevTools({ mode: 'detach' });
  win.on('closed', () => { win = null; });
}

function showWindow() {
  if (!win) createWindow();
  if (win.isMinimized()) win.restore();
  win.show(); win.focus();
}

function sendCommand(cmd) {
  showWindow();
  const send = () => win && win.webContents.send('bridge:command', cmd);
  if (win.webContents.isLoading()) win.webContents.once('did-finish-load', send); else send();
}

/* ---------------- IPC ---------------- */
const trusted = e => !!(e.senderFrame && e.senderFrame.url.startsWith('file://'));
function handle(channel, fn) {
  ipcMain.handle(channel, async (e, ...args) => {
    if (!trusted(e)) return { ok: false, error: { code: 'forbidden', message: 'forbidden' } };
    try { return { ok: true, value: await fn(e, ...args) }; }
    catch (err) {
      if (err && err.code !== 'no_key') console.error('[ipc]', channel, err && err.message);
      return { ok: false, error: { code: (err && err.code) || 'error', message: String((err && err.message) || err), provider: err && err.provider, field: err && err.field, choices: err && err.choices, created: err && err.created } };
    }
  });
}

function publicConfig() {
  const c = Object.assign({}, KeekNLP.DEFAULTS, config.nlp());
  const out = {};
  ['provider', 'sttProvider', 'liveEngine', 'chunkSec', 'groqModel', 'groqSttModel', 'geminiModel', 'groqMaxPromptTokens'].forEach(k => { out[k] = c[k]; });
  out.hasGroqKey = !!c.groqKey; out.hasGeminiKey = !!c.geminiKey;
  out.groqKeyHint = c.groqKey ? '…' + c.groqKey.slice(-4) : '';
  out.geminiKeyHint = c.geminiKey ? '…' + c.geminiKey.slice(-4) : '';
  out.encrypted = config.encrypted();
  out.stats = nlp.stats();
  return out;
}

function appInfo() {
  return { version: app.getVersion(), platform: process.platform, dataPath: store.baseDir, token: config.token(), port: bridge ? bridge.port : null };
}

function registerIpc() {
  handle('db:list', (e, p) => store.list(p));
  handle('db:set', (e, p, id, data) => store.set(p, id, data));
  handle('db:del', (e, p, id) => store.del(p, id));

  handle('cfg:get', () => publicConfig());
  handle('cfg:set', (e, patch) => {
    const removed = config.update(patch || {});
    nlp.configure(config.nlp());
    if (removed.length) nlp.remove(removed);
    return publicConfig();
  });
  handle('cfg:test', (e, provider) => nlp.test(provider === 'gemini' ? 'gemini' : 'groq'));

  handle('nlp:complete', (e, id, prompt, opts) => {
    opts = opts || {};
    const onText = opts.stream ? text => { if (!e.sender.isDestroyed()) e.sender.send('nlp:chunk', id, text); } : undefined;
    return nlp.complete(String(prompt || ''), { json: !!opts.json, onText });
  });
  handle('nlp:transcribe', (e, bytes, opts) => {
    opts = opts || {};
    return nlp.transcribe({
      data: bytes, mimeType: String(opts.mimeType || 'audio/wav'), filename: opts.filename ? String(opts.filename).slice(0, 80) : undefined,
      language: ['ar', 'en'].includes(opts.language) ? opts.language : undefined, prompt: opts.prompt ? String(opts.prompt) : undefined,
      diarize: !!opts.diarize, offsetMs: +opts.offsetMs || 0
    });
  });

  // Integrations: tokens stay in this process; the page only sees connected/info.
  const kind = k => { if (!KeekIntegrations.KINDS.includes(k)) throw Object.assign(new Error('Unknown integration'), { code: 'invalid' }); return k; };
  handle('int:list', () => integrations.list());
  handle('int:connect', (e, k, input) => integrations.connect(kind(k), input && typeof input === 'object' ? input : {}));
  handle('int:options', (e, k, patch) => integrations.setOptions(kind(k), patch || {}));
  handle('int:remove', (e, k) => integrations.remove(kind(k)));
  handle('int:send', (e, k, payload) => integrations.send(kind(k), payload));

  handle('file:save', async (e, filename, data) => {
    const name = String(filename || 'keek.txt').replace(/[\\/:*?"<>|]/g, '').slice(0, 120) || 'keek.txt';
    const r = await dialog.showSaveDialog(win, { defaultPath: path.join(app.getPath('downloads'), name) });
    if (r.canceled || !r.filePath) return false;
    await fs.writeFile(r.filePath, typeof data === 'string' ? data : String(data), 'utf8');
    return true;
  });
  handle('app:info', () => appInfo());
  handle('bridge:regen', () => { config.regenToken(); return appInfo(); });

  ipcMain.on('bridge:state', (e, s) => {
    if (!trusted(e) || !s) return;
    recState = { state: String(s.state || 'idle'), elapsedMs: +s.elapsedMs || 0, title: String(s.title || '').slice(0, 200), live: s.live || null };
    if (win) win.setTitle(recState.state === 'recording' ? '● KEEK — Recording' : recState.state === 'paused' ? '❚❚ KEEK — Paused' : 'KEEK');
  });
  ipcMain.on('open:external', (e, url) => { if (trusted(e) && /^https:\/\//.test(String(url))) shell.openExternal(String(url)); });
  ipcMain.on('notify', (e, title, body) => {
    if (!trusted(e) || !Notification.isSupported()) return;
    const n = new Notification({ title: String(title || 'KEEK').slice(0, 80), body: String(body || '').slice(0, 300) });
    n.on('click', () => showWindow());
    n.show();
  });
}

/* ---------------- media permissions & system audio ---------------- */
function setupMedia() {
  const ses = session.defaultSession;
  const allowed = ['media', 'display-capture', 'notifications', 'clipboard-sanitized-write', 'clipboard-read'];
  ses.setPermissionRequestHandler((wc, perm, cb) => cb(allowed.includes(perm) && wc.getURL().startsWith('file://')));
  ses.setPermissionCheckHandler((wc, perm) => allowed.includes(perm));
  // getDisplayMedia() in the renderer → whole screen + system audio loopback, no picker.
  ses.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
      if (!sources.length) return callback({});
      try { callback({ video: sources[0], audio: 'loopback' }); }
      catch (e) { console.warn('[media] loopback audio not supported here:', e.message); callback({ video: sources[0] }); }
    }).catch(e => { console.warn('[media]', e.message); callback({}); });
  }, { useSystemPicker: false });
}

/* ---------------- app lifecycle ---------------- */
app.whenReady().then(async () => {
  const userData = app.getPath('userData');
  store = createStore(path.join(userData, 'data'));
  config = createConfig(userData, safeStorage);
  nlp = KeekNLP.create(config.nlp(), { log: m => DEV && console.log('[nlp]', m) });
  integrations = KeekIntegrations.createManager({ load: async () => config.integrations(), save: async a => config.setIntegrations(a) });
  registerIpc();
  setupMedia();
  createWindow();

  bridge = await startBridge({ getToken: () => config.token(), onCommand: sendCommand, getState: () => recState, version: app.getVersion() });

  // Global shortcut: start (opens the recorder) / stop recording from anywhere.
  try { globalShortcut.register('CommandOrControl+Shift+Alt+R', () => sendCommand({ cmd: 'toggleRecord' })); } catch (e) { /* taken by another app */ }

  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('will-quit', () => { globalShortcut.unregisterAll(); if (bridge) bridge.server.close(); });
