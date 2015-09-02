$(function () {

  $('section:not(.subSection):last-child').css('min-height', $(window).height() - 100);

  popovers();

  $(document).on('click', '.getApiKeyBtn', function (e) {
    e.preventDefault();
    loginToAdmin();
  });

  handleLoggedInStatus();

  apiData.init(function (data) {
    submenus();
  });

  $(document).on('click', '.js-select-on-click', function () {
    $(this).select();
  });

  $(document).on('click', '.code-example', function () {
    $(this).selectText();
  });
});

$(window).load(function () {
  uiTabs();
  highlightCurrentPage.init();
  var nowNextLater = new NowNextLater();
  nowNextLater.init();
});
