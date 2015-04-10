var CompileTemplate = (function () {
  'use strict';

  return function (template, data) {
    var compiledTemplate = new EJS({
      url: template.path
    });

    if (data) {
      compiledTemplate.render(data);
    } else {
      compiledTemplate.render();
    }

    $(template.container).html(compiledTemplate);
  };
})();
