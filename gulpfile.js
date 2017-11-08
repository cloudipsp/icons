var gulp     = require('gulp');
var del      = require('del');
var svg2png = require('gulp-svg2png');

var convertToPng = function(path,size){
    return gulp.src(path)
        .pipe(svg2png({ width: size, height: size }))
        .pipe(gulp.dest('dist/png/'.concat(size)));
};

gulp.task('svg2png:32', function () {
    return convertToPng('src/**/*.svg',32);
});

gulp.task('svg2png:64', function () {
    return convertToPng('src/**/*.svg',64);
});

gulp.task('svg2png:128', function () {
    return convertToPng('src/**/*.svg',128);
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('default', ['clean','svg2png:32','svg2png:64','svg2png:128']);