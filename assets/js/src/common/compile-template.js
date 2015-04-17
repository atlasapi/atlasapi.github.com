var compileTemplate = (function () {
  'use strict';

  return function (template, data) {
    data = data || {};

    var compiledTemplate = new EJS({
      url: template.path
    }).render(data);

    $(template.container).html(compiledTemplate);
  };
})();
