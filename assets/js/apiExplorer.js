var ApiExplorer = function () {
  this.container = '#apiExplorerTabSection';
  this.endpointsUrl = '//stage.atlas.metabroadcast.com/4/meta/endpoints.json';
  this.endpointsParametersUrl = 'data/parameters.json';
  this.apiKey = 'c1e92985ec124202b7f07140bcde6e3f';
  this.queryUrl = '//stage.atlas.metabroadcast.com';
};

ApiExplorer.prototype.setApiKey = function (apiKey) {
  var apiExplorer = this,
      $apiKeyField = $('#customApiKey'),
      defaultApiKey = apiKey;

  $apiKeyField.on('change', function () {
    if ($apiKeyField.val() !== '') {
      apiExplorer.apiKey = $apiKeyField.val();
      apiExplorer.setContentQuery();
    } else {
      apiExplorer.apiKey = defaultApiKey;
      apiExplorer.setContentQuery();
    }
  });

  return apiExplorer.apiKey;
};

ApiExplorer.prototype.getData = function (url, callback) {
  var apiExplorer = this,
      dataResponse;

  $.ajax({
    url: url,
    dataType: 'json',
    async: false,
    success: function (data) {
      dataResponse = data;
    },
    error: function (err) {
      console.error('Unable to get data');
    }
  });

  return dataResponse;
};

ApiExplorer.prototype.mergeData = function () {
  var apiExplorer = this,
      endpoints = apiExplorer.getData(apiExplorer.endpointsUrl).endpoints,
      parameters = apiExplorer.getData(apiExplorer.endpointsParametersUrl).endpoints;

  for (var i = 0, ii = endpoints.length; i < ii; i++) {
    for (var j = 0, jj = parameters.length; j < jj; j++) {
      if (endpoints[i].name === parameters[j].name) {
        endpoints[i].parameters = parameters[j].parameters;
      }
    }
  }

  return endpoints;
};

ApiExplorer.prototype.init = function () {
  var apiExplorer = this;

  apiExplorer.mergeData();
};
