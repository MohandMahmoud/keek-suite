// KEEK content script — runs on Meet / Zoom web / Teams web.
// Reads ONLY the page title, the meeting address (query string removed, so passcodes are never read)
// and whether a call looks active. It never reads chat, participants or audio.
(() => {
  const host = location.hostname;
  const platform = host.includes('meet.google') ? 'meet' : host.includes('zoom.us') ? 'zoom' : host.includes('teams') ? 'teams' : 'other';

  function info() {
    let title = (document.title || '').trim();
    let inCall = false;
    if (platform === 'meet') {
      title = title.replace(/^Meet\s*[-–—:]\s*/i, '').replace(/\s*[-–—]\s*Google Meet$/i, '').trim();
      inCall = /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(location.pathname);
      if (inCall && /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(title)) title = 'Google Meet ' + title;
    } else if (platform === 'zoom') {
      title = title.replace(/\s*[-|–]\s*Zoom.*$/i, '').trim();
      inCall = /\/wc\/|\/j\/|\/s\//.test(location.pathname);
    } else if (platform === 'teams') {
      title = title.replace(/\s*\|\s*Microsoft Teams.*$/i, '').replace(/^\(\d+\)\s*/, '').trim();
      inCall = !!document.querySelector('[data-tid="call-hangup"], #hangup-button, button[aria-label*="Leave" i], [data-tid="hangup-main-btn"]');
    }
    return { platform, title: title.slice(0, 200), url: location.origin + location.pathname, inCall };
  }

  let last = '';
  function report() {
    const i = info(), k = JSON.stringify(i);
    if (k === last) return;
    last = k;
    try { chrome.runtime.sendMessage({ type: 'keek:meeting', info: i }); } catch (e) { /* extension reloaded */ }
  }
  report();
  const titleEl = document.querySelector('title');
  if (titleEl) new MutationObserver(() => setTimeout(report, 300)).observe(titleEl, { childList: true, characterData: true, subtree: true });
  setInterval(report, 5000); // SPA navigations and call state changes
})();
