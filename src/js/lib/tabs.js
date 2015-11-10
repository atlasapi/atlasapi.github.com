var uiTabs = (function () {
  'use strict';

  return function () {
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
      $(tabSelector).closest('.ui-tabs').find('.ui-tabs-panel').hide();
      $(tabSelector).show();
    };

    if (active) {
      transition(active, 'a[href="' + active + '"]');
    }

    $('.ui-tabs').each(function () {
      var $tabsContainer = $(this);

      $(document).on('click', '.ui-tabs-link', function (e) {
        e.preventDefault();
        var target = $(this).attr('href');
        transition($(this).attr('href'), $(this));
        if (history.pushState) {
          history.pushState(null, null, $(this).attr('href'));
        }
      });
    });
  }
})();
