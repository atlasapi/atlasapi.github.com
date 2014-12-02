var apiExplorer = {
  container: '#apiExplorerTabSection',
  endpointsUrl: '//stage.atlas.metabroadcast.com/4/meta/endpoints.json',
  apiKey: 'c1e92985ec124202b7f07140bcde6e3f',
  queryUrl: '//stage.atlas.metabroadcast.com'
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
  tabs(this.container);
};
