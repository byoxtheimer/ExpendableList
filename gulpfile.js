var gulp = require('gulp'),
  merge2 = require('merge2'),
  bowerFiles = require('main-bower-files'),
  del = require('del'),
  browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();
var srcs = require('./gulp/sources.json');
//var allUrls = require('./gulp/urls.json');

var isProd = false;
var cssBrowsersSupported = ['last 2 versions', 'iOS 8'];

gulp.task('build:prod', function() {
  isProd = true;
  return gulp.start('build');
});

// Static Server + watching scss/html files
gulp.task('build', ['cleanWWW', 'vendor', 'js', 'sass', 'html', 'assets'], function() {
  $.util.log($.util.colors.green('\n\n\nBUILD SUCCESSFUL'));
});

gulp.task('default', ['cleanWWW', 'pluginStubs', 'vendor', 'js', 'sass', 'html', 'assets'], function() {
  $.util.log($.util.colors.green('\n\n\nBUILD SUCCESSFUL'));
  browserSync.init({
    server: "www"
  });

  gulp.watch(srcs.js, ['js']);
  gulp.watch([
    'develop/source/elements/**/*.scss',
    'develop/source/sass/**/*.scss'
  ], ['sass']);
  gulp.watch(srcs.html, ['html']);
});

//=====================================================

gulp.task('cleanWWW', function() {
  del.sync(['www/**', '!www']);
});

function getUrlSrcs() {
  // var sourceUrls = isProd ? allUrls.prod : allUrls.dev;
  // return gulp.src(srcs.urlStorage)
  //   .pipe($.replace(/##serverHost##/, sourceUrls.host))
  //   .pipe($.replace(/##findadocHost##/, sourceUrls.findadoc));
}

gulp.task('js', function() {

  return gulp.src(srcs.urlStorage)
  //getUrlSrcs()
    .pipe($.addSrc(srcs.js))
    .pipe($.sourcemaps.init())
    .pipe($.plumber({
      errorHandler: reportError
    }))
    .pipe($.babel({
      presets: ['es2015']
    }))
    .on('error', reportError)
    .pipe($.concat('bundled.js'))
    .pipe($.if(isProd, $.uglify().on('error', function(e) {
      console.log(e);
    })))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('www/js'))
    .pipe(browserSync.stream());
});

gulp.task('pluginStubs', function() {
  return gulp.src(srcs.pluginStubs)
    .pipe($.concat('cordova.js'))
    .pipe(gulp.dest('www'));
});

gulp.task('vendor', function() {
  return gulp.src(bowerFiles())
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify().on('error', function(e) {
      console.log(e);
    }))
    .pipe(gulp.dest('www/js'));
});

gulp.task('sass', function() {
  return gulp.src(srcs.sass)
    .pipe($.sourcemaps.init())
    .pipe($.plumber({
      errorHandler: reportError
    }))
    .pipe($.sass({style: 'expanded'}))
    .on('error', reportError)
    .pipe($.autoprefixer({browsers: cssBrowsersSupported}))
    .pipe($.concat('style.css'))
    .pipe($.sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('www/css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('html', function() {
  gulp.src(srcs.html)
    .pipe(gulp.dest('www'))
    .pipe(browserSync.stream());
});

gulp.task('assets', function() {
  gulp.src(srcs.assets)
    .pipe(gulp.dest('www/assets'))
});

gulp.task('browser-sync', function() {
  browserSync({
    open: false,
    server: {
      baseDir: 'www'
    }
  });
});

function getTestJs() {
  return merge2(
    gulp.src(bowerFiles().concat(srcs.vendorTest)),

    getUrlSrcs()
      .pipe($.addSrc(srcs.js))
      .pipe($.addSrc(srcs.test))
      .pipe($.cached('testJs'))
      .pipe($.babel({
        presets: ['es2015']
      }))
      .pipe($.remember('testJs')),

    gulp.src(srcs.sass)
      .pipe($.sass({style: 'expanded'}))
      .on('error', $.util.log)
      .pipe($.autoprefixer({browsers: cssBrowsersSupported}))
      .pipe($.concat('style.css')),

    gulp.src(srcs.assets, {base: 'develop/source/'})
  );
}

gulp.task('test', function() {
  getTestJs()
    .pipe($.jasmineBrowser.specRunner({console: true}))
    .pipe($.jasmineBrowser.headless());
});

gulp.task('test:watch', ['test'], function() {
  getTestJs();
  var watchedThings = srcs.js.concat(srcs.test);
  $.watch(watchedThings, function(vinyl) {
    if (vinyl.event === 'change') {
      delete $.cached.caches['testJs'][vinyl.path];
    }

    gulp.start('test');
  });
});

gulp.task('jasmine', function() {
  getTestJs()
    .pipe($.watch(srcs.js.concat(srcs.test)))
    .pipe($.watch(srcs.sass))
    .pipe($.jasmineBrowser.specRunner())
    .pipe($.jasmineBrowser.server({port: 8888}));
});

var reportError = function(error) {
  var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

  $.notify({
    title: 'Task Failed [' + error.plugin + ']',
    message: lineNumber + 'See console.',
    sound: 'Basso'
  }).write(error);

  $.util.beep();

  // Pretty error reporting
  var report = '';
  var chalk = $.util.colors.white.bgRed;

  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  report += chalk('PROB:') + ' ' + error.message + '\n';
  if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
  if (error.fileName) { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
  console.error(report);

  this.emit('end');
};
