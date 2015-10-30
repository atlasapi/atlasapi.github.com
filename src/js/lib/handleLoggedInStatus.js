var handleLoggedInStatus = (function () {
  'use strict';

  var loadUserDataTemplate = function (data) {
    var template = Handlebars.compile($('#logged-in-template').html());
    $('#navbar-tools').html(template(data));
    if (data.user.role === 'admin') {
      var adminTemplate = Handlebars.compile($('#admin-menu-template').html());
      $('#admin-menu').html(adminTemplate());
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
    var template = Handlebars.compile($('#apps-menu-template').html());
    $('#apps-menu').html(template(data));
  };

  var loadGroupsTemplate = function (data) {
    if (data.length) {
      data.forEach(function (group) {
        if (group.name === 'BTBlackout') {
          group.title = 'EPG';
          group.url = '/admin?#/epg/bt-tv';
        }
        if (group.name === 'BBC-YV-Feed') {
          group.title = 'Feeds';
          group.url = '/admin?#/feeds';
        }
        if (group.name === 'BBC-Scrubbables') {
          group.title = 'Scrubbables';
          group.url = '/admin?#/scrubbables';
        }
      });

      var template = Handlebars.compile($('#content-menu-template').html());
      $('#content-menu').html(template(data));
    }
  };

  var loadNavigationTemplate = function () {
    var template = Handlebars.compile($('#user-navigation-template').html());
    $('.sub-nav').append(template());
  };

  var logout = function () {
    localStorage.removeItem('auth.provider');
    localStorage.removeItem('auth.token');
    var template = Handlebars.compile($('#logged-out-template').html());
    $('#navbar-tools').html(template());
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
      var template = Handlebars.compile($('#logged-out-template').html());
      $('#navbar-tools').html(template());
    }
  }
})();
