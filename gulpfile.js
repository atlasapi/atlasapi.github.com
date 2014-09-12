var gulp = require('gulp'),

    frameworkURL = 'http://assets.mbst.tv/scss/framework/',
    frameworkVersion = '0.0.15',
    frameworkPath = './css/scss/framework',

    sass = require('gulp-ruby-sass'),
    watch = require('gulp-watch'),
    remoteSrc = require('gulp-remote-src'),
    unzip = require('gulp-unzip'),
    clean = require('gulp-rimraf'),

    // Paths
    paths = {
      dist: 'css/'
    };

gulp.task('getFramework', function () {
  return remoteSrc('archive.zip', {
    base: frameworkURL + frameworkVersion + '/'
  })
    .pipe(gulp.dest('./'));
});

gulp.task('unzipFramework', ['getFramework'], function () {
  gulp.src('./archive.zip')
    .pipe(unzip())
    .pipe(gulp.dest(frameworkPath + '/'));
});

gulp.task('deleteZipFile', ['unzipFramework'], function () {
  return gulp.src('./archive.zip', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('sass', function () {
  gulp.src('css/scss/main.scss')
    .pipe(sass({
      style: 'compressed',
      sourcemap: false
    }))
    .on('error', function (err) { console.log(err.message); })
    .pipe(gulp.dest('css/'));
});

gulp.task('watch', function () {
  gulp.watch('css/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['getFramework', 'unzipFramework', 'deleteZipFile', 'sass']);
