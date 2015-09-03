$(function () {

  // Make final section full height so highlighting works
  $('#about').css('min-height', $(window).height() - 100);

  // Initiate popovers for examples section
  popovers();

  // Trigger login
  $(document).on('click', '.getApiKeyBtn', function (e) {
    e.preventDefault();
    loginToAdmin();
  });

  // Show if user is logged in or not
  handleLoggedInStatus();

  // Grabs api documentation data
  apiData.init(function (data) {
    // Populates api docs submenu
    var apiDocsSubmenu = new EJS({
      url: '../templates/api-docs-submenu'
    }).render(data);
    $('#api-docs-submenu').html(apiDocsSubmenu);

    // Initiate submenu behaviour
    submenus();
  });

  // Select text on click
  $(document).on('click', '.js-select-on-click', function () {
    $(this).select();
  });
  $(document).on('click', '.code-example', function () {
    $(this).selectText();
  });
});

$(window).load(function () {
  // Initiate navigation highlighting
  highlightCurrentPage.init();

  // Initiated now next widget
  var nowNextLater = new NowNextLater();
  nowNextLater.init();
});
