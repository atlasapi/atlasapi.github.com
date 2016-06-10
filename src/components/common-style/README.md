# common-styles #

Hi.

### What? ###

There are many MB projects, with more being created every month - the current way of CSSing is write it and guess. Copy bits from here and there and generally create messy files.

Having a base framework will not only help with this repeating of things, but should also help create a better visual connection between each product.

### How do I get set up? ###

#### Using Bower
```
#!bash
bower install --save common-style=git@bitbucket.org:mbst/common-style.git
```

Then in your scss, include the common-style base file:

```
#!scss
@import "/bower_components/common-style/scss/base.scss";
```

### The OLD WAY
**You don't copy and paste these files.**

In your projects package.json you'll need the following dependencies:

```
#!json
"devDependencies": {
  "gulp": "^3.8.7",
  "gulp-remote-src": "^0.2.1",
  "gulp-rimraf": "^0.1.0",
  "gulp-unzip": "^0.1.2",
  "gulp-autoprefixer": "^3.0.2",
  "gulp-sass": "^2.0.4"
}
```

Your gulp file should have something similar to this:

```
#!javascript
var frameworkURL = 'http://assets.mbst.tv/scss/framework/';
var frameworkVersion = '0.0.15';
var frameworkPath = './app/scss/framework';

var gulp = require('gulp');
var remoteSrc = require('gulp-remote-src');
var unzip = require('gulp-unzip');
var clean = require('gulp-rimraf');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// Paths
var paths = {
  dist: './dist'
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

gulp.task('build:css', function () {
  return gulp.src('./app/scss/index.scss')
             .pipe( sass().on('error', sass.logError) )
             .pipe( autoprefixer({
               browsers: ['last 2 versions'],
               cascade: false
             }) )
             .pipe( gulp.dest(paths.dist + '/css') );
});

gulp.task('build', ['build:css']);
gulp.task('default', ['getFramework', 'unzipFramework', 'deleteZipFile']);
```

Then do:

```
#!bash

gulp getFramework
```

**Remember to .gitignore the framework and any generated css in your repo**

# To Do #

1. Remove things from base.scss that are mb.com specific (and probably remove this file)
2. Create forms.scss
3. Add in global variable references (Primary colour, secondary colour, primary background colour, secondary background colour, border colour etc.)
4. Create an example.scss to show dependencies (global variables etc.)
