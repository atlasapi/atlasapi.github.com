var encodeQueryData = (function () {
  'use strict';
  
  return function (data) {
    var queryData = [];
    for (var parameter in data) {
      queryData.push(encodeURIComponent(parameter) + '=' + encodeURIComponent(data[parameter]));
    }
    return queryData.join('&');
  }
})();