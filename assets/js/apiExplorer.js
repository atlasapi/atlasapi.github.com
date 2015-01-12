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
      apiKey;

  if ($apiKeyInput.val() !== '') {
    apiKey = $apiKeyInput.val();
  } else {
    apiKey = apiExplorer.defaultApiKey;
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
        endpoints[i].annotations = parameters[j].annotations;
      }
    }

    // endpoints[i].query_url = apiExplorer.buildQueryURL(endpoints[i]);
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

// ApiExplorer.prototype.linkIDs = function (inputText) {
//   'use strict';

//   var apiExplorer = this,
//       queryURL = '//atlas.metabroadcast.com/4/content/$1.json?annotations',
//       replacePattern,
//       replacedText;

//   replacePattern = /[\n\r]*"id": "*([^",\n\r]*)/g;
//   replacedText = inputText.replace(replacePattern, '"id": "<a class="apiExplorerContentLink" href="#" data-id="$1">$1</a>');

//   return replacedText;
// };

// ApiExplorer.prototype.submitQueryForm = function () {
//   'use strict';

//   var apiExplorer = this;

//   $('.queryForm').each(function () {
//     var $this = $(this),
//         queryURL;

//     $this.on('submit', function (e) {
//       e.preventDefault();

//       queryURL = $this.find('.queryURL').val();

//       var $loadingDiv = $('<div class="ajaxLoading" style="width: 50px; height: 50px;"></div>');
//       $(this).siblings('.queryResponse').find('.jsonOutput').html($loadingDiv);

//       var that = $(this);

//       apiExplorer.getData(queryURL, function (response) {
//         var $jsonOutput = that.siblings('.queryResponse').find('.jsonOutput');

//         response = apiExplorer.linkIDs(JSON.stringify(response, undefined, 2));
//         $jsonOutput.html(response);
//         $jsonOutput.each(function(i, block) {
//           hljs.highlightBlock(block);
//         });
//       });
//     });
//   });
// };

// ApiExplorer.prototype.buildQueryURL = function (endpoint) {
//   'use strict';

//   var apiExplorer = this,
//       queryURL = apiExplorer.queryURL,
//       apiKey = apiExplorer.getApiKey();

//   queryURL += endpoint.root_path;

//   for (var i = 0, ii = endpoint.parameters.length; i < ii; i++) {
//     if (endpoint.parameters[i].name === 'id') {
//       queryURL += '/' + endpoint.parameters[i].default_value + '.json?';
//     }

//     if (endpoint.parameters[i].default_value !== '' && endpoint.parameters[i].name !== 'id') {
//       queryURL += endpoint.parameters[i].name + '=' + endpoint.parameters[i].default_value;

//       if (i !== ii - 1) {
//         queryURL += '&';
//       }
//     }
//   }

//   queryURL += '&key=' + apiKey;

//   return encodeURI(queryURL);
// };

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

ApiExplorer.prototype.updateQueryForm = function () {
  'use strict';

  var apiExplorer = this;

  $('.queryParametersForm').each(function () {
    var $this = $(this);

    apiExplorer.getURLComponents($this);

    $this.siblings('.queryForm').find('.queryURL').val(apiExplorer.getURLComponents($this));
  });
};

ApiExplorer.prototype.getQueryID = function ($queryParametersForm) {
  'use strict';

  var $idInput = $queryParametersForm.find('input[name="id"]'),
      queryID;

  if ($idInput.val() !== '') {
    queryID = $idInput.val() + '.json?';
  } else {
    queryID = $idInput.data('default') + '.json?';
  }

  return queryID;
};

ApiExplorer.prototype.getURLComponents = function ($queryParametersForm) {
  'use strict';

  var apiExplorer = this,
      urlComponents = {};

  urlComponents.url = apiExplorer.queryURL;
  urlComponents.endpoint = $queryParametersForm.data('endpoint') + '/';
  urlComponents.id = apiExplorer.getQueryID($queryParametersForm);
  urlComponents.parameters = apiExplorer.getQueryParameters($queryParametersForm);
  urlComponents.apiKey = apiExplorer.getApiKey();

  return apiExplorer.constructQueryURL(urlComponents);
};

ApiExplorer.prototype.constructQueryURL = function (urlComponents) {
  'use strict';

  var queryURL = urlComponents.url;

  queryURL += urlComponents.endpoint;
  queryURL += urlComponents.id;
  if (urlComponents.parameters) {
    queryURL += urlComponents.parameters + '&';
  }
  queryURL += 'key=' + urlComponents.apiKey;

  return queryURL;
};

ApiExplorer.prototype.toggleAnnotations = function () {
  'use strict';

  var apiExplorer = this;

  $('.queryParametersForm').each(function () {
    var $this = $(this),
        annotationsInput = $this.find('input[name="annotations"]'),
        annotations = [];

    $this.find('.annotation-checkbox').on('change', function () {
      var annotation = $(this).attr('name');
      if ($(this).is(':checked')) {
        annotations.push(annotation);
        annotationsInput.val(annotations.join(',')).trigger('change');
      } else {
        annotations.pop(annotation);
        annotationsInput.val(annotations.join(',')).trigger('change');
      }
    });
  });
};

ApiExplorer.prototype.getQueryParameters = function ($queryParametersForm) {
  'use strict';

  var apiExplorer = this,
      parameters = [];

  $queryParametersForm.find('.queryParameter').each(function () {
    var $this = $(this);

    if ($this.attr('name') !== 'id' && $this.val() !== '') {
      var parameter = $this.attr('name') + '=' + $this.val();
      parameters.push(parameter);
    }
  });

  return parameters.join('&');
};

ApiExplorer.prototype.toggleQueryID = function ($queryParametersForm) {
  'use strict';

  var apiExplorer = this;

  $queryParametersForm.find('input[name="id"]').on('change', function () {
    if ($(this).val() === '') {
      console.log('Default', $(this).val($(this).data('default')));
    } else {
      console.log('New value', $(this).val());
    }
  });
};

ApiExplorer.prototype.updateParameters = function () {
  'use strict';

  var apiExplorer = this,
      idPattern = /([a-zA-Z0-9]*\.json\?)/ig;

  $(document).on('change', '.queryParameter', function () {
    var parameterName = $(this).attr('name'),
        newParameterValue = $(this).val(),
        defaultValue = $(this).data('default'),
        $queryURLInput = $(this).closest('.queryParametersForm').siblings('.queryForm').find('.queryURL'),
        queryURL = $queryURLInput.val(),
        newQueryURL = apiExplorer.replaceParameter(queryURL, parameterName, newParameterValue);

    if (parameterName === 'id') {
      if ($(this).val() === '') {
        $(this).val(defaultValue);
        $queryURLInput.val(queryURL.replace(idPattern, defaultValue + '.json?'));
      } else {
        $queryURLInput.val(queryURL.replace(idPattern, newParameterValue + '.json?'));
      }
    } else {
      $queryURLInput.val(newQueryURL);
    }
  });
};

ApiExplorer.prototype.showContentJSON = function (contentID) {
  'use strict';

  var apiExplorer = this,
      idPattern = /([a-zA-Z0-9]*\.json\?)/ig,
      $queryURLInput = $('#api-content').find('.queryURL'),
      queryURL = $queryURLInput.val();

  $('a[href="#api-content"]').trigger('click');
  $('#api-content').find('input[name="id"]').val(contentID);
  $queryURLInput.val(queryURL.replace(idPattern, contentID + '.json?'));
  $('#api-content').find('.queryForm').trigger('submit');
};

ApiExplorer.prototype.prepopulateForm = function () {
  'use strict';

  var apiExplorer = this,
      queryString = location.search.substring(1),
      parameters = apiExplorer.getQueryParameters(queryString);

  if (parameters.endpoint) {
    window.location.hash = 'apiExplorer';
    $(window).load(function () {
      if ($('a[href="#api-' + parameters.endpoint + '"]')) {
        $('a[href="#api-' + parameters.endpoint + '"]').trigger('click');

        $('#api-' + parameters.endpoint).find('.queryParameter').each(function () {
          var parameterName = $(this).attr('name');

          for (var property in parameters) {
            if (property === parameterName) {
              $(this).val(parameters[property]).trigger('change');
              $('#api-' + parameters.endpoint).find('.queryForm').trigger('submit');
            }
          }
        });

        if (parameters.apiKey) {
          $('#apiKey').val(parameters.apiKey).trigger('change');
        }
      }
    });
  }
};

ApiExplorer.prototype.init = function () {
  'use strict';

  var apiExplorer = this,
      data = apiExplorer.mergeData(apiExplorer.endpointsURL, apiExplorer.endpointsParametersURL);

  apiExplorer.compileTemplate(data, apiExplorer.template);
  apiExplorer.updateApiKey();
  // apiExplorer.updateParameters();
  // apiExplorer.submitQueryForm();
  apiExplorer.toggleAnnotations();

  apiExplorer.updateQueryForm();
  apiExplorer.constructQueryURL();

  $(document).on('click', '.apiExplorerContentLink', function (e) {
    e.preventDefault();
    var contentID = $(this).data('id');

    apiExplorer.showContentJSON(contentID);
  });

  if (window.location.search) {
    apiExplorer.prepopulateForm();
  }
};
