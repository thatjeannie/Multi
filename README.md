# Local Bootstrap Theming in a Few Easy Steps

## Step 1: Navigate to the project root, enter the following into command line

If you're not trying to make a git repo for the project, omit `git` command below, and skip **Step 2**.

```TERMINAL
git init
```

```TERMINAL
npm init -y
```

```TERMINAL
touch .gitignore
```

## Step 2: Add the following to `.gitignore`

Plus any other stuff you don't need to commit.

```TEXT
node_modules/

.DS_Store

.vscode/
.idea/
```

## Step 3: Enter the following into command line

```TERMINAL
npm install --save-dev node-sass autoprefixer gulp gulp-clean-css gulp-postcss gulp-rename gulp-sass gulp-sourcemaps browser-sync
```

```TERMINAL
npm install bootstrap popper.js@1.16.0 jquery
```

## Step 4: Build the following file structure

```TEXT
root/
    build/
        home/
            js/
            scss/
        themes/
            themename/
    home/
        assets/
            css/
            images/
            js/
        themes/
            themename/
                assets/
                    css/
                    images/
                    js/
```

## Step 5: Create the following files within the above file structure

```TEXT
/build/home/scss/main.scss
/build/themes/themename/themename.scss
/home/index.html
/home/themes/themename/index.html
```

## Step 6: Add the following to `gulpfile.js`

Replace "themename" with your actual theme name.

```JS
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
```

## Step 7: Add a `start` script and a `browserslist` to `package.json`

The `start` script will call the "start" task from our Gulp file.

```JSON
"scripts": {
    "start": "gulp start",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```

The `browserslist` is used by `autoprefixer` to determine which CSS prefixes to add - "defaults" is good for [most users](https://www.npmjs.com/package/browserslist#best-practices).

```JSON
"browserslist": [
    "defaults"
]
```

## Step 8: Link minified CSS files to `head` of each HTML file

Home index.html

```HTML
<link rel="stylesheet" href="assets/css/main.min.css">
```

Theme index.html

```HTML
<link rel="stylesheet" href="assets/css/themename.min.css">
```

## Step 9: At project root, enter the following into command line

Either will work - pick one.

```TERMINAL
npm run start
```

```TERMINAL
npm start
```

## Step 10: Start building your theme

Just update `gulpfile.js` with your new theme name when you want to build another one.
