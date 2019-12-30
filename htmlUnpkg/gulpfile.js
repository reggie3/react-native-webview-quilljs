const gulp = require("gulp");
const clean = require("gulp-clean");
var inlinesource = require("gulp-inline-source");

const DIST_DIRECTORY = "dist";
gulp.task("clean", function() {
  return gulp
    .src([`./${DIST_DIRECTORY}`], {
      allowEmpty: true,
      read: false
    })
    .pipe(clean());
});

gulp.task("inlineSource", function() {
  return gulp
    .src("./index.html")
    .pipe(inlinesource())
    .pipe(gulp.dest(`./${DIST_DIRECTORY}`));
});

exports.build = gulp.series("clean", "inlineSource");
