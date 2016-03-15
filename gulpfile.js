var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var coffee = require('gulp-coffee');
var coffeeStream = coffee({bare: true});
coffeeStream.on('error', gutil.log);

var dev_dir = './src';
var out_dir = './www';

var paths = {
  sass: [ dev_dir+'/app/**/*.scss'],
  js: [
      dev_dir+'/app/app.module.coffee',
      dev_dir+'/app/**/*.coffee'
    ]
};

gulp.task('default', [
    'watch','sass','coffee'
]);

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
    .pipe(sass())
    .on('error', sass.logError)
    // .pipe(gulp.dest('./www/css/'))
    // .pipe(minifyCss({
    //   keepSpecialComments: 0
    // }))
    // .pipe(rename({ extname: '.min.css' }))
    .pipe(concat('index.css'))
    .pipe(gulp.dest(out_dir))
    .on('end', done);
});

gulp.task('coffee', function () {
    console.log(paths.js)        
    gulp.src(paths.js)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('index.js'))
    .pipe(gulp.dest(out_dir));
});



gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['coffee']);
});



