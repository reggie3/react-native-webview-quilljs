var gulp = require("gulp");
var clean = require("gulp-clean");
var fs = require("fs");
const htmlToJs = require("gulp-html-to-js");

gulp.task("clean", function() {
  return gulp.src("dist", { allowEmpty: true, read: false }).pipe(clean());
});

gulp.task("tostring", function() {
  return gulp
    .src("./assets/index.html")
    .pipe(htmlToJs())
    .pipe(gulp.dest("./assets/index.js"));
});
