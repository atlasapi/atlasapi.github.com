var ApiDocs = (function () {
  var apiData = [];

  var init = function () {
    // getEndpointData();
  };

  var getEndpointData = function () {
    $.ajax({
      url: '//atlas.metabroadcast.com/4/meta/endpoints.json',
      success: function (data) {
        _.forEach(data.endpoints, function (endpoint) {
          var endpointData = {
            description: endpoint.description,
            name: endpoint.name,
            operations: endpoint.operations,
            root: endpoint.root_path
          };
          getEndpointResponseData(endpoint.model_class_link, endpointData);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error({
          jqXHR: jqXHR,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
      }
    });
  };

  var getEndpointResponseData = function (modelClassUrl, endpointData) {
    endpointData.fields = [];
    $.ajax({
      url: modelClassUrl,
      success: function (data) {
        _.forEach(data.model_class.fields, function (field) {
          endpointData.fields.push({
            description: field.description,
            type: field.json_type,
            name: field.name
          });
        });
        getEndpointParametersAndAnnotations(endpointData);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error({
          jqXHR: jqXHR,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
      }
    });
  };

  var getEndpointParametersAndAnnotations = function (endpointData) {
    endpointData.parameters = [];
    $.ajax({
      url: 'assets/data/parameters.json',
      success: function (data) {
        _.forEach(data.endpoints, function (endpoint) {
          if (_.isMatch(endpoint, { name: endpointData.name })) {
            endpointData.annotations = endpoint.annotations;
            _.forEach(endpoint.parameters, function (parameter) {
              endpointData.parameters.push({
                name: parameter.name,
                type: parameter.type,
                description: parameter.description
              });
            });
          }
        });
        console.log('woohoo', endpointData);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error({
          jqXHR: jqXHR,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
      }
    });
  };

  return {
    init: init
  };
})();

var anExampleEndpoint = {
  name: 'String',
  description: 'String',
  root: 'String',
  operations: [
    {
      method: 'String',
      path: 'String'
    }
  ],
  fields: [
    {
      name: 'String',
      description: 'String',
      type: 'String'
    }
  ],
  parameters: [
    {
      name: 'String',
      type: 'String',
      description: 'String'
    }
  ],
  annotations: []
};
