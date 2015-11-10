var channelGroupPicker = (function () {
  'use strict';

  var apiKey = 'c1e92985ec124202b7f07140bcde6e3f';

  var channelGroupPickerClick = function () {
    $('.channel-group-picker-toggle').on('click', function (e) {
      e.preventDefault();
      toggleChannelGroupPicker();
    });
  };

  var toggleChannelGroupPicker = function (options) {
    $.ajax({
      url: 'https://atlas.metabroadcast.com/4/channel_groups.json?type=platform&annotations=channels,regions&key=' + apiKey,
      success: function (data) {
        var template = Handlebars.compile($('#channel-group-picker-template').html());
        if ($('.channel-group-picker-container').find('.channel-group-platform-picker').length) {
          $('.channel-group-picker-container').empty();
        } else {
          $('.channel-group-picker-container').html(template());
          buildPlatformTemplate(data.channel_groups);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        log.error(errorThrown);
      }
    });
  };

  var buildPlatformTemplate = function (platforms) {
    var template = Handlebars.compile($('#platform-picker-template').html());
    $('.channel-group-platform-picker').html(template(platforms));
    buildDummyRegionsTemplate();
    $('.channel-group-picker-container').find('.channel-picker-platforms').on('change', function (e) {
      var platformId = $(this).val();
      var platformTitle;
      var regions;
      _.forEach(platforms, function (platform) {
        if (platform.id === platformId) {
          regions = platform.regions;
          platformTitle = platform.title;
        }
      });
      $('#channel_groups-id-row').find('.queryParameter').val(platformId);
      $('#channel_groups-type-row').find('.queryParameter').find('option[value="platform"]').attr('selected', 'selected');
      $('#channel_groups-type-row').find('.queryParameter').trigger('change');
      if ($(this).val() !== '') {
        buildRegionsTemplate(regions, platformTitle);
      } else {
        buildDummyRegionsTemplate();
      }
    });
  };

  var buildRegionsTemplate = function (regions, platformTitle) {
    var template = Handlebars.compile($('#regions-picker-template').html());
    $('#channel_groups-id-row').find('.channel-group-region-picker').html(template(regions));
    $(document).on('change', '.channel-group-region-picker .channel-picker-regions', function () {
      var regionId = $(this).val();
      $('#channel_groups-id-row').find('.queryParameter').val(regionId);
      $('#channel_groups-type-row').find('.queryParameter').find('option[value="region"]').attr('selected', 'selected');
      $('#channel_groups-type-row').find('.queryParameter').trigger('change');
    });
  };

  var buildDummyRegionsTemplate = function () {
    var template = Handlebars.compile($('#dummy-regions-template').html());
    $('#channel_groups-id-row').find('.channel-group-region-picker').html(template());
  };

  var closeChannelGroupPicker = function () {
    $(document).on('click', '.close-channel-group-picker', function (e) {
      e.preventDefault();
      $('.channel-group-picker-container').empty();
    });
  };

  var init = function () {
    channelGroupPickerClick();
    closeChannelGroupPicker();
  };

  return {
    init: init
  };
})();
