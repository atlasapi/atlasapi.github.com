$(function () {
  $('.api-docs-nav-item a').each(function (index, link) {
    $(link).on('click', function (e) {
      e.preventDefault();
      var panelId = $(link).attr('href');
      $('.api-docs-nav-item a').removeClass('active-panel');
      $(link).addClass('active-panel');
      $('.api-docs-panel').hide();
      $(panelId).show();
    });
  });
});
