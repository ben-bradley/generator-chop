'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('chop:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompt({
        someOption: true
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'package.json',
      'gulpfile.js',
      'index.js',
      'readme.md',

      'api/controller.js',
      'api/handlers.js',
      'api/model.js',
      'api/routes.js',

      'config/default.json',
      'config/dev.json',
      'config/production.json',
      'config/test.json',

      'test/spec.js',

      'ui/routes.js',
      'ui/dist',
      'ui/src/index.html',
      'ui/src/app.js',
      'ui/src/main.less',
      'ui/src/components/App.js',
      'ui/src/components/Content.js',
      'ui/src/components/Main.js',
      'ui/src/components/Routes.js',
      'ui/src/components/Toolbar.js'
    ]);
  });
});
