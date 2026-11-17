// KEEK popup: shows the detected meeting, records this tab in the browser, or controls KEEK Desktop.
const T = {
  en: {
    sub: 'Meeting companion', other: 'Web page', inCall: '● In a call', notInCall: 'Not in a call', noMeeting: 'No meeting detected on this tab. You can still record its audio.',
    consent: 'I’ve told participants this meeting is recorded, and I’m responsible for following consent laws.',
    hBrowser: 'In this browser', recTab: 'Record this tab + my mic', recTabHint: 'Opens KEEK in a tab with this meeting ready to record. Transcription uses your free Groq/Gemini key.',
    hDesktop: 'KEEK Desktop', notRunning: 'Not running', notPaired: 'Running — not paired', badCode: 'That code didn’t work', idle: 'Connected · ready', recording: 'Recording', paused: 'Paused', stopped: 'Recording waiting for review',
    pair: 'Pair', pairHint: 'Find the pairing code in KEEK Desktop → Integrations.', desktopHint: 'Desktop records ALL computer audio (also the desktop Zoom/Teams apps).', notRunningHint: 'Open KEEK Desktop to record system audio, or record this tab in the browser.',
    recDesk: 'Record with Desktop', stop: 'Stop', showDesk: 'Show', unpair: 'Unpair', openApp: 'Open KEEK', needConsent: 'Tick the consent box first.', lang: 'العربية',
    platforms: { meet: 'Google Meet', zoom: 'Zoom', teams: 'Microsoft Teams', other: 'Web page' }
  },
  ar: {
    sub: 'رفيق الاجتماعات', other: 'صفحة ويب', inCall: '● في مكالمة', notInCall: 'ليس في مكالمة', noMeeting: 'لم يُكتشف اجتماع في هذا التبويب. ما زال بإمكانك تسجيل صوته.',
    consent: 'أبلغت المشاركين بأن الاجتماع يُسجَّل، وأتحمل مسؤولية الالتزام بقوانين الموافقة.',
    hBrowser: 'في هذا المتصفح', recTab: 'سجّل هذا التبويب + الميكروفون', recTabHint: 'يفتح كيكـ في تبويب والاجتماع جاهز للتسجيل. التفريغ عبر مفتاح Groq/Gemini المجاني.',
    hDesktop: 'كيكـ لسطح المكتب', notRunning: 'لا يعمل', notPaired: 'يعمل — غير مقترن', badCode: 'الكود غير صحيح', idle: 'متصل · جاهز', recording: 'يسجّل الآن', paused: 'متوقف مؤقتاً', stopped: 'تسجيل بانتظار المراجعة',
    pair: 'اقتران', pairHint: 'تجد كود الاقتران في تطبيق سطح المكتب ← التكاملات.', desktopHint: 'تطبيق سطح المكتب يسجّل كل صوت الجهاز (ومنها تطبيقات Zoom وTeams).', notRunningHint: 'افتح تطبيق كيكـ لسطح المكتب لتسجيل صوت النظام، أو سجّل هذا التبويب في المتصفح.',
    recDesk: 'سجّل عبر سطح المكتب', stop: 'إيقاف', showDesk: 'إظهار', unpair: 'إلغاء الاقتران', openApp: 'افتح كيكـ', needConsent: 'فعّل خانة الموافقة أولاً.', lang: 'English',
    platforms: { meet: 'Google Meet', zoom: 'Zoom', teams: 'Microsoft Teams', other: 'صفحة ويب' }
  }
};
let lang = 'en', tab = null, state = null;
const $ = id => document.getElementById(id);
const L = () => T[lang];
const send = msg => chrome.runtime.sendMessage(msg);

function meetingInfo() {
  const m = state && state.meeting;
  return m ? { title: m.title, url: m.url, platform: m.platform } : { title: '', url: '', platform: 'other' };
}

function render() {
  const l = L();
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $('sub').textContent = l.sub; $('lang').textContent = l.lang;
  $('consentText').textContent = l.consent;
  $('hBrowser').textContent = l.hBrowser; $('recTab').textContent = l.recTab; $('recTabHint').textContent = l.recTabHint;
  $('hDesktop').textContent = l.hDesktop; $('pairBtn').textContent = l.pair; $('openApp').textContent = l.openApp;

  const m = state && state.meeting;
  $('platform').textContent = l.platforms[(m && m.platform) || 'other'];
  $('callState').textContent = m ? (m.inCall ? l.inCall : l.notInCall) : '';
  $('callState').className = 'state' + (m && m.inCall ? ' live' : '');
  $('meetingTitle').textContent = m && m.title ? m.title : (m ? '—' : l.noMeeting);
  $('meetingTitle').className = 'title' + (m && m.title ? '' : ' muted');

  const d = (state && state.desktop) || { ok: false, error: 'not_running' };
  const actions = $('deskActions'); actions.innerHTML = '';
  $('pairBox').classList.add('hidden');
  const hint = $('deskHint'); hint.className = 'hint';
  const status = (cls, text) => { $('deskStatus').innerHTML = ''; const dot = document.createElement('span'); dot.className = 'dot ' + cls; $('deskStatus').append(dot, document.createTextNode(' ' + text)); };
  const button = (label, cls, fn) => { const b = document.createElement('button'); b.className = 'btn ' + cls; b.type = 'button'; b.textContent = label; b.onclick = fn; actions.append(b); return b; };

  if (d.ok) {
    const rs = (d.data && d.data.recording && d.data.recording.state) || 'idle';
    status(rs === 'recording' || rs === 'paused' ? 'rec' : 'ok', l[rs] || l.idle);
    if (rs === 'recording' || rs === 'paused') button(l.stop, 'danger', () => desktop('stop'));
    else if (rs === 'stopped') button(l.showDesk, '', () => desktop('open', { route: 'meetings' }));
    else button(l.recDesk, 'primary', () => desktop('start'));
    button(l.unpair, 'ghost', async () => { await send({ type: 'keek:unpair' }); refresh(); });
    hint.textContent = l.desktopHint;
  } else if (d.error === 'not_paired' || d.error === 'bad_code') {
    status('', d.error === 'bad_code' ? l.badCode : l.notPaired);
    $('pairBox').classList.remove('hidden');
    hint.textContent = l.pairHint;
  } else {
    status('', l.notRunning);
    hint.textContent = l.notRunningHint;
  }
}

async function desktop(action, extra) {
  const body = Object.assign({}, extra);
  if (action === 'start') {
    if (!$('consent').checked) { flash(l => l.needConsent); return; }
    body.consent = true; body.meeting = meetingInfo();
  }
  const r = await send({ type: 'keek:desktop', action, body });
  if (!r.ok) flash(() => r.error);
  setTimeout(refresh, 400);
}

function flash(fn) { const h = $('deskHint'); h.textContent = fn(L()); h.className = 'hint err'; }

async function refresh() { state = await send({ type: 'keek:popup', tabId: tab && tab.id }); render(); }

$('recTab').onclick = async () => {
  if (!tab) return;
  // prepareRecord: the KEEK tab opens with this meeting pre-filled; pressing Start there gives the page the
  // user gesture it needs for audio. Tab capture works because the popup was opened on this tab (activeTab).
  await send({ type: 'keek:openApp', cmd: { cmd: 'prepareRecord', tabId: tab.id, sys: 'tab', consent: $('consent').checked, meeting: meetingInfo() } });
  window.close();
};
$('openApp').onclick = async () => { await send({ type: 'keek:openApp', cmd: null }); window.close(); };
$('pairBtn').onclick = async () => {
  const r = await send({ type: 'keek:pair', code: $('pairCode').value });
  if (!r.ok) { state.desktop = { ok: false, error: r.error === 'not_running' ? 'not_running' : 'bad_code' }; render(); return; }
  refresh();
};
$('lang').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; chrome.storage.local.set({ popupLang: lang }); render(); };

(async () => {
  const { popupLang } = await chrome.storage.local.get('popupLang');
  lang = popupLang || (chrome.i18n.getUILanguage().startsWith('ar') ? 'ar' : 'en');
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  render();
  await refresh();
})();
