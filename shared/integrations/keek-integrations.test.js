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

/* ---------------- calendars (.ics) ---------------- */
const ICS = [
  'BEGIN:VCALENDAR', 'X-WR-CALNAME:Work',
  'BEGIN:VTIMEZONE', 'TZID:Egypt Standard Time', 'BEGIN:STANDARD', 'TZOFFSETTO:+0200', 'END:STANDARD', 'END:VTIMEZONE',
  // weekly stand-up Mon/Wed 10:00 Cairo, Meet link in a folded description, one cancelled instance
  'BEGIN:VEVENT', 'UID:standup', 'SUMMARY:Stand-up', 'DTSTART;TZID=Africa/Cairo:20261102T100000', 'DTEND;TZID=Africa/Cairo:20261102T101500',
  'RRULE:FREQ=WEEKLY;BYDAY=MO,WE', 'EXDATE;TZID=Africa/Cairo:20261118T100000',
  'DESCRIPTION:Join: https://meet.google.com/ab', ' c-defg-hij\\nThanks', 'END:VEVENT',
  // Outlook-style Windows zone name, Teams link
  'BEGIN:VEVENT', 'UID:review', 'SUMMARY:Design review', 'DTSTART;TZID=Egypt Standard Time:20261119T140000', 'DURATION:PT1H',
  'X-MICROSOFT-SKYPETEAMSMEETINGURL:https://teams.microsoft.com/l/meetup-join/19%3ameeting_x', 'ATTENDEE;CN=Omar:mailto:o@x.co', 'END:VEVENT',
  // cancelled and past events are ignored
  'BEGIN:VEVENT', 'UID:gone', 'SUMMARY:Cancelled', 'STATUS:CANCELLED', 'DTSTART:20261119T090000Z', 'END:VEVENT',
  'BEGIN:VEVENT', 'UID:old', 'SUMMARY:Old', 'DTSTART:20250101T090000Z', 'END:VEVENT',
  // monthly on the last Friday, 3 times, UTC
  'BEGIN:VEVENT', 'UID:retro', 'SUMMARY:Retro', 'DTSTART:20261030T120000Z', 'DTEND:20261030T130000Z', 'RRULE:FREQ=MONTHLY;BYDAY=-1FR;COUNT=3', 'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

test('ics: recurring events, time zones, exceptions, meeting links', () => {
  const cal = KI.utils.parseICS(ICS);
  assert.equal(cal.name, 'Work');
  const now = Date.parse('2026-11-17T00:00:00Z');
  const ev = KI.utils.upcoming(cal, 14, now);
  const stand = ev.filter(e => e.title === 'Stand-up').map(e => e.start);
  // Mon 23 + Wed 25 + Mon 30 (Wed 18 is excluded); Cairo is UTC+2 in winter
  assert.deepEqual(stand, ['2026-11-23T08:00:00.000Z', '2026-11-25T08:00:00.000Z', '2026-11-30T08:00:00.000Z']);
  const s0 = ev.find(e => e.title === 'Stand-up');
  assert.equal(s0.url, 'https://meet.google.com/abc-defg-hij');
  assert.equal(s0.platform, 'meet');
  const rev = ev.find(e => e.title === 'Design review');
  assert.equal(rev.start, '2026-11-19T12:00:00.000Z');
  assert.equal(rev.end, '2026-11-19T13:00:00.000Z');
  assert.equal(rev.platform, 'teams');
  assert.deepEqual(rev.attendees, ['Omar']);
  assert.ok(!ev.some(e => e.title === 'Cancelled' || e.title === 'Old'));
  assert.deepEqual(ev.filter(e => e.title === 'Retro').map(e => e.start), ['2026-11-27T12:00:00.000Z']);
});

test('ics: daily rule crosses month ends; UNTIL is respected', () => {
  const cal = KI.utils.parseICS('BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:d\nSUMMARY:Daily\nDTSTART:20261129T090000Z\nRRULE:FREQ=DAILY;UNTIL=20261202T090000Z\nEND:VEVENT\nEND:VCALENDAR');
  const ev = KI.utils.upcoming(cal, 30, Date.parse('2026-11-28T00:00:00Z'));
  assert.deepEqual(ev.map(e => e.start.slice(0, 10)), ['2026-11-29', '2026-11-30', '2026-12-01', '2026-12-02']);
});

test('calendar connect: webcal links work, non-calendar responses are explained', async () => {
  const f = mockFetch(url => url.includes('bad') ? new Response('<html>login</html>') : new Response(ICS));
  const I = KI.create({ fetch: f });
  const { cfg, info } = await I.connect('gcal', { url: 'webcal://calendar.google.com/calendar/ical/x/private-y/basic.ics' });
  assert.equal(cfg.url, 'https://calendar.google.com/calendar/ical/x/private-y/basic.ics');
  assert.equal(info.calendar, 'Work');
  await assert.rejects(I.connect('outlook', { url: 'https://outlook.office365.com/bad.ics' }), e => e.code === 'invalid' && /Publish a calendar/.test(e.message));
  const events = await I.run('gcal', cfg, 'events', { days: 7 });
  assert.ok(Array.isArray(events));
  await assert.rejects(I.run('gcal', cfg, 'transcript', {}), e => e.code === 'invalid');
});

/* ---------------- Zoom ---------------- */
test('zoom: server-to-server token, upcoming meetings, transcript import', async () => {
  const VTT = 'WEBVTT\n\n1\n00:00:05.120 --> 00:00:08.000\nSara Adel: Let us start.\n\n2\n01:02:03.000 --> 01:02:05.000\nOmar: Done.\n';
  const f = mockFetch((url, init) => {
    if (url.startsWith('https://zoom.us/oauth/token')) {
      assert.equal(init.headers.Authorization, 'Basic ' + Buffer.from('cid:csec').toString('base64'));
      assert.match(url, /account_id=acc/);
      return json({ access_token: 'tok', expires_in: 3600 });
    }
    if (url.includes('/rec/download')) { assert.match(url, /access_token=tok/); return new Response(VTT); }
    assert.equal(init.headers.Authorization, 'Bearer tok');
    if (url.endsWith('/users/sara%40x.co')) return json({ display_name: 'Sara', email: 'sara@x.co' });
    if (url.includes('/meetings?type=upcoming')) return json({ meetings: [{ id: 9, topic: 'Client call', start_time: new Date(Date.now() + 36e5).toISOString(), duration: 30, join_url: 'https://zoom.us/j/9' }] });
    if (url.includes('/recordings?')) return json({ meetings: [{ uuid: '/ab//c==', topic: 'Old call', start_time: '2026-11-10T10:00:00Z', duration: 62, recording_files: [{ file_type: 'TRANSCRIPT' }] }] });
    if (url.includes('/meetings/%252Fab%252F%252Fc%253D%253D/recordings')) return json({ topic: 'Old call', start_time: '2026-11-10T10:00:00Z', recording_files: [{ file_type: 'MP4' }, { file_type: 'TRANSCRIPT', download_url: 'https://zoom.us/rec/download/xyz' }] });
    return json({ message: 'unexpected ' + url }, 404);
  });
  const I = KI.create({ fetch: f });
  await assert.rejects(I.connect('zoom', { accountId: 'acc', clientId: 'cid' }), e => e.field === 'clientSecret');
  const { cfg, info } = await I.connect('zoom', { accountId: 'acc', clientId: 'cid', clientSecret: 'csec', user: 'sara@x.co' });
  assert.equal(info.user, 'Sara');
  const ev = await I.run('zoom', cfg, 'events', {});
  assert.equal(ev[0].url, 'https://zoom.us/j/9');
  assert.equal(ev[0].platform, 'zoom');
  const recs = await I.run('zoom', cfg, 'recordings', {});
  assert.equal(recs[0].hasTranscript, true);
  const tr = await I.run('zoom', cfg, 'transcript', { id: recs[0].id });
  assert.equal(tr.text, '[00:05] Sara Adel: Let us start.\n[1:02:03] Omar: Done.');
  assert.equal(f.calls.filter(c => c.url.includes('oauth/token')).length, 1); // token cached
});

test('zoom: bad app credentials give a clear message', async () => {
  const f = mockFetch(() => json({ reason: 'Invalid client_id or client_secret', error: 'invalid_client' }, 400));
  await assert.rejects(KI.create({ fetch: f }).connect('zoom', { accountId: 'a', clientId: 'b', clientSecret: 'c' }), e => e.code === 'auth' && /Server-to-Server/.test(e.message));
});
