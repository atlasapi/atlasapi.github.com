var apiExplorer = {
  container: '#apiExplorerTabSection',
  endpointsUrl: '//stage.atlas.metabroadcast.com/4/meta/endpoints.json',
  endpointsParametersUrl: 'data/parameters.json',
  apiKey: 'c1e92985ec124202b7f07140bcde6e3f',
  queryUrl: '//stage.atlas.metabroadcast.com'
};

apiExplorer.getEndpoints = function (url) {
  $.ajax({
    url: url,
    dataType: 'json',
    success: function (data) {
      apiExplorer.buildNavigation(data.endpoints);
      apiExplorer.buildSections(data.endpoints);
      tabs('#apiExplorerTabs');
    },
    error: function (data) {
      console.error('Unable to get endpoints');
    }
  });
};

apiExplorer.buildNavigation = function (data) {
  var navigation = '<ul class="clearfix tabs">';
  for (var i = 0, ii = data.length; i < ii; i++) {
    navigation += '<li class="tab"><a href="#api-' + data[i].name + '">' + data[i].name + '</a></li>';
  }
  navigation += '</ul>';
  $('#apiExplorerNavigation').html(navigation);
};

apiExplorer.buildSections = function (data) {
  var tabs = '<div class="clearfix tabHolder">';
  for (var i = 0, ii = data.length; i < ii; i++) {
    tabs += '<div class="tabArea" id="api-' + data[i].name + '">';
    tabs += '<h2>' + data[i].name + '</h2>';
    tabs += '<h3><span class="upper">GET</span> ' + data[i].root_path + '<h3>';
    tabs += '</div>';
  }
  tabs += '</div>';
  $('#apiExplorerTabSections').html(tabs);
};

apiExplorer.getEndpointParameters = function (url) {
  $.ajax({
    url: url,
    dataType: 'json',
    success: function (data) {
      for (var key in data) {
        var endpointParameters = data[key];
        apiExplorer.buildQueryForm(data[key].parameters);
      }
    },
    error: function () {
      console.error('Unable to get endpoints parameters');
    }
  });
};

apiExplorer.buildQueryForm = function (data) {
  var table = '<table>';
  table += '<thead>';
  table += '<tr>';
  table += '<th>Parameter</th>';
  table += '<th>Value</th>';
  table += '<th>Type</th>';
  table += '<th>Description</th>';
  table += '</tr>';
  table += '</thead>';
  table += '<tbody>';
  for (var i = 0, ii = data.length; i < ii; i++) {
    table += '<tr>';
    table += '<td>' + data[i].name + '</td>';
    table += '<td>' + data[i].default_value + '</td>';
    table += '<td>' + data[i].type + '</td>';
    table += '<td>' + data[i].description + '</td>';
    table += '</tr>';
  }
  table += '</tbody>';
  table += '</table>';
  console.log(table);
};

apiExplorer.setApiKey = function (apiKey) {
  var $apiKeyField = $('#customApiKey'),
      defaultApiKey = apiKey;

  $apiKeyField.on('change', function () {
    if ($apiKeyField.val() !== '') {
      apiExplorer.apiKey = $apiKeyField.val();
      apiExplorer.setContentQuery();
    } else {
      apiExplorer.apiKey = defaultApiKey;
      apiExplorer.setContentQuery();
    }
  });

  return apiExplorer.apiKey;
};

apiExplorer.setContentQuery = function () {
  var $contentQueryField = $('#apiContentQuery'),
      contentQuery = this.queryUrl + '/4/content.json' + '?key=' + apiExplorer.apiKey;
  $contentQueryField.val(contentQuery);
};

apiExplorer.init = function () {
  this.getEndpoints(this.endpointsUrl);
  this.getEndpointParameters(this.endpointsParametersUrl);
};
