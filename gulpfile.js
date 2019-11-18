const fs = require('fs');
const {src, dest, watch, parallel, series} = require('gulp');
const sass = require('gulp-sass');
const wrap = require('gulp-wrap');
const markdown = require('gulp-markdown');
const frontMatter = require('gulp-front-matter');
const del = require('delete');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

function md(){
    return src('app/**/*.md')
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(
        wrap(
          data =>
            fs
              .readFileSync(
                'app/' + data.file.frontMatter.template + '.html'
              )
              .toString(),
          null,
          { engine: 'nunjucks' }
        )
      )
    .pipe(dest('prod/'));
}

function font(){
  return src('app/**/*.ttf').pipe(dest('prod/css/'));
}

function css(){
    return src('app/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat('styles.css'))
    .pipe(dest('prod/css/'));
}

function images() {
  return src('app/**/*.jpg', 'app/**/*.jpeg').pipe(dest('prod/images'));
}

function watch_task(){
    watch('app/**/*.scss', series(css, reload));
    watch('app/**/*.md', series(md, reload));
    watch('app/**/*.jpg', series(images, reload));
    watch('app/**/*.jpeg', series(images, reload));
    watch('app/**/*.ttf', series(font, reload));
}

function sync(cb){
    browserSync.init({
        server: { baseDir: 'prod/' }
    });
    cb();
}

function reload(cb){
    browserSync.reload();
    cb();
}

function clean(cb){
    del(['prod/**/*'], cb);
}

exports.clean = clean;
exports.build = series(clean, parallel(md, images, css, font));
exports.default = series(exports.build, sync, watch_task);