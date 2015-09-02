var highlightCurrentPage = (function () {
  'use strict';

  var active = location.hash;
  var headerHeight = 64;
  var activeClass = 'active-link';

  var isOnScreen = function (el) {
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

    $('#nav-main a, .navbar-api-explorer-btn').not('.user-menu a').on('click', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      $(window).scrollTop($(target).offset().top - headerHeight);
      if (history.pushState) {
        history.pushState(null, null, target);
      }
    });

    $(document).on('click', '#api-docs-submenu a', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      if (history.pushState) {
        history.pushState(null, null, target);
      }
      $('.ui-tabs').find('a[href="' + target + '"]').trigger('click');
      $(window).scrollTop($('#api-docs').offset().top - headerHeight);
    });

    $(document).on('click', '#api-docs .menu .menu-item', function () {
      var target = $(this).attr('href');
      $('.api-docs-submenu-link').removeClass(activeClass);
      $('#api-docs-submenu').find('a[href="' + target + '"]').closest('.api-docs-submenu-link').addClass(activeClass);
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

      $('#api-docs-submenu').find('a').each(function () {
        var target = $(this).attr('href');
        if ($(target).is(':visible') && isOnScreen(target)) {
          history.pushState(null, null, target);
          $('#api-docs-submenu').find('.api-docs-submenu-link').removeClass(activeClass);
          $('#api-docs-submenu').find('a[href="' + target + '"]').closest('.api-docs-submenu-link').addClass(activeClass);
        }
      });

      if (isOnScreen('#apiExplorer')) {
        if (history.pushState) {
          history.pushState(null, null, '#apiExplorer');
        }
      }

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
