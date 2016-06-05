var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('start', function () {

})

gulp.task('default', function() {
	return gulp.src('client/app/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('/client.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('client/dist'));
});
