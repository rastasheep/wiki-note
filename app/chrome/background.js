chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ url: chrome.extension.getURL('*') }, tabs => {
    if (tabs.length) {
      chrome.tabs.highlight({
        windowId: tabs[0].windowId,
        tabs: tabs[0].index,
      });
      return;
    }

    chrome.tabs.create({
      url: chrome.extension.getURL('index.html'),
    });
  });
});
