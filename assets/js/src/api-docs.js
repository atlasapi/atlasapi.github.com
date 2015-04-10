var ApiDocs = (function () {
  'use strict';

  var init = function (endpointsData) {
    populateTemplate(endpointsData);
  };

  var populateTemplate = function (endpointsData) {
    CompileTemplate({
      path: 'assets/templates/api-docs.ejs',
      container: '#api-docs'
    }, endpointsData);
    getResponseData(endpointsData);
  };

  var getResponseData = function (endpointsData) {
    _.forEach(endpointsData, function (endpoint) {
      $.ajax({
        url: endpoint.model_class_link,
        success: function (data) {
          CompileTemplate({
            path: 'assets/templates/api-docs-response.ejs',
            container: '#api-docs-response'
          }, data.model_class);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(errorThrown);
        }
      });
    });
  };

  return {
    init: init
  };
})();
