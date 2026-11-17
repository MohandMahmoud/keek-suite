# Integrations — Slack, Notion, Linear, Jira, webhooks

Each integration connects with a URL or token you paste into **Integrations → Connect**. KEEK checks
it against the service before saving. You don't need an OAuth app or a server.

| Service | What you paste | What KEEK does |
|---|---|---|
| **Slack** | An [Incoming Webhook](https://api.slack.com/messaging/webhooks) URL (`https://hooks.slack.com/services/…`) — it is tied to one channel | Posts the summary, decisions, action items, questions and risks. Optional: post automatically when a meeting finishes processing. |
| **Notion** | An [internal integration](https://www.notion.so/profile/integrations) secret + the link of a parent page | Creates a sub-page with the full summary; action items become to-dos. **Share the parent page with the integration** (page → ••• → Connections). |
| **Linear** | A [personal API key](https://linear.app/settings/account/security) (+ team, asked for if you have several) | Creates one issue per open action item (title, description, owner, due date, transcript quotes). |
| **Jira Cloud** | Site (`yourteam.atlassian.net`), account email, [API token](https://id.atlassian.com/manage-profile/security/api-tokens), project (asked for if you leave it blank) | Creates one issue per open action item. Uses the project's “Task” type, and leaves out the due date if the project's create screen doesn't have one. |
| **Webhooks** | Any `https://` URL (Zapier, Make, n8n, your server), optional signing secret | POSTs JSON: `meeting`, `summary`, `actionItems`, `transcript`. Header `X-Keek-Event: meeting.summary` (`keek.test` when connecting). With a secret: `X-Keek-Signature: sha256=<HMAC-SHA256 of the raw body>`. Optional auto-send. |

## Sending

Open a meeting → **Share**. Every connected service is listed with a **Send** button.

- Linear and Jira only get **open** action items that haven't been sent to that service yet. KEEK keeps
  track per item, so sending again doesn't create duplicates. If a send fails partway, the issues that
  were already created are still recorded.
- Slack and Notion need a processed meeting (one with a summary). A webhook can be sent at any time.

## Where tokens live

- **Desktop:** in the Electron main process, encrypted with the OS keychain (`safeStorage`), inside
  `keek-config.json`. The page never receives them back; it only sees “connected” plus non-secret
  details such as the team or project name.
- **Extension:** in `chrome.storage.local` for this browser profile.
- **Plain web page:** Slack, Notion and Jira block cross-origin calls from web pages, so use the
  desktop app or the extension.

The extension has host permissions for `hooks.slack.com`, `api.notion.com`, `api.linear.app` and
`*.atlassian.net`. For a webhook URL or a self-hosted Jira site, Chrome asks once for permission to
reach that address when you click **Connect**.

## Module

`shared/integrations/keek-integrations.js` has no dependencies and runs in Node/Electron and in browsers:

```js
const I = KeekIntegrations.create({ fetch });
const { cfg, info } = await I.connect('jira', { site, email, apiToken, projectKey });
const { created } = await I.send('jira', cfg, payload);   // [{ id, key, url }]
```

`KeekIntegrations.createManager({ load, save })` adds storage, keeps saved secrets when a field is
left blank, and returns a `list()` that never includes secrets. Tests:
`node --test shared/integrations/keek-integrations.test.js`.
