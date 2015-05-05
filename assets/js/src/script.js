$(function () {

  $('section:not(.subSection):last-child').css('min-height', $(window).height() - 100);

  popovers();

  $(document).on('click', '.getApiKeyBtn', function (e) {
    e.preventDefault();
    loginToAdmin();
  });

  handleLoggedInStatus();

  apiData.init(function (data) {
    var compiledTemplate = new EJS({
      url: 'assets/templates/api-docs-submenu.ejs'
    }).render(data);
    $('#api-docs-submenu').html(compiledTemplate);
    apiExplorer.init(data);
    apiDocs.init(data);
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
  uiTabs.init();
  highlightCurrentPage.init();
  var nowNextLater = new NowNextLater();
  nowNextLater.init();
});
