const gulp = require('gulp');
const del = require('del');
const svg2png = require('./gulp-svg2png.js');
const svgo = require('./gulp-svgo.js');
const addViewBox = require('./svgo-add-viewbox.js');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const svgPath = 'src/**/*.svg';
const allPath = [
  'src/banks/*.svg',
  'src/card/*.svg',
  'src/crypto/*.svg',
  'src/emoney/*.svg',
  'src/installments/*.svg',
  'src/loans/*.svg',
  'src/wallets/*.svg',
];

const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          inlineStyles: false,
        },
      },
    },
    'convertStyleToAttrs',
    addViewBox,
    {
      name: 'removeAttrs',
      params: {
        attrs: ['svg_(version|x|y|id|fill|xml:space)', 'data-name', 'path_fill-rule_nonzero'],
        elemSeparator: '_',
      },
    },
    {
      name: "cleanupIds",
      params: {
        minify: false,
        force: true,
      }
    },
    {
      name: "inlineStyles",
      params: {
        onlyMatchedOnce: false,
      }
    },
    {
      name: "mergePaths",
      params: {
        force: true,
      }
    }
  ],
};

const convertToPng = function (path, out, size) {
  return gulp
    .src(path)
    .pipe(svg2png({ width: size, height: size }))
    .pipe(gulp.dest(out + size));
};

const compressSvg = function (path, out) {
  return gulp.src(path).pipe(svgo(svgoConfig)).pipe(gulp.dest(out));
};

gulp.task('svg2png:32', function () {
  return convertToPng(svgPath, 'dist/png/', 32);
});

gulp.task('svg2png:64', function () {
  return convertToPng(svgPath, 'dist/png/', 64);
});

gulp.task('svg2png:128', function () {
  return convertToPng(svgPath, 'dist/png/', 128);
});

gulp.task('svg', function () {
  return compressSvg(svgPath, 'dist/svg');
});

gulp.task('svg:src', function () {
  return gulp
    .src(allPath)
    .pipe(svgo(svgoConfig))
    .pipe(
      gulp.dest(function (file) {
        return file.base;
      }),
    );
});

gulp.task('json', function () {
  return gulp
    .src('src/json/**/*.json', { encoding: false })
    .pipe(gulp.dest('dist/json'));
});

gulp.task('favicon', function () {
  return gulp
    .src('src/favicon/**/*', { encoding: false })
    .pipe(gulp.dest('dist/favicon'));
});

gulp.task('fonts', function () {
  return gulp
    .src('src/fonts/**/*', { encoding: false })
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('flags', function () {
  return compressSvg(
    'node_modules/flag-icon-css/flags/4x3/*.svg',
    'dist/svg/flags',
  );
});

gulp.task('version', function (done) {
  fs.writeFileSync('dist/version.txt', argv.version);
  fs.writeFileSync('dist/build-date.txt', new Date().toUTCString());

  done();
});

gulp.task('clean', function (done) {
  del.sync(['dist/*']);
  done();
});

gulp.task('all:svg', function () {
  return compressSvg(allPath, 'dist/all/svg');
});

gulp.task('all:svg2png:32', function () {
  return convertToPng(allPath, 'dist/all/png/', 32);
});

gulp.task('all:svg2png:64', function () {
  return convertToPng(allPath, 'dist/all/png/', 64);
});

gulp.task('all:svg2png:128', function () {
  return convertToPng(allPath, 'dist/all/png/', 128);
});

gulp.task(
  'all',
  gulp.parallel(
    'all:svg',
    'all:svg2png:32',
    'all:svg2png:64',
    'all:svg2png:128',
  ),
);

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel(
      'version',
      'svg',
      'json',
      'favicon',
      'fonts',
      'flags',
      'svg2png:32',
      'svg2png:64',
      'svg2png:128',
      'all',
    ),
  ),
);
