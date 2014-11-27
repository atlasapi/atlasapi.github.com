var app = app || {};

app.tabs = function (tabSection) {
  $(tabSection).each(function () {
    var $tabs = $(tabSection);
    $(this).find(".tabArea").not(":first").hide();
    $tabs.find(".tabs li:first-child").addClass("selected");
    $tabs.find(".tabs a").on("click", function (e) {
      e.preventDefault();
      var $this = $(this);
      var tabTarget = $this.attr("href");
      $this.parent().addClass("selected").siblings().removeClass("selected");
      $(tabTarget).show().siblings(".tabArea").hide();
    });
  });
};
