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

ApiExplorer.prototype.setApiKey = function (data) {
  'use strict';

  var apiExplorer = this,
      $apiKeyField = $('#apiKey'),
      $apiKeyForm = $('#apiKeyForm'),
      defaultApiKey = apiExplorer.defaultApiKey;

  $apiKeyField.on('change', function () {
    var $this = $(this);

    if ($this.val() !== '') {
      apiExplorer.defaultApiKey = $this.val();
    } else {
      apiExplorer.defaultApiKey = defaultApiKey;
    }

    for (var i = 0, ii = data.length; i < ii; i++) {
      apiExplorer.buildQueryUrl(data[i]);
    }

    apiExplorer.compileTemplate(data, apiExplorer.template.path, apiExplorer.template.container);
  });

  $apiKeyForm.on('submit', function (e) {
    e.preventDefault();
  });
};

ApiExplorer.prototype.setParameters = function (data) {
  'use strict';

  var apiExplorer = this,
      endpoints = data;

  $(document).on('change', '.queryParameter', function () {
    var $this = $(this),
        newValue = $this.val(),
        endpointName = $this.data('endpoint'),
        parameterName = $this.attr('name');

    for (var i = 0, ii = endpoints.length; i < ii; i++) {
      if (endpoints[i].name === endpointName) {
        for (var j = 0, jj = endpoints[i].parameters.length; j < jj; j++) {
          if (endpoints[i].parameters[j].name === parameterName) {
            endpoints[i].parameters[j].default_value = newValue;
          }
        }
      }
      apiExplorer.buildQueryUrl(endpoints[i]);
    }

    for (var k = 0, kk = endpoints.length; k < kk; k++) {
      apiExplorer.buildQueryUrl(endpoints[k]);
    }

    apiExplorer.compileTemplate(endpoints, apiExplorer.template);

    $('.queryParametersForm').on('submit', function (e) {
      e.preventDefault();
    });
  });
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
      parameters = apiExplorer.getData(apiExplorer.endpointsParametersUrl).endpoints,
      mergedData = [];

  for (var i = 0, ii = endpoints.length; i < ii; i++) {
    for (var j = 0, jj = parameters.length; j < jj; j++) {
      if (endpoints[i].name === parameters[j].name) {
        endpoints[i].parameters = parameters[j].parameters;
      }
    }

    mergedData.push(apiExplorer.buildQueryUrl(endpoints[i]));
  }

  return mergedData;
};

ApiExplorer.prototype.compileTemplate = function (data, template) {
  'use strict';

  var apiExplorer = this,
      compiledTemplate;

  compiledTemplate = new EJS({
    url: template.path
  }).render(data);

  $(template.container).html(compiledTemplate);

  tabs('#apiExplorerTabs');
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
      queryUrl = apiExplorer.queryUrl;

  queryUrl += endpoint.root_path + '.json';
  queryUrl += '?key=' + apiExplorer.defaultApiKey;

  for (var i = 0, ii = endpoint.parameters.length; i < ii; i++) {
    queryUrl += '&' + endpoint.parameters[i].name + '=' + endpoint.parameters[i].default_value;
  }

  endpoint.query_url = encodeURI(queryUrl);

  return endpoint;
};

ApiExplorer.prototype.init = function () {
  'use strict';

  var apiExplorer = this,
      data = apiExplorer.mergeData();

  apiExplorer.compileTemplate(data, apiExplorer.template);
  apiExplorer.setApiKey(data);
  apiExplorer.setParameters(data);
  apiExplorer.submitQueryForm();
};
