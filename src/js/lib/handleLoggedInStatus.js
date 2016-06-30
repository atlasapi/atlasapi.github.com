var handleLoggedInStatus = (function () {
  'use strict';

  var loadUserDataTemplate = function (data) {
    var template = Handlebars.compile($('#logged-in-template').html());
    $('#navbar-tools').html(template(data));
    data.role.forEach(function(role) {
      if (role.id === 'admins') {
        var adminTemplate = Handlebars.compile($('#admin-menu-template').html());
        $('#admin-menu').html(adminTemplate());
      }
    });
    loadGroupsTemplate(data);
  };

  var loadApplicationsTemplate = function (data) {
    var template = Handlebars.compile($('#apps-menu-template').html());
    $('#apps-menu').html(template(data));
  };

  var loadGroupsTemplate = function (data) {
    var groups = [];
    if (data.role) {
      data.role.forEach(function (role) {
        if (role.id === 'bt-blackout' || role.id === 'admins') {
          groups.push({
            title: 'EPG',
            url: '/admin?#/epg/bt-tv'
          });
        }
        if (role.id === 'youview-feeds' || role.id === 'admins') {
          groups.push({
            title: 'Feeds',
            url: '/admin?#/feeds'
          });
        }
      });

      if (groups.length) {
        var template = Handlebars.compile($('#content-menu-template').html());
        $('#content-menu').html(template(groups));
      }
    }
  };

  var loadNavigationTemplate = function () {
    var template = Handlebars.compile($('#user-navigation-template').html());
    $('.sub-nav').append(template());
  };

  var logout = function () {
    if (window.location.host === 'dev.mbst.tv') {
      Cookies.remove('iPlanetDirectoryPro', {
        path: '/'
      });
    } else {
      Cookies.remove('iPlanetDirectoryPro', {
        path: '/',
        domain: 'metabroadcast.com'
      });
    }
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

  var events = function () {
    handleClick('.logout', logout);
    handleClick('.has-dropdown-menu > a', toggleDropDownMenu);
    $(':not(.dropdown-menu)').on('click', function (e) {
      $('.dropdown-menu').hide();
    });
  };

  return function () {
    if (atlasUser.isLoggedIn()) {
      var authCookie = atlasUser.getCredentials();
      loadNavigationTemplate();
      atlasUser.getUserData('https://admin-backend.metabroadcast.com/1/user', authCookie, loadUserDataTemplate);
      loadApplicationsTemplate();
      events();
    } else {
      var hostName = window.location.hostname;
      var referrerUrl;
      if (hostName === 'atlas.metabroadcast.com') {
        referrerUrl = 'https://atlas.metabroadcast.com';
      } else {
        referrerUrl = 'https://atlas-stage.metabroadcast.com';
      }
      var template = Handlebars.compile($('#logged-out-template').html());
      $('#navbar-tools').html(template({ referrerUrl: referrerUrl }));
    }
  }
})();
