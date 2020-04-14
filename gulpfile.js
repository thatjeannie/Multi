// Gulp Config File

// Depedencies
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// Multiple tasks are created as individual functions to be combined at the end (Gulp 4.xx)

// Function to use Browsersync to watch HTML, CSS, and image files for changes to reload the browser
function syncBrowser(done) {
    browserSync.init({
        files: [
            './home/*.html',
            './home/assets/css/*.css',
            './home/assets/js/*.js',
            './home/themes/elloasty/*.html',
            './home/themes/elloasty/assets/css/*.css',
            './home/themes/elloasty/assets/js/*.js',
            './home/themes/elloasty/assets/images/*.*',
        ],
        server: './home',
        port: 8080,
        // Set to false to turn off the default Browsersync notification overlay on the browser
        notify: false
    });
    done();
}

// Function to compile the main site SCSS files
function compileSiteStyles() {
    return gulp.src('./build/home/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./home/assets/css'))
        .pipe(cleanCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./home/assets/css'))
        .pipe(browserSync.stream());
}

// Function to compile the theme SCSS files
function compileThemeStyles() {
    return gulp.src('./build/themes/elloasty/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./home/themes/elloasty/assets/css/'))
        .pipe(cleanCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./home/themes/elloasty/assets/css'))
        .pipe(browserSync.stream())
}

// Function to watch files, and rebuild on changes
function watchFiles() {
    gulp.watch('./build/home/scss/*.scss', compileSiteStyles);
    gulp.watch('./build/themes/elloasty/*.scss', compileThemeStyles);
}

// The single task function
// Task functions must be grouped into a single `gulp-task(...)` function utilizing the `gulp.series(...)` method (Gulp 4.x)
gulp.task('start', gulp.series(syncBrowser, compileSiteStyles, compileThemeStyles, watchFiles));
