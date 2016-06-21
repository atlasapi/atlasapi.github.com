export default Backbone.View.extend({
  initialize: function (options) {
    if ($(options.templateId)) {
      this.template = Handlebars.compile($(options.templateId).html());
      this.render();
    }
  },

  render: function () {
    if (this.el) {
      this.el.innerHTML = this.template();
    }

    MBST.load({
      client: 'demo',
      widgets: [
        {
          name: 'epg',
          version: '1',
          modules: {
            common: {
              useAtlas4: true
            },
            grid: {
              holder: '#GRID',
              showTimes: true,
              nav: {
                days: 7,
                fixed: true,
                showDates: true,
                showTime: true,
                dateFormat: ["ddd", "D"],
                friendlyDayNames: {
                  today: true,
                  yesterday: true
                }
              }
            },
            "featured": {
              holder: "#FEATURED",
              items: 3,
              useGrid: false,
              arrowOverlap: true,
              showDescription: false
            }
          },
          customStyle: true,
          customScript: true
        }
      ]
    });
  }
});
