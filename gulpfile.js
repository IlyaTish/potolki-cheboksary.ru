/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2019 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.10.11-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

const gulp                      = require('gulp'),
      del                       = require('del'),
      sourcemaps                = require('gulp-sourcemaps'),
      plumber                   = require('gulp-plumber'),
      sass                      = require('gulp-sass'),
      autoprefixer              = require('gulp-autoprefixer'),
      minifyCss                 = require('gulp-clean-css'),
      babel                     = require('gulp-babel'),
      webpack                   = require('webpack-stream'),
      uglify                    = require('gulp-uglify'),
      concat                    = require('gulp-concat'),
      imagemin                  = require('gulp-imagemin'),
      browserSync               = require('browser-sync').create(),
      pug                       = require('gulp-pug'),

      pug_folder                = './',

      src_folder                = './src/',
      src_assets_folder         = src_folder + 'assets/',
      dist_folder               = './dist/',
      dist_assets_folder        = dist_folder + 'assets/',
      node_modules_folder       = './node_modules/',
      dist_node_modules_folder  = dist_folder + 'node_modules/',

      node_dependencies         = Object.keys(require('./package.json').dependencies || {});


gulp.task('clear', async () => {
  /* Удаление папки dist */
  console.log('\n' + '* Удаление папки dist *');

  const deletedPaths = await del([ dist_folder ]);
});


gulp.task('html', () => {
  /* Сборка html файлов */
  console.log('\n' + '* Сборка html файлов *');

  return gulp.src([ src_folder + '**/*.html' ], {
    base: src_folder,
    since: gulp.lastRun('html')
  })
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});


gulp.task('pug', () => {
  /* Компиляция pug файлов */
  console.log('\n' + '* Компиляция pug файлов *');

  return gulp.src([ src_folder + '**/**/**/*.pug' ], {
      base: src_folder,
      since: gulp.lastRun('pug')
    })
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});


gulp.task('sass', () => {
  /* Компиляция sass файлов */
  console.log('\n' + '* Компиляция sass файлов *');

  return gulp.src([
    src_assets_folder + 'sass/**/*.sass',
    src_assets_folder + 'scss/**/*.scss'
  ], { since: gulp.lastRun('sass') })
    .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});


gulp.task('cssLibs', () => {
  /* Компиляция стилей библиотек */
  console.log('\n' + '* Компиляция стилей библиотек *');

  return gulp.src([
    src_assets_folder + 'libs/**/*.css'
  ], { since: gulp.lastRun('cssLibs') })
    .pipe(plumber())
    .pipe(minifyCss())
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('cssConcat', () => {
  /* Объединение стилей */
  console.log('\n' + '* Объединение стилей *');

  return gulp.src([
    dist_assets_folder + 'css/**/*.css'
  ], { since: gulp.lastRun('cssConcat') })
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
});


gulp.task('js', () => {
  /* Объединение и сжатие скриптов */
  console.log('\n' + '* Объединение и сжатие скриптов (старт dev) *');

  return gulp.src([
      src_assets_folder + 'libs/**/*.js',
      src_assets_folder + 'js/**/*.js'
    ])
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist_assets_folder + 'js'))
});


gulp.task('images', () => {
  /* Минификация картинок */
  console.log('\n' + '* Минификация картинок *');

  return gulp.src([ src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)' ], { since: gulp.lastRun('images') })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(dist_assets_folder + 'images'))
    .pipe(browserSync.stream());
});


gulp.task('webfonts', () => {
  /* Сборка иконок fontawesome */
  console.log('\n' + '* Сборка иконок fontawesome *');

  return gulp
    .src(src_assets_folder + 'webfonts/*')
    .pipe(gulp.dest(dist_assets_folder + 'webfonts'))
});


gulp.task('vendor', () => {
  /* Подтягивание зависимостей из папки node_modules */
  console.log('\n' + '* Подтягивание зависимостей из папки node_modules *');

  if (node_dependencies.length === 0) {
    return new Promise((resolve) => {
      console.log('Зависимости не найдены');
      resolve();
    });
  }

  return gulp.src(node_dependencies.map(dependency => node_modules_folder + dependency + '/**/*.*'), {
    base: node_modules_folder,
    since: gulp.lastRun('vendor')
  })
    .pipe(gulp.dest(dist_node_modules_folder))
    .pipe(browserSync.stream());
});

gulp.task('build', gulp.series('clear', async () => await console.log('\n' + '* Старт сборки папки dist *'), 'html', 'pug', 'sass', 'cssLibs', 'cssConcat', 'js', 'webfonts', 'images', 'vendor'));


gulp.task('dev', gulp.series('html', 'pug', 'sass', 'cssLibs', 'cssConcat', 'js'));


gulp.task('serve', () => {
  /* Извлечение и отслеживание файлов из папки dist, запуск browserSync */
  console.log('\n' + '* Извлечение и отслеживание файлов из папки dist, запуск browserSync *');
  return browserSync.init({
    server: {
      baseDir: [ 'dist' ]
    },
    port: 3000
  });
});


gulp.task('watch', () => {
  const watchImages = [
    src_assets_folder + 'images/**/*.+(png|jpg|jpeg|webp|gif|svg|ico)'
  ];

  const watchVendor = [];

  node_dependencies.forEach(dependency => {
    watchVendor.push(node_modules_folder + dependency + '/**/*.*');
  });

  const watch = [
    src_folder + '**/*.html',
    pug_folder + '**/**/**/*.pug',
    src_assets_folder + 'sass/**/*.sass',
    src_assets_folder + 'js/**/*.js'
  ];

  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
  gulp.watch(watchImages, gulp.series('images')).on('change', browserSync.reload);
  gulp.watch(watchVendor, gulp.series('vendor')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));