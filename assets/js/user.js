var user = (function () {
  'use strict';

  var loggedInHeaderTemplatePath = 'assets/templates/header-logged-in.ejs',
      loggedOutHeaderTemplatePath = 'assets/templates/header-logged-out.ejs';

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

  function loadHeader(templatePath, userData) {
    var headerTemplate;

    if (userData) {
      headerTemplate  = new EJS({
        url: templatePath
      }).render(userData);
    } else {
      headerTemplate = new EJS({
        url: templatePath
      }).render();
    }

    $('#header').html(headerTemplate);
  }

  function getUserData() {
    var credentials = getCredentials();

    $.ajax({
      url: 'http://stage.atlas.metabroadcast.com/4/auth/user.json?oauth_provider=' + credentials.authProvider + '&oauth_token=' + credentials.authToken,
      success: function (data) {
        console.log(data);
        loadHeader(loggedInHeaderTemplatePath, data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  function logout() {
    localStorage.removeItem('auth.provider');
    localStorage.removeItem('auth.token');
    loadHeader(loggedOutHeaderTemplatePath);
  }

  function events() {
    $(document).on('click', '.logout', function (e) {
      e.preventDefault();
      logout();
    });
  }

  function init() {
    if (userLoggedIn()) {
      getUserData();
    } else {
      loadHeader(loggedOutHeaderTemplatePath);
    }

    events();
  }

  return {
    init: init
  };
})();
