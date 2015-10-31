var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');

var web_root_prefix = process.env.WEB_ROOT_PREFIX;
var server_name = process.env.SERVER_NAME;

var web_root = web_root_prefix + '/' + server_name + '/public';
var paths = {
  js: {
    src: 'public/javascripts/**/*.js',
    dest: web_root + '/javascripts'
  },
  css: {
    src: 'public/stylesheets/**/*.scss',
    dest: web_root + '/stylesheets'
  },
  img: {
    src: 'public/images/*',
    dest: web_root + '/images'
  }
};

function checkVars() {
  if (web_root_prefix === undefined || server_name === undefined) {
    console.error('Error: WEB_ROOT_PREFIX or SERVER_NAME env vars unset');
    process.exit(1);
  }
}

// Javascripts Task
// Compress
gulp.task('js', function() {
  checkVars();
  gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['babel-preset-es2015']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.js.dest));
});

// Stylesheets Task
// Compile sass, autoprefix, compress
gulp.task('css', function() {
  checkVars();
  gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.css.dest));
});

// Images Task
// Compress
gulp.task('img', function() {
  checkVars();
  gulp.src(paths.img.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.img.dest));
})

// Watch Task
// Watches JS, CSS
gulp.task('watch', function() {
  gulp.watch(paths.js.src, ['js']);
  gulp.watch(paths.css.src, ['css']);
});

gulp.task('default', ['js']);
