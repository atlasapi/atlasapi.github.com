var app = app || {};

app.tabs = function (tabSection) {
  $(tabSection).each(function () {
    var $tabs = $(tabSection);
    $(this).find(".tab-panel").not(":first").hide();
    $tabs.find(".tabs li:first-child").addClass("tabs-current");
    $tabs.find(".tabs a").on("click", function (e) {
      e.preventDefault();
      var $this = $(this);
      var tabTarget = $this.attr("href");
      $this.parent().addClass("selected").siblings().removeClass("selected");
      $(tabTarget).show().siblings(".tab-panel").hide();
    });
  });
};
