var gulp     = require('gulp');

var del      = require('del');
var pngcrush = require('imagemin-pngcrush');
var path     = require('path');
var imagemin = require('gulp-imagemin');
var svg2png  = require('gulp-svg2png');
var newer    = require('gulp-newer');

var project  = path.join(__dirname + '/');
var ignore   = path.join('!' + __dirname + '/');

gulp.task('svgo', function () {
    return gulp.src([
        project + 'src/**/*.svg',
    ])
        .pipe(newer(project + 'dist/'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }, {
                removeUselessStrokeAndFill: false
            }],
        }))
        .pipe(gulp.dest(project + 'dist/'));
});

gulp.task('svg2png', function () {
    gulp.src(project + 'src/**/*.svg')
        .pipe(svg2png())
        .pipe(gulp.dest(project + 'dist/'));
});

gulp.task('default', ['svgo', 'svg2png']);
