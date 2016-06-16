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
      client: 'atlasNowNextLater',
      widgets: [
        {
          name: 'epg',
          version: '1',
          modules: {
            grid: {
              holder: '.epg-widget'
            }
          }
        }
      ]
    });
  }
});
