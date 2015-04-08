var UiTabs = (function () {
  'use strict';

  var showActiveTab = function () {
    var activeClass = 'ui-tabs-active-link';
    var active = location.hash;

    var transition = function (selector, link) {
      activateTab(selector);
      activateLink(link);
    };

    var activateLink = function (elem) {
      $(elem).closest('.ui-tabs-nav').find('.' + activeClass).removeClass(activeClass);
      $(elem).addClass(activeClass);
    };

    var activateTab = function (tabSelector) {
      $(tabSelector).siblings('.ui-tabs-panel').hide();
      $(tabSelector).show();
    };

    if (active) {
      transition(active, 'a[href="' + active + '"]');
    }

    $('.ui-tabs').each(function () {
      var $tabsContainer = $(this);

      $tabsContainer.find('.ui-tabs-link').on('click', function (e) {
        e.preventDefault();
        transition($(this).attr('href'), $(this));
        if (history.pushState) {
          history.pushState(null, null, $(this).attr('href'));
        }
      });
    });
  };

  return {
    init: showActiveTab
  };
})();
