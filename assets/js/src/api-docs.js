var apiDocs = (function () {
  'use strict';

  var init = function (endpointsData) {
    populateTemplate(endpointsData);
  };

  var populateTemplate = function (endpointsData) {
    CompileTemplate({
      path: 'assets/templates/api-docs.ejs',
      container: '#api-docs'
    }, endpointsData);
    populateExampleResponse(endpointsData);
    getResponseData(endpointsData);
  };

  var populateExampleResponse = function (endpointsData) {
    _.forEach(endpointsData, function (endpoint) {
      console.log('endpoint', endpoint);
      CompileTemplate({
        path: 'assets/templates/api-docs-example-response.ejs',
        container: '#api-docs-' + endpoint.name + ' .api-docs-example-response'
      });
    });
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
