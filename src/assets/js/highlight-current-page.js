var highlightCurrentPage = (function () {
  'use strict';

  var active = location.hash;
  var headerHeight = 64;
  var activeClass = 'active-link';

  var isOnScreen = function (el) {
    if (el.charAt(0) === '/') {
      el = el.substring(1);
    }
    if (el.charAt(0) !== '#') {
      return;
    }
    if (!$(el).length) {
      return;
    }
    var distance = $(el).offset().top - 150;
    var $window = $(window);
    if ($window.scrollTop() > distance && $window.scrollTop() < distance + 90 + $(el).height() && $(el).is(':visible')) {
      return true;
    }
  };

  var updateOnScroll = function () {
    if (active && $(active).length) {
      $(window).scrollTop($(active).offset().top - headerHeight);
    }

    $('#nav-main a').not('.user-menu a, .api-docs-link, .api-docs-submenu-link a').on('click', function (e) {
      var target = $(this).attr('href');
      if (target.charAt(0) === '/') {
        target = target.substring(1);
      }
      if (!$(target).length) {
        return;
      }
      e.preventDefault();
      $(window).scrollTop($(target).offset().top - headerHeight);
      if (history.pushState) {
        history.pushState(null, null, target);
      }
    });

    var onScroll = function () {
      $('#nav-main > li').not('.user-menu').each(function () {
        var target = $(this).find('a').attr('href');
        if (isOnScreen(target)) {
          $(this).siblings().removeClass(activeClass);
          $(this).addClass(activeClass);
          if (!$('.submenu').is(':visible')) {
            if (history.pushState) {
              history.pushState(null, null, target);
            }
          }
        } else {
          $(this).removeClass(activeClass);
        }
      });

      $('.submenu > li').not('.user-menu .submenu').each(function () {
        var target = $(this).find('a').attr('href');
        if (isOnScreen(target)) {
          $(this).siblings().removeClass(activeClass);
          $(this).addClass(activeClass);
          if ($('.submenu').is(':visible')) {
            if (history.pushState) {
              history.pushState(null, null, target);
            } else {
              $(this).removeClass(activeClass);
            }
          }
        }
      });

      if (isOnScreen('#home')) {
        if (history.pushState) {
          history.pushState(null, null, '#home');
        }
      }
    };

    $(document).scroll(_.debounce(onScroll, 100));
  };

  return {
    init: updateOnScroll
  };
})();