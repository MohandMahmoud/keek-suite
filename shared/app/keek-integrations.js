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

  const KINDS = ['slack', 'notion', 'linear', 'jira', 'webhooks', 'gcal', 'outlook', 'zoom'];
  const NOTION_VERSION = '2022-06-28';
  /** Fields that must never be shown back to the UI. */
  const SECRET = { slack: ['url'], notion: ['token'], linear: ['apiKey'], jira: ['apiToken'], webhooks: ['secret'], gcal: ['url'], outlook: ['url'], zoom: ['clientSecret'] };
  /** Settings the UI may change without re-entering secrets. */
  const OPTIONS = { slack: ['auto'], webhooks: ['auto'], notion: [], linear: [], jira: [], gcal: [], outlook: [], zoom: [] };
  /** Read operations besides connect/send. */
  const OPS = { gcal: ['events'], outlook: ['events'], zoom: ['events', 'recordings', 'transcript'] };

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

    /* ----- Calendars (Google / Outlook) via the private iCal link ----- */
    const calendar = (label, hint) => {
      const s = {
        normalize(c) {
          const u = httpsUrl(str(c.url).replace(/^webcal:\/\//i, 'https://'), 'url');
          return { url: u.href };
        },
        async load(c) {
          const text = await call(label, c.url, { headers: { Accept: 'text/calendar, text/plain, */*' } });
          if (typeof text !== 'string' || !/BEGIN:VCALENDAR/i.test(text)) throw new IntError('invalid', 'That link didn’t return a calendar. ' + hint, { field: 'url' });
          return parseICS(text);
        },
        async test(c) {
          const cal = await s.load(c);
          return { calendar: cal.name || new URL(c.url).hostname, upcoming: upcoming(cal, 14).length };
        },
        async events(c, o) { return upcoming(await s.load(c), Math.min(60, (o && o.days) || 14)); }
      };
      return s;
    };
    const gcal = calendar('Google Calendar', 'In Google Calendar: Settings → your calendar → Integrate calendar → “Secret address in iCal format”.');
    const outlook = calendar('Outlook', 'In Outlook on the web: Settings → Calendar → Shared calendars → Publish a calendar → copy the ICS link.');

    /* ----- Zoom (Server-to-Server OAuth app) ----- */
    const zoomTokens = new Map();
    async function zoomToken(c, fresh) {
      const k = c.accountId + '|' + c.clientId, hit = zoomTokens.get(k);
      if (!fresh && hit && hit.exp > Date.now() + 60000) return hit.token;
      let r;
      try {
        r = await call('Zoom', 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + encodeURIComponent(c.accountId), {
          method: 'POST', headers: { Authorization: 'Basic ' + b64(c.clientId + ':' + c.clientSecret) }
        });
      } catch (e) {
        if (e.status === 400 || e.status === 401) throw new IntError('auth', 'Zoom rejected the Account ID / Client ID / Client Secret. Copy them from your Server-to-Server OAuth app and make sure it is activated.');
        throw e;
      }
      zoomTokens.set(k, { token: r.access_token, exp: Date.now() + (r.expires_in || 3600) * 1000 });
      return r.access_token;
    }
    async function zget(c, path) {
      const go = async fresh => call('Zoom', 'https://api.zoom.us/v2' + path, { headers: { Authorization: 'Bearer ' + await zoomToken(c, fresh) } });
      try { return await go(false); }
      catch (e) {
        if (e.status === 401) return go(true);
        if (e.status === 400 && /scope/i.test(e.message)) throw new IntError('auth', e.message + ' — add the missing scope to your Zoom app (Scopes tab), then activate it again.');
        throw e;
      }
    }
    const zuser = c => encodeURIComponent(c.user || 'me');
    const ymd = d => d.toISOString().slice(0, 10);
    const zoom = {
      normalize(c) {
        const o = { accountId: str(c.accountId), clientId: str(c.clientId), clientSecret: str(c.clientSecret), user: str(c.user) };
        if (!o.accountId) throw new IntError('invalid', 'Paste the Account ID of your Zoom app', { field: 'accountId' });
        if (!o.clientId) throw new IntError('invalid', 'Paste the Client ID of your Zoom app', { field: 'clientId' });
        if (!o.clientSecret) throw new IntError('invalid', 'Paste the Client Secret of your Zoom app', { field: 'clientSecret' });
        return o;
      },
      async test(c) {
        let u;
        try { u = await zget(c, '/users/' + zuser(c)); }
        catch (e) {
          if (!c.user && (e.status === 400 || e.status === 404)) throw new IntError('invalid', 'Enter the email of the Zoom user whose meetings KEEK should read', { field: 'user' });
          throw e;
        }
        return { user: u.display_name || [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email, email: u.email };
      },
      async events(c, o) {
        const days = Math.min(60, (o && o.days) || 14), now = Date.now(), until = now + days * 864e5;
        const r = await zget(c, '/users/' + zuser(c) + '/meetings?type=upcoming&page_size=100');
        return list(r.meetings).filter(m => m.start_time).map(m => {
          const s = Date.parse(m.start_time), e = s + (m.duration || 60) * 60000;
          return { id: 'zoom-' + m.id + '-' + m.start_time, source: 'zoom', title: m.topic || 'Zoom meeting', start: new Date(s).toISOString(), end: new Date(e).toISOString(), allDay: false, url: m.join_url || null, platform: 'zoom', location: '', organizer: '', attendees: [] };
        }).filter(x => Date.parse(x.end) > now && Date.parse(x.start) < until).sort((a, b) => a.start.localeCompare(b.start));
      },
      async recordings(c, o) {
        const to = new Date(), from = new Date(Date.now() - Math.min(30, (o && o.days) || 30) * 864e5);
        const r = await zget(c, '/users/' + zuser(c) + '/recordings?page_size=100&from=' + ymd(from) + '&to=' + ymd(to));
        return list(r.meetings).map(m => ({
          id: m.uuid, title: m.topic || 'Zoom meeting', start: m.start_time, durationMin: m.duration || null,
          hasTranscript: list(m.recording_files).some(f => f.file_type === 'TRANSCRIPT')
        })).sort((a, b) => String(b.start).localeCompare(String(a.start)));
      },
      async transcript(c, o) {
        const id = str(o && o.id);
        if (!id) throw new IntError('invalid', 'Missing recording id');
        // Zoom: UUIDs that start with "/" or contain "//" must be encoded twice.
        const enc = /^\/|\/\//.test(id) ? encodeURIComponent(encodeURIComponent(id)) : encodeURIComponent(id);
        const r = await zget(c, '/meetings/' + enc + '/recordings');
        const f = list(r.recording_files).find(x => x.file_type === 'TRANSCRIPT');
        if (!f) throw new IntError('not_found', 'This recording has no transcript. In Zoom, turn on Settings → Recording → Cloud recording → “Create audio transcript”.');
        const tok = await zoomToken(c);
        // Pass the token in the URL: fetch drops Authorization on the redirect to Zoom's file host.
        const vtt = await call('Zoom', f.download_url + (f.download_url.includes('?') ? '&' : '?') + 'access_token=' + encodeURIComponent(tok), {});
        return { title: r.topic || 'Zoom meeting', start: r.start_time || null, durationMin: r.duration || null, text: vttToText(String(vtt)) };
      }
    };

    const SERVICES = { slack, webhooks, notion, linear, jira, gcal, outlook, zoom };
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
        const s = svc(kind);
        if (!s.send) throw new IntError('invalid', kind + ' can’t receive meetings');
        if (!payload || !payload.meeting) throw new IntError('invalid', 'Nothing to send');
        return s.send(cfg, payload);
      },
      /** Read operations: calendars → events; Zoom → events, recordings, transcript. */
      async run(kind, cfg, op, args) {
        if (!(OPS[kind] || []).includes(op)) throw new IntError('invalid', 'Unsupported operation: ' + kind + '.' + op);
        return svc(kind)[op](cfg, args || {});
      }
    };
  }

  /* ---------------- iCalendar (.ics) ---------------- */
  // Outlook writes Windows zone names; map the common ones to IANA (others fall back to VTIMEZONE).
  const WIN_TZ = {
    'Egypt Standard Time': 'Africa/Cairo', 'Arab Standard Time': 'Asia/Riyadh', 'Arabian Standard Time': 'Asia/Dubai', 'Arabic Standard Time': 'Asia/Baghdad',
    'Jordan Standard Time': 'Asia/Amman', 'Middle East Standard Time': 'Asia/Beirut', 'Syria Standard Time': 'Asia/Damascus', 'Israel Standard Time': 'Asia/Jerusalem',
    'Morocco Standard Time': 'Africa/Casablanca', 'W. Central Africa Standard Time': 'Africa/Lagos', 'South Africa Standard Time': 'Africa/Johannesburg', 'E. Africa Standard Time': 'Africa/Nairobi',
    'Turkey Standard Time': 'Europe/Istanbul', 'Russian Standard Time': 'Europe/Moscow', 'GMT Standard Time': 'Europe/London', 'Greenwich Standard Time': 'Atlantic/Reykjavik',
    'W. Europe Standard Time': 'Europe/Berlin', 'Romance Standard Time': 'Europe/Paris', 'Central Europe Standard Time': 'Europe/Budapest', 'Central European Standard Time': 'Europe/Warsaw',
    'E. Europe Standard Time': 'Europe/Chisinau', 'FLE Standard Time': 'Europe/Kiev', 'GTB Standard Time': 'Europe/Bucharest',
    'India Standard Time': 'Asia/Kolkata', 'Pakistan Standard Time': 'Asia/Karachi', 'China Standard Time': 'Asia/Shanghai', 'Singapore Standard Time': 'Asia/Singapore',
    'Tokyo Standard Time': 'Asia/Tokyo', 'Korea Standard Time': 'Asia/Seoul', 'AUS Eastern Standard Time': 'Australia/Sydney',
    'Eastern Standard Time': 'America/New_York', 'Central Standard Time': 'America/Chicago', 'Mountain Standard Time': 'America/Denver', 'Pacific Standard Time': 'America/Los_Angeles',
    'US Mountain Standard Time': 'America/Phoenix', 'Atlantic Standard Time': 'America/Halifax', 'E. South America Standard Time': 'America/Sao_Paulo', 'UTC': 'UTC', 'Coordinated Universal Time': 'UTC'
  };
  const tzOk = new Map();
  function validTz(tz) {
    if (!tzOk.has(tz)) { let ok = false; try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); ok = true; } catch (e) { /* not IANA */ } tzOk.set(tz, ok); }
    return tzOk.get(tz);
  }
  function tzOffsetMin(tz, utcMs) {
    const p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      .formatToParts(new Date(utcMs)).forEach(x => { p[x.type] = x.value; });
    return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - utcMs) / 60000;
  }
  const unesc = v => String(v || '').replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');

  function parseICS(text) {
    const lines = String(text).replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
    const cal = { name: '', tz: {}, events: [] };
    const stack = [];
    let ev = null, tz = null;
    for (const line of lines) {
      const i = line.indexOf(':');
      if (i < 0) continue;
      const parts = line.slice(0, i).split(';'), N = parts[0].toUpperCase(), v = line.slice(i + 1), P = {};
      parts.slice(1).forEach(p => { const j = p.indexOf('='); if (j > 0) P[p.slice(0, j).toUpperCase()] = p.slice(j + 1).replace(/^"|"$/g, ''); });
      if (N === 'BEGIN') {
        const b = v.toUpperCase(); stack.push(b);
        if (b === 'VEVENT') ev = { exdate: [], attendees: [] };
        if (b === 'VTIMEZONE') tz = { id: '', std: null };
        continue;
      }
      if (N === 'END') {
        const b = stack.pop();
        if (b === 'VEVENT' && ev) { cal.events.push(ev); ev = null; }
        if (b === 'VTIMEZONE' && tz) { if (tz.id) cal.tz[tz.id] = tz; tz = null; }
        continue;
      }
      const top = stack[stack.length - 1];
      if (top === 'VCALENDAR' && N === 'X-WR-CALNAME') cal.name = unesc(v);
      if (tz) { if (top === 'VTIMEZONE' && N === 'TZID') tz.id = v; if (top === 'STANDARD' && N === 'TZOFFSETTO') tz.std = v; continue; }
      if (!ev || top !== 'VEVENT') continue; // skips VALARM etc.
      const dt = () => ({ v: v.trim(), tz: P.TZID, date: P.VALUE === 'DATE' || /^\d{8}$/.test(v.trim()) });
      switch (N) {
        case 'UID': ev.uid = v; break;
        case 'SUMMARY': ev.title = unesc(v); break;
        case 'DESCRIPTION': ev.description = unesc(v); break;
        case 'LOCATION': ev.location = unesc(v); break;
        case 'URL': ev.url = v; break;
        case 'STATUS': ev.status = v.toUpperCase(); break;
        case 'DTSTART': ev.start = dt(); break;
        case 'DTEND': ev.end = dt(); break;
        case 'DURATION': ev.duration = v; break;
        case 'RRULE': ev.rrule = v; break;
        case 'EXDATE': v.split(',').forEach(x => ev.exdate.push({ v: x.trim(), tz: P.TZID, date: P.VALUE === 'DATE' })); break;
        case 'RECURRENCE-ID': ev.recurrenceId = dt(); break;
        case 'ORGANIZER': ev.organizer = P.CN || v.replace(/^mailto:/i, ''); break;
        case 'ATTENDEE': ev.attendees.push(P.CN || v.replace(/^mailto:/i, '')); break;
        case 'X-GOOGLE-CONFERENCE': case 'X-MICROSOFT-SKYPETEAMSMEETINGURL': case 'X-MICROSOFT-ONLINEMEETINGEXTERNALLINK': ev.conf = v; break;
      }
    }
    return cal;
  }

  /** ICS date/time → epoch ms (UTC "Z", TZID via Intl, Windows zone names, VTIMEZONE, or local time). */
  function icsMs(d, cal) {
    const m = d && String(d.v).match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
    if (!m) return null;
    const Y = +m[1], Mo = +m[2] - 1, D = +m[3], h = +(m[4] || 0), mi = +(m[5] || 0), s = +(m[6] || 0);
    if (m[7]) return Date.UTC(Y, Mo, D, h, mi, s);
    if (d.date || !m[4]) return new Date(Y, Mo, D).getTime();
    const wall = Date.UTC(Y, Mo, D, h, mi, s);
    if (d.tz) {
      const id = String(d.tz).replace(/^\//, '');
      const iana = validTz(id) ? id : WIN_TZ[id];
      if (iana) {
        const o1 = tzOffsetMin(iana, wall);
        let ms = wall - o1 * 60000;
        const o2 = tzOffsetMin(iana, ms);
        if (o2 !== o1) ms = wall - o2 * 60000;
        return ms;
      }
      const vt = cal && cal.tz[d.tz], om = vt && vt.std && vt.std.match(/^([+-])(\d{2})(\d{2})/);
      if (om) return wall - (om[1] === '-' ? -1 : 1) * (+om[2] * 60 + +om[3]) * 60000;
    }
    return new Date(Y, Mo, D, h, mi, s).getTime();
  }

  function durMs(s) {
    const m = String(s || '').match(/^([+-])?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
    if (!m) return null;
    return ((+m[2] || 0) * 7 * 864e5 + (+m[3] || 0) * 864e5 + (+m[4] || 0) * 36e5 + (+m[5] || 0) * 6e4 + (+m[6] || 0) * 1e3) * (m[1] === '-' ? -1 : 1);
  }

  const DOW = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  /** Start times (ms) of an event inside [from, to). Supports DAILY/WEEKLY/MONTHLY/YEARLY with INTERVAL, COUNT, UNTIL, BYDAY, BYMONTHDAY, EXDATE. */
  function occurrences(ev, cal, from, to, skip) {
    const start = icsMs(ev.start, cal);
    if (start == null) return [];
    const end = ev.end ? icsMs(ev.end, cal) : null;
    const len = Math.max(0, end != null ? end - start : (durMs(ev.duration) != null ? durMs(ev.duration) : (ev.start.date ? 864e5 : 36e5)));
    const inWin = ms => ms < to && ms + len > from;
    if (!ev.rrule) return inWin(start) ? [{ s: start, len }] : [];
    const R = {};
    ev.rrule.split(';').forEach(p => { const [k, val] = p.split('='); if (k) R[k.toUpperCase()] = val; });
    const m = String(ev.start.v).match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
    const Y = +m[1], Mo = +m[2] - 1, D = +m[3], time = m[4] ? 'T' + m[4] + m[5] + (m[6] || '00') + (m[7] || '') : '';
    const at = (y, mo, d, strict) => {
      const x = new Date(Date.UTC(y, mo, d));
      if (strict && x.getUTCMonth() !== mo) return null; // e.g. Feb 30 in a monthly rule
      const v = x.getUTCFullYear() + String(x.getUTCMonth() + 1).padStart(2, '0') + String(x.getUTCDate()).padStart(2, '0') + time;
      return icsMs({ v, tz: ev.start.tz, date: ev.start.date }, cal);
    };
    const until = R.UNTIL ? icsMs({ v: R.UNTIL, tz: ev.start.tz, date: /^\d{8}$/.test(R.UNTIL) }, cal) + (/^\d{8}$/.test(R.UNTIL) ? 864e5 - 1 : 0) : Infinity;
    const count = R.COUNT ? +R.COUNT : Infinity, step = Math.max(1, +R.INTERVAL || 1);
    const ex = new Set(ev.exdate.map(x => icsMs(x, cal)).concat(skip || []));
    const out = [];
    let n = 0, guard = 0;
    // returns false to stop
    const push = ms => {
      if (++guard > 20000) return false;
      if (ms == null || ms < start) return true;
      if (ms > until || n >= count) return false;
      n++;
      if (!ex.has(ms) && inWin(ms)) out.push({ s: ms, len });
      return ms < to;
    };
    const byday = (R.BYDAY || '').split(',').filter(Boolean);
    const freq = (R.FREQ || '').toUpperCase();
    if (freq === 'DAILY') {
      for (let i = 0; ; i += step) if (!push(at(Y, Mo, D + i))) break;
    } else if (freq === 'WEEKLY') {
      const days = (byday.length ? byday.map(x => DOW.indexOf(x.slice(-2))) : [new Date(Date.UTC(Y, Mo, D)).getUTCDay()]).filter(x => x >= 0).sort((a, b) => a - b);
      const wk0 = D - new Date(Date.UTC(Y, Mo, D)).getUTCDay();
      outer: for (let w = 0; ; w += step) for (const d of days) if (!push(at(Y, Mo, wk0 + w * 7 + d))) break outer;
    } else if (freq === 'MONTHLY' || freq === 'YEARLY') {
      const yearly = freq === 'YEARLY';
      outer2: for (let k = 0; ; k += step) {
        const y = yearly ? Y + k : Y + Math.floor((Mo + k) / 12), mo = yearly ? Mo : (Mo + k) % 12;
        const cands = [];
        if (byday.length) {
          byday.forEach(b => {
            const bm = b.match(/^([+-]?\d+)?([A-Z]{2})$/); if (!bm) return;
            const wd = DOW.indexOf(bm[2]), nth = bm[1] ? +bm[1] : 0;
            const first = new Date(Date.UTC(y, mo, 1)).getUTCDay(), dim = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
            const all = []; for (let d = 1 + ((wd - first + 7) % 7); d <= dim; d += 7) all.push(d);
            if (!nth) cands.push(...all); else { const d = nth > 0 ? all[nth - 1] : all[all.length + nth]; if (d) cands.push(d); }
          });
        } else if (R.BYMONTHDAY) R.BYMONTHDAY.split(',').forEach(x => { const d = +x; const dim = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate(); cands.push(d > 0 ? d : dim + d + 1); });
        else cands.push(D);
        for (const d of [...new Set(cands)].sort((a, b) => a - b)) if (!push(at(y, mo, d, true))) break outer2;
      }
    }
    return out;
  }

  const MEET_URL = /https:\/\/(?:meet\.google\.com\/[a-z0-9-]+|[\w.-]*zoom\.us\/(?:j|my|w|s)\/[^\s<>"'\\)]+|teams\.microsoft\.com\/l\/meetup-join\/[^\s<>"'\\)]+|teams\.live\.com\/meet\/[^\s<>"'\\)]+)/i;
  function meetingLink(ev) {
    for (const s of [ev.conf, ev.url, ev.location, ev.description]) { const m = s && String(s).match(MEET_URL); if (m) return m[0]; }
    return null;
  }
  const platformOf = url => !url ? 'other' : /meet\.google/i.test(url) ? 'meet' : /zoom\.us/i.test(url) ? 'zoom' : /teams\./i.test(url) ? 'teams' : 'other';

  /** Upcoming (and ongoing) events for the next `days` days, sorted. */
  function upcoming(cal, days, now) {
    now = now || Date.now();
    const to = now + days * 864e5, out = [];
    const moved = {};
    cal.events.forEach(e => { if (e.recurrenceId && e.uid) (moved[e.uid] = moved[e.uid] || []).push(icsMs(e.recurrenceId, cal)); });
    for (const e of cal.events) {
      if (e.status === 'CANCELLED') continue;
      const occ = occurrences(e, cal, now, to, e.recurrenceId ? null : moved[e.uid]);
      const url = meetingLink(e);
      occ.forEach(o => out.push({
        id: (e.uid || e.title || 'ev') + '@' + o.s, source: 'ics', title: e.title || '(no title)',
        start: new Date(o.s).toISOString(), end: new Date(o.s + o.len).toISOString(), allDay: !!e.start.date,
        url, platform: platformOf(url), location: e.location && !MEET_URL.test(e.location) ? clip(e.location, 120) : '',
        organizer: e.organizer || '', attendees: e.attendees.slice(0, 30)
      }));
    }
    return out.sort((a, b) => a.start.localeCompare(b.start)).slice(0, 100);
  }

  /** Zoom WebVTT transcript → "[mm:ss] Speaker: text" lines (the format KEEK's import parses). */
  function vttToText(vtt) {
    const out = [];
    String(vtt).replace(/\r/g, '').split(/\n\n+/).forEach(block => {
      const ls = block.split('\n').filter(Boolean);
      const ti = ls.findIndex(l => l.includes('-->'));
      if (ti < 0) return;
      const tm = ls[ti].match(/(\d+):(\d{2}):(\d{2})/) || ls[ti].match(/(\d{2}):(\d{2})[.,]/);
      const text = ls.slice(ti + 1).join(' ').trim();
      if (!text) return;
      let sec = 0;
      if (tm && tm.length === 4) sec = +tm[1] * 3600 + +tm[2] * 60 + +tm[3];
      else if (tm) sec = +tm[1] * 60 + +tm[2];
      const ts = (sec >= 3600 ? Math.floor(sec / 3600) + ':' : '') + String(Math.floor(sec / 60) % 60).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
      out.push('[' + ts + '] ' + text);
    });
    return out.join('\n');
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
      },
      async run(kind, op, args) {
        const a = await all(), e = a[kind];
        if (!e) throw new IntError('invalid', kind + ' is not connected');
        return I.run(kind, e.cfg, op, args);
      }
    };
  }

  return { KINDS, SECRET, OPTIONS, OPS, IntError, create, createManager, publicInfo, utils: { notionId, slackText, notionBlocks, adf, issueMarkdown, hmacHex, parseICS, upcoming, icsMs, vttToText, meetingLink } };
});
