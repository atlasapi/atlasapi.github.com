var submenus = (function () {
  'use strict';

  return function () {
    // Required to make submenu's dissappear on click
    $('.has-submenu a').not('.user-menu-link').on('click', function () {
      $(this).siblings('.submenu').addClass('hide-menu');
    });

    $('.has-submenu a').not('.user-menu-link').on('mouseover', function () {
      $(this).siblings('.submenu').removeClass('hide-menu');
    });

    $(document).on('click', '.submenu a', function () {
      $(this).closest('.submenu').addClass('hide-menu');
    });

    $(document).on('mouseover', '.submenu a', function () {
      $(this).siblings('.submenu').removeClass('hide-menu');
    });

    $(document).on('click', '.user-menu-link', function (e) {
      e.preventDefault();
    });
  };
})();
