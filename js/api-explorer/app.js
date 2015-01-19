var app = app || {};

app.config = {
  container: '#api-explorer',
  endpointsUrl: 'http://stage.atlas.metabroadcast.com/4/meta/endpoints.json',
  apiKey: 'c1e92985ec124202b7f07140bcde6e3f'
};

app.init = function () {
  app.getEndpointsData(app.config.endpointsUrl);
};

app.compileTemplate = function (templateId, data) {
  var source = $(templateId).html(),
      template = Handlebars.compile(source);
  $(app.config.container).append(template(data));
};

app.getEndpointsData = function (url, template) {
  $.ajax(url, {
    success: function (data) {
      app.compileTemplate('#navigation-template', data);
      app.compileTemplate('#panel-template', data);
      app.tabs(app.config.container);
      app.queryFormHandler();
    },
    error: function () {
      console.error('Cannot get endpoints');
    }
  });
};

app.queryFormHandler = function () {
  $('.query-form').each(function () {
    $(this).on('submit', function (e) {
      e.preventDefault();
      $.ajax($(e.currentTarget).find('.query-url').val(), {
        success: function (data) {
          var endpointName = JSON.stringify(data.model_class.name).replace(/"/g, '');
          $('.' + endpointName + '-json-output').html(JSON.stringify(data, undefined, 2));
          $('.json-output').each(function(i, block) {
            hljs.highlightBlock(block);
          });
        },
        error: function () {
          console.error('Cannot get required output');
        }
      });
    });
  });
};

app.getAnnotations = function () {
  var annotations = [];
  $(document).on('click', '.annotations-checkbox', function () {
    var annotationName = $(this).attr('name');
    if ($(this).is(':checked')) {
      if ($.inArray(annotationName, annotations)) {
        annotations.push(annotationName);
      }
    } else {
      annotations.splice($.inArray(annotationName, annotations), 1);
    }
  });
  return annotations;
};

$(function () {
  app.init();
  app.getAnnotations();
});
