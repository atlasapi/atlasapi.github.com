var ApiDocs = (function () {
  'use strict';

  var init = function (endpointsData) {
    populateTemplate(endpointsData);
  };

  var compileTemplate = function (data, template) {
    var compiledTemplate = new EJS({
      url: template.path
    }).render(data);
    $(template.container).html(compiledTemplate);
  };

  var populateTemplate = function (endpointsData) {
    compileTemplate(endpointsData, {
      path: 'assets/templates/api-docs.ejs',
      container: '#api-docs'
    });
    getResponseData(endpointsData);
  };

  var getResponseData = function (endpointsData) {
    _.forEach(endpointsData, function (endpoint) {
      $.ajax({
        url: endpoint.model_class_link,
        success: function (data) {
          console.log(data);
          compileTemplate(data.model_class, {
            path: 'assets/templates/api-docs-response.ejs',
            container: '#api-docs-response'
          });
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
