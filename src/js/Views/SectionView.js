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
  }
});
