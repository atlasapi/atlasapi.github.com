var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var browserify = require('browserify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var spock = require('spock');
var del = require('del');
var zip = require('gulp-zip');
var maven = require('maven-deploy');
var bump = require('gulp-bump');
var git = require('gulp-git');
var shell = require('gulp-shell');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var args = process.argv.filter(function (arg) {
  if (arg.substr(0, 1) === '-') {
    return arg;
  }
});

/**
 *  Set the environment
 */
var ENV = 'dev';

/**
 *  Register the cleaning task
 */
gulp.task('clean', function () {
  return del.sync(['src/js/main.compiled.*', 'src/_index.html']);
});

gulp.task('reset', function () {
  return del.sync(['build', 'src/js/main.compiled.*', 'src/_index.html']);
});

/**
 *  es6 to es5 bits
 */
function bundle(browserify, file, dest, createSourceMaps) {
  if (createSourceMaps) {
    return browserify.bundle()
      .pipe(source(file))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      // Add transformation tasks to the pipeline here.
      .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dest));
  } else {
    return browserify.bundle()
      .pipe(source(file))
      .pipe(buffer())
      // Add transformation tasks to the pipeline here.
      .on('error', gutil.log)
      .pipe(gulp.dest(dest));
  }
}

gulp.task('6to5', function () {
  var b = browserify({
    entries: 'src/js/main.js',
    debug: true,
    transform: [
      babelify.configure()
    ]
  });

  var file = 'main.compiled.js';
  var dest = 'src/js/';
  var createSourceMaps = true;

  if (ENV !== 'dev') {
    createSourceMaps = false;
  }

  return bundle(b, file, dest, createSourceMaps);
});

/**
 *  embed templates in the html
 */
gulp.task('templates', ['scss', '6to5'], function () {
  return gulp.src('./src/index.html')
    .pipe(rename('_index.html'))
    .pipe(spock({
      verbose: true,
      outputDir: './src'
    }))
    .pipe(gulp.dest('./src'));
});

/**
 *  Replace js and css references with concatenated, minified files
 */
gulp.task('useref', ['templates'], function () {
  var assets = useref.assets();

  return gulp.src('./src/**/*.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minify()))
    .pipe(rev())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace())
    .pipe(gulp.dest('./build'));
});

/**
 *  Process the scss
 */
gulp.task('scss', function () {
  return gulp.src('./src/scss/base.scss')
    .pipe(rename('app.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./src/css'));
});

/**
 *  Get environment based on cli params
 */
gulp.task('getEnvironment', function (done) {
  if (args.indexOf('--stage') !== -1) {
    ENV = 'stage';
  } else if (args.indexOf('--prod') !== -1) {
    ENV = 'prod';
  }

  console.log('Environment: ' + ENV);

  done();
});

gulp.task('zip', ['build'], function () {
  var pkg = require('./package.json');
  return gulp.src('./build/**/*')
    .pipe(zip(pkg.name + '-' + pkg.version + '.zip'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('maven', ['zip'], function (cb) {
  var pkg = require('./package.json');

  var config = {
    groupId: 'com.metabroadcast',
    buildDir: "build/",
    type: "zip",
    finalName: pkg.name + '-' + pkg.version,
    repositories: [
      {
        id: 'metabroadcast-mvn',
        url: 'http://mvn.metabroadcast.com/deploy-releases-local'
      }
    ]
  };

  maven.config(config);

  maven.deploy(config.repositories[0].id, config.snapshot, cb);
});

gulp.task('bump', ['maven'], function () {
  if (ENV === 'stage') {
    return gulp.src(['./package.json'])
      .pipe(bump())
      .pipe(gulp.dest('./'));
  } else if (ENV === 'prod') {
    return gulp.src(['./package.json'])
      .pipe(bump({type: 'Minor'}))
      .pipe(gulp.dest('./'));
  }
});

gulp.task('gitCommit', ['bump'], function () {
  var version = require('./package.json').version;
  return gulp.src('.')
    .pipe(git.commit("Update package version to " + version, {args: '-a'}));
});

gulp.task('gitPush', ['gitCommit'], function () {
  return git.push('origin', 'master', function (err) {
    if (err) throw err;
  }, null);
});

/**
 * Copy images to build
 */
gulp.task('images', function () {
  gulp.src('./src/img/**/*').pipe(gulp.dest('./build/img'));
  gulp.src('./src/favicon.ico').pipe(gulp.dest('./build'));
});

/**
 * Copy JSON to build
 */
gulp.task('json', function () {
  gulp.src('./src/data/**/*').pipe(gulp.dest('./build/data'));
});

gulp.task('server', shell.task(['http-server src -p 8080 -a dev.mbst.tv --cors']));

/**
 *  The tasks that should be run on a day to day basis
 */
gulp.task('build', ['getEnvironment', 'reset', '6to5', 'scss', 'images', 'json', 'templates', 'useref', 'clean']);

gulp.task('upload', ['gitPush']);

gulp.task('watch', ['6to5', 'scss'], function () {
  gulp.watch('src/**/*.js', ['6to5']);
  gulp.watch('src/**/*.scss', ['scss']);
});

gulp.task('dev', ['watch', 'server']);

gulp.task('default');
