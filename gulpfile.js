/** ===========================================================================
 *
 * Gulpfile setup.
 *
 * @since 3.0.0
 * @version 3.0.0
 * @author Dan Fisher
 *
 * ========================================================================= */

'use strict';


/** ---------------------------------------------------------------------------
 * Load plugins
 * ------------------------------------------------------------------------- */

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var minifyJS     = require('gulp-uglify');
var concatJS     = require('gulp-concat');
var includeJS    = require('gulp-include');
var cssNano      = require('gulp-cssnano');
var gulpIf       = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var replace      = require('gulp-replace');
var sourcemaps   = require('gulp-sourcemaps');
var svgSprites   = require('gulp-svg-sprites');
var gutil        = require('gulp-util');
var jshint       = require('gulp-jshint');
var panini       = require('panini');
var imagemin     = require('gulp-imagemin');
var rename       = require('gulp-rename');
var browser      = require('browser-sync').create();
var sequence     = require('run-sequence');
var del          = require('del');
var ftp          = require('vinyl-ftp');
var yargs        = require('yargs');
var jimp         = require('gulp-jimp');

// Custom
var zip          = require('gulp-zip');
var htmlmin      = require('gulp-htmlmin');


/** ---------------------------------------------------------------------------
 * Load settings.
 * ------------------------------------------------------------------------- */

const CONFIG = require('./config.json');
const PATHS = CONFIG.PATH;
const FTP = CONFIG.FTP;


/** ---------------------------------------------------------------------------
 * Look for the --production flag.
 * ------------------------------------------------------------------------- */

const PRODUCTION = yargs.argv.production;


/** ---------------------------------------------------------------------------
 * Helper function to build an FTP connection based on the configuration.
 * ------------------------------------------------------------------------- */

function getFTPConnection() {
	return ftp.create({
		host: FTP.host,
		port: FTP.port,
		user: FTP.user,
		password: FTP.password,
		parallel: 5,
		log: gutil.log
	});
}


/** ---------------------------------------------------------------------------
 * Regular tasks.
 * ------------------------------------------------------------------------- */

// Deletes the dist folder so the build can start fresh.
gulp.task( 'reset', function() {
	return del(PATHS.dist);
});

// Copies the necessary files from src to dist.
gulp.task('copy', function() {
	return gulp
		.src(CONFIG.COPY)
		.pipe(gulp.dest(PATHS.dist));
});

// Compiles Handlebars templates with Panini.
gulp.task('pages', function() {
	return gulp
		.src(PATHS.src + '/pages/**/*.hbs')
		.pipe(panini(CONFIG.PANINI))
		// .pipe(gulpIf(PRODUCTION, replace('.css"', '.min.css"')))
		// .pipe(gulpIf(PRODUCTION, replace('core.js', 'core.min.js')))
		.pipe(rename({
			extname: '.html'
		}))
		.pipe(gulpIf(PRODUCTION, htmlmin({collapseWhitespace: true})))
		.pipe(gulp.dest(PATHS.dist));
});

// Creates a server with BrowserSync and watch for file changes.
gulp.task('server', function() {
	browser.init(CONFIG.SERVER);

	// Watch for file changes.
	gulp.watch(PATHS.src + '/{data,helpers,layouts,pages,partials}/**/*', ['watch-html']);
	gulp.watch(PATHS.src_css + '/**/*.scss', ['sass']);
	gulp.watch(PATHS.src_js + '/**/*.js', ['watch-js']);
	gulp.watch([
		PATHS.src_img + '/**/*.{png,jpg,gif,svg,ico}',
		'!' + PATHS.src_img + '/sprites/**'
	], ['watch-img']);
	gulp.watch(PATHS.src_img + '/sprites/**/*.svg', ['sprites']);
});

// Compiles Sass to CSS.
gulp.task('sass', function() {
	return gulp
		.src(PATHS.src_css + '/**/*.scss')
		.pipe(gulpIf(!PRODUCTION, sourcemaps.init()))
		.pipe(plumber({
			errorHandler: notify.onError({
				title: 'Gulp error in the <%= error.plugin %> plugin',
				message: '<%= error.message %>'
			})
		}))
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer(CONFIG.AUTOPREFIXER))
		.pipe(replace('/**/', ''))
		.pipe(plumber.stop())
		.pipe(gulpIf(!PRODUCTION, sourcemaps.write('/maps')))
		.pipe(gulpIf(PRODUCTION, cssNano()))
		.pipe(gulp.dest(PATHS.dist_css))
		.pipe(browser.stream());
});

// Concatenate and minify JS.
gulp.task('js', ['lint-js'], function() {
	return gulp
		.src([
			PATHS.src_js + '/core.js'
		])
		.pipe(gulpIf(!PRODUCTION, sourcemaps.init()))
		.pipe(includeJS())
		.pipe(concatJS('core.js'))
		.pipe(gulpIf(!PRODUCTION, sourcemaps.write('/maps')))
		.pipe(gulpIf(PRODUCTION, minifyJS()))
		.pipe(gulp.dest(PATHS.dist_js))
});

// Check JS code for errors.
gulp.task('lint-js', function() {
	return gulp
		.src([
			PATHS.src_js + '/**/*.js',
			'!' + PATHS.src_js + '/{cdn-fallback,vendor}/**/*'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail')); // task fails on JSHint error
});

// Creates sprites from SVG files.
gulp.task('sprites', function() {
	return gulp
		.src(PATHS.src_img + '/sprites/**/*.svg')
		.pipe(svgSprites({
			cssFile: 'assets/scss/components/_sprites.scss',
			common: 'icon-svg',
			padding: 0,
			baseSize: 10,
			templates: {
				scss: true
			},
			preview: false,
			svg: {
				sprite: 'assets/images/sprite.svg'
			},
			svgPath: "../images/sprite.svg",
			pngPath: "../images/sprite.svg"
		}))
		.pipe(gulp.dest(PATHS.src));
});

// Compresses images.
gulp.task('img', function() {
	return gulp
		.src([
			PATHS.src_img + '/**/*.{png,jpg,gif,svg,ico}',
			'!' + PATHS.src_img + '/*.{svg}',
			'!' + PATHS.src_img + '/sprites/**'
		])
		.pipe(gulpIf(PRODUCTION, imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true})
		], {
			verbose: true
		})))
		.pipe(gulp.dest(PATHS.dist_img));
});

// Deploy to FTP.
gulp.task('ftp-deploy', function() {
	var conn = getFTPConnection();

	return gulp
		.src(FTP.localFiles, {
			base: PATHS.dist,
			buffer: false
		})
		.pipe(conn.newer(FTP.remoteFolder))
		.pipe(conn.dest(FTP.remoteFolder));
});


/** ---------------------------------------------------------------------------
 * Watch tasks
 * ------------------------------------------------------------------------- */

// HTML
gulp.task('watch-html', ['panini-refresh', 'pages'], function(done) {
	browser.reload();
	done();
});

// JS
gulp.task('watch-js', ['js'], function(done) {
	browser.reload();
	done();
});

// Images
gulp.task('watch-img', ['img'], function(done){
	browser.reload();
	done();
});

// Watch all files and upload to FTP when a change is detected
gulp.task('deploy-watch', function() {
	var conn = getFTPConnection();

	gulp.watch(FTP.localFiles).on('change', function(event) {
		console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);

		return gulp
			.src([event.path], {
				base: PATHS.dist,
				buffer: false
			})
			.pipe(conn.newer(FTP.remoteFolder))
			.pipe(conn.dest(FTP.remoteFolder));
	});
});


/** ---------------------------------------------------------------------------
 * Other tasks.
 * ------------------------------------------------------------------------- */

// Refresh Panini.
gulp.task('panini-refresh', function() {
	panini.refresh();
});

// Adds effect on images.
gulp.task('jimp', function() {
	gulp.src([
		PATHS.src_img + '/**/*.{png,gif,jpg}',
		'!' + PATHS.src_img + '/*.{png,gif,jpg}',
		'!' + PATHS.src_img + '/basketball/favicons/*.{png,gif}',
		'!' + PATHS.src_img + '/soccer/*.{png,gif,jpg}',
		'!' + PATHS.src_img + '/soccer/favicons/*.{png,gif}',
		'!' + PATHS.src_img + '/football/*.{png,gif,jpg}',
		'!' + PATHS.src_img + '/football/favicons/*.{png,gif}',
		'!' + PATHS.src_img + '/sprites/**'
	]).pipe(jimp({
		'': {
			posterize: 2,
			greyscale: true
		}
	})).pipe(gulp.dest(PATHS.dist_img));
});

// Compiles Bootstrap.
gulp.task('bootstrap', function() {
	return gulp
		.src(PATHS.src + '/assets/vendor/bootstrap/scss/*.scss')
		.pipe(gulpIf(!PRODUCTION, sourcemaps.init()))
		.pipe(plumber({
			errorHandler: notify.onError({
				title: 'Gulp error in the <%= error.plugin %> plugin',
				message: '<%= error.message %>'
			})
		}))
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer(CONFIG.AUTOPREFIXER))
		.pipe(replace('/**/', ''))
		.pipe(plumber.stop())
		.pipe(gulpIf(!PRODUCTION, sourcemaps.write('/maps')))
		.pipe(gulpIf(PRODUCTION, cssNano()))
		.pipe(gulp.dest(PATHS.dist + '/assets/vendor/bootstrap/css'))
		.pipe(browser.stream());
});



/** ---------------------------------------------------------------------------
 * Main tasks.
 * ------------------------------------------------------------------------- */

gulp.task('build', function(cb) {
	sequence('reset', ['copy', 'pages', 'sprites'], ['sass', 'bootstrap', 'js', 'img'], cb);
});

gulp.task('default', function(cb) {
	sequence('build', 'server', cb);
});

gulp.task('deploy', function(cb) {
	sequence('build', 'ftp-deploy', cb);
});



/** ---------------------------------------------------------------------------
 * ThemeForest Pack.
 * ------------------------------------------------------------------------- */

// ZIP files.
gulp.task('zip', function () {
	gulp.src([
			PATHS.src + '/**',
			PATHS.dist + '/**',
			'.editorconfig',
			'config.json',
			'gulpfile.js',
			'package-lock.json',
			'package.json'
		], {
			base: '.'
		})
		.pipe(zip('alchemists-html-template.zip'))
		.pipe(gulp.dest('./'));
});

// Creates Basketball version for sale.
gulp.task('html-basketball', function () {
	gulp.src([
			PATHS.src + '/**/*',
			'!' + PATHS.src + '/**/_soccer_*.*',
			'!' + PATHS.src + '/**/_football_*.*',
			'!' + PATHS.src + '/**/soccer/',
			'!' + PATHS.src + '/**/soccer/**/*',
			'!' + PATHS.src + '/**/football/',
			'!' + PATHS.src + '/**/football/**/*',
			'!' + PATHS.src + '/layouts/football.hbs',
			'!' + PATHS.src + '/layouts/soccer.hbs',
			'!' + PATHS.src_css + '/style-football.scss',
			'!' + PATHS.src_css + '/style-soccer.scss',
			'!' + PATHS.src_css + '/style-soccer-dark.scss',
			'!' + PATHS.src + '/data/soccer.json',
			'!' + PATHS.src + '/data/football.json',
			PATHS.dist + '/**/*',
			'!' + PATHS.dist + '/_soccer_*.*',
			'!' + PATHS.dist + '/_football_*.*',
			'!' + PATHS.dist + '/**/soccer/',
			'!' + PATHS.dist + '/**/soccer/**/*',
			'!' + PATHS.dist + '/**/football/',
			'!' + PATHS.dist + '/**/football/**/*',
			'!' + PATHS.dist_css + '/style-football.css',
			'!' + PATHS.dist_css + '/style-soccer.css',
			'!' + PATHS.dist_css + '/style-soccer-dark.css',
			'.editorconfig',
			'config.json',
			'gulpfile.js',
			'package-lock.json',
			'package.json'
		], {
			base: '.'
		})
		.pipe(gulp.dest('./HTML/basketball'));
});

// Creates Soccer version for sale.
gulp.task('html-soccer', function () {
	gulp.src([
			PATHS.src + '/**/*',
			'!' + PATHS.src + '/**/_football_*.*',
			'!' + PATHS.src + '/**/_basketball_*.*',
			'!' + PATHS.src + '/**/blog-*.*',
			'!' + PATHS.src + '/**/features-*.*',
			'!' + PATHS.src + '/**/index*.*',
			'!' + PATHS.src + '/**/page-*.*',
			'!' + PATHS.src + '/**/player-*.*',
			'!' + PATHS.src + '/**/shop-*.*',
			'!' + PATHS.src + '/**/staff-*.*',
			'!' + PATHS.src + '/**/team-*.*',
			'!' + PATHS.src + '/**/football/',
			'!' + PATHS.src + '/**/football/**/*',
			'!' + PATHS.src + '/layouts/football.hbs',
			'!' + PATHS.src_css + '/style-football.scss',
			'!' + PATHS.src_css + '/style-basketball.scss',
			'!' + PATHS.src_css + '/style-basketball-dark.scss',
			'!' + PATHS.src + '/data/basketball.json',
			'!' + PATHS.src + '/data/football.json',
			PATHS.dist + '/_soccer_*.*',
			PATHS.dist + '/**/*/**/*',
			'!' + PATHS.dist + '/**/football/',
			'!' + PATHS.dist + '/**/football/**/*',
			'!' + PATHS.dist_css + '/style-football.css',
			'!' + PATHS.dist_css + '/style-basketball.css',
			'!' + PATHS.dist_css + '/style-basketball-dark.css',
			'.editorconfig',
			'config.json',
			'gulpfile.js',
			'package-lock.json',
			'package.json'
		], {
			base: '.'
		})
		.pipe(gulp.dest('./HTML/soccer'));
});

// Creates American Football version for sale.
gulp.task('html-football', function () {
	gulp.src([
			PATHS.src + '/**/*',
			'!' + PATHS.src + '/**/_soccer_*.*',
			'!' + PATHS.src + '/**/_basketball_*.*',
			'!' + PATHS.src + '/**/blog-*.*',
			'!' + PATHS.src + '/**/features-*.*',
			'!' + PATHS.src + '/**/index*.*',
			'!' + PATHS.src + '/**/page-*.*',
			'!' + PATHS.src + '/**/player-*.*',
			'!' + PATHS.src + '/**/shop-*.*',
			'!' + PATHS.src + '/**/staff-*.*',
			'!' + PATHS.src + '/**/team-*.*',
			'!' + PATHS.src + '/**/soccer/',
			'!' + PATHS.src + '/**/soccer/**/*',
			'!' + PATHS.src + '/layouts/soccer.hbs',
			'!' + PATHS.src_css + '/style-soccer.scss',
			'!' + PATHS.src_css + '/style-soccer-dark.scss',
			'!' + PATHS.src_css + '/style-basketball.scss',
			'!' + PATHS.src_css + '/style-basketball-dark.scss',
			'!' + PATHS.src + '/data/basketball.json',
			'!' + PATHS.src + '/data/soccer.json',
			PATHS.dist + '/_football_*.*',
			PATHS.dist + '/**/*/**/*',
			'!' + PATHS.dist + '/**/soccer/',
			'!' + PATHS.dist + '/**/soccer/**/*',
			'!' + PATHS.dist_css + '/style-soccer.css',
			'!' + PATHS.dist_css + '/style-soccer-dark.css',
			'!' + PATHS.dist_css + '/style-basketball.css',
			'!' + PATHS.dist_css + '/style-basketball-dark.css',
			'.editorconfig',
			'config.json',
			'gulpfile.js',
			'package-lock.json',
			'package.json'
		], {
			base: '.'
		})
		.pipe(gulp.dest('./HTML/football'));
});

// Packs all version
gulp.task('html-all', function(cb) {
	sequence('html-basketball', 'html-soccer', 'html-football', cb);
});

// ZIP all files
gulp.task('pack', function(cb) {
	sequence('build', 'jimp', 'zip', cb);
});

// Packs Basketball version (helper)
gulp.task('pack-basketball', function(cb) {
	sequence('build', 'jimp', 'html-basketball', cb);
});

// Packs Soccer version (helper)
gulp.task('pack-soccer', function(cb) {
	sequence('build', 'jimp', 'html-soccer', cb);
});

// Packs Football version (helper)
gulp.task('pack-football', function(cb) {
	sequence('build', 'jimp', 'html-football', cb);
});

// Builds, generates images and packs all version
gulp.task('pack-all', function(cb) {
	sequence('build', 'jimp', 'html-all', cb);
});



/** ---------------------------------------------------------------------------
 * Live Demo.
 * ------------------------------------------------------------------------- */

// Creates Basketball version for the live demo.
gulp.task('demo-basketball', function () {
	gulp.src([
			PATHS.dist + '/**/*',
			'!' + PATHS.dist + '/_soccer_*.*',
			'!' + PATHS.dist + '/_football_*.*',
			'!' + PATHS.dist + '/**/soccer/',
			'!' + PATHS.dist + '/**/soccer/**/*',
			'!' + PATHS.dist + '/**/football/',
			'!' + PATHS.dist + '/**/football/**/*',
			'!' + PATHS.dist_css + '/style-football.css',
			'!' + PATHS.dist_css + '/style-soccer.css',
			'!' + PATHS.dist_css + '/style-soccer-dark.css'
		], {
			base: PATHS.dist
		})
		.pipe(gulp.dest('./DEMO/basketball'));
});

// Creates Soccer version for the live demo.
gulp.task('demo-soccer', function () {
	gulp.src([
			PATHS.dist + '/_soccer_*.*',
			PATHS.dist + '/**/*/**/*',
			'!' + PATHS.dist + '/**/football/',
			'!' + PATHS.dist + '/**/football/**/*',
			'!' + PATHS.dist_css + '/style-football.css',
			'!' + PATHS.dist_css + '/style-basketball.css',
			'!' + PATHS.dist_css + '/style-basketball-dark.css'
		], {
			base: PATHS.dist
		})
		.pipe(gulp.dest('./DEMO/soccer'));
});

// Creates American Football version for the live demo.
gulp.task('demo-football', function () {
	gulp.src([
			PATHS.dist + '/_football_*.*',
			PATHS.dist + '/**/*/**/*',
			'!' + PATHS.dist + '/**/soccer/',
			'!' + PATHS.dist + '/**/soccer/**/*',
			'!' + PATHS.dist_css + '/style-soccer.css',
			'!' + PATHS.dist_css + '/style-soccer-dark.css',
			'!' + PATHS.dist_css + '/style-basketball.css',
			'!' + PATHS.dist_css + '/style-basketball-dark.css'
		], {
			base: PATHS.dist
		})
		.pipe(gulp.dest('./DEMO/football'));
});

// Builds Basketball version for the live demo (helper)
gulp.task('build-demo-basketball', function(cb) {
	sequence('build', 'demo-basketball', cb);
});

// Builds Soccer version for the live demo (helper)
gulp.task('build-demo-soccer', function(cb) {
	sequence('build', 'demo-soccer', cb);
});

// Builds American Football version for the live demo (helper)
gulp.task('build-demo-football', function(cb) {
	sequence('build', 'demo-football', cb);
});

// Creates all versions for the live demo
gulp.task('build-demo-all', function(cb) {
	sequence('build', 'demo-basketball', 'demo-soccer', 'demo-football', cb);
});
