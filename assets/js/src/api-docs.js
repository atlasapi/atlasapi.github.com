var apiDocs = (function () {
  'use strict';

  var init = function (endpointsData) {
    populateTemplate(endpointsData);
  };

  var populateTemplate = function (endpointsData) {
    compileTemplate({
      path: 'assets/templates/api-docs.ejs',
      container: '#api-docs'
    }, endpointsData);
    populateExampleResponse(endpointsData);
    getResponseData(endpointsData);
    linkToApiExplorer();
  };

  var populateExampleResponse = function (endpointsData) {
    _.forEach(endpointsData, function (endpoint) {
      compileTemplate({
        path: 'assets/templates/api-docs-example-response.ejs',
        container: '#api-docs-' + endpoint.name + ' .api-docs-example-response'
      }, endpoint);
      var url = $('#api-' + endpoint.name).find('.queryUrl').val();
      $('#api-docs-' + endpoint.name).find('.api-docs-example-call').val('http:' + url);
      $.ajax({
        url: url,
        success: function (data) {
          $('#api-docs-' + endpoint.name)
            .find('.api-docs-example-response')
            .find('.jsonOutput')
            .html(JSON.stringify(data, undefined, 2));
          $('#api-docs-' + endpoint.name).find('.jsonOutput').each(function(i, block) {
            hljs.highlightBlock(block);
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(errorThrown);
        }
      });
    });
  };

  var linkToApiExplorer = function () {
    $(document).on('click', '.open-api-explorer-tab', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      var headerHeight = 64;
      $(window).scrollTop($('#apiExplorer').offset().top - headerHeight);
      $('.api-explorer-nav').find('a[href=' + target + ']').trigger('click');
    });
  };

  var getResponseData = function (endpointsData) {
    _.forEach(endpointsData, function (endpoint) {
      $.ajax({
        url: endpoint.model_class_link,
        success: function (data) {
          compileTemplate({
            path: 'assets/templates/api-docs-response.ejs',
            container: '#api-docs-response'
          }, data.model_class);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(errorThrown);
        }
      });
    });
  };

  return {
    init: init
  };
})();
