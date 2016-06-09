var atlasUser = (function () {
  'use strict';

  var isLoggedIn = function () {
    return localStorage.getItem('auth.token') ? true : false;
  };

  var getCredentials = function () {
    return Cookies.get('iPlanetDirectoryPro') ? true : false;
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
