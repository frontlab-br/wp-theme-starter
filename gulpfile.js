// ============= VARS ============= //

var gulp         = require('gulp');
    cp           = require('child_process'),
    del          = require('del'),
    concat       = require('gulp-concat'),
    shell        = require('gulp-shell'),
    util         = require('gulp-util'),
    browser_sync = require('browser-sync'),
    plumber      = require('gulp-plumber'),
    notify       = require('gulp-notify'),
    fontmin      = require('gulp-fontmin'),
    sass         = require('gulp-sass'),
    neat         = require('node-neat').includePaths,
    normalize    = require('node-normalize-scss').includePaths,
    sequence     = require('gulp-sequence').use(gulp),
    svgmin       = require('gulp-svgmin'),
    svgstore     = require('gulp-svgstore'),
    inject       = require('gulp-inject'),
    cheerio      = require('gulp-cheerio'),
    svgSprite    = require('gulp-svg-sprite'),
    spritesmith  = require('gulp.spritesmith'),
    svg2png      = require('gulp-svg2png'),
    imagemin     = require('gulp-imagemin'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    path         = require('path'),
    assets       = { src: '_assets/', dest: 'assets/' };
    includes     = { dest: 'templates/' };
var svg          = { sprite_svg: require('gulp-svg-sprite'), svg2png: require('gulp-svg2png') }
var paths        = {
    img: {
        src:  assets.src + 'img/',
        dest: assets.dest + 'img/'
    },
    js: {
        src:  assets.src + 'js/',
        dest: assets.dest + 'js/'
    },
    font: {
        src:  assets.src + 'font/',
        dest: assets.dest + 'font/'
    },
    scss: {
        src:  assets.src + 'scss/'
    },
    css: {
        dest: assets.dest + 'css/'
    },
    svg: {
        src:    assets.src + 'img/svg/',
        dest:   assets.dest + 'img/svg/',
        sprite: assets.src + 'img/svg/sprite/*.svg',
        file:   assets.src + 'img/svg/sprite-svg.svg',
        css:    assets.src + 'scss/helpers/_sprite_svg.scss'
    },
    templates: {
        svg:  assets.src + 'scss/template/'
    }
};


// ============= SERVER BUILDINGS ============= //

gulp.task('default', ['browser-sync']);
gulp.task('build', ['clean', 'img', 'font', 'styles', 'lint', 'scripts']);
gulp.task('img', sequence('svg_min_all', 'sprite_svg', 'svg_inject', 'svg_min_build', 'svg_png', 'sprite_img', 'images'));
gulp.task('scripts', ['scripts:vendor', 'scripts:plugins']);

// ============= //

gulp.task('browser-sync', function () {
    browser_sync({
        proxy: "pitz.local",
        notify: false
    });
    gulp.watch(paths.scss.src + '**/*.scss', ['styles']).on('change', browser_sync.reload);;
    gulp.watch(paths.js.src + '**/*.js', ['scripts']).on('change', browser_sync.reload);
    gulp.watch('**/*.php').on('change', browser_sync.reload);
});

// ============= IMAGES BUILDING ============= //

// Clean Pre Build
gulp.task('clean', function (cb) {
    del([assets.dest +'**/*'], function (err, deletedFiles) {});
    cb();
});

// Minify SVG's
gulp.task('svg_min_all', function () {
    return gulp.src(paths.svg.src + '**/*.svg')
        .pipe(plumber({errorHandler: onError}))
        .pipe(svgmin())
        .pipe(gulp.dest(paths.svg.src));
});

// Minify SVG's
gulp.task('svg_min_build', function () {
    return gulp.src(paths.svg.src + '**/*.svg')
        .pipe(plumber({errorHandler: onError}))
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(gulp.dest(paths.svg.dest));
});


gulp.task('svg_inject', function () {
    var svgs = gulp
        .src(paths.svg.src + 'inject/*.svg')
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(cheerio({
            run: function ($) {
                $('svg').attr('style',  'display:none')
                $('svg').attr('version',  '1.1')
                $('svg').attr('xmlns',  'http://www.w3.org/2000/svg')
                $('svg').attr('xmlns:xlink',  'http://www.w3.org/1999/xlink')
                $('svg').attr('preserveAspectRatio',  'xMidYMid meet')
            },
            parserOptions: { xmlMode: false }
        }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src(includes.dest + 'content-svg.php')
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest(includes.dest));
});

// Make Sprite SVG and Sass Sprite
gulp.task('sprite_svg', function () {
    return gulp.src(paths.svg.sprite)
        .pipe(svg.sprite_svg({
            shape: {
                spacing: { padding: 6 }
            },
            mode: {
                css: {
                    dest: '../',
                    layout: 'vertical',
                    sprite: paths.svg.file,
                    bust: false,
                    render: {
                        scss: {
                            dest: paths.svg.css,
                            template: paths.templates.svg + '_svg-tpl.scss'
                        }
                    }
                }
            },
            variables: { mapname: 'icon' }
        }))
        .pipe(gulp.dest(assets.src));
});

// SVG to PNG
gulp.task('svg_png', function() {
    return gulp.src(paths.svg.file)
        .pipe(plumber({errorHandler: onError}))
        .pipe(svg.svg2png())
        .pipe(gulp.dest(paths.img.src));
});

// Sprite Images
gulp.task('sprite_img', function () {
    var data = gulp.src(paths.img.src + 'sprite/*.png')
        .pipe(spritesmith({
            imgName: 'sprite-img.png',
            imgPath: '../img/sprite-img.png',
            cssName: '_sprite_img.scss'
            // cssTemplate: paths.templates.svg + '_img-tpl.handlebars'
        }));
    data.img.pipe(gulp.dest(paths.img.src));
    data.css.pipe(gulp.dest(paths.scss.src + 'helpers/'));
});

// Minify Images
gulp.task('images', function () {
    return gulp.src(paths.img.src + '**/**/*')
        .pipe(plumber({errorHandler: onError}))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(paths.img.src))
        .pipe(gulp.dest(paths.img.dest));
});


// ============= CODE BUILDING ============= //

// Compile SASS
gulp.task('styles', function () {
    return gulp.src(paths.scss.src + '*.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass({
            includePaths: [].concat(normalize, neat),
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest(paths.css.dest));
});

// Fontface Generate
gulp.task('font', function () {
    return gulp.src(paths.font.src + '*.ttf')
        .pipe(fontmin())
        .pipe(gulp.dest(paths.font.dest));
});

// Lint scripts
gulp.task('lint', function () {
    return gulp.src(['gulpfile.js', paths.js.src + '**/*.js' ])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint());
});

// Compress Javascript
gulp.task('scripts:vendor', function() {
    return gulp.src([paths.js.src + '*.js', paths.js.src + 'vendor/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest));
});

gulp.task('scripts:plugins', function() {
    return gulp.src([paths.js.src + 'plugins/*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(concat('plugins.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest));
});


// Alerts Error
var onError = function(err) {
    notify.onError({
        title:    'Gulp',
        subtitle: 'Cagada detected!',
        message:  'Error: <%= error.message %>',
        sound:    'Beep'
    })(err);
    this.emit('end');
};
