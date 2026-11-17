// Local bridge so the KEEK browser extension can control the desktop app.
// Listens on 127.0.0.1 only. Every call except /v1/ping needs the pairing code as a Bearer token.
// Requests from ordinary web pages are rejected by Origin; Host is checked against DNS rebinding.
// Protocol: docs/06-bridge-protocol.md
const http = require('http');
const crypto = require('crypto');

const PORTS = [47821, 47822, 47823, 47824, 47825];
const EXT_ORIGIN = /^(chrome|moz|safari-web)-extension:\/\//;

function sameToken(a, b) {
  const h = s => crypto.createHash('sha256').update(String(s || '')).digest();
  return !!a && !!b && crypto.timingSafeEqual(h(a), h(b));
}

function readJSON(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(Object.assign(new Error('body too large'), { status: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { if (!chunks.length) return resolve({}); try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch (e) { reject(Object.assign(new Error('invalid JSON'), { status: 400 })); } });
    req.on('error', reject);
  });
}

const PLATFORMS = ['meet', 'zoom', 'teams', 'inperson', 'other'];
function cleanMeeting(m) {
  m = m || {};
  return {
    title: String(m.title || '').slice(0, 200),
    url: /^https:\/\//.test(m.url || '') ? String(m.url).slice(0, 500) : '',
    platform: PLATFORMS.includes(m.platform) ? m.platform : 'other'
  };
}

function startBridge({ getToken, onCommand, getState, version, log = console.log }) {
  async function handler(req, res) {
    const send = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
    const origin = req.headers.origin || '';
    if (origin && !EXT_ORIGIN.test(origin)) return send(403, { error: 'forbidden_origin' });
    if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host || '')) return send(403, { error: 'forbidden_host' });
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

    const url = new URL(req.url, 'http://127.0.0.1');
    if (url.pathname === '/v1/ping') return send(200, { app: 'keek-desktop', version });

    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim().toUpperCase();
    if (!sameToken(token, getToken())) return send(401, { error: 'unauthorized' });

    try {
      if (req.method === 'GET' && url.pathname === '/v1/status') return send(200, { app: 'keek-desktop', version, recording: getState() });
      if (req.method !== 'POST') return send(404, { error: 'not_found' });
      const body = await readJSON(req);
      switch (url.pathname) {
        case '/v1/record/start':
          if (body.consent !== true) return send(400, { error: 'consent_required' });
          onCommand({ cmd: 'startRecord', meeting: cleanMeeting(body.meeting), consent: true });
          return send(202, { ok: true });
        case '/v1/record/prepare':
          onCommand({ cmd: 'prepareRecord', meeting: cleanMeeting(body.meeting), consent: false });
          return send(202, { ok: true });
        case '/v1/record/stop':
          onCommand({ cmd: 'stopRecord' });
          return send(202, { ok: true });
        case '/v1/open':
          onCommand({ cmd: 'open', route: ['dashboard', 'meetings', 'search', 'tasks', 'settings'].includes(body.route) ? body.route : 'dashboard' });
          return send(202, { ok: true });
        default:
          return send(404, { error: 'not_found' });
      }
    } catch (e) {
      return send(e.status || 500, { error: e.message });
    }
  }

  return new Promise(resolve => {
    let i = 0;
    const server = http.createServer((req, res) => { handler(req, res).catch(e => { log('[bridge] ' + e.message); try { res.writeHead(500); res.end(); } catch (_) { /* ignore */ } }); });
    server.on('listening', () => { const port = server.address().port; log('[bridge] listening on 127.0.0.1:' + port); resolve({ server, port }); });
    server.on('error', e => {
      if (e.code === 'EADDRINUSE' && ++i < PORTS.length) server.listen(PORTS[i], '127.0.0.1');
      else { log('[bridge] disabled: ' + e.message); resolve(null); }
    });
    server.listen(PORTS[0], '127.0.0.1');
  });
}

module.exports = { startBridge, PORTS, sameToken, cleanMeeting };
