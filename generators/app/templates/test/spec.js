var should = require('should'),
  request = require('supertest'),
  config = require('config');

var API = request('http://localhost:' + config.connections.api.port), // for calls to the API
  UI = request('http://localhost:' + config..connections.ui.port); // for calls to the UI

module.exports = function (server) {

  describe('The UI', function () {

    // start the server for each test
    beforeEach(function (done) {
      server.start(done);
    });

    // drop the server after each test
    afterEach(function (done) {
      server.stop(done);
    });

    // This is what a test should/can look like
    it('GET / should return index.html', function (done) {
      UI.get('/')
        .expect(200)
        .expect(function (res) {
          var html = res.body;
          (html).should.be.a.String;
        })
        .end(done);
    });


  });

}
