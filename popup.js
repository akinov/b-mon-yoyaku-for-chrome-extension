
$(function(){

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
});
