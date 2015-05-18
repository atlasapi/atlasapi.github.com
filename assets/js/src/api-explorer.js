var apiExplorer = (function () {
  'use strict';

  var defaultApiKey = 'c1e92985ec124202b7f07140bcde6e3f';

  var getApiKey = function () {
    if (atlasUser.isLoggedIn()) {
      return $('#apiKey').val() || $('#user-api-keys').val();
    } else {
      return $('#apiKey').val() || defaultApiKey;
    }
  };

  var sendQuery = function ($queryForm) {
    var $loadingDiv = $('<div class="ajaxLoading"></div>');
    var $jsonOutput = $queryForm.siblings('.queryResponse').find('.jsonOutput');
    $jsonOutput.html($loadingDiv);
    $.ajax({
      url: $queryForm.find('.queryUrl').val(),
      success: function (data) {
        data = linkIds(JSON.stringify(data, undefined, 2));
        $jsonOutput.html(data);
        $jsonOutput.each(function(i, block) {
          hljs.highlightBlock(block);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $jsonOutput.html('Error: ' + errorThrown);
      }
    });
  };

  var linkIds = function (inputText) {
    var replacePattern = /[\n\r]*"id": "*([^",\n\r]*)/g;
    return inputText.replace(replacePattern, '"id": "<a class="apiExplorerContentLink" href="#" data-id="$1">$1</a>');
  };

  var toggleAnnotations = function ($queryParametersForm) {
    var $annotationsInput = $queryParametersForm.find('input[name="annotations"]');
    var $annotationCheckbox = $queryParametersForm.find('.annotation-checkbox');
    var annotations = [];
    $annotationCheckbox.each(function () {
      var $this = $(this);
      var annotation = $this.attr('name');
      if ($this.is(':checked')) {
        annotations.push(annotation);
      }
      $annotationsInput.val(annotations.join(',')).trigger('change');
    });
  };

  var updateForm = function ($queryParametersForm) {
    var ajaxExampleText = "$.ajax({
  url: '@url',
  success: function (data) {
    console.log(data);
  },
  error: function (jqXHR, textStatus) {
    console.error(textStatus);
  }
});";
    var queryUrlValue = getQueryUrlComponents($queryParametersForm);
    $queryParametersForm.siblings('.api-explorer-examples').find('.queryUrl').val(queryUrlValue);
    $queryParametersForm.siblings('.api-explorer-examples').find('.api-explorer-example-curl').val('curl -i \'' + queryUrlValue + '\'');
    var $ajaxExample = $queryParametersForm.siblings('.api-explorer-examples').find('.api-explorer-example-ajax');
    $ajaxExample.text(ajaxExampleText.replace('@url', queryUrlValue));
    $ajaxExample.each(function (i, block) {
      hljs.highlightBlock(block);
    });
    if ($('.user-query-url').val() !== '') {
      $('.user-query-url').val(queryUrlValue);
    }
  };

  var getQueryId = function ($queryParametersForm) {
    var $idInput = $queryParametersForm.find('input[name="id"]');
    var queryId = $idInput.val() || '';
    $idInput.val(queryId);
    return queryId;
  };

  var getQueryUrlComponents = function ($queryParametersForm) {
    var urlComponents = {};
    urlComponents.endpoint = $queryParametersForm.data('endpoint');
    urlComponents.id = getQueryId($queryParametersForm);
    urlComponents.parameters = getQueryParameters($queryParametersForm);
    urlComponents.apiKey = getApiKey();
    return constructQueryUrl(urlComponents);
  };

  var constructQueryUrl = function (urlComponents) {
    var defaultQueryUrl = 'https://atlas.metabroadcast.com';
    var queryUrl = defaultQueryUrl;
    var urlIds = urlComponents.id.split(',');
    if (urlIds.length <= 1) {
      queryUrl += urlComponents.endpoint;
      if (urlComponents.id !== '') {
        queryUrl += '/';
      }
      queryUrl += urlComponents.id + '.json?';
    } else {
      queryUrl += urlComponents.endpoint + '.json?';
      queryUrl += 'id=' + urlComponents.id + '&';
    }
    if (urlComponents.parameters) {
      queryUrl += urlComponents.parameters + '&';
    }
    queryUrl += 'key=' + urlComponents.apiKey;
    return queryUrl;
  };

  var getQueryParameters = function ($queryParametersForm) {
    var parameters = [];
    $queryParametersForm.find('.queryParameter').each(function () {
      var $this = $(this);
      if ($this.attr('name') !== 'id' && $this.val() !== '') {
        var parameter = $this.attr('name') + '=' + $this.val();
        parameters.push(parameter);
      }
    });
    return parameters.join('&');
  };

  var prepopulateForm = function () {
    var queryString = location.search.substring(1);
    var parameters = apiExplorer.formatQueryParameters(queryString);
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

  var showContentJSON = function (contentId) {
    var idPattern = /([a-zA-Z0-9]*\.json\?)/ig;
    var $queryUrlInput = $('#api-content').find('.queryUrl');
    var queryUrl = $queryUrlInput.val();
    $('a[href="#api-content"]').trigger('click');
    $('#api-content').find('input[name="id"]').val(contentId);
    $queryUrlInput.val(queryUrl.replace(idPattern, contentId + '.json?'));
    $('#api-content').find('.queryForm').trigger('submit');
  };

  var events = function (data) {
    var $queryParametersForm = $('.queryParametersForm');
    var $queryForm = $('.queryForm');
    $('#apiKey').on('change', function () {
      $queryParametersForm.each(function () {
        updateForm($(this));
      });
    });
    $queryParametersForm.each(function () {
      var $this = $(this);
      updateForm($this);
      $this.find('.queryParameter').on('change', function () {
        updateForm($this);
      });
      $this.find('.annotation-checkbox').on('change', function () {
        toggleAnnotations($this);
      });
    });
    $queryForm.each(function () {
      var $this = $(this);
      $this.on('submit', function (e) {
        e.preventDefault();
        sendQuery($this);
      });
    });
    $(document).on('click', '.apiExplorerContentLink', function (e) {
      e.preventDefault();
      var contentId = $(this).data('id');
      showContentJSON(contentId);
    });
    $(document).on('click', '.toggle-picker', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      $(target).toggle();
    });
    $(document).on('click', '.open-api-docs-tab', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      var headerHeight = 64;
      $(window).scrollTop($('#api-docs').offset().top - headerHeight);
      $('.api-docs .menu').find('a[href=' + target + ']').trigger('click');
    });
    $(document).on('change', '#user-api-keys', function () {
      var userApiKey = $(this).val();
      $('#apiKey').val(userApiKey).trigger('change');
    });
    $(document).on('click', '.logout', function () {
      loadApiKeyButton();
      $('#apiKey').val('').trigger('change');
    });
    $(document).on('click', '.show-api-key-warning', function () {
      if (!atlasUser.isLoggedIn()) {
        var $apiKeyWarning = $(this).closest('.has-api-key-warning').find('.api-key-warning');
        $('.api-key-warning').hide();
        $apiKeyWarning.show();
      }
    });
    $(document).on('click', '.close-api-key-warning', function (e) {
      e.preventDefault();
      if (!atlasUser.isLoggedIn()) {
        $(this).closest('.api-key-warning').hide();
      }
    });
    $(document).on('keyup', function (e) {
      var escKeyCode = 27;
      if (e.keyCode === escKeyCode) {
        $('.api-key-warning').hide();
      }
    });

    $(document).on('change', '.user-query-url', function () {
      $('.user-query-url').val($(this).val());
    });

    $('.user-query-form').on('submit', function (e) {
      e.preventDefault();
      handleUserQueryUrl($(this));
    });
  };

  var selectAnnotations = function (tabPanel, queryParameters) {
    var $tabPanel = $(tabPanel);
    var annotations = queryParameters.annotations.split(',');
    if (!$tabPanel.find('.annotations-row').is(':visible')) {
      $tabPanel.find('.toggle-picker').trigger('click');
    }
    $tabPanel.find('.annotation-checkbox').each(function (index, checkbox) {
      var annotationIndex = $.inArray($(checkbox).attr('name'), annotations);
      if (annotationIndex !== -1) {
        $(checkbox).prop('checked', true);
      } else {
        $(checkbox).prop('checked', false);
      }
      $(checkbox).trigger('change');
    });
  };

  var selectDefaultAnnotations = function () {
    $('.api-explorer-param-annotations').each(function (index, annotationsRow) {
      var annotations = $(annotationsRow).find('.queryParameter').val();
      annotations = annotations.split(',');
      $(annotationsRow).siblings('.annotations-picker-row').find('.annotation-checkbox').each(function (index, annotationCheckbox) {
        var annotationName = $(annotationCheckbox).attr('name');
        if ($.inArray(annotationName, annotations) > -1) {
          $(annotationCheckbox).prop('checked', true); 
        }
      });
    });
  };

  var handleUserQueryUrl = function (queryForm) {
    var queryUrl = $(queryForm).find('.user-query-url').val();
    var endpointName = queryUrl.split('4');
    endpointName = endpointName[1].split('/');
    endpointName = endpointName[1];
    endpointName = endpointName.split('.');
    endpointName = endpointName[0];
    var target = '#api-' + endpointName;
    var queryParameters = createQueryParamsObject(queryUrl);
    $('.api-explorer-nav').find('a[href="' + target + '"]').trigger('click');
    $('#apiKey').val(queryParameters.key).trigger('change');
    $(target).find('.queryTable').find('.queryParameter').each(function (index, parameterInput) {
      var inputName = $(parameterInput).attr('name');
      $(parameterInput).val('').trigger('change');
      if (queryParameters[inputName]) {
        $('[name="' + inputName + '"]').val(queryParameters[inputName]).trigger('change');
      }
    });
    selectAnnotations(target, queryParameters);
    if ($(target).find('.channel-picker-toggle')) {
      channelPicker.toggle(true, {
        tabPanel: target,
        queryParameters: queryParameters
      });
    }
    $(window).scrollTop($('#apiExplorer').offset().top - 64);
    sendQuery($(target).find('.queryForm'));
  };

  var loadUserApiKeyDropdown = function (data) {
    _.forEach(data.applications, function (application) {
      var apiKey = application.credentials.apiKey;
      application.shortKey = apiKey.substring(0, 3);
      application.shortKey += '...';
      application.shortKey += apiKey.substring(apiKey.length - 3);
    });
    var compiledTemplate = new EJS({
      url: 'assets/templates/api-key-dropdown.ejs'
    }).render(data.applications);
    $('#getApiKeyBtnHolder').html(compiledTemplate);
    $('#user-api-keys').trigger('change');
  };

  var loadApiKeyButton = function () {
    var compiledTemplate = new EJS({
      url: 'assets/templates/api-key-button.ejs'
    }).render();
    $('#getApiKeyBtnHolder').html(compiledTemplate);
  };

  var init = function (endpointsData) {
    var compiledTemplate = new EJS({
      url: 'assets/templates/api-explorer.ejs'
    }).render(endpointsData);
    $('#api-explorer-tabs').html(compiledTemplate);
    events(endpointsData);
    if (atlasUser.isLoggedIn()) {
      var credentials = atlasUser.getCredentials();
      var credentialsQueryString = encodeQueryData(credentials);
      atlasUser.getUserData('http://atlas.metabroadcast.com/4/applications.json?' + credentialsQueryString, loadUserApiKeyDropdown);
    } else {
      loadApiKeyButton();
    }
    channelPicker.init();
    channelGroupPicker.init();
    selectDefaultAnnotations();
    if (window.location.search) {
      prepopulateForm();
    }
  };

  return {
    init: init
  };
})();
