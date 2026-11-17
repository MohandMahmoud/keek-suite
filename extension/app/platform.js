/*
 * KEEK platform adapter — Chrome extension pages and plain web pages.
 * (The desktop app ships its own platform.js that talks to Electron through IPC.)
 *
 * Provides:
 *   window.claude          – the small capability API the original KEEK app expects (db, user, sample, downloads)
 *   window.KEEK_PLATFORM   – NLP config/transcription, audio capture, commands, info
 * Storage: chrome.storage.local in the extension, localStorage on the web.
 * NLP: KeekNLP (keek-nlp.js) called directly from this page; the extension's host_permissions
 *      allow the cross-origin calls to Groq and Gemini.
 */
(function () {
  'use strict';
  const hasChrome = typeof chrome !== 'undefined' && !!(chrome.storage && chrome.storage.local && chrome.runtime && chrome.runtime.id);
  const kind = hasChrome ? 'extension' : 'web';
  const CFG_KEY = 'keek-config';
  const DEF = { provider: 'auto', sttProvider: 'auto', liveEngine: 'auto', chunkSec: 20 };

  const kv = hasChrome ? {
    get: async k => (await chrome.storage.local.get(k))[k],
    all: async () => chrome.storage.local.get(null),
    set: (k, v) => chrome.storage.local.set({ [k]: v }),
    del: k => chrome.storage.local.remove(k)
  } : {
    get: async k => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : undefined; } catch (e) { return undefined; } },
    all: async () => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); try { o[k] = JSON.parse(localStorage.getItem(k)); } catch (e) { /* skip */ } } return o; },
    set: async (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    del: async k => localStorage.removeItem(k)
  };

  /* ---------- NLP ---------- */
  let cfg = Object.assign({}, DEF), nlp = null;
  const ready = (async () => {
    cfg = Object.assign({}, DEF, (await kv.get(CFG_KEY)) || {});
    nlp = window.KeekNLP.create(cfg, { log: m => console.debug('[keek-nlp]', m) });
  })();
  const publicCfg = () => {
    const c = Object.assign({}, KeekNLP.DEFAULTS, cfg);
    const out = {};
    ['provider', 'sttProvider', 'liveEngine', 'chunkSec', 'groqModel', 'groqSttModel', 'geminiModel', 'groqMaxPromptTokens'].forEach(k => { out[k] = c[k]; });
    out.hasGroqKey = !!cfg.groqKey; out.hasGeminiKey = !!cfg.geminiKey;
    out.groqKeyHint = cfg.groqKey ? '…' + cfg.groqKey.slice(-4) : ''; out.geminiKeyHint = cfg.geminiKey ? '…' + cfg.geminiKey.slice(-4) : '';
    out.stats = nlp ? nlp.stats() : {};
    return out;
  };
  const nlpApi = {
    async getConfig() { await ready; return publicCfg(); },
    async setConfig(patch) {
      await ready;
      const removed = [];
      for (const k in patch) {
        if (patch[k] === null) { delete cfg[k]; removed.push(k); }
        else if (patch[k] !== '' && patch[k] !== undefined) cfg[k] = patch[k];
      }
      await kv.set(CFG_KEY, cfg);
      nlp.configure(cfg);
      if (removed.length) nlp.remove(removed);
      return publicCfg();
    },
    async test(p) { await ready; return nlp.test(p); },
    async transcribe(bytes, o) { await ready; return nlp.transcribe(Object.assign({ data: bytes }, o)); }
  };

  /* ---------- integrations (Slack/Notion/Linear/Jira/webhooks) ---------- */
  const INT_KEY = 'keek-integrations';
  const intMgr = window.KeekIntegrations ? window.KeekIntegrations.createManager({
    load: () => kv.get(INT_KEY),
    save: a => kv.set(INT_KEY, a)
  }) : null;
  // Slack, Notion, Linear and *.atlassian.net are in host_permissions. Webhooks and self-hosted
  // Jira sites need an optional permission, which Chrome only grants from a click — so this must be
  // called synchronously from the click handler, before anything is awaited.
  function askOrigin(kind, input) {
    if (!hasChrome || !chrome.permissions || !input) return Promise.resolve(true);
    let raw = kind === 'webhooks' || kind === 'gcal' || kind === 'outlook' ? input.url : kind === 'jira' ? input.site : '';
    if (!raw) return Promise.resolve(true);
    raw = String(raw).trim().replace(/^webcal:\/\//i, 'https://');
    if (kind === 'jira' && !/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
    let u; try { u = new URL(raw); } catch (e) { return Promise.resolve(true); } // the module reports bad URLs
    if (kind === 'jira' && /\.atlassian\.net$/i.test(u.hostname)) return Promise.resolve(true);
    if (/^(calendar\.google\.com|outlook\.(office365|office|live)\.com)$/i.test(u.hostname)) return Promise.resolve(true);
    return chrome.permissions.request({ origins: [u.protocol + '//' + u.hostname + '/*'] });
  }
  const intApi = intMgr && {
    list: () => intMgr.list(),
    connect(kind, input) {
      const perm = askOrigin(kind, input);
      return perm.then(ok => {
        if (!ok) { const e = new Error('Chrome permission to reach that address was declined.'); e.code = 'auth'; throw e; }
        return intMgr.connect(kind, input);
      });
    },
    setOptions: (kind, patch) => intMgr.setOptions(kind, patch),
    remove: kind => intMgr.remove(kind),
    send: (kind, payload) => intMgr.send(kind, payload),
    run: (kind, op, args) => intMgr.run(kind, op, args)
  };

  /* ---------- window.claude shim (what the original app expects) ---------- */
  const db = {
    collection(path) {
      const pre = 'db|' + path + '|';
      return {
        async get() {
          const all = await kv.all();
          return { docs: Object.keys(all).filter(k => k.startsWith(pre)).map(k => ({ id: k.slice(pre.length), exists: true, data: () => all[k] })) };
        },
        doc(id) { return { set: d => kv.set(pre + id, d), delete: () => kv.del(pre + id) }; }
      };
    }
  };
  const sample = async (input, o) => {
    o = o || {};
    await ready;
    const text = await nlp.complete(String(input), { onText: o.onText ? s => o.onText({ text: s }) : undefined });
    return { text };
  };
  sample.json = async prompt => { await ready; return nlp.json(String(prompt)); };
  const downloads = {
    async save({ filename, data }) {
      const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
  };
  window.claude = {
    async use(name) {
      if (name === 'db') return db;
      if (name === 'user') return { id: async () => 'local' };
      if (name === 'sample') return sample;
      if (name === 'downloads') return downloads;
      throw new Error('Unknown capability: ' + name);
    }
  };

  /* ---------- capture ---------- */
  const capture = {
    // "loopback" in a browser = the screen/tab share picker with "Share audio" ticked.
    loopback: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia),
    loopbackDefault: false,
    tab: hasChrome && !!(chrome.tabCapture && chrome.tabCapture.getMediaStreamId),
    async getSystemStream() {
      const raw = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true, systemAudio: 'include', selfBrowserSurface: 'exclude' });
      const audio = raw.getAudioTracks();
      if (!audio.length) { raw.getTracks().forEach(x => x.stop()); const e = new Error('No audio was shared — tick “Share audio” in the picker.'); e.name = 'NoAudio'; throw e; }
      raw.getVideoTracks().forEach(v => { v.enabled = false; });
      return { stream: new MediaStream(audio), raw };
    },
    async getTabStream(tabId) {
      const id = await new Promise((res, rej) => chrome.tabCapture.getMediaStreamId({ targetTabId: tabId }, sid => {
        const err = chrome.runtime.lastError;
        if (err || !sid) rej(new Error((err && err.message) || 'Tab capture was refused. Click the KEEK icon on the meeting tab again.')); else res(sid);
      }));
      const s = await navigator.mediaDevices.getUserMedia({ audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: id } }, video: false });
      return { stream: s, raw: s };
    }
  };

  /* ---------- commands & state (extension) ---------- */
  const listeners = [];
  let initialCommand = null;
  try {
    const m = location.hash.match(/cmd=([^&]+)/);
    if (m) { initialCommand = JSON.parse(decodeURIComponent(m[1])); history.replaceState(null, '', location.pathname); }
  } catch (e) { console.warn('bad command in URL', e); }
  if (hasChrome && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
      if (msg && msg.type === 'keek:command') { listeners.forEach(f => f(msg.cmd)); reply({ ok: true }); }
      if (msg && msg.type === 'keek:ping') reply({ ok: true, app: true });
    });
  }

  window.KEEK_PLATFORM = {
    kind,
    nlp: nlpApi,
    integrations: intApi,
    capture,
    initialCommand,
    bridge: {
      onCommand: f => listeners.push(f),
      report: s => { if (hasChrome) chrome.runtime.sendMessage({ type: 'keek:appState', state: s }).catch(() => {}); }
    },
    async info() { return { version: hasChrome ? chrome.runtime.getManifest().version : 'web' }; },
    openExternal: url => window.open(url, '_blank', 'noopener')
  };
})();
