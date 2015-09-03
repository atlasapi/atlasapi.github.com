var handleLoggedInStatus = (function () {
  'use strict';

  var loadUserDataTemplate = function (data) {
    loadTemplate({
      templatePath: '../templates/logged-in.ejs',
      templateContainer: '#navbar-tools'
    }, data);
    if (data.user.role === 'admin') {
      loadTemplate({
        templatePath: '../templates/admin-menu.ejs',
        templateContainer: '#admin-menu'
      });
    }
    loadUserPhoto();
  };

  var sortApplicationsByDateDescending = function (data) {
    data.applications.sort(function (a, b) {
      a = new Date(a.created);
      b = new Date(b.created);
      return a > b ? -1 : a < b ? 1 : 0;
    });
    return data;
  };

  var loadApplicationsTemplate = function (data) {
    data = sortApplicationsByDateDescending(data);
    loadTemplate({
      templatePath: '../templates/apps-menu.ejs',
      templateContainer: '#apps-menu'
    }, data);
  };

  var loadGroupsTemplate = function (data) {
    if (data.length) {
      loadTemplate({
        templatePath: '../templates/content-menu.ejs',
        templateContainer: '#content-menu'
      }, data);
    }
  };

  var loadTemplate = function (templateInfo, data) {
    var data = data || {},
        template;
    template = new EJS({
      url: templateInfo.templatePath
    }).render(data);
    $(templateInfo.templateContainer).html(template);
  };

  var loadNavigationTemplate = function () {
    var template = new EJS({
      url: '../templates/user-navigation.ejs'
    }).render();
    $('#nav-main').append(template);
  };

  var logout = function () {
    localStorage.removeItem('auth.provider');
    localStorage.removeItem('auth.token');
    loadTemplate({
      templatePath: '../templates/logged-out.ejs',
      templateContainer: '#navbar-tools'
    });
    $('.user-menu').each(function () {
      $(this).empty();
    });
  };

  var toggleDropDownMenu = function ($this) {
    var $targetMenu = $this.siblings('.dropdown-menu');
    $('.dropdown-menu').not($targetMenu).hide();
    $('.submenu').hide();
    $targetMenu.toggle();
    $('.has-dropdown-menu').not($this).removeClass('active-link');
    $this.toggleClass('active-link');
  };

  var handleClick = function (element, callback) {
    $(document).on('click', element, function (e) {
      e.preventDefault();
      callback($(this));
    });
  };

  var loadUserPhoto = function () {
    var $userPhoto = $('.profile-picture'),
        imageUrl = $userPhoto.data('src');
    $userPhoto.attr('src', imageUrl);
  };

  var events = function () {
    handleClick('.logout', logout);
    handleClick('.has-dropdown-menu > a', toggleDropDownMenu);
    $(':not(.dropdown-menu)').on('click', function (e) {
      $('.dropdown-menu').hide();
    });
  };

  return function () {
    if (atlasUser.isLoggedIn()) {
      var credentials = atlasUser.getCredentials(),
          credentialsQueryString = encodeQueryData(credentials);
      loadNavigationTemplate();
      atlasUser.getUserData('https://atlas.metabroadcast.com/4/auth/user.json?' + credentialsQueryString, loadUserDataTemplate);
      atlasUser.getUserData('https://atlas.metabroadcast.com/4/applications.json?' + credentialsQueryString, loadApplicationsTemplate);
      atlasUser.getUserData('//atlas-admin-backend.metabroadcast.com/api/user/groups?' + credentialsQueryString, loadGroupsTemplate);
      events();
    } else {
      loadTemplate({
        templatePath: '../templates/logged-out.ejs',
        templateContainer: '#navbar-tools'
      });
    }
  }
})();
