const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babelify = require('babelify');
const browserify = require('browserify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const ngAnnotate = require('gulp-ng-annotate');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');

const web_root_prefix = '/var/www' //process.env.WEB_ROOT_PREFIX;
const server_name = 'voicechat.dev' //process.env.SERVER_NAME;

const web_root = web_root_prefix + '/' + server_name + '/public';
const paths = {
  js: {
    src: ['assets/public/javascripts/voicechat.js',
          'assets/public/javascripts/**/*.js'],
    dest1: web_root + '/javascripts',
    dest2: 'assets/dev/public/javascripts'
  },
  jsVendor: {
    src: ['node_modules/angular/angular.js',
          'node_modules/angular-route/angular-route.js',
          'node_modules/angular-messages/angular-messages.js',
          'node_modules/ngstorage/ngStorage.js',
          'node_modules/angular-flash-alert/dist/angular-flash.js',
          'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js',
          'node_modules/api-check/dist/api-check.js',
          'node_modules/angular-formly/dist/formly.js',
          'node_modules/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js'],
    dest1: web_root + '/javascripts',
    dest2: 'assets/dev/vendor/javascripts'
  },
  css: {
    src: 'assets/public/stylesheets/bootstrap-custom.scss',
    dest: web_root + '/stylesheets'
  },
  img: {
    src: 'assets/public/images/*',
    dest: web_root + '/images'
  },
  html: {
    src: 'assets/public/partials/**/*.html',
    dest: web_root + '/partials'
  }
};

function checkconsts() {
  if (web_root_prefix === undefined || server_name === undefined) {
    console.error('Error: WEB_ROOT_PREFIX or SERVER_NAME env vars unset');
    process.exit(1);
  }
}

// Javascripts Task
// ES6 to 5, Concatenate, Compress
gulp.task('js', function() {
  checkconsts();

  var sources = browserify({
		entries: paths.js.src[0],
		debug: true // Build source maps
	})
	.transform(babelify.configure({
		presets: ['es2015']
	}));

  return sources.bundle()
    .pipe(plumber())
    .pipe(vinylSourceStream('voicechat.min.js'))
    .pipe(vinylBuffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write('./', {
      includeContent: true
    }))
    .pipe(gulp.dest(paths.js.dest1))
    .pipe(gulp.dest(paths.js.dest2));
});

// Vendor Javascripts Task
// See 'js' task description
gulp.task('jsVendor', function() {
  checkconsts();
  return gulp.src(paths.jsVendor.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('deps.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.jsVendor.dest1))
    .pipe(gulp.dest(paths.jsVendor.dest2));
});

// Stylesheets Task
// Compile sass, autoprefix, compress
gulp.task('css', function() {
  checkconsts();
  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css.dest));
});

// Images Task
// Compress
gulp.task('img', function() {
  checkconsts();
  return gulp.src(paths.img.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.img.dest));
});

// HTML Task
// Relocate
gulp.task('html', function() {
  checkconsts();
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
});

// Watch Task
// Watches JS, CSS, Images, HTML
gulp.task('watch', ['default'], function() {
  gulp.watch(paths.js.src, ['js']);
  gulp.watch(paths.jsVendor.src, ['jsVendor'])
  gulp.watch(paths.css.src, ['css']);
  gulp.watch(paths.img.src, ['img']);
  gulp.watch(paths.html.src, ['html']);
});

gulp.task('default', ['js', 'css', 'img', 'html']);
