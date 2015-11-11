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
  * Usage: {{#if isArray this}}{{/if}}
  */
Handlebars.registerHelper('isArray', function (item, options) {
  if (Object.prototype.toString.call(item) === '[object Array]') {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
