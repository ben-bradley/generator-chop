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

      'src/server/api.controllers.js',
      'src/server/api.handlers.js',
      'src/server/api.models.js',
      'src/server/api.routes.js',
      'src/server/ui.routes.js',
      'src/server/index.js',

      'config/default.json',
      'config/dev.json',
      'config/production.json',
      'config/test.json',

      'test/spec.js',

      'src/client/index.html',
      'src/client/app.js',
      'src/client/main.less',
      'src/client/components/App.js',
      'src/client/components/Content.js',
      'src/client/components/Main.js',
      'src/client/components/Routes.js',
      'src/client/components/Toolbar.js'
    ]);
  });
});
