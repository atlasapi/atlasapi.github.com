var handleLoggedInStatus = (function () {
  'use strict';

  var loadUserDataTemplate = function (userData) {
    loadTemplate({
      templatePath: '../templates/logged-in.ejs',
      templateContainer: '#navbar-tools'
    }, userData);
    if (userData.role) {
      userData.role.forEach(function(role) {
        if (role.id === 'admins') {
          loadTemplate({
            templatePath: '../templates/admin-menu.ejs',
            templateContainer: '#admin-menu'
          });
        }
      });
    }
  };

  var sortApplicationsByDateDescending = function (data) {
    data.applications.sort(function (a, b) {
      a = new Date(a.created);
      b = new Date(b.created);
      return a > b ? -1 : a < b ? 1 : 0;
    });
    return data;
  };

  var loadApplicationsTemplate = function () {
    loadTemplate({
      templatePath: '../templates/apps-menu.ejs',
      templateContainer: '#apps-menu'
    });
  };

  var loadGroupsTemplate = function (data) {
    var groupsData = {
      admin: false,
      youview: false,
      blackout: false
    };
    data.role.forEach(function(role) {
      if (role.id === 'admins') {
        groupsData.admin = true;
      }

      if (role.id === 'bt-blackout') {
        groupsData.blackout = true;
      }

      if (role.id === 'youview-feeds') {
        groupsData.youview = true;
      }
    });
    loadTemplate({
      templatePath: '../templates/content-menu.ejs',
      templateContainer: '#content-menu'
    }, groupsData);
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
    $('#sub-nav').append(template);
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
      var credentials = atlasUser.getCredentials();
      loadNavigationTemplate();
      $.ajax({
        url: 'https://admin-backend.metabroadcast.com/1/user',
        headers: {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        },
        success: function(user) {
          console.log(user);
          loadApplicationsTemplate();
          loadUserDataTemplate(user);
          loadGroupsTemplate(user);
        },
        error: function(error) {
          console.error(error);
        }
      });
      events();
    } else {
      loadTemplate({
        templatePath: '../templates/logged-out.ejs',
        templateContainer: '#navbar-tools'
      });
    }
  }
})();
