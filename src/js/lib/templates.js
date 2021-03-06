import {elementListToArray} from '../lib/helpers.js';

var importTemplates = function (templates) {
  templates = elementListToArray(templates);
  templates.forEach(function (template) {
    let clone = document.importNode(template, true);
    document.body.appendChild(clone);
  });
};

var loadTemplates = function () {
  var templates = document.body.querySelectorAll('link[rel="import"]');

  templates = elementListToArray(templates);

  if (templates) {
    templates.forEach(function (template) {
      let templateElements;

      templateElements = template.import.querySelectorAll('script[type="text/x-handlebars-template"]');

      if (templateElements) {
        importTemplates(templateElements);
      }
    });
  }
};

export { loadTemplates }
