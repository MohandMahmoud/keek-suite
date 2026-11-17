#!/usr/bin/env node
// Copies the shared app + NLP module into the desktop app and the extension.
// Edit files in shared/, then run:  node tools/sync.mjs
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cp = (from, to) => { mkdirSync(dirname(join(root, to)), { recursive: true }); copyFileSync(join(root, from), join(root, to)); console.log('  ' + from + ' → ' + to); };

const shared = ['index.html', 'app.js', 'keekx.js', 'keekx-integrations.js', 'logo.jpg'];
for (const f of shared) {
  cp('shared/app/' + f, 'desktop/renderer/' + f);
  cp('shared/app/' + f, 'extension/app/' + f);
}
cp('shared/app/platform.js', 'extension/app/platform.js');      // desktop has its own platform.js
cp('shared/nlp/keek-nlp.js', 'extension/app/keek-nlp.js');
cp('shared/nlp/keek-nlp.js', 'desktop/renderer/keek-nlp.js');     // loaded by index.html (unused on desktop)
cp('shared/nlp/keek-nlp.js', 'desktop/src/keek-nlp.js');          // used by the Electron main process
cp('shared/integrations/keek-integrations.js', 'extension/app/keek-integrations.js');
cp('shared/integrations/keek-integrations.js', 'desktop/renderer/keek-integrations.js'); // loaded by index.html (unused on desktop)
cp('shared/integrations/keek-integrations.js', 'desktop/src/keek-integrations.js');      // used by the Electron main process
cp('shared/integrations/keek-integrations.js', 'shared/app/keek-integrations.js');        // so shared/app/index.html works as a web page
console.log('sync done');
