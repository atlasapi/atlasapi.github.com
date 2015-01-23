var handleLoggedInStatus = (function () {
  'use strict';

  function userLoggedIn() {
    return localStorage.getItem('auth.token') ? true : false;
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

  function getUserDataAndLoadTemplate(url) {
    $.ajax({
      url: url,
      success: function (data) {
        loadTemplate({
          templatePath: 'assets/templates/logged-in.ejs',
          templateContainer: '#navbar-tools'
        }, data);
        if (data.user.role === 'admin') {
          loadTemplate({
            templatePath: 'assets/templates/admin-menu.ejs',
            templateContainer: '#admin-menu'
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  function getApplicationsDataAndLoadTemplate(url) {
    $.ajax({
      url: url,
      success: function (data) {
        loadTemplate({
          templatePath: 'assets/templates/apps-menu.ejs',
          templateContainer: '#apps-menu'
        }, data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  function getGroupsDataAndLoadTemplate(url) {
    $.ajax({
      url: url,
      success: function (data) {
        if (data.length) {
          loadTemplate({
            templatePath: 'assets/templates/content-menu.ejs',
            templateContainer: '#content-menu'
          }, data);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  function loadTemplate(templateInfo, data) {
    var data = data || {},
        template;

    template = new EJS({
      url: templateInfo.templatePath
    }).render(data);

    $(templateInfo.templateContainer).html(template);
  }

  function logout() {
    localStorage.removeItem('auth.provider');
    localStorage.removeItem('auth.token');
    loadTemplate({
      templatePath: 'assets/templates/logged-out.ejs',
      templateContainer: '#navbar-tools'
    });
  }

  function toggleDropDownMenu($this) {
    var $targetMenu = $this.find('.dropdown-menu');

    $('.dropdown-menu').not($targetMenu).hide();
    $targetMenu.toggle();

    $('.has-dropdown-menu').not($this).removeClass('active-link');
    $this.toggleClass('active-link');
  }

  function handleClick(element, callback) {
    $(document).on('click', element, function (e) {
      e.preventDefault();
      callback($(this));
    });
  }

  function events() {
    handleClick('.logout', logout);
    handleClick('.has-dropdown-menu', toggleDropDownMenu);
  }

  function init() {
    if (userLoggedIn()) {
      var credentials = getCredentials(),
          credentialsQueryString = encodeQueryData(credentials);

      getUserDataAndLoadTemplate('http://stage.atlas.metabroadcast.com/4/auth/user.json?' + credentialsQueryString);
      getApplicationsDataAndLoadTemplate('http://stage.atlas.metabroadcast.com/4/applications.json?' + credentialsQueryString);
      getGroupsDataAndLoadTemplate('http://atlas-admin-backend.stage.metabroadcast.com/api/user/groups?' + credentialsQueryString);

      events();
    } else {
      loadTemplate({
        templatePath: 'assets/templates/logged-out.ejs',
        templateContainer: '#navbar-tools'
      });
    }
  }

  return init;
})();
