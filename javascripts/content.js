var selectedIds = [];

// background.jsからのMessageリスナー
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.actionName == "checkReserve") {
    loadSelectedIds(checkReserve);
  } else if (request.actionName == "checkMove") {
    loadSelectedIds(checkMove);
  } else if (request.actionName == "completeReserve") {
    completeReserve();
  }
});

function loadSelectedIds(callback) {
  chrome.storage.local.get('selectedIds', function(items) {
    if (items.selectedIds) {
      selectedIds = items.selectedIds;
    }
    callback();
  });
}

function checkReserve() {
  // 空いているサンドバッグ一覧を取得
  var $inputs = $('.bag-check>input:not(:disabled)');

  if ($inputs.length > 0 ) {

    var id = null;
    if (selectedIds.length > 0) {
      $inputs.each(function(){
        if (selectedIds.includes($(this).attr('id').slice(-2))) {
          id = $(this).attr('id').slice(-2);
          return false;
        }
      });
    } else {
      id = $inputs[0].id.slice(-2)
    }

    // bagIdをinputに入れる
    $('#your-reservation input[name=punchbag]').first().val(id);
    // 完了をbackgroundに通知
    chrome.runtime.sendMessage({greeting: "moveComplete"});
    // Submit
    $('button[data-action=reserveByCourse]').first().prop('disabled', false).click();
  } else {
    // 空きがない場合リロードする
    location.reload();
  }
}

function checkMove() {
  // 空いているサンドバッグ一覧を取得
  var $inputs = $('.bag-check>input:not(:disabled)');
  var wishedBagId = selectedIds;

  if (wishedBagId.length == 0) {
    wishedBagId = [
      "38", "39", "40", "41", "42",
      "50", "51", "52", "53",
      "63", "64", "65", "66", "67",
      "77", "78", "79", "80", "81",
      // "91", "92", "93", "94", "95", // 壁際除外
    ];
  }

  if ($inputs.length > 0 ) {
    var id = null;
    $inputs.each(function(){
      if (wishedBagId.includes($(this).attr('id').slice(-2))) {
        id = $(this).attr('id').slice(-2);
        return false;
      }
    });

    // 目的のバッグがない場合リロードして終了
    if (id == null) {
      location.reload();
      return false;
    }

    // 完了をbackgroundに通知
    chrome.runtime.sendMessage({ greeting: "moveComplete" });

    // bagIdをinputに入れる
    $('#your-reservation input[name=punchbag]').first().val(id);
    // Submit
    $('#your-reservation button[data-action=reserveMove]').first().prop('disabled', false).click();
  } else {
    // 空きがない場合リロードする
    location.reload();
  }
}

function completeReserve() {
  // サンドバッグ変更はreserveMove
  var $completeBtn = $('button[data-action=reserveComplete]');
  if ($completeBtn.length > 0 ) {
    // 完了をbackgroundに通知
    chrome.runtime.sendMessage({ greeting: "reserveComplete" });
    // Submit
    $completeBtn.first().click();
  }
}
