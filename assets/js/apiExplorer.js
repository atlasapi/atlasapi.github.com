var ApiExplorer = function () {
  'use strict';

  this.endpointsURL = '//stage.atlas.metabroadcast.com/4/meta/endpoints.json';
  this.endpointsParametersURL = 'assets/data/parameters.json';
  this.defaultApiKey = 'c1e92985ec124202b7f07140bcde6e3f';
  this.queryURL = '//atlas.metabroadcast.com';
  this.template = {
    path: 'assets/templates/apiExplorer.ejs',
    container: '#apiExplorerTabSections'
  };
};

ApiExplorer.prototype.getApiKey = function () {
  'use strict';

  var apiExplorer = this,
      $apiKeyInput = $('#apiKey'),
      apiKey = apiExplorer.defaultApiKey;

  if ($apiKeyInput.length) {
    if ($apiKeyInput.val() !== '') {
      apiKey = $apiKeyInput.val();
    }
  }

  return apiKey;
};

ApiExplorer.prototype.getData = function (URL, callback) {
  'use strict';

  var apiExplorer = this,
      async = true,
      dataResponse;

  if (!callback) {
    async = false;
  }

  $.ajax({
    url: URL,
    dataType: 'json',
    async: async,
    success: function (data) {
      if (callback) {
        callback(data);
      }
      dataResponse = data;
    },
    error: function (err) {
      console.error('Unable to get data');
    }
  });

  return dataResponse;
};

ApiExplorer.prototype.mergeData = function (originalDataURL, newDataURL) {
  'use strict';

  var apiExplorer = this,
      endpoints = apiExplorer.getData(originalDataURL).endpoints,
      parameters = apiExplorer.getData(newDataURL).endpoints;

  for (var i = 0, ii = endpoints.length; i < ii; i++) {
    for (var j = 0, jj = parameters.length; j < jj; j++) {
      if (endpoints[i].name === parameters[j].name) {
        endpoints[i].parameters = parameters[j].parameters;
      }
    }

    endpoints[i].query_url = apiExplorer.buildQueryURL(endpoints[i]);
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

ApiExplorer.prototype.linkify = function (inputText) {
  'use strict';

  var apiExplorer = this,
      replacedText,
      replacePattern1,
      replacePattern2,
      replacePattern3;

  // URLs starting with http://, https://, or ftp://
  replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(replacePattern1, '<a href="$1">$1</a>');

  // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2">$2</a>');

  return replacedText;
};

ApiExplorer.prototype.linkIDs = function (inputText) {
  'use strict';

  var apiExplorer = this,
      queryURL = '//atlas.metabroadcast.com/4/content/$1.json?annotations',
      replacePattern,
      replacedText;

  replacePattern = /[\n\r]*"id": "*([^",\n\r]*)/g;
  replacedText = inputText.replace(replacePattern, '"id": "<a class="apiExplorerContentLink" href="?content_id=$1">$1</a>');

  return replacedText;
};

ApiExplorer.prototype.submitQueryForm = function () {
  'use strict';

  var apiExplorer = this;

  $('.queryForm').each(function () {
    var $this = $(this),
        queryURL;

    $this.on('submit', function (e) {
      e.preventDefault();

      queryURL = $this.find('.queryURL').val();

      var $loadingDiv = $('<div class="ajaxLoading" style="width: 50px; height: 50px;"></div>');
      $(this).siblings('.queryResponse').find('.jsonOutput').html($loadingDiv);

      var that = $(this);

      apiExplorer.getData(queryURL, function (response) {
        var $jsonOutput = that.siblings('.queryResponse').find('.jsonOutput');

        response = apiExplorer.linkIDs(JSON.stringify(response, undefined, 2));
        $jsonOutput.html(response);
        $jsonOutput.each(function(i, block) {
          hljs.highlightBlock(block);
        });
      });
    });
  });
};

ApiExplorer.prototype.buildQueryURL = function (endpoint) {
  'use strict';

  var apiExplorer = this,
      queryURL = apiExplorer.queryURL,
      apiKey = apiExplorer.getApiKey();

  queryURL += endpoint.root_path;

  for (var i = 0, ii = endpoint.parameters.length; i < ii; i++) {
    if (endpoint.parameters[i].name === 'id') {
      queryURL += '/' + endpoint.parameters[i].default_value + '.json?';
    }

    if (endpoint.parameters[i].default_value !== '' && endpoint.parameters[i].name !== 'id') {
      queryURL += endpoint.parameters[i].name + '=' + endpoint.parameters[i].default_value;

      if (i !== ii - 1) {
        queryURL += '&';
      }
    }
  }

  queryURL += '&key=' + apiKey;

  return encodeURI(queryURL);
};

ApiExplorer.prototype.replaceParameter = function (URL, parameterName, parameterValue) {
  'use strict';

  var apiExplorer = this,
      pattern = new RegExp('(' + parameterName + '=).*?(&|$)'),
      newURL;

  if (parameterValue !== '') {
    newURL = URL.replace(pattern, '$1' + parameterValue + '$2');
  } else {
    newURL = URL.replace(pattern, '');
  }


  if (newURL === URL && parameterName !== 'id') {
    newURL = newURL + (newURL.indexOf('?') > 0 ? '&' : '?') + parameterName + '=' + parameterValue;
  }

  return newURL;
};

ApiExplorer.prototype.updateApiKey = function () {
  'use strict';

  var apiExplorer = this;

  $('#apiKey').on('change', function () {
    $('.queryURL').each(function () {
      var queryURL = $(this).val(),
          apiKey = apiExplorer.getApiKey(),
          newQueryURL = apiExplorer.replaceParameter(queryURL, 'key', apiKey);

      $(this).val(newQueryURL);
    });
  });
};

ApiExplorer.prototype.updateParameters = function () {
  'use strict';

  var apiExplorer = this,
      idPattern = /([a-zA-Z0-9]*\.json\?)/ig;

  $(document).on('change', '.queryParameter', function () {
    var parameterName = $(this).attr('name'),
        newParameterValue = $(this).val(),
        $queryURLInput = $(this).closest('.queryParametersForm').siblings('.queryForm').find('.queryURL'),
        queryURL = $queryURLInput.val(),
        newQueryURL = apiExplorer.replaceParameter(queryURL, parameterName, newParameterValue);

    if (parameterName === 'id') {
      $queryURLInput.val(queryURL.replace(idPattern, newParameterValue + '.json?'));
    } else {
      $queryURLInput.val(newQueryURL);
    }
  });
};

ApiExplorer.prototype.init = function () {
  'use strict';

  var apiExplorer = this,
      data = apiExplorer.mergeData(apiExplorer.endpointsURL, apiExplorer.endpointsParametersURL);

  apiExplorer.compileTemplate(data, apiExplorer.template);
  apiExplorer.updateApiKey();
  apiExplorer.updateParameters();
  apiExplorer.submitQueryForm();
};
