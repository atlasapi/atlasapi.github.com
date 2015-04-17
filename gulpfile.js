var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('styles', function () {
  gulp.src('./assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('scripts', function () {
  gulp.src([
    './assets/js/src/lib/lodash.min.js',
    './assets/js/src/lib/ejs.min.js',
    './assets/js/src/lib/highlight.pack.js',
    './assets/js/src/lib/typeahead.bundle.min.js',
    './assets/js/src/common/api-data.js',
    './assets/js/src/common/compile-template.js',
    './assets/js/src/common/tabs.js',
    './assets/js/src/highlight-current-page.js',
    './assets/js/src/handleLoggedInStatus.js',
    './assets/js/src/nownextlater-widget.js',
    './assets/js/src/api-docs.js',
    './assets/js/src/api-explorer.js',
    './assets/js/src/submenus.js',
    './assets/js/src/script.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./assets/js'));
});

gulp.task('dev', function () {
  gulp.watch('./assets/scss/**/*.scss', ['styles']);
  gulp.watch('./assets/js/src/**/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts']);
