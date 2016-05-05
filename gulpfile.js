var gulp = require('gulp');
var gutil = require('gulp-util');


gulp.task('start', function () {
  nodemon({
    script: 'brbteam.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})
