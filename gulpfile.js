"use strict";

//Load plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const del = require('del');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');

// BrowserSync Init
function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

// Build Sass
function buildSass(loc){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
}

//Minify send to dist
function minifyAndTransport(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
}

//Watch
function watchFiles(){
    gulp.watch('app/scss/**/*.scss', gulp.series(buildSass, browserSyncReload));
    gulp.watch('app/*.html', browserSyncReload);
    gulp.watch('app/js/**/*.js', browserSyncReload);
}

//Clean dist
function cleanBuildLoc(done) {
  del.sync('dist');
  done();
}

//define complex tasks
const watch = gulp.parallel(watchFiles, browserSyncInit);
const build = gulp.series(cleanBuildLoc, minifyAndTransport);

// export tasks
exports.build = build;
exports.default = watch;
