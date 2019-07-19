var gulp     = require('gulp');
var del      = require('del');
var svg2png = require('gulp-svg2png');
var imagemin = require('gulp-imagemin');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

var convertToPng = function(path,size){
    return gulp.src(path)
        .pipe(svg2png({ width: size, height: size }))
        .pipe(gulp.dest('dist/png/'.concat(size)));
};

var compressSvg = function(deps,out){
  return gulp.src(deps)
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          // {removeViewBox: true},
          // {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest(out));
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

gulp.task('svgcopy', function () {
    return compressSvg('src/**/*.svg', 'dist/svg')
});

gulp.task('flags', function () {
  return compressSvg('node_modules/flag-icon-css/flags/4x3/*.svg', 'dist/svg/flags')
});

gulp.task('version', function (done) {
  fs.writeFileSync('dist/version.txt', argv.version);
  fs.writeFileSync('dist/build-date.txt', new Date());

  done();
});

gulp.task('clean', function(done) {
  del.sync(['dist/*']);
  done();
});

gulp.task('default',
  gulp.series(
    'clean',
    gulp.parallel(
      'version',
      'svgcopy',
      'flags',
      'svg2png:32',
      'svg2png:64',
      'svg2png:128'
    )
  )
);