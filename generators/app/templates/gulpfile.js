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
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  less = require('gulp-less'),
  debug = require('debug')('gulpfile');

gulp.task('default', ['html', 'less', 'bundle', 'nodemon']);

var PATHS = {
  src: __dirname + '/ui/src',
  dist: __dirname + '/ui/dist'
}

// Compile JSX into JS
gulp.task('bundle', function () {
  glob.sync(PATHS.src + '/app.js').forEach(bundler);
});

function bundler(file) {
  var watchArgs = watchify.args;
  watchArgs.transform = [reactify, babelify];
  var Bundler = watchify(browserify(watchArgs));
  var uiRoot = path.dirname(file) + '/..';
  Bundler.add(file);

  function bundle() {
    debug('Bundling: ' + file);
    return Bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest(uiRoot + '/dist'));
  };
  Bundler.on('update', bundle);
  bundle();
}

// Copy an HTML file into /dist
gulp.task('html', function () {
  glob.sync(PATHS.src + '/*.html').forEach(html);
});

function html(file) {
  var uiRoot = path.dirname(file) + '/..';
  gulp.src(file)
    .pipe(gulp.dest(uiRoot + '/dist'));
}

// Uglify/min a .js file
gulp.task('uglify', function () {
  glob.sync(PATHS.dist + '/app.js').forEach(min);
});

function min(file) {
  var uiRoot = path.dirname(file) + '/..';
  gulp.src(file)
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(uiRoot + '/dist'));
}

// Less the CSS
gulp.task('less', function() {
  debug('LESS: ' + PATHS.src + '/main.less');
  glob.sync(PATHS.src + '/*.less').forEach(lessIt);
});

function lessIt(file) {
  var uiRoot = path.dirname(file) + '/..';
  debug('LESSING: ' + file);
  gulp.src(file)
    .pipe(less())
    .pipe(gulp.dest(uiRoot + '/dist'));
}


// Monitor the app
gulp.task('nodemon', function () {
  // watch for new HTMLs and publish them
  gulp.watch(PATHS.src + '/*.html', function (ev) {
    html(ev.path);
  });

  // watch for new dist/app.js and min them
  gulp.watch(PATHS.dist + '/app.js', function(ev) {
//    min(ev.path);
  });

  gulp.watch(PATHS.src + '/main.less', function(ev) {
    lessIt(ev.path);
  });

  gulp.watch(PATHS.dist + '/*', function(ev) {
    livereload.reload();
  });

  livereload.listen();

  // start the server
  nodemon({
    env: process.ENV,
    script: 'index.js',
    args: process.argv.slice(2),
    watch: [ 'index.js' ]
  });
});
