var atlasUser = (function () {
  'use strict';

  var isLoggedIn = function () {
    return Cookies.get('iPlanetDirectoryPro') ? true : false;
  };

  var getCredentials = function () {
    return Cookies.get('iPlanetDirectoryPro');
  };

  var getUserData = function (url, authCookie, callback) {
    $.ajax({
      url: url,
      headers: {
        iPlanetDirectoryPro: authCookie
      },
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
