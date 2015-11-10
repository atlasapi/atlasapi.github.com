(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ModelsSectionModelJs = require('../Models/SectionModel.js');

var _ModelsSectionModelJs2 = _interopRequireDefault(_ModelsSectionModelJs);

exports['default'] = Backbone.Collection.extend({
  model: _ModelsSectionModelJs2['default'],
  url: '/data/sections.json',
  parse: function parse(response) {
    return response.sections;
  }
});
module.exports = exports['default'];

},{"../Models/SectionModel.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Backbone.Model.extend({});
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ViewsSectionViewJs = require('../Views/SectionView.js');

var _ViewsSectionViewJs2 = _interopRequireDefault(_ViewsSectionViewJs);

exports['default'] = Backbone.View.extend({
  initialize: function initialize() {
    this.collection.fetch().then((function () {
      this.render();
    }).bind(this));
  },

  render: function render() {
    this.collection.each(function (section) {
      var sectionView = new _ViewsSectionViewJs2['default']({
        el: section.get('containerId'),
        templateId: section.get('templateId')
      });
    });
  }
});
module.exports = exports['default'];

},{"../Views/SectionView.js":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Backbone.View.extend({
  initialize: function initialize(options) {
    if ($(options.templateId)) {
      this.template = Handlebars.compile($(options.templateId).html());
      this.render();
    }
  },

  render: function render() {
    if (this.el) {
      this.el.innerHTML = this.template();
    }
  }
});
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var ENV = 'dev';

exports.ENV = ENV;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var elementListToArray = function elementListToArray(eles) {
  var arr = [];
  for (var i = 0, ii = eles.length; i < ii; i += 1) {
    arr.push(eles[i]);
  }

  return arr;
};

// Quick hack to make all feature blocks equal height
var equalHeightCols = function equalHeightCols() {
  $('.feature-block').height('auto');
  if ($(window).width() > 700) {
    var highestCol = Math.max($('.feature-block-audiences').height(), $('.feature-block-platforms').height(), $('.feature-block-developers').height(), $('.feature-block-compliance').height());
    $('.feature-block').height(highestCol);
  } else {
    $('.feature-block').height('auto');
  }
};

var tabbedDisplay = function tabbedDisplay(tabSection) {
  $(tabSection).each(function () {
    var $tabs = $(tabSection);
    $(this).find(".tab-panel").not(":first").hide();
    $tabs.find(".tabs-nav li:first-child").addClass("tabs-current");
    $tabs.find(".tabs-nav a").on("click", function (e) {
      e.preventDefault();
      var $this = $(this);
      var tabTarget = $this.attr("href");
      $this.parent().addClass("tabs-current").siblings().removeClass("tabs-current");
      $(tabTarget).show().siblings(".tab-panel").hide();
    });
  });
};

var tooltip = function tooltip() {
  $('.tooltip').each(function (index, tooltip) {
    var $tooltip = $(tooltip);
    var tooltipTitle = $tooltip.data('title');
    var tooltipText = $tooltip.data('text');
    var $tooltipBody = $('<div class="tooltip-body"></div>');
    var $tooltipHeading = $('<h4 class="tooltip-heading"></h4>');
    var $tooltipContent = $('<div class="tooltip-content"></div>');

    $tooltipHeading.text(tooltipTitle);
    $tooltipContent.text(tooltipText);
    $tooltipBody.append($tooltipHeading).append($tooltipContent);

    $tooltip.on('mouseover', function () {
      $tooltip.append($tooltipBody);
    }).on('mouseout', function () {
      $tooltip.find('.tooltip-body').remove();
    });
  });
};

var dropdowns = function dropdowns() {
  $(document).on('click', '.dropdown a', function () {
    $(this).closest('.dropdown').addClass('hide-dropdown');
  });

  $(document).on('click', '.has-dropdown', function () {
    $(this).find('.dropdown').addClass('hide-dropdown');
  });

  $(document).on('mouseleave', '.has-dropdown', function () {
    $('.hide-dropdown').removeClass('hide-dropdown');
  });
};

var toggleSelectedNavItem = function toggleSelectedNavItem() {
  if ($('.dropdown').find('.selected')) {
    var $selectedItem = $('.dropdown').find('.selected');
    $selectedItem.closest('.has-dropdown').addClass('selected');
  }
};

exports.elementListToArray = elementListToArray;
exports.equalHeightCols = equalHeightCols;
exports.tabbedDisplay = tabbedDisplay;
exports.tooltip = tooltip;
exports.dropdowns = dropdowns;
exports.toggleSelectedNavItem = toggleSelectedNavItem;

},{}],7:[function(require,module,exports){
'use strict';

var _configJs = require('../config.js');

Backbone.View = Backbone.NativeView;
window.test = {};

log.info('Environment: ' + _configJs.ENV);

if (_configJs.ENV === 'dev') {
  log.enableAll();
} else if (_configJs.ENV === 'stage') {
  log.setLevel('error');
} else if (_configJs.ENV === 'prod') {
  log.disableAll();
}

},{"../config.js":5}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _libHelpersJs = require('../lib/helpers.js');

var importTemplates = function importTemplates(templates) {
  templates = (0, _libHelpersJs.elementListToArray)(templates);
  templates.forEach(function (template) {
    var clone = document.importNode(template, true);

    document.body.appendChild(clone);
  });
};

var loadTemplates = function loadTemplates() {
  var templates = document.body.querySelectorAll('link[rel="import"]');

  templates = (0, _libHelpersJs.elementListToArray)(templates);

  if (templates) {
    templates.forEach(function (template) {
      var templateElements = template['import'].querySelectorAll('template');

      if (templateElements) {
        importTemplates(templateElements);
      }
    });
  }
};

exports.loadTemplates = loadTemplates;

},{"../lib/helpers.js":6}],9:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./lib/init.js');

var _libTemplatesJs = require('./lib/templates.js');

var _CollectionsContentCollectionJs = require('./Collections/ContentCollection.js');

var _CollectionsContentCollectionJs2 = _interopRequireDefault(_CollectionsContentCollectionJs);

var _ViewsContentCollectionViewJs = require('./Views/ContentCollectionView.js');

var _ViewsContentCollectionViewJs2 = _interopRequireDefault(_ViewsContentCollectionViewJs);

var _ViewsSectionViewJs = require('./Views/SectionView.js');

var _ViewsSectionViewJs2 = _interopRequireDefault(_ViewsSectionViewJs);

var _libHelpersJs = require('./lib/helpers.js');

(0, _libTemplatesJs.loadTemplates)();

var envInfo = {};

if (window.location.hostname !== 'voila.metabroadcast.com') {
  envInfo.isDev = true;
}

$(function () {
  var contentCollection = new _CollectionsContentCollectionJs2['default']();
  var contentCollectionView = new _ViewsContentCollectionViewJs2['default']({ collection: contentCollection });
  var headerTemplate = Handlebars.compile($('#header-template').html());
  var subHeaderTemplate = Handlebars.compile($('#sub-header-template').html());
  $('#site-header').html(headerTemplate(envInfo));
  $('#sub-header').html(subHeaderTemplate);

  $(document).on('click', '.navbar-login', function (e) {
    e.preventDefault();
    loginToAdmin();
  });
});

$(window).load(function () {
  if ($('#home').length) {
    $('.sub-nav').onePageNav({
      currentClass: 'selected',
      changeHash: true,
      scrollSpeed: 200
    });
  }

  // Initiate API Docs
  apiData.init(function (data) {
    apiDocs.init(data);
  });

  (0, _libHelpersJs.tooltip)();
  (0, _libHelpersJs.dropdowns)();
  handleLoggedInStatus();

  // Makes sure correct nav item is highlighted
  if (window.location.hash) {
    var target = window.location.hash;
    $('.sub-nav').find('a[href=' + target + ']').trigger('click');
  }

  // Initiate now next widget
  var nowNextLater = new NowNextLater();
  nowNextLater.init();
});

$(window).on('scroll', _.debounce(_libHelpersJs.toggleSelectedNavItem, 250));

},{"./Collections/ContentCollection.js":1,"./Views/ContentCollectionView.js":3,"./Views/SectionView.js":4,"./lib/helpers.js":6,"./lib/init.js":7,"./lib/templates.js":8}]},{},[9])


//# sourceMappingURL=main.compiled.js.map
