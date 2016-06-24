var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var mainBowerFiles = require('gulp-main-bower-files');
var shell = require('gulp-shell');
var exec = require('child_process').exec;


gulp.task('inject', function() {
	var target = gulp.src('client/index.html');

	//var sources = gulp.src(mainBowerFiles(), {read: false});

	// console.log(sources);
	//
	// return target.pipe(inject(sources))
	// 						 .pipe(gulp.dest('client/'));

});

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

gulp.task('run', ['default'], shell.task([
	'npm start',
]
));

// gulp.task('run-all', ['run'], function(){
//
// 	exec("echo hello");
//
// });
