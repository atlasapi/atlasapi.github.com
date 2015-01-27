function highlightCurrentPage() {

  function isOnScreen(el) {
    var distance = $(el).offset().top - 250,
        $window = $(window);

    if ($window.scrollTop() > distance && $window.scrollTop() < distance + $(el).height()) {
      return true;
    } else {
      return false;
    }
  }

  $(document).scroll(function () {

    $('#nav-main > li').each(function () {
      var target = $(this).find('a').attr('href');
      if (isOnScreen(target)) {
        $(this).siblings().removeClass('active-link');
        $(this).addClass('active-link');
        if (!$('.submenu .active-link')) {
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
  });
}
