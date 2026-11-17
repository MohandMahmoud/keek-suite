#!/usr/bin/env python3
"""
Turn the single-file KEEK web app (keek.html) into the shared renderer used by the desktop
app and the browser extension:

    shared/app/index.html   – markup + CSS, loads the scripts below (no inline script → MV3-safe)
    shared/app/app.js       – the original app script with a handful of small, asserted hooks
    shared/app/logo.jpg     – the KEEK logo (used for icons)

The hooks only call into KEEKX (shared/app/keekx.js), which holds all new behaviour.
Usage:  python3 tools/extract_app.py path/to/keek.html
Every patch must match exactly once, so a changed source fails loudly instead of silently.
"""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'shared', 'original', 'keek.html')
OUT = os.path.join(ROOT, 'shared', 'app')

html = open(SRC, encoding='utf-8').read()
m = re.search(r'<script>\n(.*)</script>\s*</body>', html, re.S)
assert m, 'inline <script> not found'
js = m.group(1)
head = html[:m.start()]

PATCHES = [
    # boot: load AI/provider config first, install hooks, hand over to KEEKX when ready
    ('await Store.init();', 'await KEEKX.init();await Store.init();'),
    ('UI.ready=true;render();\n})();', 'UI.ready=true;render();KEEKX.afterBoot();\n})();'),
    ('/* ---------- boot ---------- */', 'KEEKX.install();\n\n/* ---------- boot ---------- */'),
    # "new meeting" sheet: the desktop-capture option becomes live when the platform supports it
    ("""<button class="option" disabled>${ic('monitor')}<div><b>${t('optDesktop')}</b><span class="small muted">${t('optDesktopD')}</span><div style="margin-top:6px"><span class="badge warn">${t('notDetected')}</span></div></div></button>""",
     "${KEEKX.desktopOption()}"),
    # upload sheet: real transcription instead of "not switched on yet"
    ("""<div class="setup">${ic('gear')}<div><b>${t('sttOffTitle')}</b>${t('sttOffBody')}</div></div>`,cancel+(md_.mid?""",
     """${KEEKX.uploadSttBlock(md_)}`,cancel+KEEKX.uploadBtn(md_)+(md_.mid?"""),
    # import sheet can be pre-filled with a machine transcript
    ("""<textarea class="input" id="imText" style="min-height:220px" placeholder="${esc(t('pastePh'))}"></textarea>""",
     """<textarea class="input" id="imText" style="min-height:220px" placeholder="${esc(t('pastePh'))}">${esc(f.text||'')}</textarea>"""),
    # recorder: capture sources + accurate note
    ("""<div class="note" style="position:relative;max-width:560px">${t('micOnlyNote')}</div>""", "${KEEKX.captureNote(f)}"),
    ("""${st==='idle'?`<label class="consent">""", """${st==='idle'?KEEKX.sourcePicker(f):''}\n   ${st==='idle'?`<label class="consent">"""),
    ("""<option value="en-US" ${f.lang==='en-US'?'selected':''}>English</option></select>""",
     """<option value="en-US" ${f.lang==='en-US'?'selected':''}>English</option>${KEEKX.autoLangOption(f)}</select>"""),
    ('REC.stream=await navigator.mediaDevices.getUserMedia({audio:true})', 'REC.stream=await KEEKX.captureStream(REC.form)'),
    # notifications: desktop notifications are real in the desktop app
    ("['notifyDesktop',false]", "['notifyDesktop',!!KEEKX.canNotify()]"),
]
for old, new in PATCHES:
    n = js.count(old)
    assert n == 1, f'patch target found {n}x: {old[:80]}'
    js = js.replace(old, new)

# integrations page: replace the three static "KEEK apps" cards with live status cards
pat = re.compile(r'<div class="cards" style="margin-bottom:24px">.*?</div>\n </div>\n <h3 class="day">', re.S)
assert len(pat.findall(js)) == 1, 'apps cards block not found'
js = pat.sub(lambda _: '${KEEKX.appCards()}\n <h3 class="day">', js)

# logo for icons
lm = re.search(r"const LOGO=`data:image/jpeg;base64,([^`]+)`", js)
assert lm, 'LOGO not found'
os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, 'logo.jpg'), 'wb').write(base64.b64decode(lm.group(1)))

CSP = ("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
       "font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self' blob: data:; "
       "connect-src 'self' blob: data: https: http://localhost:* http://127.0.0.1:*")
head = head.replace('<meta charset="utf-8">', f'<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" content="{CSP}">', 1)
index = (head.rstrip() + '\n'
         '<script src="keek-nlp.js"></script>\n'
         '<script src="keek-integrations.js"></script>\n'
         '<script src="platform.js"></script>\n'
         '<script src="keekx.js"></script>\n'
         '<script src="keekx-integrations.js"></script>\n'
         '<script src="app.js"></script>\n'
         '</body>\n</html>\n')
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index)
open(os.path.join(OUT, 'app.js'), 'w', encoding='utf-8').write(
    '/* KEEK app — extracted from keek.html by tools/extract_app.py. New behaviour lives in keekx.js. */\n' + js)
print('ok:', os.path.join(OUT, 'index.html'), len(index), 'bytes;', 'app.js', len(js), 'bytes')
