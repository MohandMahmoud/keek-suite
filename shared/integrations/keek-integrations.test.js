// Run: node --test shared/integrations/keek-integrations.test.js   (no network, no tokens needed)
const test = require('node:test');
const assert = require('node:assert/strict');
const KI = require('./keek-integrations.js');

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
function mockFetch(handler) {
  const calls = [];
  const f = async (url, init) => { calls.push({ url: String(url), init: init || {}, body: init && init.body ? JSON.parse(init.body) : null }); return handler(String(url), init || {}, calls.length); };
  f.calls = calls;
  return f;
}
const payload = (items) => ({
  event: 'meeting.summary',
  meeting: { id: 'm1', title: 'Sprint planning', when: 'Nov 17, 2026', participants: ['Sara', 'Omar'] },
  summary: { overview: 'We planned the sprint.', topics: ['scope'], points: [], decisions: [{ title: 'Ship quiz builder', description: '', status: 'confirmed' }], questions: ['Budget?'], risks: [] },
  actionItems: items || [{ id: 't1', title: 'Write the spec', owner: 'Sara', due: '2026-11-20', status: 'open', quotes: ['[01:02] Sara: I will write it'] }],
  labels: {}
});

test('slack: rejects non-Slack URLs, posts the summary', async () => {
  const f = mockFetch(() => new Response('ok'));
  const I = KI.create({ fetch: f });
  await assert.rejects(I.connect('slack', { url: 'https://example.com/hook' }), e => e.code === 'invalid' && e.field === 'url');
  const { cfg } = await I.connect('slack', { url: 'https://hooks.slack.com/services/T/B/xyz123' });
  await I.send('slack', cfg, payload());
  const text = f.calls[1].body.text;
  assert.match(text, /\*Sprint planning\*/);
  assert.match(text, /• Ship quiz builder/);
  assert.match(text, /• Write the spec — Sara — 2026-11-20/);
});

test('webhooks: signs the body with HMAC-SHA256 and sends the event header', async () => {
  const f = mockFetch(() => json({ ok: true }));
  const I = KI.create({ fetch: f });
  await assert.rejects(I.connect('webhooks', { url: 'http://example.com/x' }), e => e.code === 'invalid');
  const { cfg } = await I.connect('webhooks', { url: 'https://example.com/x', secret: 's3cret' });
  await I.send('webhooks', cfg, payload());
  const c = f.calls[1];
  assert.equal(c.init.headers['X-Keek-Event'], 'meeting.summary');
  const expected = require('crypto').createHmac('sha256', 's3cret').update(c.init.body).digest('hex');
  assert.equal(c.init.headers['X-Keek-Signature'], 'sha256=' + expected);
  assert.equal(c.body.labels, undefined);
  assert.equal(c.body.meeting.title, 'Sprint planning');
});

test('notion: accepts a page link, explains a page the integration cannot see', async () => {
  assert.equal(KI.utils.notionId('https://www.notion.so/team/Meetings-0123456789abcdef0123456789abcdef?pvs=4'), '01234567-89ab-cdef-0123-456789abcdef');
  const f = mockFetch(url => url.endsWith('/users/me') ? json({ bot: { workspace_name: 'Acme' } }) : json({ message: 'Could not find page' }, 404));
  const I = KI.create({ fetch: f });
  await assert.rejects(I.connect('notion', { token: 'ntn_x', page: '0123456789abcdef0123456789abcdef' }), e => e.code === 'not_found' && /Connections/.test(e.message));
});

test('notion: creates a page with headings and to-dos', async () => {
  const f = mockFetch((url, init) => {
    if (url.endsWith('/users/me')) return json({ bot: { workspace_name: 'Acme' } });
    if (init.method === 'POST') return json({ id: 'p2', url: 'https://notion.so/p2' });
    return json({ url: 'https://notion.so/p1', properties: { title: { type: 'title', title: [{ plain_text: 'Meetings' }] } } });
  });
  const I = KI.create({ fetch: f });
  const { cfg, info } = await I.connect('notion', { token: 'ntn_x', page: '0123456789abcdef0123456789abcdef' });
  assert.equal(info.pageTitle, 'Meetings');
  const r = await I.send('notion', cfg, payload());
  assert.equal(r.created[0].url, 'https://notion.so/p2');
  const body = f.calls.at(-1).body;
  assert.equal(body.parent.page_id, '01234567-89ab-cdef-0123-456789abcdef');
  assert.ok(body.children.some(b => b.type === 'to_do' && /Write the spec/.test(b.to_do.rich_text[0].text.content)));
});

test('linear: asks to choose a team when there are several, then creates issues', async () => {
  const f = mockFetch((url, init) => {
    const q = JSON.parse(init.body).query;
    if (q.includes('viewer')) return json({ data: { viewer: { name: 'Sara' }, teams: { nodes: [{ id: 'a', key: 'ENG', name: 'Engineering' }, { id: 'b', key: 'DES', name: 'Design' }] } } });
    return json({ data: { issueCreate: { success: true, issue: { id: 'i1', identifier: 'ENG-7', url: 'https://linear.app/x/ENG-7' } } } });
  });
  const I = KI.create({ fetch: f });
  await assert.rejects(I.connect('linear', { apiKey: 'lin_api_x' }), e => e.code === 'choose' && e.choices.length === 2);
  const { cfg, info } = await I.connect('linear', { apiKey: 'lin_api_x', teamId: 'a' });
  assert.equal(info.teamKey, 'ENG');
  const r = await I.send('linear', cfg, payload());
  assert.deepEqual(r.created, [{ id: 't1', key: 'ENG-7', url: 'https://linear.app/x/ENG-7' }]);
  const input = f.calls.at(-1).body.variables.input;
  assert.equal(input.teamId, 'a');
  assert.equal(input.dueDate, '2026-11-20');
  assert.match(input.description, /Owner: Sara/);
});

test('linear: GraphQL errors surface (HTTP 200 with errors)', async () => {
  const f = mockFetch(() => json({ errors: [{ message: 'Authentication required, not authenticated' }] }));
  await assert.rejects(KI.create({ fetch: f }).connect('linear', { apiKey: 'bad' }), e => e.code === 'auth');
});

test('jira: picks the Task type, retries without due date, reports partial progress', async () => {
  let creates = 0;
  const f = mockFetch((url, init) => {
    if (url.endsWith('/myself')) return json({ displayName: 'Sara' });
    if (url.includes('/project/ENG')) return json({ key: 'ENG', name: 'Engineering', issueTypes: [{ name: 'Epic' }, { name: 'Task' }, { name: 'Sub-task', subtask: true }] });
    if (init.method === 'POST') {
      creates++;
      const body = JSON.parse(init.body);
      if (body.fields.duedate) return json({ errors: { duedate: 'Field \'duedate\' cannot be set.' } }, 400);
      if (creates === 3) return json({ errorMessages: ['boom'] }, 500);
      return json({ key: 'ENG-' + creates });
    }
    return json({}, 404);
  });
  const I = KI.create({ fetch: f });
  const { cfg, info } = await I.connect('jira', { site: 'acme.atlassian.net', email: 'a@b.co', apiToken: 'tok', projectKey: 'eng' });
  assert.equal(cfg.site, 'https://acme.atlassian.net');
  assert.equal(info.issueType, 'Task');
  const items = [{ id: 't1', title: 'One', due: '2026-11-20', status: 'open' }, { id: 't2', title: 'Two', status: 'open' }];
  await assert.rejects(I.send('jira', cfg, payload(items)), e => e.created && e.created.length === 1 && e.created[0].key === 'ENG-2');
  const auth = f.calls[0].init.headers.Authorization;
  assert.equal(auth, 'Basic ' + Buffer.from('a@b.co:tok').toString('base64'));
});

test('manager: blank fields keep saved secrets, list() never exposes them', async () => {
  let saved = {};
  const f = mockFetch(() => new Response('ok'));
  const mgr = KI.createManager({ fetch: f, load: async () => saved, save: async a => { saved = JSON.parse(JSON.stringify(a)); } });
  await mgr.connect('slack', { url: 'https://hooks.slack.com/services/T/B/secret99', auto: true });
  let l = await mgr.list();
  assert.equal(l.slack.connected, true);
  assert.equal(l.slack.info.auto, true);
  assert.ok(!JSON.stringify(l).includes('secret99'));
  await mgr.connect('slack', { url: '', auto: false });          // edit without re-entering the URL
  assert.equal(saved.slack.cfg.url, 'https://hooks.slack.com/services/T/B/secret99');
  assert.equal(saved.slack.cfg.auto, false);
  await mgr.remove('slack');
  l = await mgr.list();
  assert.equal(l.slack.connected, false);
  await assert.rejects(mgr.send('slack', payload()), e => e.code === 'invalid');
});
