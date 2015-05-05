var atlasUser = (function () {
  'use strict';
  
  var isLoggedIn = function () {
    return localStorage.getItem('auth.token') ? true : false;
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
        console.error(errorThrown);
      }
    });
  };
  
  return {
    isLoggedIn: isLoggedIn,
    getCredentials: getCredentials,
    getUserData: getUserData
  };
})();