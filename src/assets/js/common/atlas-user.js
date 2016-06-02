var atlasUser = (function () {
  'use strict';

  var isLoggedIn = function () {
    return Cookies.get('iPlanetDirectoryPro') ? true : false;
  };

  var getCredentials = function () {
    return {
      oauth_provider: localStorage.getItem('auth.provider'),
      oauth_token: localStorage.getItem('auth.token')
    };
  };

  var getUserData = function (callback) {
    $.ajax({
      url: 'https://admin-backend.metabroadcast.com/1/user',
      headers: {
        iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
      },
      success: function(user) {
        callback(user);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        log.error(errorThrown);
      }
    });
  };

  return {
    isLoggedIn: isLoggedIn,
    getCredentials: getCredentials,
    getUserData: getUserData
  };
})();
