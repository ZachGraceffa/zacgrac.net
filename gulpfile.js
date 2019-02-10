"use strict";

//Load plugins
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const del = require('del');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');

// BrowserSync Init
function browserSyncInit(done) {
  browserSync.init(null, {
          proxy: "http://localhost:3000", // port of node server
          port: 4000 //will not clash with node
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
function watchFiles(done){
    gulp.watch('app/scss/**/*.scss', gulp.series(buildSass, browserSyncReload));
    gulp.watch('app/*.html', browserSyncReload);
    gulp.watch('app/js/**/*.js', browserSyncReload);
    done();
}

//Clean dist
function cleanBuildLoc(done) {
  del.sync('dist');
  done();
}

//Use Nodemon to route through Express
function nodeServer(done) {
    var callbackCalled = false;
    return nodemon({script: 'app/server.js'}).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            done();
        }
    });
}

//define complex tasks
const watch = gulp.series(nodeServer, gulp.parallel(watchFiles, browserSyncInit));
const build = gulp.series(cleanBuildLoc, minifyAndTransport);

// export tasks
exports.build = build;
exports.default = watch;
