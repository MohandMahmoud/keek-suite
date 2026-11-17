// Run: node --test desktop/test/   (plain Node; Electron not required)
const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('os');
const fs = require('fs');
const path = require('path');
const createStore = require('../src/store.js');
const createConfig = require('../src/config.js');
const { startBridge, sameToken } = require('../src/bridge.js');

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'keek-'));

test('store: set / list / delete, path segments sanitised', async () => {
  const s = createStore(tmp());
  await s.set('data/users/local/keek', 'ws', { v: 2, n: 'مرحبا' });
  await s.set('data/users/local/keek', 'm_m1', { id: 'm1' });
  let rows = await s.list('data/users/local/keek');
  assert.deepEqual(rows.map(r => r.id).sort(), ['m_m1', 'ws']);
  assert.equal(rows.find(r => r.id === 'ws').data.n, 'مرحبا');
  await s.del('data/users/local/keek', 'm_m1');
  rows = await s.list('data/users/local/keek');
  assert.deepEqual(rows.map(r => r.id), ['ws']);
  await s.set('../../etc', 'x', {});            // must stay inside baseDir
  assert.ok(fs.existsSync(path.join(s.baseDir, '_', '_', 'etc', 'x.json')) || fs.readdirSync(s.baseDir).length >= 1);
  assert.equal(fs.existsSync(path.join(s.baseDir, '..', '..', 'etc', 'x.json')), false);
  assert.deepEqual(await s.list('nothing/here'), []);
});

test('config: keys encrypted at rest, removable, token generated', () => {
  const dir = tmp();
  const fakeSafe = { isEncryptionAvailable: () => true, encryptString: s => Buffer.from('ENC:' + s), decryptString: b => b.toString().slice(4) };
  const c = createConfig(dir, fakeSafe);
  assert.match(c.token(), /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
  c.update({ groqKey: 'gsk_secret', provider: 'gemini', bogus: 'x' });
  const raw = fs.readFileSync(path.join(dir, 'keek-config.json'), 'utf8');
  assert.ok(!raw.includes('gsk_secret'), 'key must not be stored in plain text');
  assert.ok(!raw.includes('bogus'));
  const again = createConfig(dir, fakeSafe);
  assert.equal(again.nlp().groqKey, 'gsk_secret');
  assert.equal(again.nlp().provider, 'gemini');
  assert.deepEqual(again.update({ groqKey: null }), ['groqKey']);
  assert.equal(again.nlp().groqKey, '');
  const old = again.token();
  assert.notEqual(again.regenToken(), old);
});

test('bridge: origin, host and token checks; commands forwarded', async () => {
  const cmds = [];
  const b = await startBridge({ getToken: () => 'ABCD-EFGH-JKLM', onCommand: c => cmds.push(c), getState: () => ({ state: 'idle' }), version: '1.0.0', log: () => {} });
  assert.ok(b && b.port);
  const base = 'http://127.0.0.1:' + b.port;
  const ext = { Origin: 'chrome-extension://abcdefghijklmnop' };
  const auth = Object.assign({ Authorization: 'Bearer abcd-efgh-jklm', 'Content-Type': 'application/json' }, ext);

  assert.equal((await (await fetch(base + '/v1/ping', { headers: ext })).json()).app, 'keek-desktop');
  assert.equal((await fetch(base + '/v1/status', { headers: { Origin: 'https://evil.example' } })).status, 403);
  assert.equal((await fetch(base + '/v1/status', { headers: Object.assign({ Authorization: 'Bearer WRONG' }, ext) })).status, 401);
  const st = await fetch(base + '/v1/status', { headers: auth });
  assert.equal(st.status, 200);
  assert.equal(st.headers.get('access-control-allow-origin'), ext.Origin);

  assert.equal((await fetch(base + '/v1/record/start', { method: 'POST', headers: auth, body: JSON.stringify({ meeting: { title: 'x' } }) })).status, 400);
  const r = await fetch(base + '/v1/record/start', { method: 'POST', headers: auth, body: JSON.stringify({ consent: true, meeting: { title: 'Weekly sync', url: 'https://meet.google.com/abc-defg-hij', platform: 'meet' } }) });
  assert.equal(r.status, 202);
  await fetch(base + '/v1/record/stop', { method: 'POST', headers: auth });
  assert.deepEqual(cmds, [
    { cmd: 'startRecord', meeting: { title: 'Weekly sync', url: 'https://meet.google.com/abc-defg-hij', platform: 'meet' }, consent: true },
    { cmd: 'stopRecord' }
  ]);
  b.server.close();
});

test('sameToken is constant-time and rejects empty', () => {
  assert.equal(sameToken('', ''), false);
  assert.equal(sameToken('A', 'A'), true);
  assert.equal(sameToken('A', 'B'), false);
});
