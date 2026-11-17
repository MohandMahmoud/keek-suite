/*
 * KEEKX integrations UI — Slack, Notion, Linear, Jira and webhooks.
 * Loaded after keekx.js and before app.js. Talks to KEEK_PLATFORM.integrations
 * (desktop: Electron main process via IPC; extension/web: keek-integrations.js in the page).
 *
 *  - Integrations page: live cards with connect / edit / check / disconnect
 *  - Meeting → Share: post the summary (Slack, Notion, webhook) or create issues (Linear, Jira)
 *  - Optional auto-send to Slack / webhooks when a meeting finishes processing
 */
(function () {
  'use strict';
  const X = window.KEEKX;
  const PL = () => window.KEEK_PLATFORM || {};
  const XI = X.int = { state: {}, loaded: false, open: null, form: {}, choices: {}, busy: {}, err: {}, result: {} };

  const BUILT = ['slack', 'notion', 'linear', 'jira', 'webhooks'];
  const PLANNED = [['gcal', 'cal', 'v1.1'], ['outlook', 'cal', 'v1.2'], ['zoom', 'monitor', 'v1.2']];
  const ICON = { slack: 'plug', notion: 'file', linear: 'tasks', jira: 'tasks', webhooks: 'plug' };
  const ISSUES = { linear: true, jira: true };
  const FIELDS = {
    slack: [['url', 'url']],
    webhooks: [['url', 'url'], ['secret', 'secret']],
    notion: [['token', 'secret'], ['page', 'text']],
    linear: [['apiKey', 'secret'], ['teamId', 'choice']],
    jira: [['site', 'text'], ['email', 'email'], ['apiToken', 'secret'], ['projectKey', 'choice']]
  };
  const SECRETF = { slack: ['url'], webhooks: ['secret'], notion: ['token'], linear: ['apiKey'], jira: ['apiToken'] };
  const PH = {
    'slack.url': 'https://hooks.slack.com/services/…', 'webhooks.url': 'https://example.com/keek-hook',
    'notion.token': 'ntn_…', 'notion.page': 'https://www.notion.so/…', 'linear.apiKey': 'lin_api_…',
    'jira.site': 'yourteam.atlassian.net', 'jira.email': 'name@company.com', 'jira.apiToken': 'ATATT…', 'jira.projectKey': 'ENG'
  };
  const HELP = {
    slack: 'https://api.slack.com/messaging/webhooks',
    notion: 'https://www.notion.so/profile/integrations',
    linear: 'https://linear.app/settings/account/security',
    jira: 'https://id.atlassian.com/manage-profile/security/api-tokens'
  };

  const STR = {
    ar: {
      integrationsSub: 'اربط كيكـ بالأدوات التي تعمل بها. Slack وNotion وLinear وJira وWebhooks تُربط برابط أو مفتاح؛ التقويمات وZoom حسب خارطة الطريق.',
      sendToIntegration: 'لإرسال المهام إلى Linear أو Jira افتح الاجتماع واختر "مشاركة".',
      kxEdit: 'تعديل', kxCheck: 'فحص الاتصال', kxDisconnect: 'فصل', kxHelp: 'كيف أحصل عليه', checking: 'جارٍ الفحص…',
      intSaved: 'تم ربط {s}', intRemoved: 'تم فصل {s}', intOk: '{s} يعمل',
      keepSecret: 'محفوظ — اتركه فارغاً للإبقاء عليه',
      intAuto: 'أرسل تلقائياً عند انتهاء معالجة أي اجتماع',
      intWebOnly: 'في تبويب متصفح عادي تمنع Slack وNotion وJira هذه الطلبات. استخدم تطبيق سطح المكتب أو الإضافة.',
      f_url_slack: 'رابط Incoming Webhook', f_url_webhooks: 'رابط الاستقبال (Endpoint)', f_secret: 'مفتاح التوقيع (اختياري)',
      f_token: 'المفتاح السري للتكامل', f_page: 'رابط الصفحة الأم', f_apiKey: 'مفتاح API الشخصي', f_teamId: 'الفريق',
      f_site: 'موقع Jira', f_email: 'بريد حساب Atlassian', f_apiToken: 'API token', f_projectKey: 'مفتاح المشروع (اختياري)',
      h_slack: 'في Slack: أنشئ تطبيقاً ← Incoming Webhooks ← Add New Webhook ← اختر القناة ← انسخ الرابط.',
      h_notion: 'أنشئ تكاملاً داخلياً وانسخ مفتاحه، ثم افتح الصفحة الأم ← ••• ← Connections ← أضف التكامل.',
      h_linear: 'Linear ← Settings ← Security & access ← Personal API keys ← New key.',
      h_jira: 'أنشئ API token من id.atlassian.com ← Security. الموقع يكون مثل yourteam.atlassian.net.',
      h_webhooks: 'يرسل كيكـ طلب POST بصيغة JSON (الاجتماع، الملخص، المهام، النص). مع مفتاح التوقيع يحمل كل طلب X-Keek-Signature: sha256=HMAC للمحتوى.',
      i_team: 'الفريق', i_project: 'المشروع', i_page: 'الصفحة', i_target: 'الوجهة', i_site: 'الموقع', i_signed: 'موقّع', i_type: 'نوع المهمة',
      sendNone: 'لا يوجد تكامل مربوط بعد. اربط Slack أو Notion أو Linear أو Jira أو Webhook لإرسال الاجتماعات إليها.', goIntegrations: 'ربط تكامل',
      send_slack: 'نشر الملخص والقرارات والمهام في قناة Slack.', send_notion: 'إنشاء صفحة Notion بالملخص الكامل.', send_webhooks: 'إرسال بيانات الاجتماع كاملة إلى رابطك.',
      send_issues: 'إنشاء {n} مهمة في {s} من المهام المفتوحة.', allSent: 'كل المهام المفتوحة أُرسلت من قبل.', needReport: 'عالج الاجتماع أولاً.',
      sendBtn: 'إرسال', sending: 'جارٍ الإرسال…', sentOk: 'تم الإرسال إلى {s}', sendFailed: '{s}: {e}', sentBefore: 'أُرسل سابقاً {d}', autoSent: 'أُرسل "{t}" إلى {s}',
      kxVia: 'أُرسل من كيكـ', kxFrom: 'من اجتماع'
    },
    en: {
      integrationsSub: 'Connect KEEK to the tools you work in. Slack, Notion, Linear, Jira and webhooks connect with a URL or token; calendars and Zoom are on the roadmap.',
      sendToIntegration: 'To send action items to Linear or Jira, open the meeting and choose Share.',
      kxEdit: 'Edit', kxCheck: 'Check connection', kxDisconnect: 'Disconnect', kxHelp: 'How to get it', checking: 'Checking…',
      intSaved: '{s} connected', intRemoved: '{s} disconnected', intOk: '{s} works',
      keepSecret: 'Saved — leave blank to keep',
      intAuto: 'Send automatically when a meeting finishes processing',
      intWebOnly: 'In a normal browser tab, Slack, Notion and Jira block these requests. Use the desktop app or the extension.',
      f_url_slack: 'Incoming webhook URL', f_url_webhooks: 'Endpoint URL', f_secret: 'Signing secret (optional)',
      f_token: 'Integration secret', f_page: 'Parent page link', f_apiKey: 'Personal API key', f_teamId: 'Team',
      f_site: 'Jira site', f_email: 'Atlassian account email', f_apiToken: 'API token', f_projectKey: 'Project key (optional)',
      h_slack: 'In Slack: create an app → Incoming Webhooks → Add New Webhook → pick a channel → copy the URL.',
      h_notion: 'Create an internal integration and copy its secret, then open the parent page → ••• → Connections → add the integration.',
      h_linear: 'Linear → Settings → Security & access → Personal API keys → New key.',
      h_jira: 'Create an API token at id.atlassian.com → Security. The site looks like yourteam.atlassian.net.',
      h_webhooks: 'KEEK POSTs JSON (meeting, summary, action items, transcript). With a signing secret, each request carries X-Keek-Signature: sha256=HMAC of the body.',
      i_team: 'Team', i_project: 'Project', i_page: 'Page', i_target: 'Target', i_site: 'Site', i_signed: 'Signed', i_type: 'Issue type',
      sendNone: 'No integration is connected yet. Connect Slack, Notion, Linear, Jira or a webhook to send meetings there.', goIntegrations: 'Connect an integration',
      send_slack: 'Post the summary, decisions and action items to your Slack channel.', send_notion: 'Create a Notion page with the full summary.', send_webhooks: 'Send the full meeting data to your URL.',
      send_issues: 'Create {n} issue(s) in {s} from open action items.', allSent: 'All open action items were already sent.', needReport: 'Process the meeting first.',
      sendBtn: 'Send', sending: 'Sending…', sentOk: 'Sent to {s}', sendFailed: '{s}: {e}', sentBefore: 'Sent before {d}', autoSent: 'Sent “{t}” to {s}',
      kxVia: 'Sent from KEEK', kxFrom: 'From meeting'
    }
  };

  const oApply = X.applyStrings;
  X.applyStrings = function () {
    oApply.apply(this, arguments);
    ['ar', 'en'].forEach(l => Object.assign(I18N[l], STR[l]));
  };

  const api = () => PL().integrations || null;
  const name = k => t('in_' + k);

  XI.load = async function () {
    const a = api();
    if (!a) { XI.loaded = true; return; }
    try { XI.state = (await a.list()) || {}; } catch (e) { console.warn('integrations', e); }
    XI.loaded = true;
    if (UI.route === 'integrations' || (UI.modal && UI.modal.type === 'share')) render();
  };
  const on = k => !!(XI.state[k] && XI.state[k].connected);

  /* ---------------- payload sent to every service ---------------- */
  XI.payload = function (m, kind) {
    const r = m.report;
    let items = liveTasks().filter(x => x.meetingId === m.id);
    if (ISSUES[kind]) items = items.filter(x => !isDone(x) && !(x.ext && x.ext[kind]));
    const proj = m.projectId && typeof P === 'function' ? P(m.projectId) : null;
    const p = {
      event: 'meeting.summary',
      lang: S.settings.lang || 'ar',
      meeting: {
        id: m.id, title: m.title || '', date: m.date || null, when: m.date ? fmtDateTime(m.date) : '',
        platform: t('pf_' + (m.platform || 'other')), durationMs: m.duration || null, url: m.url || null,
        participants: m.participants || [], tags: m.tags || [], project: proj ? proj.name : null
      },
      summary: r ? {
        overview: r.overview || '', topics: r.topics || [],
        points: (r.points || []).map(x => ({ title: x.title, detail: x.detail })),
        decisions: (r.decisions || []).map(d => ({ title: d.title, description: d.description || '', status: d.status })),
        questions: (r.questions || []).map(x => x.text), risks: (r.risks || []).map(x => x.text),
        followup: r.followup || null
      } : null,
      actionItems: items.map(x => ({
        id: x.id, title: x.title, description: x.description || '', owner: x.owner || null, due: x.due || null, dueText: x.dueText || null, status: x.status,
        quotes: (x.refs || []).slice(0, 2).map(id => { const s = segOf(m, id); return s ? '[' + fmtTsLatin(s.t) + '] ' + (s.sp ? s.sp + ': ' : '') + s.text : ''; }).filter(Boolean)
      })),
      labels: {
        overview: t('sOverview'), points: t('sPoints'), decisions: t('decisions'), actionItems: t('actionItems'), questions: t('openQuestions'),
        risks: t('risks'), followup: t('sFollowup'), owner: t('owner'), saidDue: t('saidInMeeting'), fromMeeting: t('kxFrom'), via: t('kxVia')
      }
    };
    if (kind === 'webhooks') p.transcript = (m.transcript || []).map(s => ({ t: s.t, speaker: s.sp || null, text: s.text }));
    return p;
  };

  /** Send and remember what was sent (so issues aren't created twice). */
  XI.send = async function (kind, m) {
    const a = api();
    if (!a) throw new Error('Integrations are not available here');
    const at = new Date().toISOString();
    const mark = created => {
      (created || []).forEach(c => {
        const tk = S.tasks.find(x => x.id === c.id);
        if (tk) tk.ext = Object.assign({}, tk.ext, { [kind]: { key: c.key, url: c.url, at } });
      });
    };
    try {
      const r = await a.send(kind, XI.payload(m, kind));
      if (ISSUES[kind]) mark(r.created);
      else m.ext = Object.assign({}, m.ext, { [kind]: { at, url: (r.created && r.created[0] && r.created[0].url) || null } });
      commit();
      return r;
    } catch (e) {
      if (ISSUES[kind] && e.created && e.created.length) { mark(e.created); commit(); }
      throw e;
    }
  };

  /* ---------------- Integrations page ---------------- */
  function infoLine(k, i) {
    const bits = [];
    if (k === 'slack' && i.target) bits.push(t('i_target') + ': <span dir="ltr">' + esc(i.target) + '</span>');
    if (k === 'webhooks') { if (i.target) bits.push(t('i_target') + ': <span dir="ltr">' + esc(i.target) + '</span>'); if (i.signed) bits.push(t('i_signed') + ' ✓'); }
    if (k === 'notion') bits.push(t('i_page') + ': ' + esc(i.pageTitle || '') + (i.workspace ? ' — ' + esc(i.workspace) : ''));
    if (k === 'linear') bits.push(t('i_team') + ': ' + esc(i.team || ''));
    if (k === 'jira') { bits.push(t('i_site') + ': <span dir="ltr">' + esc(i.site || '') + '</span>'); bits.push(t('i_project') + ': ' + esc(i.project || '')); if (i.issueType) bits.push(t('i_type') + ': ' + esc(i.issueType)); }
    return bits.join(' · ');
  }

  function form(k, st) {
    const f = XI.form[k] || (XI.form[k] = {});
    const rows = FIELDS[k].map(([fname, type]) => {
      const label = t('f_' + (fname === 'url' ? 'url_' + k : fname));
      const ch = XI.choices[k] && XI.choices[k].field === fname ? XI.choices[k].choices : null;
      if (type === 'choice') {
        if (ch) return `<label class="field"><span>${label}</span><select class="select" data-kxi="${k}:${fname}"><option value="">—</option>${ch.map(c => `<option value="${esc(c.value)}" ${f[fname] === c.value ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}</select></label>`;
        if (k === 'linear') return '';
      }
      const secret = SECRETF[k].includes(fname);
      const ph = secret && st.connected ? t('keepSecret') : (PH[k + '.' + fname] || '');
      return `<label class="field"><span>${label}</span><input class="input" dir="ltr" type="${secret ? 'password' : type === 'email' ? 'email' : 'text'}" autocomplete="off" spellcheck="false" data-kxi="${k}:${fname}" value="${esc(f[fname] || '')}" placeholder="${esc(ph)}"></label>`;
    }).join('');
    return `<div class="stack" style="gap:10px;margin-top:4px"><p class="tiny muted">${t('h_' + k)}</p>
      ${HELP[k] ? `<div><button class="btn sm ghost" data-act="kxLink" data-url="${HELP[k]}">${t('kxHelp')} ↗</button></div>` : ''}${rows}
      <div class="chips"><button class="btn sm primary" data-act="kxIntConnect" data-k="${k}" ${XI.busy[k] ? 'disabled' : ''}>${XI.busy[k] ? t('checking') : t('connect')}</button>
      <button class="btn sm ghost" data-act="kxIntCancel" data-k="${k}">${t('cancel')}</button></div></div>`;
  }

  function card(k) {
    const st = XI.state[k] || {}, info = st.info || {}, busy = XI.busy[k];
    const badge = st.connected ? `<span class="badge ok">${t('connected')}</span>` : `<span class="badge">${t('notConnected')}</span>`;
    let body;
    if (XI.open === k) body = form(k, st);
    else if (st.connected) {
      body = `<p class="perm">${infoLine(k, info)}</p>
        ${'auto' in info ? `<label class="consent"><input type="checkbox" data-kxi-auto="${k}" ${info.auto ? 'checked' : ''}><span class="small">${t('intAuto')}</span></label>` : ''}
        <div class="chips"><button class="btn sm" data-act="kxIntEdit" data-k="${k}">${ic('gear')}${t('kxEdit')}</button>
        <button class="btn sm ghost" data-act="kxIntCheck" data-k="${k}" ${busy ? 'disabled' : ''}>${busy ? t('checking') : t('kxCheck')}</button>
        <button class="btn sm ghost" data-act="kxIntRemove" data-k="${k}">${t('kxDisconnect')}</button></div>`;
    } else body = `<p class="perm"><b>${t('permissions')}:</b> ${t('in_' + k + '_p')}</p><div><button class="btn sm" data-act="kxIntEdit" data-k="${k}">${t('connect')}</button></div>`;
    const err = XI.err[k] ? `<p class="tiny" style="color:var(--danger)">${esc(XI.err[k])}</p>` : '';
    return `<div class="card"><h3><span class="person">${ic(ICON[k])}${name(k)}</span>${badge}</h3><p class="small">${t('in_' + k + '_d')}</p>${body}${err}</div>`;
  }

  const planned = ([k, i, v]) => `<div class="card"><h3><span class="person">${ic(i)}${t('in_' + k)}</span><span class="badge">${t('plannedFor', { v })}</span></h3><p class="small">${t('in_' + k + '_d')}</p><p class="perm"><b>${t('permissions')}:</b> ${t('in_' + k + '_p')}</p><button class="btn sm" disabled>${t('connect')}</button></div>`;

  function integrationsView() {
    if (!XI.loaded && !XI.loading) { XI.loading = true; XI.load().finally(() => { XI.loading = false; }); }
    return `<div class="page-head"><div><h1>${t('nav_integrations')}</h1><p>${t('integrationsSub')}</p></div></div>
      <h3 class="day">${t('keekApps')}</h3>${X.appCards()}
      <h3 class="day">${t('directory')}</h3>
      ${X.kind === 'web' ? `<p class="note" style="margin-bottom:14px">${t('intWebOnly')}</p>` : ''}
      <div class="cards">${BUILT.map(card).join('')}${PLANNED.map(planned).join('')}</div>
      <p class="note" style="margin-top:20px">${t('integrationsNote')}</p>`;
  }

  /* ---------------- Share sheet ---------------- */
  function shareModal(md_) {
    const m = M(md_.mid);
    if (!m) return '';
    if (!XI.loaded && !XI.loading) { XI.loading = true; XI.load().finally(() => { XI.loading = false; }); }
    const conn = BUILT.filter(on);
    let body;
    if (!conn.length) {
      body = `<div class="setup">${ic('share')}<div>${t('sendNone')}<div style="margin-top:8px"><button class="btn sm" data-act="kxIntGo">${t('goIntegrations')}</button></div></div></div>`;
    } else {
      body = conn.map(k => {
        let desc, disabled = false;
        if (ISSUES[k]) {
          const n = liveTasks().filter(x => x.meetingId === m.id && !isDone(x) && !(x.ext && x.ext[k])).length;
          desc = n ? t('send_issues', { n: fmtNum(n), s: name(k) }) : t('allSent');
          disabled = !n;
        } else {
          desc = t('send_' + k);
          if (k !== 'webhooks' && !m.report) { desc += ' ' + t('needReport'); disabled = true; }
        }
        const prev = m.ext && m.ext[k];
        const res = XI.result[k];
        let extra = '';
        if (prev && !res) extra += `<div class="tiny muted">${t('sentBefore', { d: fmtDate(prev.at) })}${prev.url ? ` <button class="btn sm ghost" data-act="kxLink" data-url="${esc(prev.url)}">↗</button>` : ''}</div>`;
        if (res && res.ok) extra += `<div class="tiny" style="color:var(--accent)">✓ ${t('sentOk', { s: name(k) })}</div>${(res.links || []).filter(l => l.url).length ? `<div class="chips" style="margin-top:4px">${res.links.filter(l => l.url).slice(0, 12).map(l => `<button class="btn sm ghost" data-act="kxLink" data-url="${esc(l.url)}" dir="ltr">${esc(l.key === 'page' ? 'Notion' : l.key)} ↗</button>`).join('')}</div>` : ''}`;
        if (res && !res.ok) extra += `<div class="tiny" style="color:var(--danger)">${esc(res.msg)}</div>`;
        const busy = XI.busy['send:' + k];
        return `<div class="option" style="cursor:default;align-items:flex-start">${ic(ICON[k])}<div style="flex:1;min-width:0"><b>${name(k)}</b><span class="small muted">${desc}</span>${extra}</div>
          <button class="btn sm primary" data-act="kxIntSend" data-k="${k}" data-id="${m.id}" ${disabled || busy ? 'disabled' : ''}>${busy ? t('sending') : t('sendBtn')}</button></div>`;
      }).join('');
    }
    const title = t('share');
    const foot = `<button class="btn" data-act="exportModal" data-id="${m.id}">${ic('download')}${t('export')}</button><button class="btn primary" data-act="modalClose">${t('close')}</button>`;
    return `<div class="scrim" data-act="modalScrim"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><h3>${esc(title)}</h3><button class="btn sm ghost" data-act="modalClose" aria-label="${esc(t('close'))}">${ic('x')}</button></div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div></div></div>`;
  }

  /* ---------------- auto-send after processing ---------------- */
  XI.auto = async function (m) {
    if (!m || m.sample) return;
    if (!XI.loaded) await XI.load();
    for (const k of ['slack', 'webhooks']) {
      const st = XI.state[k];
      if (!st || !st.connected || !(st.info && st.info.auto)) continue;
      try { await XI.send(k, m); toast(t('autoSent', { t: m.title, s: name(k) })); }
      catch (e) { toast(t('sendFailed', { s: name(k), e: e.message || String(e) })); }
    }
  };

  /* ---------------- install ---------------- */
  const oInstall = X.install;
  X.install = function () {
    oInstall.apply(this, arguments);

    VIEWS.integrations = integrationsView;

    const oModal = modalHtml;
    modalHtml = function () {
      const md_ = UI.modal;
      if (md_ && md_.type === 'share') return shareModal(md_);
      return oModal.apply(this, arguments);
    };
    const oShare = A.shareModal;
    A.shareModal = function () { XI.result = {}; return oShare.apply(this, arguments); };

    const oProcess = processMeeting;
    processMeeting = async function (m) {
      await oProcess.apply(this, arguments);
      const live = M(m.id);
      if (live && live.status === 'completed') XI.auto(live);
    };

    A.kxIntGo = () => { UI.modal = null; go('integrations'); };
    A.kxIntEdit = el => { const k = el.dataset.k; XI.open = k; XI.form[k] = {}; XI.err[k] = null; XI.choices[k] = null; render(); };
    A.kxIntCancel = el => { const k = el.dataset.k; XI.open = null; XI.form[k] = {}; XI.err[k] = null; XI.choices[k] = null; render(); };

    // Must call the platform synchronously: in the extension it may ask Chrome for a host permission,
    // which only works inside the click.
    const connect = (k, input, okMsg) => {
      const a = api();
      if (!a) { XI.err[k] = 'Integrations are not available here'; render(); return; }
      let pr;
      try { pr = a.connect(k, input); } catch (e) { pr = Promise.reject(e); }
      XI.busy[k] = true; XI.err[k] = null; render();
      pr.then(state => {
        XI.state = state || XI.state; XI.open = null; XI.form[k] = {}; XI.choices[k] = null;
        toast(t(okMsg, { s: name(k) }));
      }).catch(e => {
        if (e && e.code === 'choose' && e.choices) { XI.choices[k] = { field: e.field, choices: e.choices }; XI.open = k; }
        XI.err[k] = (e && e.message) || String(e);
      }).finally(() => { XI.busy[k] = false; render(); });
    };
    A.kxIntConnect = el => { const k = el.dataset.k; connect(k, Object.assign({}, XI.form[k] || {}), 'intSaved'); };
    A.kxIntCheck = el => connect(el.dataset.k, {}, 'intOk');
    A.kxIntRemove = async el => {
      const k = el.dataset.k;
      try { XI.state = await api().remove(k); XI.err[k] = null; toast(t('intRemoved', { s: name(k) })); }
      catch (e) { XI.err[k] = e.message || String(e); }
      render();
    };
    A.kxIntSend = async el => {
      const k = el.dataset.k, m = M(el.dataset.id);
      if (!m) return;
      XI.busy['send:' + k] = true; XI.result[k] = null; render();
      try {
        const r = await XI.send(k, m);
        XI.result[k] = { ok: true, links: r.created || [] };
        toast(t('sentOk', { s: name(k) }));
      } catch (e) {
        XI.result[k] = { ok: false, msg: (e && e.message) || String(e) };
      }
      XI.busy['send:' + k] = false; render();
    };

    const onField = e => {
      const el = e.target;
      if (el.dataset && el.dataset.kxi) {
        const [k, f] = el.dataset.kxi.split(':');
        (XI.form[k] = XI.form[k] || {})[f] = el.value;
      }
    };
    document.addEventListener('input', onField);
    document.addEventListener('change', e => {
      onField(e);
      const k = e.target.dataset && e.target.dataset.kxiAuto;
      if (!k) return;
      api().setOptions(k, { auto: e.target.checked }).then(s => { XI.state = s; render(); }).catch(err => { XI.err[k] = err.message; render(); });
    });
  };

  const oAfter = X.afterBoot;
  X.afterBoot = function () { oAfter.apply(this, arguments); XI.load(); };
})();
