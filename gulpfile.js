const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

const paths = {
	styles: {
		src: 'src/styles/**/*.scss',
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/scripts/**/*.js',
		dest: 'dist/scripts/'
	},
	images: {
		src: 'src/img/*',
		dest: 'dist/img/'
	}
}

function clean() {
	return del(['dist'])
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
		.pipe(gulp.dest(paths.styles.dest))
}

function img() {
	return gulp.src(paths.images.src)
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
		.pipe(gulp.dest(paths.images.dest))
}

function watcher() {
	gulp.watch(paths.styles.src, styles)

}

const build = gulp.series(clean, gulp.parallel(styles, img), watcher)

exports.clean = clean
exports.styles = styles
exports.img = img
exports.watcher = watcher
exports.build = build
exports.default = build
