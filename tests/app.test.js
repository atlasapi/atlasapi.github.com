describe('app', function () {
  beforeEach(function (done) {
    this.schedules = new test.SchedulesCollection();
    this.schedules.fetch({
      success: function () {
        done();
      }
    });
  });

  describe('atlas schedules collection', function () {
    describe('when .fetch() is called', function () {
      it('fetches a schedule', function (done) {
        expect(this.schedules.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('atlas programmes collection', function () {

    beforeEach(function () {
      this.programmes = new test.ProgrammesCollection(this.schedules.at(0).get('entries'));
    });

    describe('when passed schedule entries', function () {
      it('creates multiple programmes', function () {
        expect(this.programmes.length).toBeGreaterThan(1);
      });
    });

  });

  describe('atlas programme model', function () {
    describe('parsing the programme should normalise the programme data', function () {
      beforeEach(function () {
        this.programme = new test.ProgrammeModel(this.schedules.at(0).get('entries')[0], {parse: true});
      });

      it('get(\'image\') should return a string', function () {
        expect(typeof this.programme.get('image')).toBe('string');
      });
    });
  });
});