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

    // Initiate api docs if on page
    if ($('#api-docs').length) {
      apiDocs.init(data);

      $(document).on('click', '.api-docs-submenu-link a', function (e) {
        var target = $(this).attr('href');
        target = target.split('#');
        target = target[1];
        $('.ui-tabs-nav').find('a[href="#' + target + '"]').trigger('click');
      });
    }

    // Initiate api explorer if on page
    if ($('#apiExplorer').length) {
      apiExplorer.init(data);

      $('.navbar-api-explorer-btn').on('click', function (e) {
        e.preventDefault();
        $(window).scrollTop($('#apiExplorer').offset().top - 100);
        if (history.pushState) {
          history.pushState(null, null, '#apiExplorer');
        }
      });
    }

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
  // highlightCurrentPage.init();
  $('.sub-nav').onePageNav({
    currentClass: 'selected',
    changeHash: true,
    scrollSpeed: 200
  });

  if (window.location.hash) {
    var target = window.location.hash;
    $('.sub-nav').find('a[href=' + target + ']').trigger('click');
  }

  // Initiate tabs if api docs and explorer are present
  if ($('#api-docs').length && $('#apiExplorer').length) {
    uiTabs();
  }

  // Initiated now next widget
  var nowNextLater = new NowNextLater();
  nowNextLater.init();
});
