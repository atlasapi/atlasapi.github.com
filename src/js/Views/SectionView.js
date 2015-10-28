export default Backbone.View.extend({
  initialize: function (options) {
    this.template = Handlebars.compile($(options.templateId).html());
    this.render();
  },

  render: function () {
    this.el.innerHTML = this.template();
  }
});
