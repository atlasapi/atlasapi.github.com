var channelPicker = (function () {
  'use strict';

  var apiKey = 'c1e92985ec124202b7f07140bcde6e3f';

  var channelPickerClick = function () {
    $('.channel-picker-toggle').on('click', function (e) {
      e.preventDefault();
      var tabPanel = $(this).closest('.ui-tabs-panel').attr('id');
      toggleChannelPicker(false, {
        tabPanel: tabPanel
      });
    });
  };

  var toggleChannelPicker = function (checkSelectedChannels, options) {
    var $tabPanel = $('#' + options.tabPanel);
    $.ajax({
      url: '//atlas.metabroadcast.com/4/channel_groups.json?type=platform&annotations=channels,regions&key=' + apiKey,
      success: function (data) {
        var compiledTemplate = new EJS({
          url: 'assets/templates/channelPicker.ejs'
        }).render();
        if ($tabPanel.find('.channel-picker-row').length && !checkSelectedChannels) {
          $tabPanel.find('.channel-picker-row').remove();
        } else {
          $tabPanel.find('.api-explorer-param-id').after(compiledTemplate);
        }
        buildPlatformTemplate(data.channel_groups);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        log.error(errorThrown);
      }
    }).then(function () {
      if (checkSelectedChannels) {
        selectChannels(options);
      }
    });
  };

  var selectChannels = function (options) {
    var $tabPanel = $(options.tabPanel);
    var channels = options.queryParameters.id.split(',');
    $tabPanel.find('.channel-picker-checkbox').each(function (index, checkbox) {
      var channelIndex = $.inArray($(checkbox).val(), channels);
      if (channelIndex !== -1) {
        $(checkbox).prop('checked', true);
      } else {
        $(checkbox).prop('checked', false);
      }
      $(checkbox).trigger('change');
    });
  };

  var buildPlatformTemplate = function (platforms) {
    var compiledTemplate = new EJS({
      url: 'assets/templates/platformPicker.ejs'
    }).render(platforms);
    $('.platform-picker').html(compiledTemplate);
    buildDummyRegionsTemplate();
    buildDummySearchTemplate();
    $('.channel-picker-platforms').on('change', function () {
      var platformId = $(this).val();
      var platformTitle;
      var regions;
      _.forEach(platforms, function (platform) {
        if (platform.id === platformId) {
          regions = platform.regions;
          platformTitle = platform.title;
        }
      });
      if ($(this).val() !== '') {
        buildRegionsTemplate(regions, platformTitle);
      } else {
        buildDummyRegionsTemplate();
        buildDummySearchTemplate();
      }
    });
  };

  var buildDummyRegionsTemplate = function () {
    var compiledTemplate = new EJS({
      url: 'assets/templates/dummyRegionsTemplate.ejs'
    }).render();
    $('.region-picker').html(compiledTemplate);
  };

  var buildRegionsTemplate = function (regions, platformTitle) {
    var compiledTemplate = new EJS({
      url: 'assets/templates/regionsPicker.ejs'
    }).render(regions);
    $('.region-picker').html(compiledTemplate);
    buildDummySearchTemplate();
    $('.channel-picker-regions').on('change', function () {
      var regionId = $(this).val();
      if (regionId !== '') {
        getRegionChannels(regionId, platformTitle);
      } else {
        buildDummySearchTemplate();
      }
    });
  };

  var buildDummySearchTemplate = function () {
    var compiledTemplate = new EJS({
      url: 'assets/templates/dummySearchTemplate.ejs'
    }).render();
    $('#channel-search').html(compiledTemplate);
  };

  var getRegionChannels = function (regionId, platformTitle) {
    var channelsEndpoint = '//atlas.metabroadcast.com/4/channel_groups/';
    var channelsAnnotations = '?annotations=channels';
    var searchResults = [];
    var channelsUrl = channelsEndpoint + regionId + '.json' + channelsAnnotations + '&type=region' + '&key=' + apiKey;
    $.ajax({
      url: channelsUrl,
      success: function (data) {
        var regionTitle = data.channel_group.title;
        _.forEach(data.channel_group.channels, function (channel) {
          searchResults.push(channel);
        });
        buildChannelsTemplate(data.channel_group.channels, platformTitle, regionTitle);
        buildChannelSearchTemplate(searchResults);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        log.error(errorThrown);
      }
    });
  };

  var buildChannelsTemplate = function (channels, platformTitle, regionTitle) {
    _.forEach(channels, function (channel) {
      channel.platform_title = platformTitle;
      channel.region_title = regionTitle;
    });
    var compiledTemplate = new EJS({
      url: 'assets/templates/channels.ejs'
    }).render(channels);
    $('.channels-container').html(compiledTemplate);
  };

  var substringMatcher = function (strs) {
    return function (query, callback) {
      var matches = [];
      var substrRegex = new RegExp(query, 'i');
      $.each(strs, function (i, str) {
        if (substrRegex.test(str.query)) {
          matches.push({
            value: str.value,
            id: str.channel.id
          });
        }
      });
      callback(matches);
    };
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
    var compiledTemplate = new EJS({
      url: 'assets/templates/channelSearch.ejs'
    }).render(data);
    $('.channel-search').html(compiledTemplate);
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
    $(document).on('typeahead:autocompleted typeahead:selected', '#channel-search-box', function (event, datum) {
      $('.channel-picker-checkbox').each(function () {
        if (datum.id === $(this).val()) {
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
  
  var closeChannelPicker = function () {
    $(document).on('click', '.close-channel-picker', function (e) {
      e.preventDefault();
      if ($('.channel-picker-row').length) {
        $('.channel-picker-row').remove();
      }
    });  
  };
  
  var channelPickerChange = function () {
    $(document).on('change', '.channel-picker-checkbox', function () {
      var channelIds = [];
      $('.channel-picker-checkbox').each(function () {
        if ($(this).is(':checked')) {
          channelIds.push($(this).val());
        }
      });
      $('#schedules-id-input').val(channelIds.join(',')).trigger('change');
    });
  };

  var init = function () {
    channelPickerClick();
    closeChannelPicker();
    channelPickerChange();
  };

  return {
    init: init,
    toggle: toggleChannelPicker
  };
})();
