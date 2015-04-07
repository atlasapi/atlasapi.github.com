var ApiDocs = (function () {
  'use strict';

  var init = function (endpointsData) {
    buildTemplate(endpointsData);
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

  var buildTemplate = function (endpointsData) {
    compileTemplate(endpointsData, {
      path: 'assets/templates/api-docs.ejs',
      container: '#api-docs'
    });
    getResponseData(endpointsData);
  };

  var getResponseData = function (endpointsData) {
    _.forEach(data, function (endpoint) {
      $.ajax({
        url: endpoint.model_class_link,
        success: function (data) {
          compileTemplate(data.model_class, {
            path: 'assets/templates/api-docs-response.ejs',
            container: '#api-docs-response'
          });
          console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error({
            jqXHR: jqXHR,
            textStatus: textStatus,
            errorThrown: errorThrown
          });
        }
      });
    });
  };

  return {
    init: init
  };
})();
