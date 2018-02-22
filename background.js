var checkInterval = null;
var completeInterval = null;
var currentTab = null;

chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.startsWith('https://www.b-monster.jp')) {
    currentTab = tab;
    chrome.browserAction.setPopup({ "popup": "popup.html" });
  } else {
    alert('b-monster の予約画面を開いてください');
  }
});

// content.jsからのMessageリスナー
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // content.jsから
    if (request.greeting == "checkComplete") {
      // バッグの選択完了
      clearInterval(checkInterval);
      completeInterval = setInterval(completeReserve, 1000);
    }
    else if (request.greeting == "reserveComplete") {
      // 予約完了
      stopReserve();
    }
    else if (request.greeting == "moveComplete") {
      // 移動完了
      stopReserve();
    }
    // popup.jsから
    else if (request.greeting == "startReserve") {
      // 予約開始
      startReserve();
    }
    else if (request.greeting == "stopReserve") {
      // 予約開始
      stopReserve();
    }
    else {
      console.log(request);
    }
  }
);

function startReserve() {
  chrome.tabs.sendMessage(currentTab.id, { actionName: "loadSelectedIds" });

  if (currentTab.url.match(/move/)) {
    checkInterval = setInterval(checkMove, 3000);
  } else {
    checkInterval = setInterval(checkReserve, 3000);
  }
  chrome.browserAction.setIcon({ path: "icon_on.png" });
}

function stopReserve() {
  clearInterval(checkInterval);
  clearInterval(completeInterval);
  chrome.browserAction.setIcon({ path: "icon_off.png" });
  chrome.storage.local.set({ 'working': false });
}

function checkMove() {
  chrome.tabs.sendMessage(currentTab.id, { actionName: "checkMove" });
}

function checkReserve() {
  chrome.tabs.sendMessage(currentTab.id, { actionName: "checkReserve" });
}

function completeReserve() {
  chrome.tabs.sendMessage(currentTab.id, { actionName: "completeReserve" });
}
