var apiDocs = (function () {
  'use strict';

  var init = function (resourcesData) { 
    getTypesData(resourcesData);
  };

  var getTypesData = function (resourcesData) {
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
        combineTypesAndResources(data.types, resourcesData);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        log.error(errorThrown);
      }
    })
  };

  var combineTypesAndResources = function (typesData, resourcesData) {
    var apiData = {
      types: typesData,
      resources: resourcesData
    };
    populateTemplate(apiData);
  };

  var populateTemplate = function (apiData) {
    var compiledTemplate = new EJS({
      url: 'assets/templates/api-docs.ejs'
    }).render(apiData);
    $('#api-docs').html(compiledTemplate);
    populateExampleResponse(apiData);
    getResponseData(apiData);
    linkToApiExplorer();
    linkResponseToTypes();
    $('#apiKey').on('change', function () {
      populateExampleResponse(apiData);
    });
  };

  var populateExampleResponse = function (apiData) {
    _.forEach(apiData.resources, function (resource) {
      var compiledTemplate = new EJS({
        url: 'assets/templates/api-docs-example-response.ejs'
      }).render(resource);
      var $endpointContainer = $('#api-docs-' + resource.name);
      $endpointContainer.find('.api-docs-example-response').html(compiledTemplate);
      $.ajax({
        url: $('#api-' + resource.name).find('.queryUrl').val(),
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

  var getResponseData = function (apiData) {
    _.forEach(apiData.resources, function (resource) {
      $.ajax({
        url: resource.model_class_link,
        success: function (data) {
          var compiledTemplate = new EJS({
            url: 'assets/templates/api-docs-response.ejs'
          }).render(data.type);
          $('#api-docs-' + resource.name).find('.api-docs-response').html(compiledTemplate);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          log.error(errorThrown);
        }
      });
    });
  };

  var linkResponseToTypes = function () {
    $(document).on('click', '.api-docs-types-link', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      var headerHeight = 64;
      $(window).scrollTop($('#api-docs').offset().top - headerHeight);   
      $('#api-docs .menu').find('a[href=' + target + ']').trigger('click');
    });
  };

  return {
    init: init
  };
})();
