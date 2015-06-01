var gulp = require('gulp'),
  gutil = require('gulp-util'),
  glob = require('glob'),
  path = require('path'),
  browserify = require('browserify'),
  sourcemaps = require('gulp-sourcemaps'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  watchify = require('watchify'),
  reactify = require('reactify'),
  babelify = require('babelify'),
  babel = require('gulp-babel'),
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  less = require('gulp-less'),
  debug = require('debug')('gulpfile');

//gulp.task('default', ['babel', 'html', 'less', 'bundle', 'nodemon']);
gulp.task('default', ['nodemon'], function () {
  debug('gulped!')
});

// convert server-side es6 to es5
gulp.task('babel', function () {
  return gulp.src('src/server/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist/server'));
});

// Compile JSX into JS
gulp.task('bundle', function () {
  bundler(__dirname + '/src/client/app.js');
});

function bundler(file) {
  var watchArgs = watchify.args;
  watchArgs.transform = [reactify, babelify];
  var Bundler = watchify(browserify(watchArgs));
  var uiRoot = path.dirname(file) + '/..';
  Bundler.add(file);

  debug('BUNDLE:', file);

  function bundle() {
    debug('BUNDLING: ' + file);
    return Bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest('dist/client'));
  };
  Bundler.on('update', bundle);
  bundle();
}

// Copy an HTML file into /dist
gulp.task('html', function () {
  glob.sync('src/client/**.html').forEach(html);
});

function html(file) {
  gulp.src(file)
    .pipe(gulp.dest('dist/client'));
}

// Less the CSS
gulp.task('less', function () {
  debug('LESS: src/client/*.less');
  glob.sync('src/client/*.less').forEach(lessIt);
});

function lessIt(file) {
  debug('LESSING: ' + file);
  gulp.src(file)
    .pipe(less())
    .pipe(gulp.dest('dist/client'));
}

// Monitor the app
gulp.task('nodemon', ['babel', 'html', 'less', 'bundle'], function () {
  // watch for new HTMLs and publish them
  gulp.watch('src/client/**.html', function (ev) {
    html(ev.path);
  });

  gulp.watch('src/client/main.less', function (ev) {
    lessIt(ev.path);
  });

  gulp.watch('src/server/*.js', function (ev) {

    return gulp.src(ev.path)
      .pipe(babel())
      .pipe(gulp.dest('dist/server'));
  })

  gulp.watch('dist/client/*', function (ev) {
    livereload.reload();
  });

  livereload.listen();

  // start the server
  nodemon({
    env: process.ENV,
    script: 'index.js',
    args: process.argv.slice(2),
    watch: ['dist/server/*']
  });
});
