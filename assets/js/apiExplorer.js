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

ApiExplorer.prototype.sendQuery = function ($queryForm) {
  'use strict';

  var apiExplorer = this,
      queryURL = $queryForm.find('.queryURL').val(),
      $loadingDiv = $('<div class="ajaxLoading" style="width: 50px; height: 50px;"></div>');

  $queryForm.siblings('.queryResponse').find('.jsonOutput').html($loadingDiv);

  apiExplorer.getData(queryURL, function (response) {
    var $jsonOutput = $queryForm.siblings('.queryResponse').find('.jsonOutput');

    response = apiExplorer.linkIDs(JSON.stringify(response, undefined, 2));
    $jsonOutput.html(response);
    $jsonOutput.each(function(i, block) {
      hljs.highlightBlock(block);
    });
  });
};

ApiExplorer.prototype.events = function () {
  'use strict';

  var apiExplorer = this,
      $queryParametersForm = $('.queryParametersForm'),
      $queryForm = $('.queryForm');

  $('#apiKey').on('change', function () {
    $queryParametersForm.each(function () {
      apiExplorer.updateForm($(this));
    });
  });

  $queryParametersForm.each(function () {
    var $this = $(this);

    apiExplorer.updateForm($this);

    $this.find('.queryParameter').on('change', function () {
      apiExplorer.updateForm($this);
    });

    $this.find('.annotation-checkbox').on('change', function () {
      apiExplorer.toggleAnnotations($this);
    });
  });

  $queryForm.each(function () {
    var $this = $(this);

    $this.on('submit', function (e) {
      e.preventDefault();
      apiExplorer.sendQuery($this);
    });
  });
};

ApiExplorer.prototype.toggleAnnotations = function ($queryParametersForm) {
  'use strict';

  var apiExplorer = this,
      $annotationsInput = $queryParametersForm.find('input[name="annotations"]'),
      $annotationCheckbox = $queryParametersForm.find('.annotation-checkbox'),
      annotations = [];

  $annotationCheckbox.each(function () {
    var $this = $(this),
        annotation = $this.attr('name');

    if ($this.is(':checked')) {
      annotations.push(annotation);
    }

    $annotationsInput.val(annotations.join(',')).trigger('change');
  });
};

ApiExplorer.prototype.updateForm = function ($queryParametersForm) {
  'use strict';

  var apiExplorer = this;

  apiExplorer.getQueryURLComponents($queryParametersForm);
  $queryParametersForm.siblings('.queryForm').find('.queryURL').val(apiExplorer.getQueryURLComponents($queryParametersForm));
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

ApiExplorer.prototype.getQueryURLComponents = function ($queryParametersForm) {
  'use strict';

  var apiExplorer = this,
      urlComponents = {};

  urlComponents.endpoint = $queryParametersForm.data('endpoint') + '/';
  urlComponents.id = apiExplorer.getQueryID($queryParametersForm);
  urlComponents.parameters = apiExplorer.getQueryParameters($queryParametersForm);
  urlComponents.apiKey = apiExplorer.getApiKey();

  return apiExplorer.constructQueryURL(urlComponents);
};

ApiExplorer.prototype.constructQueryURL = function (urlComponents) {
  'use strict';

  var apiExplorer = this,
      queryURL = apiExplorer.queryURL;

  queryURL += urlComponents.endpoint;
  queryURL += urlComponents.id;
  if (urlComponents.parameters) {
    queryURL += urlComponents.parameters + '&';
  }
  queryURL += 'key=' + urlComponents.apiKey;

  return queryURL;
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

ApiExplorer.prototype.formatQueryParameters = function (str) {
  'use strict';

  var apiExplorer = this;

  return (str || document.location.search).replace(/(^\?)/,'').split('&').map(function (n) {
    return n = n.split("="),this[n[0]] = n[1],this;
  }.bind({}))[0];
};

ApiExplorer.prototype.prepopulateForm = function () {
  'use strict';

  var apiExplorer = this,
      queryString = location.search.substring(1),
      parameters = apiExplorer.formatQueryParameters(queryString);

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
  apiExplorer.events();

  if (window.location.search) {
    apiExplorer.prepopulateForm();
  }

  // $(document).on('click', '.apiExplorerContentLink', function (e) {
  //   e.preventDefault();
  //   var contentID = $(this).data('id');

  //   apiExplorer.showContentJSON(contentID);
  // });
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

// ApiExplorer.prototype.showContentJSON = function (contentID) {
//   'use strict';

//   var apiExplorer = this,
//       idPattern = /([a-zA-Z0-9]*\.json\?)/ig,
//       $queryURLInput = $('#api-content').find('.queryURL'),
//       queryURL = $queryURLInput.val();

//   $('a[href="#api-content"]').trigger('click');
//   $('#api-content').find('input[name="id"]').val(contentID);
//   $queryURLInput.val(queryURL.replace(idPattern, contentID + '.json?'));
//   $('#api-content').find('.queryForm').trigger('submit');
// };
