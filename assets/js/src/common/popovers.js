var popovers = (function () {
  'use strict';
  
  return function () {
    var hoverTimer;
    $('.hov').bind('mouseover',function () {
      var that = $(this);
      var thatHeight = $(this).height();
      hoverTimer = setTimeout(function () {
        if (that.find('.hover').length === 0) {
          if (!that.hasClass('hovDown')) {
            $('.hover[data-title="'+that.attr('data-title')+'"]').clone().css({'bottom': thatHeight+5}).appendTo(that).fadeIn('fast');
          } else {
            $('.hover[data-title="'+that.attr('data-title')+'"]').clone().css({'top': thatHeight+5}).appendTo(that).fadeIn('fast');
          }
        } else {
          that.find('.hover').fadeIn('fast');
        }
      }, 500);
      $('.hov').bind('mouseout',function () {
        clearTimeout(hoverTimer);
        that.find('.hover').fadeOut('fast');
      });
    });
  }
})();