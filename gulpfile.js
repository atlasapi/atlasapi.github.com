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
  gulp.src('./src/googled4b379d670909716.html').pipe(gulp.dest('./build'));
  gulp.src('./src/CNAME').pipe(gulp.dest('./build'));
  gulp.src('./src/images/**/*').pipe(gulp.dest('./build/images'));
  gulp.src('./src/favicon.ico').pipe(gulp.dest('./build'));
  gulp.src('./3/**/*').pipe(gulp.dest('./build/3'));
  gulp.src('./src/templates/**/*').pipe(gulp.dest('./build/templates'));
});

gulp.task('styles', function () {
  gulp.src('./src/assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./build/css'));
});

// Compiles necessary files for api docs
gulp.task('apiDocs', function () {
  gulp.src([
    './src/assets/js/lib/lodash.min.js',
    './src/assets/js/lib/ejs.min.js',
    './src/assets/js/lib/highlight.pack.js',
    './src/assets/js/lib/typeahead.bundle.min.js',
    './src/assets/js/lib/moment.min.js',
    './src/assets/js/lib/jquery.selectText.js',
    './src/assets/js/lib/loglevel.js',
    './src/assets/js/common/api-data.js',
    './src/assets/js/common/tabs.js',
    './src/assets/js/common/popovers.js',
    './src/assets/js/common/encode-query-data.js',
    './src/assets/js/common/create-query-params-object.js',
    './src/assets/js/common/atlas-user.js',
    './src/assets/js/login-to-admin.js',
    './src/assets/js/highlight-current-page.js',
    './src/assets/js/handleLoggedInStatus.js',
    './src/assets/js/nownextlater-widget.js',
    './src/assets/js/channel-picker.js',
    './src/assets/js/channel-group-picker.js',
    './src/assets/js/api-docs.js',
    './src/assets/js/api-explorer.js',
    './src/assets/js/submenus.js',
    './src/assets/js/script.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('api-docs-bundle.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./build/js'));
});

// Compiles necessary files for api explorer
gulp.task('apiExplorer', function () {
  gulp.src([
    './src/assets/js/lib/lodash.min.js',
    './src/assets/js/lib/ejs.min.js',
    './src/assets/js/lib/highlight.pack.js',
    './src/assets/js/lib/typeahead.bundle.min.js',
    './src/assets/js/lib/moment.min.js',
    './src/assets/js/lib/jquery.selectText.js',
    './src/assets/js/lib/loglevel.js',
    './src/assets/js/common/api-data.js',
    './src/assets/js/common/tabs.js',
    './src/assets/js/common/popovers.js',
    './src/assets/js/common/encode-query-data.js',
    './src/assets/js/common/create-query-params-object.js',
    './src/assets/js/common/atlas-user.js',
    './src/assets/js/login-to-admin.js',
    './src/assets/js/highlight-current-page.js',
    './src/assets/js/handleLoggedInStatus.js',
    './src/assets/js/nownextlater-widget.js',
    './src/assets/js/channel-picker.js',
    './src/assets/js/channel-group-picker.js',
    './src/assets/js/api-docs.js',
    './src/assets/js/api-explorer.js',
    './src/assets/js/submenus.js',
    './src/assets/js/script.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('api-explorer-bundle.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./build/js'));
});

// Compiles javascript needed for all pages
gulp.task('scripts', function () {
  gulp.src([
    './src/assets/js/lib/lodash.min.js',
    './src/assets/js/lib/ejs.min.js',
    // './src/assets/js/lib/highlight.pack.js',
    // './src/assets/js/lib/typeahead.bundle.min.js',
    // './src/assets/js/lib/moment.min.js',
    './src/assets/js/lib/jquery.selectText.js',
    // './src/assets/js/lib/loglevel.js',
    './src/assets/js/common/api-data.js',
    // './src/assets/js/common/tabs.js',
    './src/assets/js/common/popovers.js',
    // './src/assets/js/common/encode-query-data.js',
    // './src/assets/js/common/create-query-params-object.js',
    // './src/assets/js/common/atlas-user.js',
    // './src/assets/js/login-to-admin.js',
    './src/assets/js/highlight-current-page.js',
    // './src/assets/js/handleLoggedInStatus.js',
    './src/assets/js/nownextlater-widget.js',
    // './src/assets/js/channel-picker.js',
    // './src/assets/js/channel-group-picker.js',
    // './src/assets/js/api-docs.js',
    // './src/assets/js/api-explorer.js',
    './src/assets/js/submenus.js',
    './src/assets/js/script.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main-bundle.js'))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('versioning', function () {
  gulp.src('./src/pages/**/*.html')
    .pipe(htmlReplace({
      'css': '/css/main.' + dateForVersioning + '.css',
      'mainJs': '/js/main-bundle.' + dateForVersioning + '.js',
      'apiDocs': '/js/api-docs-bundle.' + dateForVersioning + '.js',
      'apiExplorer': '/js/api-explorer-bundle.' + dateForVersioning + '.js'
    }))
    .pipe(gulp.dest('./build'));
  gulp.src('./build/css/main.css')
    .pipe(rename('./main.' + dateForVersioning + '.css'))
    .pipe(gulp.dest('./build/css'));
  gulp.src('./build/js/main-bundle.js')
    .pipe(rename('./main-bundle.' + dateForVersioning + '.js'))
    .pipe(gulp.dest('./build/js'));
  gulp.src('./build/js/api-docs-bundle.js')
    .pipe(rename('./api-docs-bundle.' + dateForVersioning + '.js'))
    .pipe(gulp.dest('./build/js'));
  gulp.src('./build/js/api-explorer-bundle.js')
    .pipe(rename('./api-explorer-bundle.' + dateForVersioning + '.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('watch', function () {
  gulp.watch('./src/pages/**/*.html', ['build']);
  gulp.watch('./src/assets/images/**/*', ['build']);
  gulp.watch('./src/assets/scss/**/*.scss', ['build']);
  gulp.watch('./src/assets/js/**/*.js', ['build']);
});

gulp.task('build', ['styles', 'scripts', 'apiDocs', 'apiExplorer', 'versioning', 'copyFiles']);

gulp.task('server', shell.task(['http-server build -p 3000 -a dev.mbst.tv -s -c-1 -o --cors']));

gulp.task('dev', function () {
  runSequence('build', 'watch', 'server');
});

gulp.task('default', ['build']);
