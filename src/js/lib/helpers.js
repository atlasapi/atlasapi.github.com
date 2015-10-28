var elementListToArray = function (eles) {
  var arr = [];
  for(let i = 0, ii = eles.length; i < ii; i += 1) {
    arr.push(eles[i]);
  }

  return arr;
};

// Quick hack to make all feature blocks equal height
var equalHeightCols = function () {
  $('.feature-block').height('auto');
  if ($(window).width() > 700) {
    var highestCol = Math.max($('.feature-block-audiences').height(), $('.feature-block-platforms').height(), $('.feature-block-developers').height(), $('.feature-block-compliance').height());
    $('.feature-block').height(highestCol);
  } else {
    $('.feature-block').height('auto');
  }
};

var tabbedDisplay = function (tabSection) {
  $(tabSection).each(function () {
    var $tabs = $(tabSection);
    $(this).find(".tab-panel").not(":first").hide();
    $tabs.find(".tabs-nav li:first-child").addClass("tabs-current");
    $tabs.find(".tabs-nav a").on("click", function (e) {
      e.preventDefault();
      var $this = $(this);
      var tabTarget = $this.attr("href");
      $this.parent().addClass("tabs-current").siblings().removeClass("tabs-current");
      $(tabTarget).show().siblings(".tab-panel").hide();
    });
  });
};

export {elementListToArray, equalHeightCols, tabbedDisplay}
