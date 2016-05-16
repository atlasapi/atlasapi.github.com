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

  var getUserData = function (url, callback) {
    $.ajax({
      url: url,
      success: function (data) {
        callback(data);
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
