var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var htmlReplace = require('gulp-html-replace');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var dateForVersioning = new Date().getTime();

gulp.task('copyFiles', function () {
  gulp.src('./src/assets/images/**/*').pipe(gulp.dest('./images'));
  gulp.src('./src/templates/**/*').pipe(gulp.dest('./templates'));
  gulp.src('./src/data/**/*').pipe(gulp.dest('./data'));
});

gulp.task('styles', function () {
  gulp.src('./src/assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./css'));
});

// Compiles necessary files for api docs
gulp.task('apiDocs', function () {
  gulp.src([
    './src/assets/js/lib/highlight.pack.js',
    './src/assets/js/lib/typeahead.bundle.min.js',
    './src/assets/js/lib/moment.min.js',
    './src/assets/js/common/tabs.js',
    './src/assets/js/common/create-query-params-object.js',
    './src/assets/js/channel-picker.js',
    './src/assets/js/channel-group-picker.js',
    './src/assets/js/api-docs.js',
    './src/assets/js/api-explorer.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('api-docs-bundle.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./js'));
});

// Compiles javascript needed for all pages
gulp.task('scripts', function () {
  gulp.src([
    './src/assets/js/lib/lodash.min.js',
    './src/assets/js/lib/ejs.min.js',
    './src/assets/js/lib/jquery.selectText.js',
    './src/assets/js/lib/loglevel.js',
    './src/assets/js/common/api-data.js',
    './src/assets/js/common/popovers.js',
    './src/assets/js/common/encode-query-data.js',
    './src/assets/js/common/atlas-user.js',
    './src/assets/js/login-to-admin.js',
    './src/assets/js/highlight-current-page.js',
    './src/assets/js/handleLoggedInStatus.js',
    './src/assets/js/nownextlater-widget.js',
    './src/assets/js/submenus.js',
    './src/assets/js/script.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main-bundle.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./js'));
});

gulp.task('versioning', function () {
  gulp.src('./src/pages/**/*.html')
    .pipe(htmlReplace({
      'css': '/css/main.css?qs=' + dateForVersioning,
      'mainJs': '/js/main-bundle.js?qs=' + dateForVersioning,
      'apiDocs': '/js/api-docs-bundle.js?qs=' + dateForVersioning
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  gulp.watch('./src/pages/**/*.html', ['build']);
  gulp.watch('./src/assets/images/**/*', ['build']);
  gulp.watch('./src/assets/scss/**/*.scss', ['build']);
  gulp.watch('./src/assets/js/**/*.js', ['build']);
});

gulp.task('build', ['styles', 'scripts', 'apiDocs', 'copyFiles', 'versioning']);

gulp.task('server', shell.task(['http-server -p 3000 -a dev.mbst.tv -s -c-1 -o --cors']));

gulp.task('dev', function () {
  runSequence('build', 'watch', 'server');
});

gulp.task('default', ['build']);
