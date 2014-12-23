describe('ApiExplorer', function () {
  var apiExplorer = new ApiExplorer();

  describe('apiExplorer', function () {
    it('should be defined', function () {
      expect(apiExplorer).to.exist();
    });

    it('should have endpointsURL property', function () {
      expect(apiExplorer).to.have.property('endpointsURL');
    });

    it('should have endpointsParametersURL property', function () {
      expect(apiExplorer).to.have.property('endpointsParametersURL');
    });

    it('should have defaultApiKey property', function () {
      expect(apiExplorer).to.have.property('defaultApiKey');
    });

    it('should have queryURL property', function () {
      expect(apiExplorer).to.have.property('queryURL');
    });

    it('should have template property', function () {
      expect(apiExplorer).to.have.property('template');
    });
  });

  describe('apiExplorer.getApiKey', function () {
    it('should be defined', function () {
      expect(apiExplorer.getApiKey).to.exist();
    });

    it('should return an api key', function () {
      expect(apiExplorer.defaultApiKey).to.equal(apiExplorer.getApiKey());
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

  describe('apiExplorer.mergeData', function () {
    it('should be defined', function () {
      expect(apiExplorer.mergeData).to.exist();
    });

    it('should merge parameters into the endpoints data', function () {
      var originalDataURL = 'mocks/mergeDataOriginalMock.json',
          newDataURL = 'mocks/mergeDataNewMock.json',
          dataResponse = apiExplorer.mergeData(originalDataURL, newDataURL),
          updatedData = [{
          "name": "content",
          "parameters": [{
            "name": "foo",
            "value": "bar"
          },
          {
            "name": "bar",
            "value": "foo"
          }],
          "query_url": "//atlas.metabroadcast.comundefinedfoo=undefined&bar=undefined&key=c1e92985ec124202b7f07140bcde6e3f"
        }, {
          "name": "schedules",
          "parameters": [{
            "name": "foo",
            "value": "bar"
          },
          {
            "name": "bar",
            "value": "foo"
          }],
          "query_url": "//atlas.metabroadcast.comundefinedfoo=undefined&bar=undefined&key=c1e92985ec124202b7f07140bcde6e3f"
        }, {
          "name": "topics",
          "parameters": [{
            "name": "foo",
            "value": "bar"
          },
          {
            "name": "bar",
            "value": "foo"
          }],
          "query_url": "//atlas.metabroadcast.comundefinedfoo=undefined&bar=undefined&key=c1e92985ec124202b7f07140bcde6e3f"
        }];

      expect(JSON.stringify(dataResponse)).to.equal(JSON.stringify(updatedData));
    });
  });

  describe('apiExplorer.compileTemplate', function () {
    it('should be defined', function () {
      expect(apiExplorer.compileTemplate).to.exist();
    });
  });

  describe('apiExplorer.linkify', function () {
    var linkifyResult = apiExplorer.linkify('http://example.com');

    it('should be defined', function () {
      expect(apiExplorer.linkify).to.exist();
    });

    it('should return a string', function () {
      expect(linkifyResult).to.be.a('string');
    });

    it('should return a linked URL', function () {
      expect(linkifyResult).to.equal('<a href="http://example.com">http://example.com</a>');
    });
  });

  describe('apiExplorer.submitQueryForm', function () {
    it('should be defined', function () {
      expect(apiExplorer.submitQueryForm).to.exist();
    });
  });

  describe('apiExplorer.buildQueryURL', function () {
    it('should be defined', function () {
      expect(apiExplorer.buildQueryURL).to.exist();
    });
  });

  describe('apiExplorer.replaceParameter', function () {
    it('should be defined', function () {
      expect(apiExplorer.replaceParameter).to.exist();
    });

    it('should replace the value of given URL parameter if follows "?"', function () {
      var url = 'http://example.com?foo=bar&bar=foo',
          newUrl = 'http://example.com?foo=foobar&bar=foo';

      expect(apiExplorer.replaceParameter(url, 'foo', 'foobar')).to.equal(newUrl);
    });

    it('should replace the value of given URL parameter if follows "&"', function () {
      var url = 'http://example.com?foo=bar&bar=foo',
          newUrl = 'http://example.com?foo=bar&bar=foobar';

      expect(apiExplorer.replaceParameter(url, 'bar', 'foobar')).to.equal(newUrl);
    });
  });

  describe('apiExplorer.updateApiKey', function () {
    it('should be defined', function () {
      expect(apiExplorer.updateApiKey).to.exist();
    });
  });

  describe('apiExplorer.updateParameters', function () {
    it('should be defined', function () {
      expect(apiExplorer.updateParameters).to.exist();
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
