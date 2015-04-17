var apiExplorer = (function () {
  'use strict';

  var defaultApiKey = 'c1e92985ec124202b7f07140bcde6e3f';
  var singleId = true;

  var getApiKey = function () {
    return $('#apiKey').val() || defaultApiKey;
  };

  var sendQuery = function ($queryForm) {
    var $loadingDiv = $('<div class="ajaxLoading" style="width: 50px; height: 50px;"></div>');
    $queryForm.siblings('.queryResponse').find('.jsonOutput').html($loadingDiv);
    $.ajax({
      url: $queryForm.find('.queryUrl').val(),
      success: function (data) {
        var $jsonOutput = $queryForm.siblings('.queryResponse').find('.jsonOutput');
        data = linkIds(JSON.stringify(data, undefined, 2));
        $jsonOutput.html(data);
        $jsonOutput.each(function(i, block) {
          hljs.highlightBlock(block);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
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
    getQueryUrlComponents($queryParametersForm);
    $queryParametersForm.siblings('.queryForm').find('.queryUrl').val(getQueryUrlComponents($queryParametersForm));
  };

  var getQueryId = function ($queryParametersForm) {
    var $idInput = $queryParametersForm.find('input[name="id"]');
    var queryId = $idInput.val() || $idInput.data('default');
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
    var defaultQueryUrl = '//atlas.metabroadcast.com';
    var queryUrl = defaultQueryUrl;
    if (singleId === true) {
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
    $('.channel-picker-toggle').on('click', function (e) {
      e.preventDefault();
      toggleChannelPicker(data);
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
        singleId = true;
      } else {
        singleId = false;
      }
      $('#schedules-id-input').val(channelIds.join(',')).trigger('change');
    });
    $(document).on('click', '.toggle-picker', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      $(target).toggle();
    });
  };

  var toggleChannelPicker = function () {
    var compiledTemplate;
    $.ajax({
      url: '//atlas.metabroadcast.com/4/channel_groups.json?type=platform&annotations=channels,regions&key=' + defaultApiKey,
      success: function (data) {
        var channelGroups = data.channel_groups;
        compiledTemplate = new EJS({
          url: 'assets/templates/channelPicker.ejs'
        }).render();
        if ($('.channel-picker-row').length) {
          $('.channel-picker-row').remove();
        } else {
          $('#schedules-id-row').after(compiledTemplate);
        }
        buildPlatformTemplate(channelGroups);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  };

  var buildPlatformTemplate = function (data) {
    var regions;
    compileTemplate({
      path: 'assets/templates/platformPicker.ejs',
      container: '.platform-picker'
    }, data); 
    buildDummyRegionsTemplate();
    buildDummySearchTemplate();
    $('.channel-picker-platforms').on('change', function () {
      var platformId = $(this).val();
      for (var i = 0, ii = data.length; i < ii; i++) {
        if (data[i].id === platformId) {
          regions = data[i].regions;
          _.forEach(regions, function (region) {
            region.platform_title = data[i].title;
          });
        }
      }
      if ($(this).val() !== '') {
        buildRegionsTemplate(regions);
      } else {
        buildDummyRegionsTemplate();
        buildDummySearchTemplate();
      }
    });
  };

  var buildDummyRegionsTemplate = function () {
    compileTemplate({
      path: 'assets/templates/dummyRegionsTemplate.ejs',
      container: '.region-picker'
    });
  };

  var buildRegionsTemplate = function (data) {
    var regionId;
    compileTemplate({
      path: 'assets/templates/regionsPicker.ejs',
      container: '.region-picker'
    }, data);
    buildDummySearchTemplate();
    $('.channel-picker-regions').on('change', function () {
      regionId = $(this).val();
      if (regionId !== '') {
        getRegionChannels(regionId);
      } else {
        buildDummySearchTemplate();
      }
    });
  };

  var buildDummySearchTemplate = function () {
    compileTemplate({
      path: 'assets/templates/dummySearchTemplate.ejs',
      container: '#channel-search'
    });
  };

  var buildChannelSearchTemplate = function (data) {
    var now = new Date().toISOString();
    var monthMap = {
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
    compileTemplate({
      path: 'assets/templates/channelSearch.ejs',
      container: '.channel-search'
    }, data);
    for (var i = 0, ii = data.length; i < ii; i++) {
      var startDate = new Date(data[i].start_date);
      var formattedDate = {};
      var query = [];
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
        data[i].value = data[i].channel.title + ' (' + data[i].channel.id + ') Starts on ' + startDateString;
      } else {
        data[i].value = data[i].channel.title + ' (' + data[i].channel.id + ')';
      }
      query = [
        data[i].channel.title,
        data[i].channel.id,
        data[i].channel.title.replace(/\s/ig, ''),
        data[i].channel.title.replace(/\s?one/ig, '1'),
        data[i].channel.title.replace(/\s?two/ig, '2'),
        data[i].channel.title.replace(/\s?three/ig, '3'),
        data[i].channel.title.replace(/\s?four/ig, '4'),
        data[i].channel.title.replace(/\s?five/ig, '5')
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
      source: substringMatcher(data)
    });
    $(document).on('typeahead:autocompleted typeahead:selected', '#channel-search-box', function (obj, datum, name) {
      $('.channel-picker-checkbox').each(function () {
        if (datum.channel.id === $(this).val()) {
          $(this).prop('checked', true).trigger('change');
          if (!$('.id-added').length) {
            $('#channel-search-box').after('<div class="id-added">&#10003;</div>');
            setTimeout(function () {
              $('.id-added').fadeOut('slow', function () {
                $(this).remove();
              });
            }, 1000);
          }
        }
      });
    });
  };

  var substringMatcher = function (strs) {
    return function (q, cb) {
      var matches = [];
      var substrRegex = new RegExp(q, 'i');
      $.each(strs, function (i, str) {
        if (substrRegex.test(str.query)) {
          matches.push({
            value: str.value,
            id: str.id
          });
        }
      });
      cb(matches);
    };
  };

  var getRegionChannels = function (regionId) {
    var channelsEndpoint = '//atlas.metabroadcast.com/4/channel_groups/';
    var channelsAnnotations = '?annotations=channels';
    var channelsUrl;
    var channelsData;
    var searchResults = [];
    var platformTitle;
    var regionTitle;
    channelsUrl = channelsEndpoint + regionId + '.json' + channelsAnnotations + '&type=region' + '&key=' + defaultApiKey;
    $.ajax({
      url: channelsUrl,
      success: function (data) {
        channelsData = data;
        console.log(data);
        platformTitle = channelsData.channel_group.platform_title;
        regionTitle = channelsData.channel_group.title;
        for (var i = 0, ii = channelsData.channel_group.channels.length; i < ii; i++) {
          searchResults.push(channelsData.channel_group.channels[i]);
        }
        buildChannelsTemplate(channelsData.channel_group.channels, platformTitle, regionTitle);
        buildChannelSearchTemplate(searchResults);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  };

  var buildChannelsTemplate = function (channels, platformTitle, regionTitle) {
    var regexPattern = new RegExp('[^/]+$');
    for (var i = 0, ii = channels.length; i < ii; i++) {
      var aliases = channels[i].channel.aliases;
      channels[i].platform_title = platformTitle;
      channels[i].region_title = regionTitle;
    }
    compileTemplate({
      path: 'assets/templates/channels.ejs',
      container: '.channels-container'
    }, channels);
  };

  var init = function (endpointsData) {
    compileTemplate({
      path: 'assets/templates/api-explorer.ejs',
      container: '#api-explorer-tabs'
    }, endpointsData);
    events(endpointsData);
    if (window.location.search) {
      prepopulateForm();
    }
  };

  return {
    init: init
  };
})();
