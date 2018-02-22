var active = false;
var checkInterval = null;
var completeInterval = null;
var tabId = null;

chrome.browserAction.onClicked.addListener(function(tab) {
  tabId = tab.id;
  // chrome.browserAction.setPopup({ "popup": "popup.html" });
  // return false;

  if (active) {
    active = false;
    clearInterval(checkInterval);
    clearInterval(completeInterval);
    chrome.browserAction.setIcon({path: "icon_off.png"});
  } else {
    active = true;
    if (tab.url.match(/move/)) {
      checkInterval = setInterval(checkMove, 3000);
    } else {
      checkInterval = setInterval(checkReserve, 3000);
    }
    chrome.browserAction.setIcon({path: "icon_on.png"});
  }
});

// content.jsからのMessageリスナー
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "checkComplete") {
      // バッグの選択完了
      clearInterval(checkInterval);
      completeInterval = setInterval(completeReserve, 1000);

    } else if  (request.greeting == "reserveComplete") {
      // 予約完了
      clearInterval(completeInterval);
    } else {
      console.log(request);
    }
  }
);

function checkMove() {
  chrome.tabs.sendMessage(tabId, { actionName: "checkMove" });
}

function checkReserve() {
  chrome.tabs.sendMessage(tabId, { actionName: "checkReserve" });
}

function completeReserve() {
  chrome.tabs.sendMessage(tabId, { actionName: "completeReserve" });
}
