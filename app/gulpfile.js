var gulp = require('gulp');
var clean = require('gulp-clean');
 
gulp.task('clean', function () {
    return gulp.src('node_modules', {allowEmpty: true, read: false})
        .pipe(clean());
});