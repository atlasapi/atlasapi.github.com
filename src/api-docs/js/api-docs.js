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
    var typesToLink = [];
    _.forEach(apiData.types, function (type) {
      typesToLink.push(type.name);
    });
    apiData.typesToLink = typesToLink;
    var compiledTemplate = new EJS({
      url: 'templates/api-docs.ejs'
    }).render(apiData);
    $('#api-docs').html(compiledTemplate);
    populateExampleResponse(apiData);
    getResponseData(apiData);
    linkToApiExplorer();
    linkResponseToTypes();
    $('#apiKey').on('change', function () {
      populateExampleResponse(apiData);
    });
    hideEmptyTables();
    // Unhides api explorer to make loading appear more pleasant
    $('#apiExplorer').removeClass('hide');
    if (window.location.hash) {
      var target = window.location.hash;
      $('a[href="' + target + '"]').trigger('click');
    }
  };

  var hideEmptyTables = function () {
    $('.api-docs-annotations-resource').each(function (index, table) {
      if (!$(table).find('tbody').find('tr').length) {
        $(table).hide();
      }
    });
  };

  var populateExampleResponse = function (apiData) {
    _.forEach(apiData.resources, function (resource) {
      var compiledTemplate = new EJS({
        url: 'templates/api-docs-example-response.ejs'
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
    var typesToLink = [];
    _.forEach(apiData.types, function (type) {
      typesToLink.push(type.name);
    });
    _.forEach(apiData.resources, function (resource) {
      $.ajax({
        url: resource.model_class_link,
        success: function (data) {
          data.typesToLink = typesToLink;
          var compiledTemplate = new EJS({
            url: 'templates/api-docs-response.ejs'
          }).render(data);
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
