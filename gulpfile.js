var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    del = require('del');


gulp.task('clean', function() {
   del(['deploy']); 
});

gulp.task('build', function () {
    var assets = useref.assets();
    
    gulp.src('index.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('deploy'));
    
    gulp.src('bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('deploy/fonts'))
});
