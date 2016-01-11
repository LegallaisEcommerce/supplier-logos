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
var run        = require('gulp-run');

var project   = path.join(__dirname + '/');
var ignore    = path.join('!' + __dirname + '/');
var dist      = project + 'dist/';
var src       = project + 'src/';
var srcLogos  = project + 'src/*.svg';
var distLogos = project + 'dist/*.svg';
var distPngs  = project + 'dist/*.svg.png';

gulp.task('svgo', function () {
    return gulp.src(srcLogos)
        .pipe(newer(dist))
        .pipe(rename(function(path, file) {
            path.basename = changeCase.snakeCase(path.basename);
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

gulp.task('minify-png', function (cb) {
    return gulp.src(distPngs)
        .pipe(imagemin({
            progressive: true,
            use: [pngcrush()]
        }))
        .pipe(rename(function(opt) {
          opt.basename = opt.basename.replace('.svg', '');
          return opt;
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('clean', function(cb) {
    del(distPngs, {force:true}, cb);
});

// This task crashes, probably too much files.
// gulp.task('svg2png', function () {
//     gulp.src(distLogos)
//         .pipe(svg2png(1, true))
//         .pipe(gulp.dest(dist));
// });

// This task generate black and white png files
// gulp.task('svg2png', function () {
//     run('cd ' + dist + ' && mogrify -background none -format png *.svg').exec();
// });

// This task work. Only on mac os.
gulp.task('svg2png', function () {
    run('cd ' + dist + ' && for i in *svg; do echo "$i"; qlmanage -t -s 500 -o ' + dist + ' "$i"; done;').exec();
});

gulp.task('default', ['svgo', 'svg2png', 'minify-png', 'clean']);
