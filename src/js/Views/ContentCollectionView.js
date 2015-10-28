import SectionView from '../Views/SectionView.js';

export default Backbone.View.extend({
  initialize: function () {
    this.collection.fetch().then(function () {
      this.render();
    }.bind(this));
  },

  render: function () {
    this.collection.each(function (section) {
      var sectionView = new SectionView({
        el: section.get('containerId'),
        templateId: section.get('templateId')
      });
    });
  }
});
