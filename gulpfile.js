var gulp = require('gulp');
var source = require('vinyl-source-stream');

var stylus = require('gulp-stylus');
var autoprefixer = require('autoprefixer-stylus');

var inline = require('gulp-inline-source');

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');

var del = require('del');

var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

var sequence = require('run-sequence');

var browserSync = require('browser-sync').create();


// defalt call 'clean', but must callback 'init' task
gulp.task('default', ['init'] );

// init
gulp.task('init', function() {
  return sequence(
    // init task
    ['stylus', 'html'],
    // watch task
    ['watch', 'browserify'],
    //inlined file for tumblr
    'inline',
    'serve'
  );
});

//clean build, tunblr Folder
gulp.task('clean', function() {
  del(['build', 'inlined'], function() {
    console.log('finished');
  });
});

// stylus
gulp.task('stylus', function() {
  return gulp.src('./src/css/style.styl')
    .pipe(plumber({
      errorHandler: notify.onError({
        title: "Stylus Error",
        message: "<%= error.message %>"
      })
    }))
    .pipe(
      stylus({
        use: [
          function() { autoprefixer({browsers: ['ie 9']}) }
        ]
      })
    )
    .pipe(gulp.dest('./build/css'))

});

// html copy
gulp.task('html', function() {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./build'));
});

// inline js, css
gulp.task('inline', function() {
  gulp.src('./build/index.html')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(inline())
    .pipe(gulp.dest('./inlined/'));
});

// JS compile
gulp.task('browserify', function() {
  var bundler = browserify({
    entries: ['./src/js/app.js'], // Only need initial file, browserify finds the deps
    transform: [babelify], // We want to convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  var watcher  = watchify(bundler);

  return watcher
    .on('update', function() { // When any files update
      var updateStart = Date.now();
      console.log('JS compile!');
      watcher
        .bundle() // Create new bundle that uses the cache for high performance
        .on('error', notify.onError({
            title: "JS Error",
            message: "<%= error.message %>"
        }))
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build/js'));
      console.log('JS compiled!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .on('error', notify.onError({
      title: "JS Error",
      message: "<%= error.message %>"
    }))
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

// watch html, css files
gulp.task('watch', function() {
  gulp.watch( ['./src/css/**/*.styl'], ['stylus'] );
  gulp.watch( ['./src/index.html'], ['html'] );
  var build_wather = gulp.watch( ['./build/**/*'], function() {
    browserSync.reload();
  });

});

//serve
gulp.task('serve', function() {
  browserSync.init({
      server: "./build"
  });
});
