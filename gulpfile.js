'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var sftp = require('gulp-sftp');
var jasmine = require('gulp-jasmine');


gulp.task('jshint', function () {
    return gulp.src('app/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['jshint'], function () {
    return gulp.src('app/*.js').pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
    var options = {
        verbose: true,
        includeStackTrace: true,
        timeout: 10000,
        forceExit: true
    };
    return gulp.src('spec/*.js').pipe(jasmine(options));
});



gulp.task('deploy', function () {
    return gulp.src('dist/*')
        .pipe(sftp({
            host: 'adama',
            user: 'gustavo',
            remotePath: '/tmp/1clipboard-server'
        }));
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});