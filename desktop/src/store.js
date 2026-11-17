// Local JSON document store: one file per document under <userData>/data/<collection path>/<id>.json
// Mirrors the tiny db API the KEEK app uses (collection(path).get / doc(id).set / doc(id).delete).
const fs = require('fs/promises');
const path = require('path');

const safe = s => String(s).replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 120) || '_';

module.exports = function createStore(baseDir) {
  const dirOf = p => path.join(baseDir, ...String(p || '').split('/').filter(Boolean).map(safe));

  async function writeAtomic(file, text) {
    const tmp = file + '.' + process.pid + '.tmp';
    await fs.writeFile(tmp, text, 'utf8');
    try { await fs.rename(tmp, file); }
    catch (e) { // Windows can refuse a rename while antivirus holds the file; write in place instead
      await fs.writeFile(file, text, 'utf8');
      await fs.unlink(tmp).catch(() => {});
    }
  }

  return {
    baseDir,
    async list(p) {
      const d = dirOf(p);
      let names;
      try { names = await fs.readdir(d); } catch (e) { if (e.code === 'ENOENT') return []; throw e; }
      const out = [];
      for (const n of names) {
        if (!n.endsWith('.json')) continue;
        try { out.push({ id: n.slice(0, -5), data: JSON.parse(await fs.readFile(path.join(d, n), 'utf8')) }); }
        catch (e) { console.warn('[store] skipping unreadable file', n, e.message); }
      }
      return out;
    },
    async set(p, id, data) {
      const d = dirOf(p);
      await fs.mkdir(d, { recursive: true });
      await writeAtomic(path.join(d, safe(id) + '.json'), JSON.stringify(data));
    },
    async del(p, id) {
      try { await fs.unlink(path.join(dirOf(p), safe(id) + '.json')); }
      catch (e) { if (e.code !== 'ENOENT') throw e; }
    }
  };
};
