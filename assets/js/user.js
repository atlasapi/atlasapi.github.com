var user = (function () {
  'use strict';

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
        loadTemplate('assets/templates/logged-in.ejs', '#navbar-tools', data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  function getApplicationsData() {
    var credentials = getCredentials();

    $.ajax({
      url: 'http://stage.atlas.metabroadcast.com/4/applications.json?oauth_provider=' + credentials.authProvider + '&oauth_token=' + credentials.authToken,
      success: function (data) {
        loadTemplate('assets/templates/apps-menu.ejs', '#apps-menu', data);
        console.log(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  function loadTemplate(templatePath, templateContainer, data) {
    var data = data || {},
        template;

    template = new EJS({
      url: templatePath
    }).render(data);

    $(templateContainer).html(template);
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
      getApplicationsData();
    } else {
      loadTemplate('assets/templates/logged-out.ejs', '#navbar-tools');
    }

    events();
  }

  return {
    init: init
  };
})();
