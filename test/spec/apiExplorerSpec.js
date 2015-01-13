describe('ApiExplorer', function () {
  var apiExplorer = new ApiExplorer();

  describe('apiExplorer', function () {
    it('should be defined', function () {
      expect(apiExplorer).to.exist();
    });

    it('should have endpointsUrl property', function () {
      expect(apiExplorer).to.have.property('endpointsUrl');
    });

    it('should have endpointsParametersUrl property', function () {
      expect(apiExplorer).to.have.property('endpointsParametersUrl');
    });

    it('should have channelGroupsUrl property', function () {
      expect(apiExplorer).to.have.property('channelGroupsUrl');
    });

    it('should have defaultApiKey property', function () {
      expect(apiExplorer).to.have.property('defaultApiKey');
    });

    it('should have queryUrl property', function () {
      expect(apiExplorer).to.have.property('queryUrl');
    });

    it('should have template property', function () {
      expect(apiExplorer).to.have.property('template');
    });
  });

  describe('apiExplorer.getData', function () {
    it('should be defined', function () {
      expect(apiExplorer.getData).to.exist();
    });

    it('should return data', function () {
      var dataResponse = apiExplorer.getData('mocks/getDataMock.json'),
          mockObject = {
          "endpoints": [
            { "name": "content" },
            { "name": "schedules" },
            { "name": "topics" }
          ]
        };

      expect(JSON.stringify(dataResponse)).to.equal(JSON.stringify(mockObject));
    });
  });

  describe('apiExplorer.getApiKey', function () {
    it('should be defined', function () {
      expect(apiExplorer.getApiKey).to.exist();
    });

    it('should return an API key', function () {
      var apiKey = apiExplorer.getApiKey();
      expect(apiKey).to.equal(apiExplorer.defaultApiKey);
    });
  });

  describe('apiExplorer.mergeData', function () {
    it('should be defined', function () {
      expect(apiExplorer.mergeData).to.exist();
    });

    it('should merge parameters into the endpoints data', function () {
      var originalDataUrl = 'mocks/mergeDataOriginalMock.json',
          newDataUrl = 'mocks/mergeDataNewMock.json',
          channelGroupsUrl = 'mocks/channelGroupsMock.json',
          dataResponse = apiExplorer.mergeData(originalDataUrl, newDataUrl, channelGroupsUrl),
          updatedData = [{"name":"content","parameters":[{"name":"foo","value":"bar"},{"name":"bar","value":"foo"}]},{"name":"schedules","parameters":[{"name":"foo","value":"bar"},{"name":"bar","value":"foo"}]},{"name":"topics","parameters":[{"name":"foo","value":"bar"},{"name":"bar","value":"foo"}]}];

      expect(JSON.stringify(dataResponse)).to.equal(JSON.stringify(updatedData));
    });
  });

  describe('apiExplorer.compileTemplate', function () {
    it('should be defined', function () {
      expect(apiExplorer.compileTemplate).to.exist();
    });
  });

  describe('apiExplorer.sendQuery', function () {
    it('should be defined', function () {
      expect(apiExplorer.sendQuery).to.exist();
    });
  });

  describe('apiExplorer.linkIds', function () {
    var linkIdsResult = apiExplorer.linkIds('"id": "abcd"');

    it('should be defined', function () {
      expect(apiExplorer.linkIds).to.exist();
    });

    it('should return a string', function () {
      expect(linkIdsResult).to.be.a('string');
    });

    it('should return a linked string', function () {
      expect(linkIdsResult).to.equal('"id": "<a class="apiExplorerContentLink" href="#" data-id="abcd">abcd</a>"');
    });
  });

  describe('apiExplorer.toggleAnnotations', function () {
    it('should be defined', function () {
      expect(apiExplorer.toggleAnnotations).to.exist();
    });
  });

  describe('apiExplorer.updateForm', function () {
    it('should be defined', function () {
      expect(apiExplorer.updateForm).to.exist();
    });
  });

  describe('apiExplorer.getQueryId', function () {
    it('should be defined', function () {
      expect(apiExplorer.getQueryId).to.exist();
    });
  });

  describe('apiExplorer.getQueryUrlComponents', function () {
    it('should be defined', function () {
      expect(apiExplorer.getQueryUrlComponents).to.exist();
    });
  });

  describe('apiExplorer.constructQueryUrl', function () {
    it('should be defined', function () {
      expect(apiExplorer.constructQueryUrl).to.exist();
    });
  });

  describe('apiExplorer.getQueryParameters', function () {
    it('should be defined', function () {
      expect(apiExplorer.getQueryParameters).to.exist();
    });
  });

  describe('apiExplorer.formatQueryParameters', function () {
    it('should be defined', function () {
      expect(apiExplorer.formatQueryParameters).to.exist();
    });
  });

  describe('apiExplorer.prepopulateForm', function () {
    it('should be defined', function () {
      expect(apiExplorer.prepopulateForm).to.exist();
    });
  });

  describe('apiExplorer.showContentJSON', function () {
    it('should be defined', function () {
      expect(apiExplorer.showContentJSON).to.exist();
    });
  });

  describe('apiExplorer.events', function () {
    it('should be defined', function () {
      expect(apiExplorer.events).to.exist();
    });
  });

  describe('apiExplorer.init', function () {
    it('should be defined', function () {
      expect(apiExplorer.init).to.exist();
    });

    it('should call apiExplorer.compileTemplate method', function () {

    });

    it('should call apiExplorer.updateApiKey method', function () {

    });

    it('should call apiExplorer.updateParameters method', function () {

    });

    it('should call apiExplorer.submitQueryForm method', function () {

    });
  });
});
