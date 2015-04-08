var UiTabs = (function () {
  'use strict';

  var showActiveTab = function () {
    var activeClass = 'ui-tabs-active-link';

    $('.ui-tabs').each(function () {
      var $tabsContainer = $(this);

      var activateLink = function (elem) {
        $tabsContainer.find('.' + activeClass).removeClass(activeClass);
        $(elem).addClass(activeClass);
      };

      var activateTab = function (tabSelector) {
        $tabsContainer.find('.ui-tabs-panel').hide();
        $(tabSelector).show();
      };

      var transition = function (selector, link) {
        activateTab(selector);
        activateLink(link);
      };

      var active = location.hash;

      if (active) {
        transition(active, 'a[href="' + active + '"]');
      }

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
