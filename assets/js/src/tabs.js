var UiTabs = (function () {
  'use strict';

  var activeClass = 'ui-tabs-active-link';

  var activateLink = function (elem) {
    $('.' + activeClass).removeClass(activeClass);
    $(elem).addClass(activeClass);
  };

  var activateTab = function (tabSelector) {
    $('.ui-tabs-panel').hide();
    $(tabSelector).show();
  };

  var transition = function (selector, link) {
    activateTab(selector);
    activateLink(link);
  };

  var showActiveTab = function () {
    var active = location.hash;

    if (active) {
      transition(active, 'a[href="' + active + '"]');
    }

    $(document).on('click', '.ui-tabs-link', function (e) {
      e.preventDefault();
      transition($(this).attr('href'), $(this));
      if (history.pushState) {
        history.pushState(null, null, $(this).attr('href'));
      }
    });
  };

  return {
    init: showActiveTab
  };
})();
