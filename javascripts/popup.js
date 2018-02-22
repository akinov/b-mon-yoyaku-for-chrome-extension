
$(function(){
  // 実行中か確認
  chrome.storage.local.get('working', function(items) {
    if (items.working) {
      $('#reserveStart').prop('disabled', true);
      $('#reserveStop').prop('disabled', false);
    }
  });

  // 選択済みバッグに.selected付与
  chrome.storage.local.get('selectedIds', function(items) {
    if (items.selectedIds) {
      $('label').each(function() {
        if (items.selectedIds.includes($(this).text())) {
          $(this).addClass('selected');
        }
      });
    }
  });

  // バッグがクリックされた時
  $('label').on('click', function() {
    // .selectedを付け替える
    $(this).toggleClass('selected');

    // 選択済みバッグIDをまとめる
    var selectedIds = [];
    $('label.selected').each(function(){
      selectedIds.push($(this).text());
    });

    // localストレージに登録
    chrome.storage.local.set({ 'selectedIds': selectedIds });
  });

  $reserveStart = $('#reserveStart').on('click', function(){
    $reserveStart.prop('disabled', true);
    $reserveStop.prop('disabled', false);
    chrome.storage.local.set({ 'working': true });
    chrome.runtime.sendMessage({ greeting: "startReserve" });
  });

  $reserveStop = $('#reserveStop').on('click', function(){
    $reserveStart.prop('disabled', false);
    $reserveStop.prop('disabled', true);
    chrome.storage.local.set({ 'working': false });
    chrome.runtime.sendMessage({ greeting: "stopReserve" });
  });
});
