const gulp = require("gulp");
const replace = require("gulp-replace");
const concat = require("gulp-concat");
const debug = require("gulp-debug");
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const fs = require("fs");
const babel = require("gulp-babel");
var env = require("gulp-env");
var jsEscape = require("gulp-js-escape");
var cleanhtml = require("gulp-cleanhtml");

const STRING_WORKING_DIRECTORY = "stringification";
const COMBINE_SOURCE_FILE = "combinedHTMLCSSJS.txt";
const STRING_TEMPLATE_FILE_PATH = "./templates/htmlString.template.js";
const HTML_INDEX_TEMPLATE_FILE_PATH = "./templates/htmlIndex.template.html";
const DISTRIBUTION_DIRECTORY = "dist";
const BABEL_DISTRIBUTION_DIRECTORY = "babelDist";
const BUILD_DIRECTORY = "build";
const PARCEL_DIRECTORY = "parcelOutput";
const DIST_OUTPUT_FILENAME = "html.js";
const DESTINATION_PROJECT_DIRECTORY = "../app";
const BROWSER_TEST_DIRECTORY = "./browser";
const BROWSER_TEST_FILE = "index.html";

gulp.task("clean", function() {
  return gulp
    .src(
      [
        `./${STRING_WORKING_DIRECTORY}`,
        `./${DISTRIBUTION_DIRECTORY}`,
        `./${BABEL_DISTRIBUTION_DIRECTORY}`,
        `./${BUILD_DIRECTORY}`,
        `./${PARCEL_DIRECTORY}`,
        `./${BROWSER_TEST_DIRECTORY}`
      ],
      {
        allowEmpty: true,
        read: false
      }
    )
    .pipe(clean());
});

gulp.task("replaceBackTicksInJS", function() {
  return gulp
    .src("./build/static/js/*.js")
    .pipe(debug({ title: "replaceBackTicksInJS:" }))
    .pipe(replace("`", ""))
    .pipe(replace(/\/\/#\s(.*).map/gi, ""))
    .pipe(gulp.dest(`./${STRING_WORKING_DIRECTORY}/`));
});

gulp.task("replaceBackTicksInCSS", function() {
  return gulp
    .src("./build/static/css/*.css")
    .pipe(debug({ title: "replaceBackTicksInCSS:" }))
    .pipe(replace("`", ""))
    .pipe(replace(/\/\/#\s(.*).map/gi, ""))
    .pipe(replace(/\/*((.|\n)*)\*\//gi, "")) // comments including multiline
    .pipe(gulp.dest(`./${STRING_WORKING_DIRECTORY}/`));
});

gulp.task("removeLinksFromHTML", () => {
  return gulp
    .src("./build/index.html")
    .pipe(debug({ title: "removeLinksFromHTML" }))
    .pipe(replace(/<\s*link(.*?)>/gi, ""))
    .pipe(replace(/<\s*script(.*?)script>/gi, ""))
    .pipe(replace(/\/*((.|\n)*)\*\//gi, "")) // comments including multiline
    .pipe(rename("html.txt"))
    .pipe(gulp.dest(`./${STRING_WORKING_DIRECTORY}`));
});

gulp.task("concatFiles", () => {
  return gulp
    .src([
      `./${STRING_WORKING_DIRECTORY}/html.txt`,
      `./${STRING_WORKING_DIRECTORY}/*.css`,
      `./${STRING_WORKING_DIRECTORY}/*.js`
    ])
    .pipe(debug({ title: "concatJS:" }))
    .pipe(concat(`${COMBINE_SOURCE_FILE}`))
    .pipe(rename(`${BROWSER_TEST_FILE}`))
    .pipe(gulp.dest(`./${BROWSER_TEST_DIRECTORY}/`))
    .pipe(gulp.dest(`./${STRING_WORKING_DIRECTORY}`));
});

gulp.task("setNodeEnvDev", function() {
  return (process.env.NODE_ENV = "development");
});

gulp.task("createIndexFileFromBabel", () => {
  const combinedHTMLCSSJS = fs.readFileSync(
    `./${BABEL_DISTRIBUTION_DIRECTORY}/${COMBINE_SOURCE_FILE}`,
    "utf8"
  );

  return gulp
    .src(`${STRING_TEMPLATE_FILE_PATH}`)
    .pipe(replace("HTML", combinedHTMLCSSJS))
    .pipe(rename("index.js"))
    .pipe(gulp.dest(`./${DISTRIBUTION_DIRECTORY}`));
});

gulp.task("replaceStuffInParcelBundel", function() {
  return gulp
    .src(`./${PARCEL_DIRECTORY}/index.html`)
    .pipe(debug({ title: "replaceStuffInParcelBundel:" }))
    .pipe(replace("`", ""))
    .pipe(replace(/\/\/#\s(.*).map/gi, ""))
    .pipe(replace(/\/\!*((.|\n)*)\*\/\./gi, "")) // comments including multiline
    .pipe(cleanhtml())
    .pipe(rename(`${BROWSER_TEST_FILE}`))
    .pipe(gulp.dest(`./${BROWSER_TEST_DIRECTORY}/`))
    .pipe(rename(`${COMBINE_SOURCE_FILE}`))
    .pipe(gulp.dest(`./${STRING_WORKING_DIRECTORY}/`));
});

gulp.task("createIndexFileFromTemplate", () => {
  const combinedHTMLCSSJS = fs.readFileSync(
    `./${STRING_WORKING_DIRECTORY}/${COMBINE_SOURCE_FILE}`,
    "ascii"
  );

  return (
    gulp
      .src(`${STRING_TEMPLATE_FILE_PATH}`)
      .pipe(debug({ title: "createIndexFileFromTemplate:" }))
      .pipe(replace("HTML", combinedHTMLCSSJS))
      // .pipe(replace("?!\1", "?!\\1"))
      .pipe(rename(`${DIST_OUTPUT_FILENAME}`))
      .pipe(gulp.dest(`./${DISTRIBUTION_DIRECTORY}`))
  );
});

gulp.task("copyHTMLToDestinationProject", () => {
  return gulp
    .src(`./${DISTRIBUTION_DIRECTORY}/${DIST_OUTPUT_FILENAME}`)
    .pipe(debug({ title: "copyHTMLToDestinationProject:" }))
    .pipe(gulp.dest(`./${DESTINATION_PROJECT_DIRECTORY}`));
});

exports.postParcelBuild = gulp.series(
  "replaceStuffInParcelBundel",
  "createIndexFileFromTemplate",
  "copyHTMLToDestinationProject"
);

exports.buildWebpack = gulp.series(
  "replaceBackTicksInJS",
  "replaceBackTicksInCSS",
  "removeLinksFromHTML",
  "concatFiles",
  "createIndexFileFromTemplate",
  "copyHTMLToDestinationProject"
);

gulp.task("babel", function() {
  const envs = env.set({
    NODE_ENV: "development"
  });
  return gulp
    .src([
      "./src/**/*.js",
      "./src/**/*.jsx",
      "./src/**/*.ts",
      "./src/**/*.tsx",
      "!./src/**/*.test.*"
    ])
    .pipe(envs)
    .pipe(babel())
    .pipe(concat(`${COMBINE_SOURCE_FILE}`))
    .pipe(gulp.dest(`./${BABEL_DISTRIBUTION_DIRECTORY}/`));
});

exports.babelBuild = gulp.series("clean", "babel");
