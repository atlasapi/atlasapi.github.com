var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    watch = require('gulp-watch');

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

gulp.task('default', ['watch']);
