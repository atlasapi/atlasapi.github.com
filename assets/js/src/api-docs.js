var apiDocs = (function () {
  'use strict';

  var init = function (endpointsData) { 
    populateTemplate(endpointsData);
    populateTypesTemplate();
    linkResponseToTypes();
    $('#apiKey').on('change', function () {
      populateExampleResponse(endpointsData);
    });
  };

  var loadEndpointsData = function () {
    return endpointsData;
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
      var $endpointContainer = $('#api-docs-' + endpoint.name);
      $endpointContainer.find('.api-docs-example-response').html(compiledTemplate);
      $.ajax({
        url: $('#api-' + endpoint.name).find('.queryUrl').val(),
        success: function (data) {
          $endpointContainer.find('.jsonOutput').html(JSON.stringify(data, undefined, 2));
          $endpointContainer.find('.code-example').each(function(i, block) {
            hljs.highlightBlock(block);
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          log.error(errorThrown);
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
          }).render(data.type);
          $('#api-docs-' + endpoint.name).find('.api-docs-response').html(compiledTemplate);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          log.error(errorThrown);
        }
      });
    });
  };

  var populateTypesTemplate = function () {
    $.ajax({
      url: 'https://atlas.metabroadcast.com/4/meta/types.json',
      success: function (data) {
        // Sort types by name alphabetically
        data.types.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        var compiledTemplate = new EJS({
          url: 'assets/templates/api-docs-types.ejs'
        }).render(data.types);
        $('#api-docs-types-container').html(compiledTemplate);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        log.error(errorThrown);
      }
    });
  };

  var getTypesData = function () {
    $.ajax({
      url: 'https://atlas.metabroadcast.com/4/meta/types.json',
      success: function (data) {
        // Sort types by name alphabetically
        data.types.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        log.error(errorThrown);
      }
    })
  };

  var linkResponseToTypes = function () {
    $(document).on('click', '.api-docs-types-link', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      var headerHeight = 64;
      $(window).scrollTop($('#api-docs-types-container').offset().top - headerHeight);   
      $('.api-docs-types-container').find('a[href=' + target + ']').trigger('click');
    });
  };

  return {
    init: init
  };
})();
