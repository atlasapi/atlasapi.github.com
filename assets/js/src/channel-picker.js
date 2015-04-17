var channelPicker = (function () {

  // $('.channel-picker-toggle').on('click', function (e) {
  //   e.preventDefault();
  //   toggleChannelPicker(data);
  // });
  // $(document).on('click', '.close-channel-picker', function (e) {
  //   e.preventDefault();
  //   if ($('.channel-picker-row').length) {
  //     $('.channel-picker-row').remove();
  //   }
  // });
  // $(document).on('change', '.channel-picker-checkbox', function () {
  //   var channelIds = [];
  //   $('.channel-picker-checkbox').each(function () {
  //     if ($(this).is(':checked')) {
  //       channelIds.push($(this).val());
  //     }
  //   });
  //   if (channelIds.length === 1) {
  //     singleId = true;
  //   } else {
  //     singleId = false;
  //   }
  //   $('#schedules-id-input').val(channelIds.join(',')).trigger('change');
  // });

  // var toggleChannelPicker = function () {
  //   var compiledTemplate;
  //   $.ajax({
  //     url: '//atlas.metabroadcast.com/4/channel_groups.json?type=platform&annotations=channels,regions&key=' + defaultApiKey,
  //     success: function (data) {
  //       var channelGroups = data.channel_groups;
  //       compiledTemplate = new EJS({
  //         url: 'assets/templates/channelPicker.ejs'
  //       }).render();
  //       if ($('.channel-picker-row').length) {
  //         $('.channel-picker-row').remove();
  //       } else {
  //         $('#schedules-id-row').after(compiledTemplate);
  //       }
  //       buildPlatformTemplate(channelGroups);
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.error(errorThrown);
  //     }
  //   });
  // };

  // var buildPlatformTemplate = function (data) {
  //   var regions;
  //   compileTemplate({
  //     path: 'assets/templates/platformPicker.ejs',
  //     container: '.platform-picker'
  //   }, data); 
  //   buildDummyRegionsTemplate();
  //   buildDummySearchTemplate();
  //   $('.channel-picker-platforms').on('change', function () {
  //     var platformId = $(this).val();
  //     for (var i = 0, ii = data.length; i < ii; i++) {
  //       if (data[i].id === platformId) {
  //         regions = data[i].regions;
  //         _.forEach(regions, function (region) {
  //           region.platform_title = data[i].title;
  //         });
  //       }
  //     }
  //     if ($(this).val() !== '') {
  //       console.log('regions', regions);
  //       buildRegionsTemplate(regions);
  //     } else {
  //       buildDummyRegionsTemplate();
  //       buildDummySearchTemplate();
  //     }
  //   });
  // };

  // var buildDummyRegionsTemplate = function () {
  //   compileTemplate({
  //     path: 'assets/templates/dummyRegionsTemplate.ejs',
  //     container: '.region-picker'
  //   });
  // };

  // var buildRegionsTemplate = function (data) {
  //   var regionId;
  //   compileTemplate({
  //     path: 'assets/templates/regionsPicker.ejs',
  //     container: '.region-picker'
  //   }, data);
  //   buildDummySearchTemplate();
  //   $('.channel-picker-regions').on('change', function () {
  //     regionId = $(this).val();
  //     if (regionId !== '') {
  //       getRegionChannels(regionId);
  //     } else {
  //       buildDummySearchTemplate();
  //     }
  //   });
  // };

  // var buildDummySearchTemplate = function () {
  //   compileTemplate({
  //     path: 'assets/templates/dummySearchTemplate.ejs',
  //     container: '#channel-search'
  //   });
  // };

  // var buildChannelSearchTemplate = function (data) {
  //   var now = new Date().toISOString();
  //   var monthMap = {
  //     1: 'January',
  //     2: 'February',
  //     3: 'March',
  //     4: 'April',
  //     5: 'May',
  //     6: 'June',
  //     7: 'July',
  //     8: 'August',
  //     9: 'September',
  //     10: 'October',
  //     11: 'November',
  //     12: 'December'
  //   };
  //   compileTemplate({
  //     path: 'assets/templates/channelSearch.ejs',
  //     container: '.channel-search'
  //   }, data);
  //   for (var i = 0, ii = data.length; i < ii; i++) {
  //     var startDate = new Date(data[i].start_date);
  //     var formattedDate = {};
  //     var query = [];
  //     if (startDate.getDay() === 1 || startDate.getDay() === 21 || startDate.getDay() === 31) {
  //       formattedDate.day = startDate.getDay() + 'st ';
  //     } else if (startDate.getDay() === 2 || startDate === 22) {
  //       formattedDate.day = startDate.getDay() + 'nd ';
  //     } else if (startDate.getDay() === 3 || startDate === 23) {
  //       formattedDate.day = startDate.getDay() + 'rd ';
  //     } else {
  //       formattedDate.day = startDate.getDay() + 'th ';
  //     }
  //     formattedDate.month = monthMap[startDate.getMonth()] + ' ';
  //     formattedDate.year = startDate.getFullYear();
  //     if (data[i].start_date > now) {
  //       var startDateString = formattedDate.day + formattedDate.month + formattedDate.year;
  //       data[i].value = data[i].channel.title + ' (' + data[i].channel.id + ') Starts on ' + startDateString;
  //     } else {
  //       data[i].value = data[i].channel.title + ' (' + data[i].channel.id + ')';
  //     }
  //     query = [
  //       data[i].channel.title,
  //       data[i].channel.id,
  //       data[i].channel.title.replace(/\s/ig, ''),
  //       data[i].channel.title.replace(/\s?one/ig, '1'),
  //       data[i].channel.title.replace(/\s?two/ig, '2'),
  //       data[i].channel.title.replace(/\s?three/ig, '3'),
  //       data[i].channel.title.replace(/\s?four/ig, '4'),
  //       data[i].channel.title.replace(/\s?five/ig, '5')
  //     ];
  //     data[i].query = query.join();
  //   }
  //   $('#channel-search-box').typeahead({
  //     hint: true,
  //     highlight: true,
  //     minLength: 1
  //   }, {
  //     name: 'data',
  //     displayKey: 'value',
  //     source: substringMatcher(data)
  //   });
  //   $(document).on('typeahead:autocompleted typeahead:selected', '#channel-search-box', function (obj, datum, name) {
  //     $('.channel-picker-checkbox').each(function () {
  //       if (datum.channel.id === $(this).val()) {
  //         $(this).prop('checked', true).trigger('change');
  //         if (!$('.id-added').length) {
  //           $('#channel-search-box').after('<div class="id-added">&#10003;</div>');
  //           setTimeout(function () {
  //             $('.id-added').fadeOut('slow', function () {
  //               $(this).remove();
  //             });
  //           }, 1000);
  //         }
  //       }
  //     });
  //   });
  // };

  // var substringMatcher = function (strs) {
  //   return function (q, cb) {
  //     var matches = [];
  //     var substrRegex = new RegExp(q, 'i');
  //     $.each(strs, function (i, str) {
  //       if (substrRegex.test(str.query)) {
  //         matches.push({
  //           value: str.value,
  //           id: str.id
  //         });
  //       }
  //     });
  //     cb(matches);
  //   };
  // };

  // var getRegionChannels = function (regionId) {
  //   var channelsEndpoint = '//atlas.metabroadcast.com/4/channel_groups/';
  //   var channelsAnnotations = '?annotations=channels';
  //   var channelsUrl;
  //   var channelsData;
  //   var searchResults = [];
  //   var platformTitle;
  //   var regionTitle;
  //   channelsUrl = channelsEndpoint + regionId + '.json' + channelsAnnotations + '&type=region' + '&key=' + defaultApiKey;
  //   $.ajax({
  //     url: channelsUrl,
  //     success: function (data) {
  //       channelsData = data;
  //       console.log(data);
  //       platformTitle = channelsData.channel_group.platform_title;
  //       regionTitle = channelsData.channel_group.title;
  //       for (var i = 0, ii = channelsData.channel_group.channels.length; i < ii; i++) {
  //         searchResults.push(channelsData.channel_group.channels[i]);
  //       }
  //       buildChannelsTemplate(channelsData.channel_group.channels, platformTitle, regionTitle);
  //       buildChannelSearchTemplate(searchResults);
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.error(errorThrown);
  //     }
  //   });
  // };

  // var buildChannelsTemplate = function (channels, platformTitle, regionTitle) {
  //   var regexPattern = new RegExp('[^/]+$');
  //   for (var i = 0, ii = channels.length; i < ii; i++) {
  //     var aliases = channels[i].channel.aliases;
  //     channels[i].platform_title = platformTitle;
  //     channels[i].region_title = regionTitle;
  //   }
  //   compileTemplate({
  //     path: 'assets/templates/channels.ejs',
  //     container: '.channels-container'
  //   }, channels);
  // };

  var init = function (endpointsData) {
    console.log('endpointsData', endpointsData);
    console.log('Channel picker has been initialised');
  };
  
  return {
    init: init
  };
})();