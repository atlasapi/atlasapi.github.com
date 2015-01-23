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

  function getDataAndLoadTemplate(url, templateInfo) {
    $.ajax({
      url: url,
      success: function (data) {
        console.log(data);
        loadTemplate({
          templatePath: templateInfo.templatePath,
          templateContainer: templateInfo.templateContainer
        }, data)
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

    $('.has-dropdown').not($this).removeClass('active-link');
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

      getDataAndLoadTemplate('http://stage.atlas.metabroadcast.com/4/auth/user.json?' + credentialsQueryString, {
        templatePath: 'assets/templates/logged-in.ejs',
        templateContainer: '#navbar-tools'
      });

      getDataAndLoadTemplate('http://stage.atlas.metabroadcast.com/4/applications.json?' + credentialsQueryString, {
        templatePath: 'assets/templates/apps-menu.ejs',
        templateContainer: '#apps-menu'
      });

      getDataAndLoadTemplate('http://atlas-admin-backend.stage.metabroadcast.com/api/user/groups?' + credentialsQueryString, {
        templatePath: 'assets/templates/content-menu.ejs',
        templateContainer: '#content-menu'
      });

      loadTemplate({
        templatePath: 'assets/templates/admin-menu.ejs',
        templateContainer: '#admin-menu'
      });

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
