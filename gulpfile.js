var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    del = require('del');

var deploy_folder = 'deploy';
var source_folder = 'src';
	
gulp.task('clean', function() {
   del([deploy_folder]); 
});

gulp.task('build', function () {
    var assets = useref.assets();
    
    gulp.src(source_folder + '/index.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(deploy_folder));
    
	// process bootstrap fonts
    gulp.src(source_folder + '/bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest(deploy_folder + '/fonts'))
	
	// process images
	gulp.src(source_folder + '/img/*')
		.pipe(gulp.dest(deploy_folder + '/img'))
	
});
