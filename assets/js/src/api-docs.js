$(function () {
  $('.api-docs-nav .menu-item').each(function (index, link) {
    $(link).on('click', function (e) {
      e.preventDefault();
      var panelId = $(link).attr('href');
      $('.api-docs-nav .menu-item').removeClass('menu-item-selected');
      $(link).addClass('menu-item-selected');
      $('.api-docs-panel').hide();
      $(panelId).show();
    });
  });
});
