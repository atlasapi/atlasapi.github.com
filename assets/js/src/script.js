var popovers = function () {
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
};

var loginToAdmin = function () {
  var url;
  if (MBST.ENV === 'stage' || window.location.href.indexOf('stage')) {
    url = '//stage.atlas.metabroadcast.com/4/auth/providers.json';
  } else {
    url = '//atlas.metabroadcast.com/4.0/auth/providers.json';
  }
  $.ajax({
    url: url,
    success: function (data) {
      var str = '<div style="font-size: 16px; text-align: left;" class="mbl">Log in with one of the services below</div>',
        i,
        ii;
      if (data.auth_providers && data.auth_providers.length > 0) {
        for (i = 0, ii = data.auth_providers.length; i < ii; i += 1) {
          str += '<a href="http://atlas.metabroadcast.com/admin#/login/' + data.auth_providers[i].namespace + '" class="signInBtn btn-'+ data.auth_providers[i].namespace +'"><span class="fa fa-'+ data.auth_providers[i].namespace +'"></span>Sign In with '+ data.auth_providers[i].namespace +'</a>';
        }
      }
      str += '';
      $('.loginHolder').html(str);
      $('.loginWrapper').show().click(function () {
        $('.loginWrapper').hide();
      });
    }
  });
};

$(document).ready(function () {

  $('section:not(.subSection):last-child').css('min-height', $(window).height() - 100);

  popovers();

  $(document).on('click', '.getApiKeyBtn', function (e) {
    e.preventDefault();
    loginToAdmin();
  });

  handleLoggedInStatus();

  var nowNextLater = new NowNextLater();
  nowNextLater.init();

  apiData.init(function (data) {
    var apiDocsSubmenu = new EJS({
      url: 'assets/templates/api-docs-submenu.ejs'
    }).render(data);
    $('#api-docs-submenu').html(apiDocsSubmenu);

    apiDocs.init(data);
  });

  var apiExplorer = new ApiExplorer();
  apiExplorer.init();

  $(document).on('click', '.has-submenu', function (e) {
    e.preventDefault();
    var $submenu = $(this).find('.submenu');
    $('.submenu').not($submenu).hide();
    $submenu.toggle();
  });
});

$(window).load(function () {
  uiTabs.init();
  submenus.init();
  highlightCurrentPage.init();
});
