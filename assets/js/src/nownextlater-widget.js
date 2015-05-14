var NowNextLater = function () {
  'use strict';

  this.apiKey = '84097c4de516445eb7bb58f4b73d2842';
  this.channelGroupsEndpointURL = '//users-atlas.metabroadcast.com/3.0/channel_groups/';
  this.channelGroupsID = 'cbgZ';
  this.channelGroupsAnnotations = ['channels'];
  this.channelIDsLimit = 200;
  this.scheduleEndpointURL = '//users3-atlas.metabroadcast.com/3.0/schedule.json?';
  this.scheduleCount = 2;
  this.scheduleAnnotations = ['channel', 'channel_summary', 'extended_description', 'brand_summary', 'broadcasts'];
  this.fadeDuration = 1000 * 3;
  this.carouselInterval = false;
  this.carouselSpeed = 1000 * 5;
  this.burnGuardTimeout = false;
  this.fullscreenInterval = false;
  this.loadPanelTimeout = false;
  this.loadImageTimeout = false;
  this.fullscreenButton = $('<a class="fullscreen-button" href="#"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAXCAQAAAC7KEemAAAA7klEQVR4Ab3UP2oCURgE8GfpFbyAIF5ARKysRZBUGoVAzmHnNp7EU1jZWHoR/xWCz1/AYh8PE3GbzFSzzBS7M98GhauEvYaQqGEv4aoIbnIMssBAjlsAsLOwMFbLAjXjx/MdQApEE+EPTsQ8sHFBNP3VPhVxsUmBQt8Z0ezJPhNx1lekwFLQc0I0z+xzESc9wRKCLYaCoOuIaFTaRyKOug81xDaoa5aGjgPWpV7joFPqpnqQs22lVaqWlXbuCCrwfwMV3qHqV3rq4e7jdQ9503ffr5vOt3T39daWyrXO310rRJ/v3EP1i6t+0xX/Gj9yFgEV5JXFEAAAAABJRU5ErkJggg=="></a>');
};

NowNextLater.prototype.buildChannelGroupsURL = function () {
  'use strict';

  var nowNextLater = this,
      channelGroupsURL = nowNextLater.channelGroupsEndpointURL;

  channelGroupsURL += nowNextLater.channelGroupsID + '.json?';
  channelGroupsURL += 'annotations=' + nowNextLater.channelGroupsAnnotations.join();
  channelGroupsURL += '&limit=' + nowNextLater.channelGroupsLimit;

  return encodeURI(channelGroupsURL);
};

NowNextLater.prototype.createListOfChannelIDs = function () {
  'use strict';

  var nowNextLater = this,
      channelGroupsURL = nowNextLater.buildChannelGroupsURL(),
      data = nowNextLater.getData(channelGroupsURL),
      channelGroupsData = data.channel_groups[0].channels,
      channelIDs = [];

  for (var i = 0, ii = nowNextLater.channelIDsLimit; i < ii; i++) {
    channelIDs.push(channelGroupsData[i].channel.id);
  }

  return channelIDs;
};

NowNextLater.prototype.buildScheduleURL = function () {
  'use strict';

  var nowNextLater = this,
      channelIDs = nowNextLater.createListOfChannelIDs(),
      scheduleURL = nowNextLater.scheduleEndpointURL,
      coeff = 1000 * 60 * 5,
      date = new Date(),
      rounded = new Date(Math.round(date.getTime() / coeff) * coeff);

  scheduleURL += 'channel_id=' + channelIDs.join();
  scheduleURL += '&annotations=' + nowNextLater.scheduleAnnotations.join();
  scheduleURL += '&from=' + rounded.toISOString();
  scheduleURL += '&count=' + nowNextLater.scheduleCount;
  scheduleURL += '&apiKey=' + nowNextLater.apiKey;

  return encodeURI(scheduleURL);
};

NowNextLater.prototype.getData = function (url) {
  'use strict';

  var nowNextLater = this,
      dataResponse;

  $.ajax({
    url: url,
    dataType: 'json',
    async: false,
    success: function (data) {
      dataResponse = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      log.error(errorThrown);
    }
  });

  return dataResponse;
};

NowNextLater.prototype.mergeProgrammeData = function () {
  'use strict';

  var nowNextLater = this,
      scheduleURL = nowNextLater.buildScheduleURL(),
      data = nowNextLater.getData(scheduleURL).schedule,
      programmes = [],
      programmeOnNow = {},
      programmeOnNext = {};

  for (var i = 0, ii = data.length; i < ii; i++) {

    if (data[i].items.length) {
      programmeOnNow = data[i].items[0];
      programmeOnNow.channel = data[i].channel;

      if (data[i].items[1]) {
        programmeOnNext = data[i].items[1];
        programmeOnNext.channel = data[i].channel;
      }

      programmes.push(programmeOnNow);
      programmes.push(programmeOnNext);
    }
  }

  return programmes;
};

NowNextLater.prototype.filterOutDuplicates = function (data) {
  'use strict';

  var nowNextLater = this,
      programmes = [],
      programmeIDs = [];

  for (var i = 0, ii = data.length; i < ii; i++) {
    var programmeData = data[i].broadcasts[0].transmission_time + data[i].title;

    if (programmeData && programmeIDs.indexOf(programmeData) === -1) {
      programmes.push(data[i]);
      programmeIDs.push(programmeData);
    }
  }

  return programmes;
};

NowNextLater.prototype.filterOutByLength = function (data, programmeLengthInMinutes) {
  'use strict';

  var nowNextLater = this,
      programmeLengthInSeconds = 60 * programmeLengthInMinutes,
      programmes = [];

  for (var i = 0, ii = data.length; i < ii; i++) {
    if (data[i].broadcasts[0].duration > programmeLengthInSeconds) {
      programmes.push(data[i]);
    }
  }

  return programmes;
};

NowNextLater.prototype.filterOutByStartTime = function (data, minutesSinceStart, minutesTilStart) {
  'use strict';

  var nowNextLater = this,
      now = new Date(),
      millisecondsSinceStart = 1000 * 60 * minutesSinceStart,
      programmes = [];

  for (var i = 0, ii = data.length; i < ii; i++) {
    var startTime = new Date(data[i].broadcasts[0].transmission_time),
        timeSinceStartOffset = new Date(now - millisecondsSinceStart),
        timeTilStartMax = new Date(now).setMinutes(now.getMinutes() + minutesTilStart),
        timeTilStartOffset = new Date(timeTilStartMax);

    if (startTime >= timeSinceStartOffset && startTime <= timeTilStartOffset) {
      programmes.push(data[i]);
    }
  }

  return programmes;
};

NowNextLater.prototype.filterOutGenres = function (data) {
  'use strict';

  var nowNextLater = this,
      programmes = [];

  for (var i = 0, ii = data.length; i < ii; i++) {
    var genres = data[i].genres;

    if ($.inArray('http://ref.atlasapi.org/atlas/news', genres) === -1 &&
        $.inArray('http://www.bbc.co.uk/programmes/genres/news', genres) === -1 &&
        $.inArray('http://www.bbc.co.uk/programmes/genres/weather', genres) === -1 &&
        $.inArray('http://pressassociation.com/genres/2F02', genres) === -1 &&
        $.inArray('http://pressassociation.com/genres/A600', genres) === -1 &&
        $.inArray('http://pressassociation.com/genres/audio', genres) === -1 &&
        $.inArray('http://pressassociation.com/genres/6000', genres) === -1 &&
        $.inArray('http://pressassociation.com/genres/2F06', genres) === -1) {
      programmes.push(data[i]);
    }
  }

  return programmes;
};

NowNextLater.prototype.filterOutNoImages = function (data) {
  'use strict';

  var nowNextLater = this,
      programmes = [];

  for (var i = 0, ii = data.length; i < ii; i++) {
    if (data[i].image) {
      programmes.push(data[i]);
    }
  }

  return programmes;
};

NowNextLater.prototype.filterOutChannelIDs = function (data) {
  'use strict';

  var nowNextLater = this,
      programmes = [];

  for (var i = 0, ii = data.length; i < ii; i++) {
    if (data[i].channel.id !== 'cbZN') {
      programmes.push(data[i]);
    }
  }

  return programmes;
};

NowNextLater.prototype.formatStartTimes = function (data) {
  'use strict';

  var nowNextLater = this,
      programmes = [],
      now = new Date().getTime();

  for (var i = 0, ii = data.length; i < ii; i++) {
    var startTime = new Date(data[i].broadcasts[0].transmission_time).getTime(),
        minutes,
        seconds,
        milliseconds,
        startTimeString;

    if (startTime < now) {
      milliseconds = now - startTime;
      seconds = Math.floor(milliseconds / 1000);
      minutes = Math.floor(seconds / 60);

      startTimeString = 'Started ';

      if (seconds < 60) {
        if (seconds === 1) {
          startTimeString += seconds + ' second';
        } else {
          startTimeString += seconds + ' seconds';
        }
      } else {
        if (minutes === 1) {
          startTimeString += minutes + ' minute';
        } else {
          startTimeString += minutes + ' minutes';
        }
      }

      startTimeString += ' ago';
    } else {
      milliseconds = startTime - now;
      seconds = Math.floor(milliseconds / 1000);
      minutes = Math.floor(seconds / 60);

      startTimeString = 'Starting in ';

      if (seconds < 60) {
        if (seconds === 1) {
          startTimeString += seconds + ' second';
        } else {
          startTimeString += seconds + ' seconds';
        }
      } else {
        if (minutes === 1) {
          startTimeString += minutes + ' minute';
        } else {
          startTimeString += minutes + ' minutes';
        }
      }
    }

    data[i].start_time_string = startTimeString;

    programmes.push(data[i]);
  }

  return programmes;
};

NowNextLater.prototype.normalizeProgrammeTitles = function (data) {
  'use strict';

  var nowNextLater = this,
      programmes = [];

  for (var i = 0, ii = data.length; i < ii; i++) {
    if (data[i].container) {
      data[i].programme_title = data[i].container.title;
    } else {
      data[i].programme_title = data[i].title;
    }

    programmes.push(data[i]);
  }

  return programmes;
};

NowNextLater.prototype.runProgrammeFilters = function () {
  'use strict';

  var nowNextLater = this,
      programmes = nowNextLater.mergeProgrammeData();

  programmes = nowNextLater.filterOutDuplicates(programmes);
  programmes = nowNextLater.filterOutByLength(programmes, 5);
  programmes = nowNextLater.filterOutByStartTime(programmes, 2, 30);
  programmes = nowNextLater.filterOutGenres(programmes);
  programmes = nowNextLater.filterOutNoImages(programmes);
  programmes = nowNextLater.filterOutChannelIDs(programmes);
  programmes = nowNextLater.normalizeChannelLogos(programmes);
  programmes = nowNextLater.normalizeProgrammeTitles(programmes);
  programmes = nowNextLater.formatStartTimes(programmes);

  return programmes;
};

NowNextLater.prototype.normalizeChannelLogos = function (data) {
  'use strict';

  var nowNextLater = this,
      programmes = data;

  for (var i = 0, ii = programmes.length; i < ii; i++) {
    if (programmes[i].channel.images) {
      for (var j = 0, jj = programmes[i].channel.images.length; j < jj; j++) {
        if ('dark_transparent' === programmes[i].channel.images[j].theme) {
          programmes[i].channel_logo = programmes[i].channel.images[j].uri;
          break;
        } else {
          programmes[i].channel_logo = programmes[i].channel.image;
        }
      }
    } else {
      programmes[i].channel_logo = programmes[i].channel.image;
    }
  }

  return programmes;
};

NowNextLater.prototype.orderByStartTime = function () {
  'use strict';

  var nowNextLater = this,
      programmes = nowNextLater.runProgrammeFilters();

  programmes.sort(function (a, b) {
    a = new Date(a.broadcasts[0].transmission_time);
    b = new Date(b.broadcasts[0].transmission_time);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  return programmes;
};

NowNextLater.prototype.groupDataForFullscreenView = function (data) {
  'use strict';

  var nowNextLater = this,
      programmes = [],
      programmesPerPage = 9;

  for (var i = 0, ii = data.length; i < ii; i += programmesPerPage) {
    programmes.push(data.slice(i, i + programmesPerPage));
  }

  if (programmes[programmes.length -1].length < programmesPerPage) {
    programmes.pop();
  }

  return programmes;
};

NowNextLater.prototype.compileTemplate = function (data, options) {
  'use strict';

  var nowNextLater = this,
      compiledTemplate;

  compiledTemplate = new EJS({
    url: options.template
  }).render(data);

  if (options.append) {
    $(options.container).append(compiledTemplate);
  } else {
    $(options.container).html(compiledTemplate);
  }
};

NowNextLater.prototype.preloadCarouselImages = function (firstPanel, imageContainer) {
  'use strict';

  var nowNextLater = this,
      $firstPanel = $(firstPanel),
      $firstImage = $firstPanel.find(imageContainer),
      firstImageURL = $firstImage.data('src'),
      $secondPanel = $firstPanel.next('.widget-panel'),
      $secondImage = $secondPanel.find(imageContainer),
      secondImageURL = $secondImage.data('src'),
      $thirdPanel = $secondPanel.next('.widget-panel'),
      $thirdImage = $thirdPanel.find(imageContainer),
      thirdImageURL = $thirdImage.data('src');

  $firstImage.attr('src', firstImageURL);
  $secondImage.attr('src', secondImageURL);
  $thirdImage.attr('src', thirdImageURL);
};

NowNextLater.prototype.setupCarousel = function () {
  'use strict';

  var nowNextLater = this,
      programmeData = nowNextLater.orderByStartTime();

  nowNextLater.compileTemplate(programmeData, {
    template: 'assets/templates/carousel.ejs',
    container: '#carousel-widget-container'
  });

  $('#carousel-widget-container').hide();

  nowNextLater.preloadCarouselImages('.carousel-slide:first-child', '.widget-programme-image');
  nowNextLater.preloadCarouselImages('.carousel-slide:first-child', '.widget-channel-logo');

  $('.carousel-slide:first-child .widget-programme-image').on('load', function () {
    $('#carousel-widget-container').fadeIn();
  });

  $('.carousel-slide:gt(0)').hide();

  if (nowNextLater.fullscreenAvailable) {
    $('#carousel-widget-container').prepend(nowNextLater.fullscreenButton);
  }
};

NowNextLater.prototype.triggerCarousel = function () {
  'use strict';

  var nowNextLater = this,
      index,
      carouselItemsCount;

  if (nowNextLater.carouselInterval) {
    clearInterval(nowNextLater.carouselInterval);
  }

  nowNextLater.setupCarousel();

  index = 0;
  carouselItemsCount = $('.carousel-slide').length;

  nowNextLater.carouselInterval = setInterval(function () {

    nowNextLater.preloadCarouselImages('.carousel-slide:first-child', '.widget-programme-image');
    nowNextLater.preloadCarouselImages('.carousel-slide:first-child', '.widget-channel-logo');

    $('.carousel-slide:first-child').fadeOut(nowNextLater.fadeDuration)
      .next('.carousel-slide').fadeIn(nowNextLater.fadeDuration)
      .end().appendTo('.carousel');

    index += 1;

    if (index === carouselItemsCount) {
      nowNextLater.triggerCarousel();
    }

  }, nowNextLater.carouselSpeed);
};

NowNextLater.prototype.removeElement = function (element) {
  'use strict';

  var nowNextLater = this,
      $element = $(element);

  $element.remove();
};

NowNextLater.prototype.fullscreenAvailable = function () {
  'use strict';

  var nowNextLater = this;

  if (this.fullScreenEl.requestFullscreen || this.fullScreenEl.mozRequestFullScreen || this.fullScreenEl.webkitRequestFullscreen || this.fullScreenEl.msRequestFullscreen) {
    return true;
  }
};

NowNextLater.prototype.loadFullscreen = function () {
  'use strict';

  var nowNextLater = this,
      programmeData = nowNextLater.orderByStartTime(),
      dataForFullscreen = nowNextLater.groupDataForFullscreenView(programmeData),
      $widgetPanels = $('.widget-panel-container .widget-panel-inner');

  $widgetPanels.each(function (index) {
    nowNextLater.compileTemplate(dataForFullscreen[0][index], {
      template: 'assets/templates/fullscreen.ejs',
      container: $(this),
      append: true
    });
  });

  nowNextLater.loadNewProgramme(dataForFullscreen);
};

NowNextLater.prototype.loadNewProgramme = function (dataForFullscreen) {
  'use strict';

  var nowNextLater = this,
      items = $('.widget-panel-container .widget-panel-inner'),
      index = 0,
      page = 1;

  nowNextLater.loadPanel(items, index, page, dataForFullscreen);
};

NowNextLater.prototype.loadPanel = function (items, index, page, dataForFullscreen) {
  'use strict';

  var nowNextLater = this,
      $widgetPanel,
      imageLoaded;

  if (page < dataForFullscreen.length) {
    if (index < items.length) {

      nowNextLater.loadPanelTimeout = setTimeout(function () {

        nowNextLater.compileTemplate(dataForFullscreen[page][index], {
          template: 'assets/templates/fullscreen.ejs',
          container: $(items[index]),
          append: true
        });

        $widgetPanel = $(items[index]).find('.widget-panel:last-child');
        $widgetPanel.hide();
        $widgetPanel.find('.widget-programme-image').on('load', function () {
          imageLoaded = true;
          $widgetPanel.fadeIn(1000, function () {
            if ($(items[index - 1]).find('.widget-panel').length > 1) {
              $(items[index-1]).find('.widget-panel:first-child').remove();
            }
          });
        });

        nowNextLater.loadImageTimeout = setTimeout(function () {
          if (!imageLoaded) {
            $widgetPanel.find('.widget-programme-image').attr('src', 'http://placehold.it/460x259&text=Image+not+available');
            $widgetPanel.fadeIn(1500, function () {
              if ($(items[index - 1]).find('.widget-panel').length > 1) {
                $(items[index-1]).find('.widget-panel:first-child').remove();
              }
            });
          }
        }, 1400);

        index++;

        nowNextLater.loadPanel(items, index, page, dataForFullscreen);
      }, 1500);
    } else {
      nowNextLater.loadPanelTimeout = setTimeout(function () {
        var programmeData = nowNextLater.orderByStartTime();
        dataForFullscreen = nowNextLater.groupDataForFullscreenView(programmeData);
        page++;
        nowNextLater.loadPanel(items, 0, page, dataForFullscreen);
      });
    }
  } else {
    nowNextLater.loadPanelTimeout = setTimeout(function () {
      var programmeData = nowNextLater.orderByStartTime();
      dataForFullscreen = nowNextLater.groupDataForFullscreenView(programmeData);
      nowNextLater.loadPanel(items, 0, 0, dataForFullscreen);
    });
  }
};

NowNextLater.prototype.goFullScreen = function (element) {
  'use strict';

  var nowNextLater = this;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(element.ALLOW_KEYBOARD_INPUT);
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};

NowNextLater.prototype.enterFullscreen = function () {
  'use strict';

  var nowNextLater = this;

  clearInterval(nowNextLater.carouselInterval);
  nowNextLater.goFullScreen(document.getElementById('fullscreen-widget-container'));
  nowNextLater.loadFullscreen();
  nowNextLater.startBurnGuard();
  $('#fullscreen-widget-container').show();
};

NowNextLater.prototype.leaveFullscreen = function () {
  'use strict';

  var nowNextLater = this;

  clearInterval(nowNextLater.fullscreenInterval);
  clearTimeout(nowNextLater.burnGuardTimeout);
  clearTimeout(nowNextLater.loadPanelTimeout);
  clearTimeout(nowNextLater.loadImageTimeout);
  $('#fullscreen-widget-container').hide();
  nowNextLater.triggerCarousel();
};

NowNextLater.prototype.startBurnGuard = function () {
  'use strict';

  var nowNextLater = this,
      colors = ['#f00', '#0f0', '#00f'],
      color = 0,
      delay = 5 * 60 * 1000,
      scrollDelay = 1000,
      $burnGuard = $('<div id="burn-guard"></div>'),
      rColor;

  $burnGuard.css({
    'background-color': '#f0f',
    'width': '1px',
    'height': $(document).height() + 'px',
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'display': 'none'
  });

  $burnGuard.appendTo('body');

  color = ++color % 3;
  rColor = colors[color];

  $burnGuard.css({
    'left': 0,
    'background-color': rColor
  }).show().animate({
    'left': $(window).width() + 'px'
  }, scrollDelay, function () {
    $(this).hide();
    if (nowNextLater.burnGuardTimeout) {
      clearTimeout(nowNextLater.burnGuardTimeout);
    }
    nowNextLater.burnGuardTimeout = setTimeout(nowNextLater.startBurnGuard, delay);
  });
};

NowNextLater.prototype.init = function () {
  'use strict';

  var nowNextLater = this;

  nowNextLater.triggerCarousel();

  $(document).on('click', '.fullscreen-button', function (e) {
    e.preventDefault();
    nowNextLater.enterFullscreen();
  });

  $(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function () {
    var fullscreenEnabled = document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitIsFullScreen || document.msFullscreenEnabled ? true : false;

    if (fullscreenEnabled === false) {
      nowNextLater.leaveFullscreen();
    }

    // Fix for IE as it doesn't listen for exitfullscreen event from keyboard input
    if (document.msFullscreenEnabled) {
      $(document).on('keyup', function (e) {
        var escKeyCode = 27;

        if (e.keyCode === escKeyCode) {
          nowNextLater.leaveFullscreen();
        }
      });
    }
  });
};
