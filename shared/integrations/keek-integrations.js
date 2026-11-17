/*!
 * KEEK Integrations — send meeting summaries and action items to Slack, Notion, Linear, Jira
 * and your own webhooks. No OAuth app or server needed: each service takes a URL or token
 * that the user pastes in once.
 *
 *   const I = KeekIntegrations.create({ fetch });
 *   const { cfg, info } = await I.connect('linear', { apiKey, teamId });   // validates, fills defaults
 *   const result = await I.send('linear', cfg, payload);                  // → { created:[{id,key,url}], message }
 *
 * Stateless: the caller stores cfg (it contains secrets — desktop keeps it encrypted in the main
 * process; the extension keeps it in chrome.storage.local).
 *
 * Works unchanged in Node 18+ / Electron main (require), extension pages and browsers (<script>).
 * Note: a normal web page can't call Notion, Jira or Slack (they block CORS); the extension
 * (host permissions) and the desktop app (Node) can.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.KeekIntegrations = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const KINDS = ['slack', 'notion', 'linear', 'jira', 'webhooks'];
  const NOTION_VERSION = '2022-06-28';
  /** Fields that must never be shown back to the UI. */
  const SECRET = { slack: ['url'], notion: ['token'], linear: ['apiKey'], jira: ['apiToken'], webhooks: ['secret'] };
  /** Settings the UI may change without re-entering secrets. */
  const OPTIONS = { slack: ['auto'], webhooks: ['auto'], notion: [], linear: [], jira: [] };

  class IntError extends Error {
    constructor(code, message, extra) {
      super(message);
      this.name = 'IntError';
      this.code = code; // invalid | auth | not_found | rate_limited | network | server | bad_request | choose
      if (extra) Object.assign(this, extra);
    }
    toJSON() { return { code: this.code, message: this.message, field: this.field, choices: this.choices, created: this.created }; }
  }

  /* ---------------- small helpers ---------------- */
  const str = v => (v == null ? '' : String(v)).trim();
  const clip = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const list = a => Array.isArray(a) ? a : [];

  function b64(s) {
    if (typeof Buffer !== 'undefined') return Buffer.from(s, 'utf8').toString('base64');
    return btoa(unescape(encodeURIComponent(s)));
  }

  async function hmacHex(secret, body) {
    const subtle = (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) || null;
    if (subtle) {
      const enc = new TextEncoder();
      const key = await subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const sig = new Uint8Array(await subtle.sign('HMAC', key, enc.encode(body)));
      return Array.from(sig, b => b.toString(16).padStart(2, '0')).join('');
    }
    if (typeof require === 'function') return require('crypto').createHmac('sha256', secret).update(body).digest('hex');
    throw new IntError('invalid', 'Signing is not available here');
  }

  function httpsUrl(v, field, allowHttp) {
    const s = str(v);
    let u;
    try { u = new URL(s); } catch (e) { throw new IntError('invalid', 'Enter a full URL starting with https://', { field }); }
    const local = /^(localhost|127\.0\.0\.1)$/i.test(u.hostname);
    if (u.protocol !== 'https:' && !(allowHttp && local && u.protocol === 'http:')) throw new IntError('invalid', 'The URL must start with https://' + (allowHttp ? ' (http:// is allowed only for localhost)' : ''), { field });
    return u;
  }

  /** Notion page URL or id → dashed UUID. */
  function notionId(v) {
    const s = str(v).split('?')[0].split('#')[0];
    const m = s.replace(/-/g, '').match(/([0-9a-f]{32})$/i);
    if (!m) throw new IntError('invalid', 'Paste the Notion page link (or its 32-character ID)', { field: 'page' });
    const h = m[1].toLowerCase();
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }

  /** What the UI may display about a connection (no secrets). */
  function publicInfo(kind, cfg, info) {
    const out = Object.assign({}, info || {});
    (OPTIONS[kind] || []).forEach(k => { out[k] = !!(cfg && cfg[k]); });
    return out;
  }

  /* ---------------- the client ---------------- */
  function create(opts) {
    opts = opts || {};
    const fetchFn = opts.fetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    if (!fetchFn) throw new Error('KeekIntegrations needs a global fetch.');
    const timeoutMs = opts.timeoutMs || 30000;

    async function call(service, url, init) {
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
      let res;
      try {
        res = await fetchFn(url, Object.assign({}, init, ctrl ? { signal: ctrl.signal } : {}));
      } catch (e) {
        if (ctrl && ctrl.signal.aborted) throw new IntError('network', service + ' took too long to respond');
        const browserPage = typeof window !== 'undefined' && !(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);
        throw new IntError('network', service + ': couldn’t reach the service (' + (e && e.message || e) + ')' +
          (browserPage ? '. Browsers block this call from a normal web page — use the KEEK desktop app or extension.' : '.'));
      } finally { if (timer) clearTimeout(timer); }
      const text = await res.text().catch(() => '');
      let j = null; try { j = text ? JSON.parse(text) : null; } catch (e) { /* not JSON (Slack replies "ok") */ }
      if (!res.ok) {
        let msg = '';
        if (j) {
          msg = j.message || (j.errorMessages && j.errorMessages.join('; ')) || '';
          if (j.errors && !Array.isArray(j.errors)) msg = [msg].concat(Object.keys(j.errors).map(k => k + ': ' + j.errors[k])).filter(Boolean).join('; ');
          if (Array.isArray(j.errors) && j.errors[0]) msg = msg || j.errors[0].message;
          if (!msg && j.error) msg = typeof j.error === 'string' ? j.error : j.error.message;
        }
        msg = clip(msg || text || res.statusText || 'error', 300);
        const code = res.status === 401 || res.status === 403 ? 'auth' : res.status === 404 ? 'not_found' : res.status === 429 ? 'rate_limited' : res.status >= 500 ? 'server' : 'bad_request';
        throw new IntError(code, service + ' ' + res.status + ': ' + msg, { status: res.status });
      }
      return j != null ? j : text;
    }

    /* ----- Slack (incoming webhook) ----- */
    const slack = {
      normalize(c) {
        const u = httpsUrl(c.url, 'url');
        if (!/^hooks\.slack\.com$/i.test(u.hostname)) throw new IntError('invalid', 'Use a Slack Incoming Webhook URL (https://hooks.slack.com/services/…)', { field: 'url' });
        return { url: u.href, auto: !!c.auto };
      },
      async test(c) {
        await call('Slack', c.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: '✅ KEEK is connected. Meeting summaries will be posted here.' }) });
        return { target: 'hooks.slack.com/…' + c.url.slice(-6) };
      },
      async send(c, p) {
        await call('Slack', c.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: clip(slackText(p), 38000), unfurl_links: false }) });
        return { created: [], message: 'posted' };
      }
    };

    /* ----- Webhooks ----- */
    const webhooks = {
      normalize(c) {
        const u = httpsUrl(c.url, 'url', true);
        return { url: u.href, secret: str(c.secret), auto: !!c.auto };
      },
      async post(c, body, event) {
        const json = JSON.stringify(body);
        const headers = { 'Content-Type': 'application/json', 'X-Keek-Event': event, 'User-Agent': 'KEEK-Webhook/1' };
        if (c.secret) headers['X-Keek-Signature'] = 'sha256=' + await hmacHex(c.secret, json);
        return call('Webhook', c.url, { method: 'POST', headers, body: json });
      },
      async test(c) {
        await webhooks.post(c, { event: 'keek.test', sentAt: new Date().toISOString() }, 'keek.test');
        return { target: new URL(c.url).host, signed: !!c.secret };
      },
      async send(c, p) {
        const body = Object.assign({ sentAt: new Date().toISOString() }, p);
        delete body.labels;
        await webhooks.post(c, body, p.event || 'meeting.summary');
        return { created: [], message: 'delivered' };
      }
    };

    /* ----- Notion ----- */
    const nh = c => ({ Authorization: 'Bearer ' + c.token, 'Notion-Version': NOTION_VERSION, 'Content-Type': 'application/json' });
    const notion = {
      normalize(c) {
        const token = str(c.token);
        if (!token) throw new IntError('invalid', 'Paste your Notion integration secret', { field: 'token' });
        return { token, page: notionId(c.page) };
      },
      async test(c) {
        const me = await call('Notion', 'https://api.notion.com/v1/users/me', { headers: nh(c) });
        let page;
        try { page = await call('Notion', 'https://api.notion.com/v1/pages/' + c.page, { headers: nh(c) }); }
        catch (e) {
          if (e.code === 'not_found') throw new IntError('not_found', 'Notion can’t see that page. Open the page → ••• → Connections → add your integration, then try again.', { field: 'page' });
          throw e;
        }
        return { workspace: (me.bot && me.bot.workspace_name) || me.name || 'Notion', pageTitle: notionTitle(page) || 'Untitled', pageUrl: page.url };
      },
      async send(c, p) {
        const blocks = notionBlocks(p);
        const body = { parent: { page_id: c.page }, properties: { title: { title: rt(p.meeting.title || 'Meeting') } }, children: blocks.slice(0, 100) };
        const page = await call('Notion', 'https://api.notion.com/v1/pages', { method: 'POST', headers: nh(c), body: JSON.stringify(body) });
        // Notion accepts 100 blocks per request; append the rest.
        for (let i = 100; i < blocks.length; i += 100) {
          await call('Notion', 'https://api.notion.com/v1/blocks/' + page.id + '/children', { method: 'PATCH', headers: nh(c), body: JSON.stringify({ children: blocks.slice(i, i + 100) }) });
        }
        return { created: [{ id: p.meeting.id, key: 'page', url: page.url }], message: 'page created' };
      }
    };

    /* ----- Linear ----- */
    const gql = (c, query, variables) => call('Linear', 'https://api.linear.app/graphql', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: c.apiKey }, body: JSON.stringify({ query, variables })
    }).then(j => {
      if (j && j.errors && j.errors.length) {
        const m = j.errors[0].message || 'error';
        throw new IntError(/auth/i.test(m) ? 'auth' : 'bad_request', 'Linear: ' + m);
      }
      return j.data;
    });
    const linear = {
      normalize(c) {
        const apiKey = str(c.apiKey);
        if (!apiKey) throw new IntError('invalid', 'Paste your Linear personal API key', { field: 'apiKey' });
        return { apiKey, teamId: str(c.teamId) };
      },
      async test(c) {
        const d = await gql(c, '{ viewer { name } teams(first: 100) { nodes { id key name } } }');
        const teams = (d.teams && d.teams.nodes) || [];
        if (!teams.length) throw new IntError('not_found', 'This Linear key can’t see any team.');
        let team = teams.find(x => x.id === c.teamId);
        if (!team) {
          if (teams.length > 1) throw new IntError('choose', 'Choose the Linear team for new issues', { field: 'teamId', choices: teams.map(x => ({ value: x.id, label: x.key + ' — ' + x.name })) });
          team = teams[0];
        }
        c.teamId = team.id;
        return { user: d.viewer && d.viewer.name, team: team.key + ' — ' + team.name, teamKey: team.key };
      },
      async send(c, p) {
        const created = [];
        try { for (const it of list(p.actionItems)) {
          const input = { teamId: c.teamId, title: clip(it.title, 250), description: issueMarkdown(it, p) };
          if (/^\d{4}-\d{2}-\d{2}$/.test(it.due || '')) input.dueDate = it.due;
          const d = await gql(c, 'mutation($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier url } } }', { input });
          const iss = d.issueCreate && d.issueCreate.issue;
          if (!iss) throw new IntError('bad_request', 'Linear didn’t create the issue “' + clip(it.title, 60) + '”');
          created.push({ id: it.id, key: iss.identifier, url: iss.url });
        } } catch (e) { e.created = created; throw e; } // remember what was created before the failure
        return { created, message: created.length + ' issue(s) created' };
      }
    };

    /* ----- Jira Cloud ----- */
    const jh = c => ({ Authorization: 'Basic ' + b64(c.email + ':' + c.apiToken), Accept: 'application/json', 'Content-Type': 'application/json' });
    const jira = {
      normalize(c) {
        let site = str(c.site);
        if (site && !/^https?:\/\//i.test(site)) site = 'https://' + site;
        const u = httpsUrl(site, 'site');
        const email = str(c.email), apiToken = str(c.apiToken);
        if (!/.+@.+/.test(email)) throw new IntError('invalid', 'Enter the email of your Atlassian account', { field: 'email' });
        if (!apiToken) throw new IntError('invalid', 'Paste an Atlassian API token', { field: 'apiToken' });
        return { site: u.origin, email, apiToken, projectKey: str(c.projectKey).toUpperCase(), issueType: str(c.issueType) };
      },
      async test(c) {
        const me = await call('Jira', c.site + '/rest/api/3/myself', { headers: jh(c) });
        if (!c.projectKey) {
          const r = await call('Jira', c.site + '/rest/api/3/project/search?maxResults=100', { headers: jh(c) });
          const ps = list(r.values);
          if (!ps.length) throw new IntError('not_found', 'This account can’t see any Jira project.');
          if (ps.length > 1) throw new IntError('choose', 'Choose the Jira project for new issues', { field: 'projectKey', choices: ps.map(x => ({ value: x.key, label: x.key + ' — ' + x.name })) });
          c.projectKey = ps[0].key;
        }
        let proj;
        try { proj = await call('Jira', c.site + '/rest/api/3/project/' + encodeURIComponent(c.projectKey), { headers: jh(c) }); }
        catch (e) { if (e.code === 'not_found') throw new IntError('not_found', 'Jira project ' + c.projectKey + ' wasn’t found', { field: 'projectKey' }); throw e; }
        const types = list(proj.issueTypes).filter(x => !x.subtask).map(x => x.name);
        if (!c.issueType || !types.includes(c.issueType)) c.issueType = types.find(x => /^task$/i.test(x)) || types.find(x => /^(مهمة)$/.test(x)) || types[0] || 'Task';
        return { user: me.displayName, site: c.site.replace(/^https:\/\//, ''), project: proj.key + ' — ' + proj.name, issueType: c.issueType };
      },
      async send(c, p) {
        const created = [];
        try { for (const it of list(p.actionItems)) {
          const fields = { project: { key: c.projectKey }, summary: clip(String(it.title || '').replace(/\s+/g, ' '), 250), issuetype: { name: c.issueType || 'Task' }, description: adf(issueMarkdown(it, p)) };
          if (/^\d{4}-\d{2}-\d{2}$/.test(it.due || '')) fields.duedate = it.due;
          let r;
          try { r = await call('Jira', c.site + '/rest/api/3/issue', { method: 'POST', headers: jh(c), body: JSON.stringify({ fields }) }); }
          catch (e) {
            if (e.status !== 400 || !fields.duedate || !/duedate/i.test(e.message)) throw e;
            delete fields.duedate; // the project's create screen doesn't have "Due date"
            r = await call('Jira', c.site + '/rest/api/3/issue', { method: 'POST', headers: jh(c), body: JSON.stringify({ fields }) });
          }
          created.push({ id: it.id, key: r.key, url: c.site + '/browse/' + r.key });
        } } catch (e) { e.created = created; throw e; }
        return { created, message: created.length + ' issue(s) created' };
      }
    };

    const SERVICES = { slack, webhooks, notion, linear, jira };
    const svc = kind => { const s = SERVICES[kind]; if (!s) throw new IntError('invalid', 'Unknown integration: ' + kind); return s; };

    return {
      /** Validate the config, check it against the service, fill defaults. → { cfg, info } */
      async connect(kind, cfg) {
        const s = svc(kind);
        const c = s.normalize(cfg || {});
        const info = await s.test(c);
        return { cfg: c, info };
      },
      /** Send a meeting payload (see buildPayload in the app). */
      async send(kind, cfg, payload) {
        if (!payload || !payload.meeting) throw new IntError('invalid', 'Nothing to send');
        return svc(kind).send(cfg, payload);
      }
    };
  }

  /* ---------------- formatting ---------------- */
  function L(p, k, d) { return (p.labels && p.labels[k]) || d; }

  function slackText(p) {
    const m = p.meeting, s = p.summary || {}, out = [];
    const esc = t => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    out.push('*' + esc(m.title) + '*' + (m.when ? '  ·  ' + esc(m.when) : ''));
    if (s.overview) out.push('', '*' + L(p, 'overview', 'Overview') + '*', esc(s.overview));
    if (list(s.decisions).length) out.push('', '*' + L(p, 'decisions', 'Decisions') + '*', ...s.decisions.map(d => '• ' + esc(d.title)));
    if (list(p.actionItems).length) out.push('', '*' + L(p, 'actionItems', 'Action items') + '*', ...p.actionItems.map(it => '• ' + esc(it.title) + (it.owner ? ' — ' + esc(it.owner) : '') + (it.due || it.dueText ? ' — ' + esc(it.due || it.dueText) : '')));
    if (list(s.questions).length) out.push('', '*' + L(p, 'questions', 'Open questions') + '*', ...s.questions.map(q => '• ' + esc(q)));
    if (list(s.risks).length) out.push('', '*' + L(p, 'risks', 'Risks') + '*', ...s.risks.map(q => '• ' + esc(q)));
    out.push('', '_' + L(p, 'via', 'Sent from KEEK') + '_');
    return out.join('\n');
  }

  function rt(text) {
    const s = String(text || ''), out = [];
    for (let i = 0; i < s.length && out.length < 50; i += 1900) out.push({ type: 'text', text: { content: s.slice(i, i + 1900) } });
    return out.length ? out : [{ type: 'text', text: { content: '' } }];
  }
  const nb = (type, text, extra) => ({ object: 'block', type, [type]: Object.assign({ rich_text: rt(text) }, extra || {}) });

  function notionBlocks(p) {
    const m = p.meeting, s = p.summary || {}, b = [];
    const meta = [m.when, m.platform, list(m.participants).join(', ')].filter(Boolean).join(' · ');
    if (meta) b.push(nb('paragraph', meta));
    if (s.overview) b.push(nb('heading_2', L(p, 'overview', 'Overview')), nb('paragraph', s.overview));
    if (list(s.topics).length) b.push(nb('paragraph', s.topics.join(' · ')));
    if (list(s.points).length) { b.push(nb('heading_2', L(p, 'points', 'Key points'))); s.points.forEach(x => b.push(nb('bulleted_list_item', x.title + (x.detail ? ': ' + x.detail : '')))); }
    if (list(s.decisions).length) { b.push(nb('heading_2', L(p, 'decisions', 'Decisions'))); s.decisions.forEach(d => b.push(nb('bulleted_list_item', d.title + (d.description ? ' — ' + d.description : '')))); }
    if (list(p.actionItems).length) {
      b.push(nb('heading_2', L(p, 'actionItems', 'Action items')));
      p.actionItems.forEach(it => b.push(nb('to_do', it.title + (it.owner ? ' — ' + it.owner : '') + (it.due || it.dueText ? ' — ' + (it.due || it.dueText) : ''), { checked: it.status === 'completed' })));
    }
    if (list(s.questions).length) { b.push(nb('heading_2', L(p, 'questions', 'Open questions'))); s.questions.forEach(q => b.push(nb('bulleted_list_item', q))); }
    if (list(s.risks).length) { b.push(nb('heading_2', L(p, 'risks', 'Risks'))); s.risks.forEach(q => b.push(nb('bulleted_list_item', q))); }
    if (s.followup && (s.followup.subject || s.followup.body)) b.push(nb('heading_2', L(p, 'followup', 'Follow-up')), nb('paragraph', [s.followup.subject, s.followup.body].filter(Boolean).join('\n\n')));
    return b;
  }

  function notionTitle(page) {
    const props = (page && page.properties) || {};
    for (const k in props) if (props[k] && props[k].type === 'title') return (props[k].title || []).map(x => x.plain_text || '').join('');
    return '';
  }

  function issueMarkdown(it, p) {
    const m = p.meeting, lines = [];
    if (it.description) lines.push(it.description, '');
    if (it.owner) lines.push(L(p, 'owner', 'Owner') + ': ' + it.owner);
    if (it.dueText && it.dueText !== it.due) lines.push(L(p, 'saidDue', 'Deadline as said') + ': ' + it.dueText);
    lines.push(L(p, 'fromMeeting', 'From meeting') + ': ' + m.title + (m.when ? ' (' + m.when + ')' : ''));
    if (list(it.quotes).length) lines.push('', ...it.quotes.map(q => '> ' + q));
    lines.push('', '— ' + L(p, 'via', 'Sent from KEEK'));
    return lines.join('\n');
  }

  /** Plain text → Atlassian Document Format (one paragraph per line). */
  function adf(text) {
    const content = String(text || '').split('\n').map(line => line.trim()
      ? { type: 'paragraph', content: [{ type: 'text', text: clip(line, 30000) }] }
      : { type: 'paragraph', content: [] });
    return { type: 'doc', version: 1, content };
  }

  /**
   * Connection store shared by the desktop main process and the extension.
   *   load() → { [kind]: { cfg, info, at } }   save(all)
   * Secrets never leave it: list() returns only connected/info/options.
   */
  function createManager(o) {
    const I = create({ fetch: o.fetch, timeoutMs: o.timeoutMs });
    const all = async () => (await o.load()) || {};
    async function list() {
      const a = await all(), out = {};
      KINDS.forEach(k => {
        const e = a[k];
        out[k] = e && e.cfg ? { connected: true, info: publicInfo(k, e.cfg, e.info), at: e.at } : { connected: false };
      });
      return out;
    }
    return {
      list,
      /** Fields left blank keep their saved value, so secrets needn't be re-entered when editing. */
      async connect(kind, input) {
        const a = await all();
        const merged = Object.assign({}, (a[kind] && a[kind].cfg) || {});
        for (const k in (input || {})) {
          const v = input[k];
          if (typeof v === 'boolean') merged[k] = v;
          else if (v != null && String(v).trim() !== '') merged[k] = v;
        }
        const r = await I.connect(kind, merged);
        a[kind] = { cfg: r.cfg, info: r.info, at: new Date().toISOString() };
        await o.save(a);
        return list();
      },
      async setOptions(kind, patch) {
        const a = await all(), e = a[kind];
        if (!e) throw new IntError('invalid', kind + ' is not connected');
        (OPTIONS[kind] || []).forEach(k => { if (patch && k in patch) e.cfg[k] = !!patch[k]; });
        await o.save(a);
        return list();
      },
      async remove(kind) {
        const a = await all();
        delete a[kind];
        await o.save(a);
        return list();
      },
      async send(kind, payload) {
        const a = await all(), e = a[kind];
        if (!e) throw new IntError('invalid', kind + ' is not connected');
        return I.send(kind, e.cfg, payload);
      }
    };
  }

  return { KINDS, SECRET, OPTIONS, IntError, create, createManager, publicInfo, utils: { notionId, slackText, notionBlocks, adf, issueMarkdown, hmacHex } };
});
