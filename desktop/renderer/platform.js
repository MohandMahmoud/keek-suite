/*
 * KEEK platform adapter — DESKTOP (Electron renderer).
 * Talks to the main process through window.keekNative (preload.js). The AI keys never reach this page.
 * Not overwritten by tools/sync.mjs.
 */
(function () {
  'use strict';
  const N = window.keekNative;
  if (!N) { console.error('KEEK: keekNative bridge missing — is preload.js loaded?'); return; }

  async function call(promise) {
    const r = await promise;
    if (!r || r.ok === false) {
      const err = new Error((r && r.error && r.error.message) || 'IPC error');
      if (r && r.error) { err.code = r.error.code; err.provider = r.error.provider; err.field = r.error.field; err.choices = r.error.choices; err.created = r.error.created; }
      throw err;
    }
    return r.value;
  }

  /* ---- AI (the original app calls this "sample") ---- */
  let seq = 0;
  const streams = new Map();
  N.onChunk((id, text) => { const f = streams.get(id); if (f) f(text); });
  const sample = async (input, o) => {
    o = o || {};
    const id = ++seq;
    if (o.onText) streams.set(id, text => o.onText({ text }));
    try { return { text: await call(N.complete(id, String(input), { json: false, stream: !!o.onText })) }; }
    finally { streams.delete(id); }
  };
  sample.json = prompt => call(N.complete(++seq, String(prompt), { json: true }));

  /* ---- storage ---- */
  const db = {
    collection(path) {
      return {
        async get() { const rows = await call(N.dbList(path)); return { docs: rows.map(r => ({ id: r.id, exists: true, data: () => r.data })) }; },
        doc(id) { return { set: d => call(N.dbSet(path, id, d)), delete: () => call(N.dbDel(path, id)) }; }
      };
    }
  };
  const downloads = {
    async save({ filename, data }) {
      const saved = await call(N.saveFile(filename, typeof data === 'string' ? data : String(data)));
      if (!saved) { const e = new Error('declined'); e.code = 'declined'; throw e; }
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

  /* ---- platform API for KEEKX ---- */
  window.KEEK_PLATFORM = {
    kind: 'desktop',
    nlp: {
      getConfig: () => call(N.cfgGet()),
      setConfig: patch => call(N.cfgSet(patch)),
      test: p => call(N.cfgTest(p)),
      transcribe: (bytes, o) => call(N.transcribe(bytes, o || {}))
    },
    capture: {
      loopback: true, loopbackDefault: true, tab: false,
      // main.js answers getDisplayMedia with "whole screen + system audio loopback" (no picker).
      async getSystemStream() {
        const raw = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: { width: 320, height: 180, frameRate: 1 } });
        const audio = raw.getAudioTracks();
        if (!audio.length) {
          raw.getTracks().forEach(x => x.stop());
          const e = new Error(navigator.platform.startsWith('Mac') ? 'System audio isn’t available on this Mac — allow Screen Recording for KEEK, or pick a virtual device such as BlackHole' : 'System audio isn’t available on this computer');
          e.name = 'NoSystemAudio';
          throw e;
        }
        raw.getVideoTracks().forEach(v => { v.enabled = false; }); // keep (stopping it can end loopback audio)
        return { stream: new MediaStream(audio), raw };
      }
    },
    bridge: {
      onCommand: f => N.onCommand(f),
      report: s => N.reportState(s),
      regenToken: () => call(N.regenToken())
    },
    integrations: {
      list: () => call(N.intList()),
      connect: (kind, input) => call(N.intConnect(kind, input)),
      setOptions: (kind, patch) => call(N.intOptions(kind, patch)),
      remove: kind => call(N.intRemove(kind)),
      send: (kind, payload) => call(N.intSend(kind, payload)),
      run: (kind, op, args) => call(N.intRun(kind, op, args))
    },
    info: () => call(N.appInfo()),
    openExternal: url => N.openExternal(url),
    notify: (title, body) => N.notify(title, body)
  };
})();
