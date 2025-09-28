chrome.action.onClicked.addListener((tab) => {
  try {
    chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: "sidepanel.html",
      enabled: true
    });

    chrome.sidePanel.open({ tabId: tab.id });
  } catch (err) {
    console.warn("Side panel failed, falling back to popup:", err);

    chrome.windows.create({
      url: chrome.runtime.getURL("sidepanel.html"),
      type: "popup",
      width: 300,
      height: 400
    });
  }
});