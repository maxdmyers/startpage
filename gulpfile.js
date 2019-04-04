var gulp        = require('gulp');
var notify      = require('gulp-notify');
var uglify      = require('gulp-uglify');
var cleanCss    = require('gulp-clean-css');
var scss        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var rm          = require('gulp-rm');
var rename      = require('gulp-rename');
var concat      = require('gulp-concat');
var browserSync = require('browser-sync').create('Server');

/* ---------------\
Wordpress Site URL
-----------------*/
var devUrl      = "http://startpage.test";

var paths       = {
    styles: {
        src:    'assets/src/scss/*.scss',
        dest:   'assets/build/css/'
    },
    scripts: {
        src:    'assets/src/js/*.js',
        dest:   'assets/build/js/'
    },
    fonts: {
        src:    'assets/src/fonts/*',
        dest:   'assets/build/fonts/'
    }
};


/* ---------------\
   Assets Tasks
-----------------*/
gulp.task('clean:build', function() {
    return gulp.src( 'assets/build/**/*' )
        .pipe( rm() );
});

gulp.task('styles', gulp.series( function() {
    return gulp.src( paths.styles.src )
        .pipe( scss().on( 'error', scss.logError ) )
        .pipe( sourcemaps.init() )
        .pipe( cleanCss() )
        .pipe( sourcemaps.write() )
        .pipe( concat( 'all.min.css' ) )
        .pipe( gulp.dest( paths.styles.dest ) )
        .pipe( notify( 'SCSS build completed' ) )
        .pipe( browserSync.stream() );
}));

gulp.task('fonts', gulp.series( function() {
    return gulp.src( paths.fonts.src )
        .pipe( gulp.dest( paths.fonts.dest ) )
        .pipe( browserSync.stream() );
}));

gulp.task('scripts', gulp.series( function() {
    return gulp.src([
            // './node_modules/bootstrap/dist/js/bootstrap.js',
            paths.scripts.src
        ])
        .pipe( sourcemaps.init() )
        .pipe( concat('all.min.js') )
        .pipe( sourcemaps.write() )
        .pipe( uglify() )
        .pipe( gulp.dest( paths.scripts.dest ) )
        .pipe( notify( 'Javascript build completed' ) )
        .pipe( browserSync.stream() );
}));

gulp.task('jquery', gulp.series(function() {
    return gulp.src( './node_modules/jquery/dist/jquery.js' )
        .pipe( sourcemaps.init() )
        .pipe( concat('jquery.min.js') )
        .pipe( sourcemaps.write() )
        .pipe( uglify() )
        .pipe( gulp.dest( paths.scripts.dest ) )
        .pipe( notify( 'jquery build completed' ) )
        .pipe( browserSync.stream() );
}));


/* ---------------\
    Watch Task
-----------------*/
gulp.task('watch', gulp.series( function() {
    var files = [
        paths.styles.src,
        paths.scripts.src,
        './style.css',
        './**/*.php',
        './**/*.twig'
    ];
    browserSync.init(files, {
        proxy: {
            target: devUrl
        }
    });
    notify( 'Watch started...' );
    gulp.watch( paths.scripts.src, gulp.series('scripts') );
    gulp.watch( paths.styles.src, gulp.series('styles') );
    gulp.watch( paths.fonts.src, gulp.series('fonts') );
    gulp.watch( '*.twig' ).on( 'change', browserSync.reload );
}));

gulp.task( 'default', gulp.series( 'scripts', 'styles', 'fonts', 'watch' ) );
