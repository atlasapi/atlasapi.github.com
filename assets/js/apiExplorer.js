var ApiExplorer = function () {
  'use strict';

  this.endpointsUrl = '//atlas.metabroadcast.com/4/meta/endpoints.json';
  this.endpointsParametersUrl = 'assets/data/parameters.json';
  this.channelGroupsUrl = '//atlas.metabroadcast.com/3.0/channel_groups.json?offset=0&type=platform&apiKey=c1e92985ec124202b7f07140bcde6e3f';
  this.defaultApiKey = 'c1e92985ec124202b7f07140bcde6e3f';
  this.queryUrl = '//atlas.metabroadcast.com';
  this.template = {
    path: 'assets/templates/apiExplorer.ejs',
    container: '#apiExplorerTabSections'
  };
  this.singleId = true;
};

ApiExplorer.prototype.getData = function (url, callback) {
  'use strict';

  var apiExplorer = this,
      async = true,
      dataResponse;

  if (!callback) {
    async = false;
  }

  $.ajax({
    url: url,
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

  if ($apiKeyInput.val()) {
    apiKey = $apiKeyInput.val();
  } else {
    apiKey = apiExplorer.defaultApiKey;
  }

  return apiKey;
};

ApiExplorer.prototype.mergeData = function (originalDataUrl, newDataUrl, channelGroupsUrl) {
  'use strict';

  var apiExplorer = this,
      endpoints = apiExplorer.getData(originalDataUrl).endpoints,
      parameters = apiExplorer.getData(newDataUrl).endpoints,
      channelGroups = apiExplorer.getData(channelGroupsUrl).channel_groups;

  for (var i = 0, ii = endpoints.length; i < ii; i++) {
    for (var j = 0, jj = parameters.length; j < jj; j++) {
      if (endpoints[i].name === parameters[j].name) {
        endpoints[i].parameters = parameters[j].parameters;
        endpoints[i].annotations = parameters[j].annotations;
      }
    }

    if (endpoints[i].name === 'schedules') {
      endpoints[i].channel_groups = channelGroups;
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
      queryUrl = $queryForm.find('.queryUrl').val(),
      $loadingDiv = $('<div class="ajaxLoading" style="width: 50px; height: 50px;"></div>');

  $queryForm.siblings('.queryResponse').find('.jsonOutput').html($loadingDiv);

  apiExplorer.getData(queryUrl, function (response) {
    var $jsonOutput = $queryForm.siblings('.queryResponse').find('.jsonOutput');

    response = apiExplorer.linkIds(JSON.stringify(response, undefined, 2));
    $jsonOutput.html(response);
    $jsonOutput.each(function(i, block) {
      hljs.highlightBlock(block);
    });
  });
};

ApiExplorer.prototype.linkIds = function (inputText) {
  'use strict';

  var apiExplorer = this,
      queryUrl = '//atlas.metabroadcast.com/4/content/$1.json?annotations',
      replacePattern,
      replacedText;

  replacePattern = /[\n\r]*"id": "*([^",\n\r]*)/g;
  replacedText = inputText.replace(replacePattern, '"id": "<a class="apiExplorerContentLink" href="#" data-id="$1">$1</a>');

  return replacedText;
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

  apiExplorer.getQueryUrlComponents($queryParametersForm);
  $queryParametersForm.siblings('.queryForm').find('.queryUrl').val(apiExplorer.getQueryUrlComponents($queryParametersForm));
};

ApiExplorer.prototype.getQueryId = function ($queryParametersForm) {
  'use strict';

  var $idInput = $queryParametersForm.find('input[name="id"]'),
      defaultId = $idInput.data('default'),
      queryId;

  if ($idInput.val() !== '') {
    queryId = $idInput.val();
  } else {
    queryId = defaultId;
    $idInput.val(defaultId);
  }

  return queryId;
};

ApiExplorer.prototype.getQueryUrlComponents = function ($queryParametersForm) {
  'use strict';

  var apiExplorer = this,
      urlComponents = {};

  urlComponents.endpoint = $queryParametersForm.data('endpoint');
  urlComponents.id = apiExplorer.getQueryId($queryParametersForm);
  urlComponents.parameters = apiExplorer.getQueryParameters($queryParametersForm);
  urlComponents.apiKey = apiExplorer.getApiKey();

  return apiExplorer.constructQueryUrl(urlComponents);
};

ApiExplorer.prototype.constructQueryUrl = function (urlComponents) {
  'use strict';

  var apiExplorer = this,
      queryUrl = apiExplorer.queryUrl;

  if (apiExplorer.singleId === true) {
    queryUrl += urlComponents.endpoint + '/';
    queryUrl += urlComponents.id + '.json?';
  } else {
    queryUrl += urlComponents.endpoint + '.json?';
  }

  if (urlComponents.parameters) {
    queryUrl += urlComponents.parameters + '&';
  }

  if (apiExplorer.singleId === false) {
    queryUrl += 'id=' + urlComponents.id + '&';
  }

  queryUrl += 'key=' + urlComponents.apiKey;

  return queryUrl;
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

ApiExplorer.prototype.showContentJSON = function (contentId) {
  'use strict';

  var apiExplorer = this,
      idPattern = /([a-zA-Z0-9]*\.json\?)/ig,
      $queryUrlInput = $('#api-content').find('.queryUrl'),
      queryUrl = $queryUrlInput.val();

  $('a[href="#api-content"]').trigger('click');
  $('#api-content').find('input[name="id"]').val(contentId);
  $queryUrlInput.val(queryUrl.replace(idPattern, contentId + '.json?'));
  $('#api-content').find('.queryForm').trigger('submit');
};

ApiExplorer.prototype.events = function (data) {
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

  $(document).on('click', '.apiExplorerContentLink', function (e) {
    e.preventDefault();
    var contentId = $(this).data('id');

    apiExplorer.showContentJSON(contentId);
  });

  $('.channel-picker-toggle').on('click', function (e) {
    e.preventDefault();
    apiExplorer.toggleChannelPicker(data);
  });

  $(document).on('click', '.close-channel-picker', function (e) {
    e.preventDefault();

    if ($('.channel-picker-row').length) {
      $('.channel-picker-row').remove();
    }
  });

  $(document).on('change', '.channel-picker-checkbox', function () {
    var channelIds = [];

    $('.channel-picker-checkbox').each(function () {
      if ($(this).is(':checked')) {
        channelIds.push($(this).val());
      }
    });

    if (channelIds.length === 1) {
      apiExplorer.singleId = true;
    } else {
      apiExplorer.singleId = false;
    }

    $('#schedules-id-input').val(channelIds.join(',')).trigger('change');
  });

  $(document).on('click', '.toggle-picker', function (e) {
    e.preventDefault();
    var target = $(this).attr('href');

    $(target).toggle();
  });
};

ApiExplorer.prototype.init = function () {
  'use strict';

  var apiExplorer = this,
      data = apiExplorer.mergeData(apiExplorer.endpointsUrl, apiExplorer.endpointsParametersUrl, apiExplorer.channelGroupsUrl);

  apiExplorer.compileTemplate(data, apiExplorer.template);
  apiExplorer.events(data);

  if (window.location.search) {
    apiExplorer.prepopulateForm();
  }
};

ApiExplorer.prototype.toggleChannelPicker = function (data) {
  'use strict';

  var apiExplorer = this,
      compiledTemplate,
      channelGroups;

  for (var i = 0, ii = data.length; i < ii; i++) {
    if (data[i].channel_groups) {
      channelGroups = data[i].channel_groups;
    }
  }

  compiledTemplate = new EJS({
    url: 'assets/templates/channelPicker.ejs'
  }).render();

  if ($('.channel-picker-row').length) {
    $('.channel-picker-row').remove();
  } else {
    $('#schedules-id-row').after(compiledTemplate);
  }

  apiExplorer.buildPlatformTemplate(channelGroups);
};

ApiExplorer.prototype.buildPlatformTemplate = function (data) {
  'use strict';

  var apiExplorer = this,
      compiledTemplate,
      regions;

  compiledTemplate = new EJS({
    url: 'assets/templates/platformPicker.ejs'
  }).render(data);

  $('.platform-picker').html(compiledTemplate);

  apiExplorer.buildDummyRegionsTemplate();
  apiExplorer.buildDummySearchTemplate();

  $('.channel-picker-platforms').on('change', function () {
    var platformId = $(this).val();

    for (var i = 0, ii = data.length; i < ii; i++) {
      if (data[i].id === platformId) {
        regions = data[i].regions;
      }
    }

    if ($(this).val() !== '') {
      apiExplorer.buildRegionsTemplate(regions);
    } else {
      apiExplorer.buildDummyRegionsTemplate();
      apiExplorer.buildDummySearchTemplate();
    }
  });
};

ApiExplorer.prototype.buildDummyRegionsTemplate = function () {
  'use strict';

  var apiExplorer = this,
      compiledTemplate;

  compiledTemplate = new EJS({
    url: 'assets/templates/dummyRegionsTemplate.ejs'
  }).render();

  $('.region-picker').html(compiledTemplate);
};

ApiExplorer.prototype.buildRegionsTemplate = function (data) {
  'use strict';

  var apiExplorer = this,
      compiledTemplate,
      regionId;

  compiledTemplate = new EJS({
    url: 'assets/templates/regionsPicker.ejs'
  }).render(data);

  $('.region-picker').html(compiledTemplate);

  apiExplorer.buildDummySearchTemplate();

  $('.channel-picker-regions').on('change', function () {
    regionId = $(this).val();

    if (regionId !== '') {
      apiExplorer.getRegionChannels(regionId);
    } else {
      apiExplorer.buildDummySearchTemplate();
    }
  });
};

ApiExplorer.prototype.buildDummySearchTemplate = function () {
  'use strict';

  var apiExplorer = this,
      compiledTemplate;

  compiledTemplate = new EJS({
    url: 'assets/templates/dummySearchTemplate.ejs'
  }).render();

  $('#channel-search').html(compiledTemplate);
};

ApiExplorer.prototype.buildChannelSearchTemplate = function (data) {
  'use strict';

  var apiExplorer = this,
      now = new Date().toISOString(),
      compiledTemplate,
      monthMap = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    };

  compiledTemplate = new EJS({
    url: 'assets/templates/channelSearch.ejs'
  }).render(data);

  $('.channel-search').html(compiledTemplate);

  for (var i = 0, ii = data.length; i < ii; i++) {
    var startDate = new Date(data[i].start_date),
        formattedDate = {},
        query = [];

    if (startDate.getDay() === 1 || startDate.getDay() === 21 || startDate.getDay() === 31) {
      formattedDate.day = startDate.getDay() + 'st ';
    } else if (startDate.getDay() === 2 || startDate === 22) {
      formattedDate.day = startDate.getDay() + 'nd ';
    } else if (startDate.getDay() === 3 || startDate === 23) {
      formattedDate.day = startDate.getDay() + 'rd ';
    } else {
      formattedDate.day = startDate.getDay() + 'th ';
    }

    formattedDate.month = monthMap[startDate.getMonth()] + ' ';
    formattedDate.year = startDate.getFullYear();

    if (data[i].start_date > now) {
      var startDateString = formattedDate.day + formattedDate.month + formattedDate.year;
      data[i].value = data[i].channel.title + ' (' + data[i].deer_id + ') Starts on ' + startDateString;
    } else {
      data[i].value = data[i].channel.title + ' (' + data[i].deer_id + ')';
    }

    query = [
      data[i].channel.title,
      data[i].deer_id,
      data[i].channel.title.replace(/\s/ig, ''),
      data[i].channel.title.replace(/\sone/ig, '1'),
      data[i].channel.title.replace(/one/ig, '1'),
      data[i].channel.title.replace(/\stwo/ig, '2'),
      data[i].channel.title.replace(/two/ig, '2'),
      data[i].channel.title.replace(/\sthree/ig, '3'),
      data[i].channel.title.replace(/three/ig, '3'),
      data[i].channel.title.replace(/\sfour/ig, '4'),
      data[i].channel.title.replace(/four/ig, '4'),
      data[i].channel.title.replace(/\sfive/ig, '5'),
      data[i].channel.title.replace(/five/ig, '5')
    ];

    data[i].query = query.join();
  }

  $('#channel-search-box').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  }, {
    name: 'data',
    displayKey: 'value',
    source: apiExplorer.substringMatcher(data)
  });

  $(document).on('typeahead:autocompleted typeahead:selected', '#channel-search-box', function (obj, datum, name) {
    $('.channel-picker-checkbox').each(function () {
      if (datum.deer_id === $(this).val()) {
        $(this).prop('checked', true).trigger('change');
      }
    });
  });
};

ApiExplorer.prototype.substringMatcher = function (strs) {
  'use strict';

  return function (q, cb) {
    var matches = [],
        substrRegex = new RegExp(q, 'i');

    $.each(strs, function (i, str) {
      if (substrRegex.test(str.query)) {
        matches.push({
          value: str.value,
          deer_id: str.deer_id
        });
      }
    });

    cb(matches);
  };
};

ApiExplorer.prototype.getRegionChannels = function (regionId) {
  'use strict';

  var apiExplorer = this,
      channelsEndpoint = '//users-atlas.metabroadcast.com/3.0/channel_groups/',
      channelsAnnotations = '?annotations=channels',
      channelsUrl,
      channelsData,
      searchResults = [],
      platformTitle,
      regionTitle;

  channelsUrl = channelsEndpoint + regionId + '.json' + channelsAnnotations;
  channelsData = apiExplorer.getData(channelsUrl);

  platformTitle = channelsData.channel_groups[0].platform.title;
  regionTitle = channelsData.channel_groups[0].title;

  for (var i = 0, ii = channelsData.channel_groups[0].channels.length; i < ii; i++) {
    searchResults.push(channelsData.channel_groups[0].channels[i]);
  }

  apiExplorer.buildChannelsTemplate(channelsData.channel_groups[0].channels, platformTitle, regionTitle);
  apiExplorer.buildChannelSearchTemplate(searchResults);
};

ApiExplorer.prototype.buildChannelsTemplate = function (channels, platformTitle, regionTitle) {
  'use strict';

  var apiExplorer = this,
      compiledTemplate,
      regexPattern = new RegExp('[^/]+$');

  for (var i = 0, ii = channels.length; i < ii; i++) {
    var aliases = channels[i].channel.aliases;

    channels[i].platform_title = platformTitle;
    channels[i].region_title = regionTitle;
    channels[i].deer_id = apiExplorer.convertIdToDeer(aliases);
  }

  compiledTemplate = new EJS({
    url: 'assets/templates/channels.ejs'
  }).render(channels);

  $('.channels-container').html(compiledTemplate);
};

ApiExplorer.prototype.convertIdToDeer = function (aliases) {
  'use strict';

  var apiExplorer = this,
      deerIdPattern = new RegExp('[^/]+$'),
      deerId;

  for (var i = 0, ii = aliases.length; i < ii; i++) {
    if (aliases[i].search('http://atlas.metabroadcast.com/4.0/channels/') !== -1) {
      deerId = aliases[i].match(deerIdPattern);
    }
  }

  return deerId[0];
};
