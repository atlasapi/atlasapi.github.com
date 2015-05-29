var loginToAdmin = (function () {
  'use strict';
  
  return function () {
    var url;
    if (MBST.ENV === 'stage' || window.location.href.indexOf('stage') !== -1) {
      url = '//stage.atlas.metabroadcast.com/4/auth/providers.json';
    } else {
      url = 'https://atlas.metabroadcast.com/4/auth/providers.json';
    }
    $.ajax({
      url: url,
      success: function (data) {
        var str = '<div style="font-size: 16px; text-align: left;" class="mbl">Log in with one of the services below</div>',
          i,
          ii;
        if (data.auth_providers && data.auth_providers.length > 0) {
          for (i = 0, ii = data.auth_providers.length; i < ii; i += 1) {
            str += '<a href="https://atlas.metabroadcast.com/admin#/login/' + data.auth_providers[i].namespace + '" class="signInBtn btn-'+ data.auth_providers[i].namespace +'"><span class="fa fa-'+ data.auth_providers[i].namespace +'"></span>Sign In with '+ data.auth_providers[i].namespace +'</a>';
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
