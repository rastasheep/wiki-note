chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ url: chrome.extension.getURL('*') }, tabs => {
    const appTab = tabs[0];
    if (tabs.length) {
      chrome.tabs.highlight({
        windowId: appTab.windowId,
        tabs: appTab.index,
      });
      chrome.windows.update(appTab.windowId, { focused: true });
      return;
    }

    chrome.tabs.query({ lastFocusedWindow: true, active: true }, activeTabs => {
      const currentTab = activeTabs[0];
      const url = chrome.extension.getURL('index.html');
      if (currentTab.url === 'chrome://newtab/') {
        chrome.tabs.update(currentTab.id, { url });
        return;
      }

      chrome.tabs.create({ url });
    });
  });
});
