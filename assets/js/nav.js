function highlightCurrentPage() {

  if (window.location.hash) {
    $(window).scrollTop($(window.location.hash).offset().top - 100);
  }

  function isOnScreen(el) {
    var distance = $(el).offset().top - 200,
        $window = $(window);

    if ($window.scrollTop() > distance && $window.scrollTop() < distance + 90 + $(el).height()) {
      return true;
    } else {
      return false;
    }
  }

  $('#nav-main a, .navbar-api-explorer-btn').on('click', function (e) {
    e.preventDefault();
    var target = $(this).attr('href');
    $(window).scrollTop($(target).offset().top - 100);
    if (history.pushState) {
      history.pushState(null, null, target);
    }
  });

  $(document).scroll(function () {

    $('#nav-main > li').each(function () {
      var target = $(this).find('a').attr('href');
      if (isOnScreen(target)) {
        $(this).siblings().removeClass('active-link');
        $(this).addClass('active-link');
        if (!$('.submenu').is(':visible')) {
          if (history.pushState) {
            history.pushState(null, null, target);
          }
        }
      } else {
        $(this).removeClass('active-link');
      }
    });

    $('.submenu > li').each(function () {
      var target = $(this).find('a').attr('href');
      if (isOnScreen(target)) {
        $(this).siblings().removeClass('active-link');
        $(this).addClass('active-link');
        if ($('.submenu').is(':visible')) {
          if (history.pushState) {
            history.pushState(null, null, target);
          } else {
            $(this).removeClass('active-link');
          }
        }
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
  });
}
