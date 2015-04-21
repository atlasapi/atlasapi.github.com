var apiDocs = (function () {
  'use strict';

  var init = function (endpointsData) {
    populateTemplate(endpointsData);
  };

  var populateTemplate = function (endpointsData) {
    var compiledTemplate = new EJS({
      url: 'assets/templates/api-docs.ejs'
    }).render(endpointsData);
    $('#api-docs').html(compiledTemplate);
    populateExampleResponse(endpointsData);
    getResponseData(endpointsData);
    linkToApiExplorer();
  };

  var populateExampleResponse = function (endpointsData) {
    _.forEach(endpointsData, function (endpoint) {
      var compiledTemplate = new EJS({
        url: 'assets/templates/api-docs-example-response.ejs'
      }).render(endpoint);
      var url = $('#api-' + endpoint.name).find('.queryUrl').val(); 
      var $endpointContainer = $('#api-docs-' + endpoint.name);
      $endpointContainer.find('.api-docs-example-response').html(compiledTemplate);
      $endpointContainer.find('.api-docs-example-call').val(url);
      $endpointContainer.find('.api-docs-example-curl').val('curl -i ' + url);
      var ajaxExampleText = $endpointContainer.find('.api-docs-example-ajax').text().replace('@url', url);
      $endpointContainer.find('.api-docs-example-ajax').text(ajaxExampleText);
      $.ajax({
        url: url,
        success: function (data) {
          $endpointContainer.find('.jsonOutput').html(JSON.stringify(data, undefined, 2));
          $endpointContainer.find('.code-example').each(function(i, block) {
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
          var compiledTemplate = new EJS({
            url: 'assets/templates/api-docs-response.ejs'
          }).render(data.model_class);
          $('#api-docs-response').html(compiledTemplate);
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
