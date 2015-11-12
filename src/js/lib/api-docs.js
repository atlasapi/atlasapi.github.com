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
    });
  };

  var combineTypesAndResources = function (typesData, resourcesData) {
    var apiData = {
      types: typesData,
      resources: resourcesData
    };
    addDescriptionsToAnnotations(apiData);
  };

  var addDescriptionsToAnnotations = function (apiData) {
    _.forEach(apiData.resources, function (resource) {
      _.forEach(resource.annotations, function (annotation) {
        if (annotation.description === '') {
          _.forEach(apiData.types, function (type) {
            if (annotation.type === type.name) {
              annotation.description = type.description;
            }
          });
        }
      });
    });
    populateTemplate(apiData);
  };

  var populateTemplate = function (apiData) {
    var template = Handlebars.compile($('#api-docs-template').html());
    $('#api-docs').html(template(apiData));
    uiTabs();
    // populateExampleResponse(apiData);
    // linkToApiExplorer();
    // $('#apiKey').on('change', function () {
    //   populateExampleResponse(apiData);
    // });
  };

  var populateExampleResponse = function (apiData) {
    _.forEach(apiData.resources, function (resource) {
      var template = Handlebars.compile($('#api-docs-example-response-template').html());
      var $endpointContainer = $('#api-docs-' + resource.name);
      $endpointContainer.find('.api-docs-example-response').html(template(resource));
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

  return {
    init: init
  };
})();
