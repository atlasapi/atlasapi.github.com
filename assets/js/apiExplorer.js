var ApiExplorer = function () {
  'use strict';

  this.endpointsUrl = '//stage.atlas.metabroadcast.com/4/meta/endpoints.json';
  this.endpointsParametersUrl = 'assets/data/parameters.json';
  this.defaultApiKey = 'c1e92985ec124202b7f07140bcde6e3f';
  this.queryUrl = '//atlas.metabroadcast.com';
  this.template = {
    path: 'assets/templates/apiExplorer.ejs',
    container: '#apiExplorerTabSections'
  };
};

ApiExplorer.prototype.getApiKey = function () {
  'use strict';

  var apiExplorer = this,
      $apiKeyInput = $('#apiKey'),
      apiKey;

  if ($apiKeyInput.val() !== '') {
    apiKey = $apiKeyInput.val();
  } else {
    apiKey = apiExplorer.defaultApiKey;
  }

  return apiKey;
};

ApiExplorer.prototype.getData = function (url) {
  'use strict';

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
  'use strict';

  var apiExplorer = this,
      endpoints = apiExplorer.getData(apiExplorer.endpointsUrl).endpoints,
      parameters = apiExplorer.getData(apiExplorer.endpointsParametersUrl).endpoints;

  for (var i = 0, ii = endpoints.length; i < ii; i++) {
    for (var j = 0, jj = parameters.length; j < jj; j++) {
      if (endpoints[i].name === parameters[j].name) {
        endpoints[i].parameters = parameters[j].parameters;
      }
    }

    endpoints[i].query_url = apiExplorer.buildQueryUrl(endpoints[i]);
  }

  return endpoints;
};

ApiExplorer.prototype.compileTemplate = function (data, template) {
  'use strict';

  var apiExplorer = this,
      compiledTemplate;

  compiledTemplate = new EJS({
    url: template.path
  }).render(data);

  $(template.container).html(compiledTemplate);
};

ApiExplorer.prototype.submitQueryForm = function () {
  'use strict';

  var apiExplorer = this;

  $('.queryForm').each(function () {
    var queryUrl = $(this).find('.queryUrl').val();

    $(this).on('submit', function (e) {
      e.preventDefault();

      var response = apiExplorer.getData(queryUrl),
          $jsonOutput = $(this).siblings('.queryResponse').find('.jsonOutput');

      $jsonOutput.html(JSON.stringify(response, undefined, 2));

      $jsonOutput.each(function(i, block) {
        hljs.highlightBlock(block);
      });
    });
  });
};

ApiExplorer.prototype.buildQueryUrl = function (endpoint) {
  'use strict';

  var apiExplorer = this,
      queryUrl = apiExplorer.queryUrl,
      apiKey = apiExplorer.getApiKey();

  queryUrl += endpoint.root_path + '.json';
  queryUrl += '?key=' + apiKey;

  for (var i = 0, ii = endpoint.parameters.length; i < ii; i++) {
    queryUrl += '&' + endpoint.parameters[i].name + '=' + endpoint.parameters[i].default_value;
  }

  return encodeURI(queryUrl);
};

ApiExplorer.prototype.init = function () {
  'use strict';

  var apiExplorer = this,
      data = apiExplorer.mergeData();

  apiExplorer.compileTemplate(data, apiExplorer.template);
  apiExplorer.submitQueryForm();
};
