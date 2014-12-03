var ApiExplorer = function () {
  'use strict';

  this.container = '#apiExplorerTabs';
  this.endpointsUrl = '//stage.atlas.metabroadcast.com/4/meta/endpoints.json';
  this.endpointsParametersUrl = 'assets/data/parameters.json';
  this.apiKey = 'c1e92985ec124202b7f07140bcde6e3f';
  this.queryUrl = '//atlas.metabroadcast.com';
  this.templates = [
    {
      path: 'assets/templates/navigation.ejs',
      container: '#apiExplorerNavigation'
    },
    {
      path: 'assets/templates/sections.ejs',
      container: '#apiExplorerTabSections'
    }
  ];
};

// ApiExplorer.prototype.setApiKey = function (apiKey) {
//   'use strict';
//
//   var apiExplorer = this,
//       $apiKeyField = $('#customApiKey'),
//       defaultApiKey = apiKey;

//   $apiKeyField.on('change', function () {
//     if ($apiKeyField.val() !== '') {
//       apiExplorer.apiKey = $apiKeyField.val();
//       apiExplorer.setContentQuery();
//     } else {
//       apiExplorer.apiKey = defaultApiKey;
//       apiExplorer.setContentQuery();
//     }
//   });

//   return apiExplorer.apiKey;
// };

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

ApiExplorer.prototype.compileTemplate = function (data, templatePath, container) {
  'use strict';

  var apiExplorer = this,
      template;

  template = new EJS({
    url: templatePath
  }).render(data);

  $(container).html(template);
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
  queryUrl += '?key=' + apiExplorer.apiKey;

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

  for (var i = 0, ii = apiExplorer.templates.length; i < ii; i++) {
    apiExplorer.compileTemplate(data, apiExplorer.templates[i].path, apiExplorer.templates[i].container);
  }

  apiExplorer.submitQueryForm();
  tabs(apiExplorer.container);
};
