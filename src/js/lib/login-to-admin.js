var loginToAdmin = (function () {
  'use strict';

  return function () {
    var url;
    if (MBST.ENV === 'stage' || window.location.href.indexOf('stage') !== -1 || window.location.href.indexOf('dev') !== -1) {
      url = 'http://stage.atlas.metabroadcast.com/4/auth/providers.json';
    } else {
      url = 'https://atlas.metabroadcast.com/4/auth/providers.json';
    }

    $.ajax({
      url: url,
      success: function (data) {
        var str = '<h3>Log in with one of the services below</h3>',
          i,
          ii;
        if (data.auth_providers && data.auth_providers.length > 0) {
          for (i = 0, ii = data.auth_providers.length; i < ii; i += 1) {
            str += '<a href="//atlas.metabroadcast.com/admin#/login/' + data.auth_providers[i].namespace + '" class="signInBtn btn-'+ data.auth_providers[i].namespace +'"><span class="fa"></span>Sign In with '+ data.auth_providers[i].namespace +'</a>';
          }
        }
        str += '';
        $('.loginHolder').html(str);
        $('.loginWrapper').show().click(function () {
          $('.loginWrapper').hide();
        });
      }
    });
  }
})();
