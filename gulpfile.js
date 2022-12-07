const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();



const paths = {
	html: {
		src: 'src/*.html',
		dest: 'dist'
	},
	styles: {
		src: 'src/styles/**/*.scss',
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/scripts/**/*.js',
		dest: 'dist/scripts/'
	},
	images: {
		src: 'src/img/**',
		dest: 'dist/img/'
	}
}




function clean() {
	return del(['dist/*', '!dist/img'])
}

function html() {
	return gulp.src(paths.html.src)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest(paths.html.dest))
		.pipe(browserSync.stream())
}

function styles() {
	return gulp.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(rename({
			basename: 'style',
			suffix: '.min'
		}))
		.pipe(sourcemaps.write())
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream())
}

function img() {
	return gulp.src(paths.images.src)
		.pipe(newer(paths.images.dest))
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest(paths.images.dest))
}

function watcher() {
	browserSync.init({
		server: {
			baseDir: "./dist/"
		}
	})
	gulp.watch(paths.html.dest).on('change', browserSync.reload)
	gulp.watch(paths.html.src, html)
	gulp.watch(paths.styles.src, styles)
	gulp.watch(paths.images.src, img)
}



const build = gulp.series(clean, html, gulp.parallel(styles, img), watcher)

exports.clean = clean
exports.styles = styles
exports.img = img
exports.html = html
exports.watcher = watcher
exports.build = build
exports.default = build
