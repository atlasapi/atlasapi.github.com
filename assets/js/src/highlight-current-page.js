var HighlightCurrentPage = (function () {
  'use strict';

  var init = function () {

  };

  return {
    init: init
  };
})();

// function highlightCurrentPage() {

//   if (window.location.hash !== '') {
//     $(window).scrollTop($(window.location.hash).offset().top - 64);
//   }

//   function isOnScreen(el) {
//     var distance = $(el).offset().top - 150,
//         $window = $(window);

//     if ($window.scrollTop() > distance && $window.scrollTop() < distance + 90 + $(el).height()) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   $('#nav-main a, .navbar-api-explorer-btn').not('.user-menu a').on('click', function (e) {
//     e.preventDefault();
//     var target = $(this).attr('href');
//     $(window).scrollTop($(target).offset().top - 64);
//     if (history.pushState) {
//       history.pushState(null, null, target);
//     }
//   });

//   $(document).scroll(function () {

//     $('#nav-main > li').not('.user-menu').each(function () {
//       var target = $(this).find('a').attr('href');
//       if (isOnScreen(target)) {
//         $(this).siblings().removeClass('active-link');
//         $(this).addClass('active-link');
//         if (!$('.submenu').is(':visible')) {
//           if (history.pushState) {
//             history.pushState(null, null, target);
//           }
//         }
//       } else {
//         $(this).removeClass('active-link');
//       }
//     });

//     $('.submenu > li').not('.user-menu .submenu').each(function () {
//       var target = $(this).find('a').attr('href');
//       if (isOnScreen(target)) {
//         $(this).siblings().removeClass('active-link');
//         $(this).addClass('active-link');
//         if ($('.submenu').is(':visible')) {
//           if (history.pushState) {
//             history.pushState(null, null, target);
//           } else {
//             $(this).removeClass('active-link');
//           }
//         }
//       }
//     });

//     if (isOnScreen('#apiExplorer')) {
//       if (history.pushState) {
//         history.pushState(null, null, '#apiExplorer');
//       }
//     }

//     if (isOnScreen('#home')) {
//       if (history.pushState) {
//         history.pushState(null, null, '#home');
//       }
//     }
//   });
// }
