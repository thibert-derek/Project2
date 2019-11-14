const {src, dest, watch, parallel, series} = require('gulp');
const markdown = require('gulp-markdown');

function md(){
    return src('*.md')
    .pipe(markdown())
    .pipe(dest('prod/'));
}

