/**
  * Usage: {{#if a === b}}{{/if}}
  */
Handlebars.registerHelper('if', function (conditional, options) {
  if (options.hash.desired === options.hash.type) {
    options.fn(this);
  } else {
    options.inverse(this);
  }
});

/**
  * Usage: {{#ifArray this}}{{/ifArray}}
  */
Handlebars.registerHelper('ifArray', function (item, options) {
  if (Object.prototype.toString.call(item) === '[object Array]') {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
