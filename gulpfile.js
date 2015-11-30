var gulp       = require('gulp');

var del        = require('del');
var pngcrush   = require('imagemin-pngcrush');
var path       = require('path');
var imagemin   = require('gulp-imagemin');
var svg2png    = require('gulp-svg2png');
var newer      = require('gulp-newer');
var exec       = require('child_process').exec;
var rename     = require('gulp-rename');
var changeCase = require('change-case');

var project    = path.join(__dirname + '/');
var ignore     = path.join('!' + __dirname + '/');
var dist       = project + 'dist/';
var srcLogos   = project + 'src/**/*.svg';
var distPngs   = project + 'dist/**/*.png';

gulp.task('svgo', function () {
    return gulp.src(srcLogos)
        .pipe(newer(dist))
        .pipe(rename(function(path, file) {
            path.basename = changeCase.paramCase(path.basename);
            return path;
        }))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }, {
                removeUselessStrokeAndFill: false
            }],
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('minify-png', function () {
    return gulp.src(distPngs)
        .pipe(imagemin({
            progressive: true,
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('svg2png', function () {
    gulp.src(srcLogos)
        .pipe(svg2png())
        .pipe(gulp.dest(dist));
});

gulp.task('default', ['svgo', 'svg2png']);
