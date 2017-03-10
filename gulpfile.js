const gulp       = require('gulp')

const del        = require('del')
const chalk      = require('chalk')
const fs         = require('fs')
const pngcrush   = require('imagemin-pngcrush')
const path       = require('path')
const imagemin   = require('gulp-imagemin')
const svgmin     = require('gulp-svgmin')
const svg2png    = require('gulp-svg2png')
const newer      = require('gulp-newer')
const exec       = require('child_process').exec
const rename     = require('gulp-rename')
const changeCase = require('change-case')
const run        = require('gulp-run')

const project   = path.join(__dirname + '/')
const ignore    = path.join('!' + __dirname + '/')
const dist      = project + 'dist/'
const src       = project + 'src/'
const srcLogos  = project + 'src/*.svg'
const distLogos = project + 'dist/*.svg'
const distPngs  = project + 'dist/*.svg.png'


gulp.task('svgo', () => {
    gulp.src(srcLogos)
        .pipe(newer(dist))
        .pipe(rename((path, file) => {
            path.basename = changeCase.snakeCase(path.basename)
            return path
        }))
        .pipe(svgmin({
            plugins: [{
                removeDoctype: true
            }, {
                removeComments: true
            }]
        }))
        .pipe(gulp.dest(dist))
})

gulp.task('svg2png', () => {
    let files         = fs.readdirSync(dist)
    let numberOfFiles = files.length
    let time          = 0

    let dones         = doneFiles(files)

    for (let i = 0; i < files.length; i++) {
        let file     = files[i]
        let done     = dones.indexOf(file) >= 0 || dones.indexOf(file.replace('.svg', '.png')) >= 0
        let filePath = path.join(src + file)
        time += 100

        if (!file.includes('.png') && !done && file !== '.DS_Store') {

            setTimeout(() => {
                console.log(chalk.blue(`Starting ||||| ${filePath} (${i + 1} of ${numberOfFiles})`));
                run(`cd ${dist} && qlmanage -t -s 500 -o ${dist} ${file}`).exec()
                console.log(chalk.green(`Done     ||||| ${filePath} (${i + 1} of ${numberOfFiles})`));
            }, time)
        } else {
            console.log(chalk.yellow(`Skip ||||| ${filePath} (${i + 1} of ${numberOfFiles})`));
        }
    }
})

gulp.task('minify-png', cb => {
    return gulp.src(distPngs)
        .pipe(imagemin({
            progressive : true,
            use         : [pngcrush()],
        }))
        .pipe(rename(opt => {
          opt.basename = opt.basename.replace('.svg', '')
          return opt
        }))
        .pipe(gulp.dest(dist))
})

gulp.task('clean', cb => {
    del(distPngs, {force:true}, cb)
})

// This task crashes, probably too much files.
// gulp.task('svg2png', function () {
//     gulp.src(distLogos)
//         .pipe(svg2png(1, true))
//         .pipe(gulp.dest(dist))
// })

// This task generate black and white png files
// gulp.task('svg2png', function () {
//     run('cd ' + dist + ' && mogrify -background none -format png *.svg').exec()
// })

// This task work. Only on mac os.
// gulp.task('svg2png', () => {
//     run('cd ' + dist + ' && for i in *svg; do echo "$i"; qlmanage -t -s 500 -o ' + dist + ' "$i"; done;').exec()
// })

gulp.task('default', ['svgo', 'svg2png', 'minify-png', 'clean'])


function doneFiles(files) {
    let dones = []

    for (let i = 0; i < files.length; i++) {
        let file     = files[i]
        let filePath = path.join(src + file)

        if (file.includes('.png')) {
            dones.push(file)
            dones.push(file.replace('.svg.png', '.svg'))
        }
    }

    return dones
}
