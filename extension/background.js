// KEEK extension — background service worker.
//  * remembers which tabs are meetings (from content.js) and shows a badge
//  * talks to KEEK Desktop over the localhost bridge (docs/06-bridge-protocol.md)
//  * opens / reuses the in-extension KEEK app tab and forwards commands to it
const PORTS = [47821, 47822, 47823, 47824, 47825];
const APP_URL = chrome.runtime.getURL('app/index.html');
const tabKey = id => 'tab:' + id;

/* ---------------- meetings & badge ---------------- */
async function setMeeting(tabId, info) {
  await chrome.storage.session.set({ [tabKey(tabId)]: Object.assign({}, info, { tabId, at: Date.now() }) });
  const { appState } = await chrome.storage.session.get('appState');
  if (appState && (appState.state === 'recording' || appState.state === 'paused')) return;
  chrome.action.setBadgeBackgroundColor({ tabId, color: '#476D3A' });
  chrome.action.setBadgeText({ tabId, text: info.inCall ? '●' : '' });
}
chrome.tabs.onRemoved.addListener(id => chrome.storage.session.remove(tabKey(id)));

async function setAppState(state) {
  await chrome.storage.session.set({ appState: state });
  const rec = state && (state.state === 'recording' || state.state === 'paused');
  chrome.action.setBadgeBackgroundColor({ color: rec ? '#C8372D' : '#476D3A' });
  chrome.action.setBadgeText({ text: rec ? (state.state === 'paused' ? '❚❚' : 'REC') : '' });
  if (rec) { // per-tab badges would hide the global REC badge
    const all = await chrome.storage.session.get(null);
    Object.values(all).filter(v => v && v.tabId != null).forEach(v => chrome.action.setBadgeText({ tabId: v.tabId, text: '' }).catch(() => {}));
  }
}

/* ---------------- KEEK Desktop bridge ---------------- */
async function findDesktop() {
  const { desktopPort } = await chrome.storage.local.get('desktopPort');
  for (const p of [...new Set([desktopPort, ...PORTS].filter(Boolean))]) {
    try {
      const r = await fetch(`http://127.0.0.1:${p}/v1/ping`, { signal: AbortSignal.timeout(700) });
      if (r.ok && (await r.json()).app === 'keek-desktop') { chrome.storage.local.set({ desktopPort: p }); return p; }
    } catch (e) { /* try next */ }
  }
  return null;
}

const ROUTES = { status: ['GET', '/v1/status'], start: ['POST', '/v1/record/start'], prepare: ['POST', '/v1/record/prepare'], stop: ['POST', '/v1/record/stop'], open: ['POST', '/v1/open'] };
async function desktopCall(action, body, codeOverride) {
  const port = await findDesktop();
  if (!port) return { ok: false, error: 'not_running' };
  const code = codeOverride || (await chrome.storage.local.get('pairCode')).pairCode;
  if (!code) return { ok: false, error: 'not_paired' };
  const [method, path] = ROUTES[action] || ROUTES.status;
  try {
    const r = await fetch(`http://127.0.0.1:${port}${path}`, {
      method, headers: { Authorization: 'Bearer ' + code, 'Content-Type': 'application/json' },
      body: method === 'POST' ? JSON.stringify(body || {}) : undefined, signal: AbortSignal.timeout(4000)
    });
    const data = await r.json().catch(() => ({}));
    if (r.status === 401) return { ok: false, error: 'bad_code' };
    return { ok: r.ok, status: r.status, data, error: r.ok ? null : (data.error || 'error') };
  } catch (e) { return { ok: false, error: 'not_running' }; }
}

async function pair(code) {
  code = String(code || '').trim().toUpperCase().replace(/\s+/g, '');
  if (/^[A-Z2-9]{12}$/.test(code)) code = code.slice(0, 4) + '-' + code.slice(4, 8) + '-' + code.slice(8);
  const r = await desktopCall('status', null, code);
  if (r.ok) await chrome.storage.local.set({ pairCode: code });
  return r;
}

/* ---------------- in-extension app tab ---------------- */
async function findAppTab() {
  try {
    const ctx = await chrome.runtime.getContexts({ contextTypes: ['TAB'] });
    const c = ctx.find(x => x.documentUrl && x.documentUrl.startsWith(APP_URL));
    return c ? { tabId: c.tabId, windowId: c.windowId } : null;
  } catch (e) { return null; }
}
async function openApp(cmd) {
  const existing = await findAppTab();
  if (existing) {
    await chrome.tabs.update(existing.tabId, { active: true });
    if (existing.windowId != null) chrome.windows.update(existing.windowId, { focused: true }).catch(() => {});
    if (cmd) { try { await chrome.tabs.sendMessage(existing.tabId, { type: 'keek:command', cmd }); } catch (e) { /* page still loading */ } }
    return { ok: true, reused: true };
  }
  await chrome.tabs.create({ url: APP_URL + (cmd ? '#cmd=' + encodeURIComponent(JSON.stringify(cmd)) : '') });
  return { ok: true, reused: false };
}

/* ---------------- messages ---------------- */
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  const run = p => { p.then(reply, e => reply({ ok: false, error: String(e && e.message || e) })); return true; };
  switch (msg && msg.type) {
    case 'keek:meeting': if (sender.tab) setMeeting(sender.tab.id, msg.info); return false;
    case 'keek:appState': setAppState(msg.state); return false;
    case 'keek:popup': return run((async () => ({
      meeting: (await chrome.storage.session.get(tabKey(msg.tabId)))[tabKey(msg.tabId)] || null,
      app: (await chrome.storage.session.get('appState')).appState || null,
      desktop: await desktopCall('status')
    }))());
    case 'keek:desktop': return run(desktopCall(msg.action, msg.body));
    case 'keek:pair': return run(pair(msg.code));
    case 'keek:unpair': return run(chrome.storage.local.remove('pairCode').then(() => ({ ok: true })));
    case 'keek:openApp': return run(openApp(msg.cmd));
  }
  return false;
});

chrome.runtime.onInstalled.addListener(d => { if (d.reason === 'install') openApp(null); });
