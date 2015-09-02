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

// Compiles necessary files for api docs
gulp.task('apiDocs', function () {
  gulp.src([
    './assets/js/src/lib/lodash.min.js',
    './assets/js/src/lib/ejs.min.js',
    './assets/js/src/lib/highlight.pack.js',
    './assets/js/src/lib/typeahead.bundle.min.js',
    './assets/js/src/lib/moment.min.js',
    './assets/js/src/lib/jquery.selectText.js',
    './assets/js/src/lib/loglevel.js',
    './assets/js/src/common/api-data.js',
    './assets/js/src/common/tabs.js',
    './assets/js/src/common/popovers.js',
    './assets/js/src/common/encode-query-data.js',
    './assets/js/src/common/create-query-params-object.js',
    './assets/js/src/common/atlas-user.js',
    './assets/js/src/login-to-admin.js',
    './assets/js/src/highlight-current-page.js',
    './assets/js/src/handleLoggedInStatus.js',
    './assets/js/src/nownextlater-widget.js',
    './assets/js/src/channel-picker.js',
    './assets/js/src/channel-group-picker.js',
    './assets/js/src/api-docs.js',
    './assets/js/src/api-explorer.js',
    './assets/js/src/submenus.js',
    './assets/js/src/script.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('api-docs-bundle.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./assets/js'));
});

// Compiles necessary files for api explorer
gulp.task('apiExplorer', function () {
  gulp.src([
    './assets/js/src/lib/lodash.min.js',
    './assets/js/src/lib/ejs.min.js',
    './assets/js/src/lib/highlight.pack.js',
    './assets/js/src/lib/typeahead.bundle.min.js',
    './assets/js/src/lib/moment.min.js',
    './assets/js/src/lib/jquery.selectText.js',
    './assets/js/src/lib/loglevel.js',
    './assets/js/src/common/api-data.js',
    './assets/js/src/common/tabs.js',
    './assets/js/src/common/popovers.js',
    './assets/js/src/common/encode-query-data.js',
    './assets/js/src/common/create-query-params-object.js',
    './assets/js/src/common/atlas-user.js',
    './assets/js/src/login-to-admin.js',
    './assets/js/src/highlight-current-page.js',
    './assets/js/src/handleLoggedInStatus.js',
    './assets/js/src/nownextlater-widget.js',
    './assets/js/src/channel-picker.js',
    './assets/js/src/channel-group-picker.js',
    './assets/js/src/api-docs.js',
    './assets/js/src/api-explorer.js',
    './assets/js/src/submenus.js',
    './assets/js/src/script.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('api-explorer-bundle.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./assets/js'));
});

// Compiles javascript needed for main page
gulp.task('scripts', function () {
  gulp.src([
    './assets/js/src/lib/lodash.min.js',
    './assets/js/src/lib/ejs.min.js',
    './assets/js/src/lib/highlight.pack.js',
    './assets/js/src/lib/typeahead.bundle.min.js',
    './assets/js/src/lib/moment.min.js',
    './assets/js/src/lib/jquery.selectText.js',
    './assets/js/src/lib/loglevel.js',
    './assets/js/src/common/api-data.js',
    './assets/js/src/common/tabs.js',
    './assets/js/src/common/popovers.js',
    './assets/js/src/common/encode-query-data.js',
    './assets/js/src/common/create-query-params-object.js',
    './assets/js/src/common/atlas-user.js',
    './assets/js/src/login-to-admin.js',
    './assets/js/src/highlight-current-page.js',
    './assets/js/src/handleLoggedInStatus.js',
    './assets/js/src/nownextlater-widget.js',
    './assets/js/src/channel-picker.js',
    './assets/js/src/channel-group-picker.js',
    './assets/js/src/api-docs.js',
    './assets/js/src/api-explorer.js',
    './assets/js/src/submenus.js',
    './assets/js/src/script.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main-bundle.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./assets/js'));
});

gulp.task('dev', function () {
  gulp.watch('./assets/scss/**/*.scss', ['styles']);
  gulp.watch('./assets/js/src/**/*.js', ['scripts', 'apiDocs', 'apiExplorer']);
});

gulp.task('default', ['styles', 'scripts', 'apiDocs', 'apiExplorer']);
