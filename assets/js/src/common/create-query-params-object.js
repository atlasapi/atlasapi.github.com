var createQueryParamsObject = (function () {
  'use strict';

  return function (url) {
    var queryParameters = {};
    var queryString = url.split('?');
    queryString = queryString[1];
    var queryStringArray = queryString.split('&');
    _.forEach(queryStringArray, function (queryParameter) {
      queryParameter = queryParameter.split('=');
      queryParameters[queryParameter[0]] = queryParameter[1];
    });
    return queryParameters;
  }
})();