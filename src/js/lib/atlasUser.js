var atlasUser = (function () {
  'use strict';

  var isLoggedIn = function () {
    return Cookies.get('iPlanetDirectoryPro') ? true : false;
  };

  var getCredentials = function () {
    return Cookies.get('iPlanetDirectoryPro');
  };

  var getUserData = function (url, authCookie) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: url,
        headers: {
          iPlanetDirectoryPro: authCookie
        },
        success: function (data) {
          resolve(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          log.error(errorThrown);
          reject(errorThrown);
        }
      });
    });
  };

  return {
    isLoggedIn: isLoggedIn,
    getCredentials: getCredentials,
    getUserData: getUserData
  };
})();
