'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the top-notch ' + chalk.red('Chop') + ' generator!'
    ));

    var prompts = [{
      type: 'text',
      name: 'name',
      message: 'What would you like to call your App?',
      default: this.appname
    }, {
      type: 'text',
      name: 'author',
      message: 'Who\'s name should I put as the author in the package.json?'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {

      this.directory('api', 'api');
      this.directory('ui', 'ui');
      this.directory('config', 'config');
      this.directory('example', 'example');
      this.directory('test', 'test');

      this.mkdir('ui/dist');

      this.copy('.gitignore', '.gitignore');
      this.copy('gulpfile.js', 'gulpfile.js');
      this.copy('index.js', 'index.js');
      this.copy('readme.md', 'readme.md');

      this.template('_package.json', 'package.json');
      this.template('ui/src/_index.html', 'ui/src/index.html');

    }
  },

  install: function () {
    var _this = this;
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      bower: false,
      callback: function() {
        var cwd = this.env.cwd,
          src = cwd + '/node_modules/font-awesome/fonts',
          dest = 'ui/dist/fonts';
        this.directory(src, dest);
      }.bind(_this)
    });
  }
});
