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

var tooltip = function () {
  $('.tooltip').each(function (index, tooltip) {
    var $tooltip = $(tooltip);
    var tooltipTitle = $tooltip.data('title');
    var tooltipText = $tooltip.data('text');
    var $tooltipBody = $('<div class="tooltip-body"></div>');
    var $tooltipHeading = $('<h4 class="tooltip-heading"></h4>');
    var $tooltipContent = $('<div class="tooltip-content"></div>');

    $tooltipHeading.text(tooltipTitle);
    $tooltipContent.text(tooltipText);
    $tooltipBody
      .append($tooltipHeading)
      .append($tooltipContent);

    $tooltip.on('mouseover', function () {
      $tooltip.append($tooltipBody);
    }).on('mouseout', function () {
      $tooltip.find('.tooltip-body').remove();
    });
  });
};

var dropdowns = function () {
  $(document).on('click', '.dropdown a', function () {
    $(this).closest('.dropdown').addClass('hide-dropdown');
  });

  $(document).on('click', '.has-dropdown', function () {
    $(this).find('.dropdown').addClass('hide-dropdown');
  });

  $(document).on('mouseleave', '.has-dropdown', function () {
    $('.hide-dropdown').removeClass('hide-dropdown');
  });
};

export {elementListToArray, equalHeightCols, tabbedDisplay, tooltip, dropdowns}
