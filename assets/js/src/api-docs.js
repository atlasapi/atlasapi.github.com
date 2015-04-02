var ApiDocs = (function () {
  'use strict';

  var apiData = [];

  var init = function () {
    getEndpointsData();
    getParametersData();
    enableTabLinks();
  };

  var compileTemplate = function (data, template) {
    var compiledTemplate = new EJS({
      url: template.path
    }).render(data);

    $(template.container).html(compiledTemplate);
  };

  var enableTabLinks = function () {
    $(document).on('click', '.api-docs-nav .menu-item', function (e) {
      e.preventDefault();

      var $this = $(this),
          tabPanelId = $this.attr('href'),
          $tabPanel = $(tabPanelId);

      $('.api-docs-nav').find('.menu-item').removeClass('menu-item-selected');
      $(this).addClass('menu-item-selected');

      $('.api-docs-panel').hide();
      $tabPanel.show();
    });
  };

  var getEndpointsData = function () {
    $.ajax({
      url: '//atlas.metabroadcast.com/4/meta/endpoints.json',
      success: function (data) {
        getParametersData(data.endpoints);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error({
          jqXHR: jqXHR,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
      }
    });
  };

  var getParametersData = function (endpointsData) {
    $.ajax({
      url: 'assets/data/parameters.json',
      success: function (data) {
        var parametersData = data.endpoints;
        mergeData(parametersData, endpointsData)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error({
          jqXHR: jqXHR,
          textStatus: textStatus,
          errorThrown: errorThrown
        });
      }
    });
  };

  var mergeData = function (parametersData, endpointsData) {
    _.forEach(endpointsData, function (endpoint) {
      _.forEach(parametersData, function (parameters) {
        if (endpoint.name === parameters.name) {
          endpoint.parameters = parameters.parameters;
          endpoint.annotations = parameters.annotations;
        }
      });
    });
    compileTemplate(endpointsData, {
      path: 'assets/templates/api-docs.ejs',
      container: '#api-docs'
    });
  };

  return {
    init: init
  };
})();
