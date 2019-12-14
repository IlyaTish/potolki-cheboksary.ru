const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      cleanCSS     = require('gulp-clean-css'),
      browserSync  = require('browser-sync').create();
      pug          = require('gulp-pug'),
      concat       = require('gulp-concat'),
      babel        = require('gulp-babel'),
      uglify       = require('gulp-uglify'),
      del          = require('del'),
      sourcemaps   = require('gulp-sourcemaps'),
      plumber      = require('gulp-plumber'),
      autoprefixer = require('gulp-autoprefixer'),
      imagemin     = require('gulp-imagemin'),
      fs           = require('fs');


const paths = {
  src:  './src',
  dist: './dist',
  html: {
    src:  './src/*.html',
    dest: './dist'
  },
  pug: {
    src:  './src/*.pug',
    dest: './dist'
  },
  styles: {
    src:  './src/assets/sass/style.sass',
    dest: './dist/assets/css'
  },
  scripts: {
    src:  './src/assets/js/**/**/*.js',
    dest: './dist/assets/js'
  },
  libs: {
    jsSrc:   './src/assets/libs/*.js',
    cssSrc:  './src/assets/libs/**/*.css',
    cssDest: './dist/assets/css'
  },
  fonts: {
    src:  './src/assets/fonts/**/*',
    dest: './dist/assets/fonts'
  },
  images: {
    src: './src/img/**/**/*.+(png|jpg|jpeg|gif|svg|ico)',
  }
}


function reload() {
  browserSync.reload();
}


gulp.task('clear', async () => {
  /* Удаление папки js */
  console.log('\n' + '* Удаление папки js *');
  const deletedPaths = await del([ paths.dist ]);
});


gulp.task('html', () => {
  /* Сборка html файлов */
  console.log('\n' + '* Сборка html файлов *');
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
});


gulp.task('pug', () => {
  /* Компиляция pug файлов */
  console.log('\n' + '* Компиляция pug файлов *');
  return gulp
    .src(paths.pug.src)
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream());
});


gulp.task('styles', () => {
  /* Компиляция style.sass */
  console.log('\n' + '* Компиляция style.sass *');
  return (
    gulp
      .src(paths.styles.src)
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(autoprefixer())
      .pipe(concat('style.min.css'))
      .pipe(cleanCSS())
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(browserSync.stream())
  );
});


gulp.task('cssLibs', () => {
  /* Сборка библиотек стилей */
  console.log('\n' + '* Сборка библиотек стилей *');
  return (
    gulp
      .src(paths.libs.cssSrc)
      .pipe(concat('libs.min.css'))
      .pipe(cleanCSS())
      .pipe(gulp.dest(paths.libs.cssDest))
      .pipe(browserSync.stream())
  );
});


gulp.task('cssConcat', () => {
  /* Объединение всех стилей */
  console.log('\n' + '* Объединение всех стилей *');
  return (
    gulp
      .src(paths.dist + '/assets/css/*.css')
      .pipe(concat('all.min.css'))
      .pipe(gulp.dest(paths.dist + '/assets/css'))
      .pipe(browserSync.stream())
  );
});


gulp.task('clearCss', () => {
  /* Удаление лишних стилей */
  console.log('\n' + '* Удаление лишних стилей *');
  return (
    del([ paths.styles.dest ])
  );
});


gulp.task('scripts', () => {
  /* Объединение и сжатие скриптов */
  console.log('\n' + '* Объединение и сжатие скриптов *');
  return (
    gulp
      .src([ paths.libs.jsSrc, paths.scripts.src ])
      .pipe(concat('all.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(paths.scripts.dest))
  );
});


gulp.task('images', () => {
  /* Минификация картинок */
  console.log('\n' + '* Минификация картинок *');
  return gulp
    .src(paths.src + '/assets/images/**/*.+(png|jpg|jpeg|gif|svg|ico)')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + '/assets/images'))
    .pipe(browserSync.stream());
});


gulp.task('fonts', () => {
  /* Сборка шрифтов */
  console.log('\n' + '* Сборка шрифтов *');
  return gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
});


gulp.task('webfonts', () => {
  /* Сборка иконок fontawesome */
  console.log('\n' + '* Сборка иконок fontawesome *');
  return gulp
    .src(paths.src + '/assets/webfonts/*')
    .pipe(gulp.dest(paths.dist + '/assets/webfonts'))
});


gulp.task('watch', () => {
  /* Отслеживание pug/html/sass */
  console.log('\n' + '* Отслеживание pug/html/sass *');
  browserSync.init({
    server: {
      baseDir: [ './dist' ]
    },
    port: 3000
  });

  gulp.watch(paths.html.src).on('change', browserSync.reload);
  gulp.watch(paths.pug.src, gulp.series('pug')).on('change', browserSync.reload);
  gulp.watch(paths.styles.src, gulp.series('clearCss', 'styles', 'cssLibs', 'cssConcat'));
  gulp.watch(paths.scripts.src, gulp.series('scripts')).on('change', browserSync.reload);
  gulp.watch(paths.images.src).on('change', browserSync.reload);
});


gulp.task('build', gulp.series('clear', 'html', 'pug', 'styles', 'cssLibs', 'cssConcat', 'scripts', 'images', 'fonts', 'webfonts'));
gulp.task('default', gulp.series('build', gulp.parallel('watch')));