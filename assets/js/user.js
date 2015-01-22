var user = (function () {
  'use strict';

  var loggedInTemplatePath = 'assets/templates/logged-in.ejs',
      loggedOutTemplatePath = 'assets/templates/logged-out.ejs';

  function getCredentials() {
    return {
      authProvider: localStorage.getItem('auth.provider'),
      authToken: localStorage.getItem('auth.token')
    };
  }

  function userLoggedIn() {
    if (localStorage.getItem('auth.token')) {
      return true;
    } else {
      return false;
    }
  }

  function loggedInStatus(templatePath, userData) {
    var template;

    if (userData) {
      template  = new EJS({
        url: templatePath
      }).render(userData);
    } else {
      template = new EJS({
        url: templatePath
      }).render();
    }

    $('#navbar-tools').html(template);
  }

  function getUserData() {
    var credentials = getCredentials();

    $.ajax({
      url: 'http://stage.atlas.metabroadcast.com/4/auth/user.json?oauth_provider=' + credentials.authProvider + '&oauth_token=' + credentials.authToken,
      success: function (data) {
        loggedInStatus(loggedInTemplatePath, data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  function logout() {
    localStorage.removeItem('auth.provider');
    localStorage.removeItem('auth.token');
    loggedInStatus(loggedOutHeaderTemplatePath);
  }

  function toggleUserMenu() {
    $('.user-dropdown-menu').toggleClass('hide');
  }

  function events() {
    $(document).on('click', '.logout', function (e) {
      e.preventDefault();
      logout();
    });

    $(document).on('click', '.navbar-user', function (e) {
      e.preventDefault();
      toggleUserMenu();
    });
  }

  function init() {
    if (userLoggedIn()) {
      getUserData();
    } else {
      loggedInStatus(loggedOutTemplatePath);
    }

    events();
  }

  return {
    init: init
  };
})();
