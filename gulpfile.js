'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();

/**
 * Global Variables section
 * In this section we define global variables
 */
const dirs = {
  src: 'src',
  dest: 'build'
};

var paths = {
  styles: {
    src: `${dirs.src}/styles/style.scss`,
    dest: `${dirs.dest}/styles/`,
    wildcard: `${dirs.src}/styles/**/*.scss`
  },
  scripts: {
    src: `${dirs.src}/scripts/script.js`,
    dest: `${dirs.dest}/scripts/`,
    wildcard: `${dirs.src}/scripts/**/*.js`
  },
  templates: {
    src: `${dirs.src}/templates/index.html`,
    dest: dirs.dest,
  }
};

/**
 * Handle browser Sync functions
 */
const live = () => {
  browserSync.init({
    server: {
      baseDir: "./build",
      index: "index.html",
      directory: false,
      https: false,
    },
    watch: true,
    port: 8083,
    open: true,
    cors: true,
    notify: true
  });
}

/**
 * Styles section
 * In this section we define functionality who doing style stuff
 */
const styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
}

/**
 * Script section
 * In this section we define functionality who doing JS stuff ;)
 */
const scripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(paths.scripts.dest))
}

/**
 * Template handler
 */
const templates = () => {
  return gulp.src(paths.templates.src)
    .pipe(gulp.dest(paths.templates.dest))
}

/**
 * Gulp task watch usefull in development time
 */
const watch = () => {
  gulp.watch(paths.styles.wildcard, ['styles']).on('change', browserSync.reload);;
  gulp.watch(paths.scripts.wildcard, ['scripts']).on('change', browserSync.reload);;
  gulp.watch(paths.templates.src, ['templates']).on('change', browserSync.reload);;
}

/**
 * build Function
 * Provide Sequence for run in order 
 */
const build = (callback) => {
  runSequence(
    'styles',
    'scripts',
    'templates',
    callback);
}

/**
 * In development time use this task, it will proviede watch and other stuff
 */
const dev = (callback) => {
  runSequence(
    'build',
    'live',
    'watch',
    callback);
}

/**
 * Gulp Tasks
 */

gulp.task('live', live);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('templates', templates);
gulp.task('build', build);
gulp.task('watch', watch);
gulp.task('dev', dev);
gulp.task('default', build);