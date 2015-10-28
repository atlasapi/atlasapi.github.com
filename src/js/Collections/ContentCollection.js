import SectionModel from '../Models/SectionModel.js';

export default Backbone.Collection.extend({
  model: SectionModel,
  url: 'data/sections.json',
  parse: function (response) {
    return response.sections;
  }
});
