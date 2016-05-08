var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('start', function () {
  nodemon({
    script: 'brbteam.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('default', function() {
	return gulp.src('client/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('/client.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('client'));
});
