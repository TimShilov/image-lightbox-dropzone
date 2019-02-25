const gulp = require('gulp');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

const file = 'image-lightbox-dropzone';
const APP_VERSION = require('./package.json').version;

// compress js
gulp.task('js', () => {
    return gulp.src(`src/${file}.js`)
        .pipe(replace('%APP_VERSION%', APP_VERSION))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist/'));
});

// compile SASS to CSS
gulp.task('sass', () => {
    return gulp.src(`src/${file}.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('test', () => {
    return gulp.src([`src/${file}.js`])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// minify files
gulp.task('minify-js', () => {
    return gulp.src([`dist/${file}.js`])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});
// minify files
gulp.task('minify-css', () => {
    return gulp.src([`dist/${file}.css`])
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});

// build assets
gulp.task('default', gulp.series(['js', 'sass', 'minify-js', 'minify-css']));