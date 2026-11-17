// Preload (sandboxed): exposes a narrow, typed API to the renderer as window.keekNative.
const { contextBridge, ipcRenderer } = require('electron');

// Commands can arrive before the page registers its handler; buffer them.
const pendingCommands = [];
let commandHandler = null;
ipcRenderer.on('bridge:command', (_e, cmd) => { if (commandHandler) commandHandler(cmd); else pendingCommands.push(cmd); });

const chunkHandlers = new Set();
ipcRenderer.on('nlp:chunk', (_e, id, text) => chunkHandlers.forEach(f => f(id, text)));

contextBridge.exposeInMainWorld('keekNative', {
  dbList: p => ipcRenderer.invoke('db:list', p),
  dbSet: (p, id, data) => ipcRenderer.invoke('db:set', p, id, data),
  dbDel: (p, id) => ipcRenderer.invoke('db:del', p, id),
  cfgGet: () => ipcRenderer.invoke('cfg:get'),
  cfgSet: patch => ipcRenderer.invoke('cfg:set', patch),
  cfgTest: provider => ipcRenderer.invoke('cfg:test', provider),
  complete: (id, prompt, opts) => ipcRenderer.invoke('nlp:complete', id, prompt, opts),
  transcribe: (bytes, opts) => ipcRenderer.invoke('nlp:transcribe', bytes, opts),
  saveFile: (name, data) => ipcRenderer.invoke('file:save', name, data),
  intList: () => ipcRenderer.invoke('int:list'),
  intConnect: (kind, input) => ipcRenderer.invoke('int:connect', kind, input),
  intOptions: (kind, patch) => ipcRenderer.invoke('int:options', kind, patch),
  intRemove: kind => ipcRenderer.invoke('int:remove', kind),
  intSend: (kind, payload) => ipcRenderer.invoke('int:send', kind, payload),
  intRun: (kind, op, args) => ipcRenderer.invoke('int:run', kind, op, args),
  appInfo: () => ipcRenderer.invoke('app:info'),
  regenToken: () => ipcRenderer.invoke('bridge:regen'),
  onChunk: f => { chunkHandlers.add(f); },
  onCommand: f => { commandHandler = f; pendingCommands.splice(0).forEach(c => f(c)); },
  reportState: s => ipcRenderer.send('bridge:state', s),
  openExternal: url => ipcRenderer.send('open:external', url),
  notify: (title, body) => ipcRenderer.send('notify', title, body)
});
