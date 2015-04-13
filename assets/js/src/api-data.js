var apiData = (function () {
  'use strict';

  var getEndpointsData = function (callback) {
    $.ajax({
      url: '//atlas.metabroadcast.com/4/meta/endpoints.json',
      success: function (data) {
        getLocalData(data.endpoints, callback);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  };

  var getLocalData = function (endpointsData, callback) {
    $.ajax({
      url: 'assets/data/local-data.json',
      success: function (data) {
        mergeData(endpointsData, data.endpoints, callback);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  };

  var mergeData = function (endpointsData, localData, callback) {
    _.forEach(endpointsData, function (endpoint) {
      _.forEach(localData, function (local) {
        if (endpoint.name === local.name) {
          endpoint.parameters = local.parameters;
          endpoint.annotations = local.annotations;
          endpoint.service_level = local.service_level;
          endpoint.error_messages = local.error_messages;
        }
      });
    });
    callback(endpointsData);
  };

  return {
    init: getEndpointsData
  };
})();
