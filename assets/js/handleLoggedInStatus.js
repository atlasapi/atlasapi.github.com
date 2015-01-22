var handleLoggedInStatus = (function () {
  'use strict';

  function userLoggedIn() {
    return localStorage.getItem ? true : false;
  }

  function getCredentials() {
    return {
      oauth_provider: localStorage.getItem('auth.provider'),
      oauth_token: localStorage.getItem('auth.token')
    };
  }

  function encodeQueryData(data) {
    var queryData = [];

    for (var parameter in data) {
      queryData.push(encodeURIComponent(parameter) + '=' + encodeURIComponent(data[parameter]));
    }

    return queryData.join('&');
  }

  function getDataAndLoadTemplate(url, template) {
    $.ajax({
      url: url,
      success: function (data) {
        loadTemplate(template.templatePath, template.templateContainer, data)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  function getGroupsData() {
    var credentials = getCredentials(),
        credentialsQueryString = encodeQueryData(credentials);

    $.ajax({
      url: 'http://atlas-admin-backend.stage.metabroadcast.com/api/user/groups?' + credentialsQueryString,
      success: function (data) {
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
    loadTemplate('assets/templates/logged-out.ejs', '#navbar-tools');
  }

  function toggleUserMenu() {
    $('.user-dropdown-menu').toggleClass('hide');
  }

  function handleClick(element, callback) {
    $(document).on('click', element, function (e) {
      e.preventDefault();
      callback();
    });
  }

  function events() {
    handleClick('.logout', logout);
    handleClick('.navbar-user', toggleUserMenu);
  }

  function init() {
    if (userLoggedIn()) {
      var credentials = getCredentials(),
          credentialsQueryString = encodeQueryData(credentials);

      getDataAndLoadTemplate('http://stage.atlas.metabroadcast.com/4/auth/user.json?' + credentialsQueryString, {
        templatePath: 'assets/templates/logged-in.ejs',
        templateContainer: '#navbar-tools'
      });

      getDataAndLoadTemplate('http://stage.atlas.metabroadcast.com/4/applications.json?' + credentialsQueryString, {
        templatePath: 'assets/templates/apps-menu.ejs',
        templateContainer: '#apps-menu'
      });

      getGroupsData();
      events();
    } else {
      loadTemplate('assets/templates/logged-out.ejs', '#navbar-tools');
    }
  }

  return init();
})();
