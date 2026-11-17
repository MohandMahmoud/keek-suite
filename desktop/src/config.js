// Settings + API keys for the desktop app.
// Keys are encrypted with Electron safeStorage (Keychain on macOS, DPAPI on Windows, libsecret/kwallet on Linux).
// Env vars GROQ_API_KEY / GEMINI_API_KEY override saved keys (handy for development).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KEY_FIELDS = { groqKey: 'groq', geminiKey: 'gemini' };
const SETTINGS = ['provider', 'sttProvider', 'liveEngine', 'chunkSec', 'groqModel', 'groqSttModel', 'geminiModel', 'geminiSttModel', 'geminiThinking', 'groqMaxPromptTokens'];
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

function newToken() {
  let s = '';
  for (let i = 0; i < 12; i++) s += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8);
}

module.exports = function createConfig(userDataDir, safeStorage) {
  const file = path.join(userDataDir, 'keek-config.json');
  let data = { settings: { liveEngine: 'auto', chunkSec: 20 }, keys: {} };
  try { data = Object.assign(data, JSON.parse(fs.readFileSync(file, 'utf8'))); } catch (e) { /* first run */ }
  data.settings = data.settings || {};
  data.keys = data.keys || {};
  if (!data.bridgeToken) { data.bridgeToken = newToken(); save(); }

  function save() {
    fs.mkdirSync(userDataDir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), { mode: 0o600 });
  }
  const canEncrypt = () => { try { return safeStorage && safeStorage.isEncryptionAvailable(); } catch (e) { return false; } };
  const enc = s => canEncrypt() ? { e: safeStorage.encryptString(s).toString('base64') } : { p: s };
  const dec = v => {
    if (!v) return '';
    if (v.p) return v.p;
    try { return safeStorage.decryptString(Buffer.from(v.e, 'base64')); } catch (e) { console.warn('[config] could not decrypt a saved key'); return ''; }
  };

  return {
    file,
    encrypted: canEncrypt,
    /** Full config for KeekNLP (includes keys — main process only). */
    nlp() {
      return Object.assign({}, data.settings, {
        groqKey: process.env.GROQ_API_KEY || dec(data.keys.groq),
        geminiKey: process.env.GEMINI_API_KEY || dec(data.keys.gemini)
      });
    },
    /** Apply a patch from the renderer. null removes a value; '' / undefined are ignored. Returns removed keys. */
    update(patch) {
      const removed = [];
      for (const k of Object.keys(patch || {})) {
        const v = patch[k];
        if (KEY_FIELDS[k]) {
          if (v === null) { delete data.keys[KEY_FIELDS[k]]; removed.push(k); }
          else if (typeof v === 'string' && v.trim()) data.keys[KEY_FIELDS[k]] = enc(v.trim());
        } else if (SETTINGS.includes(k)) {
          if (v === null) { delete data.settings[k]; removed.push(k); }
          else if (v !== '' && v !== undefined) data.settings[k] = v;
        }
      }
      save();
      return removed;
    },
    /** Integration connections (Slack/Notion/Linear/Jira/webhooks) — stored encrypted as one blob. */
    integrations() {
      if (!data.integrations) return {};
      try { return JSON.parse(dec(data.integrations)) || {}; } catch (e) { return {}; }
    },
    setIntegrations(all) {
      if (all && Object.keys(all).length) data.integrations = enc(JSON.stringify(all));
      else delete data.integrations;
      save();
    },
    token: () => data.bridgeToken,
    regenToken() { data.bridgeToken = newToken(); save(); return data.bridgeToken; }
  };
};
module.exports.newToken = newToken;
