var apiData = (function () {
  'use strict';

  var getEndpointsData = function (callback) {
    $.ajax({
      url: 'https://atlas.metabroadcast.com/4/meta/resources.json',
      success: function (data) {
        getLocalData(data.resources, callback);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        log.error(errorThrown);
      }
    });
  };

  var getLocalData = function (endpointsData, callback) {
    $.ajax({
      url: '../data/local-data.json',
      success: function (data) {
        mergeData(endpointsData, data.resources, callback);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        log.error(errorThrown);
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
