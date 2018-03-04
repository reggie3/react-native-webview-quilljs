const gulp = require('gulp');
const log = require('fancy-log');
const intercept = require('gulp-intercept');
const concat = require('gulp-concat');
const jeditor = require('gulp-json-editor');
const bump = require('gulp-bump');
const webpack_stream = require('webpack-stream');
const webpack_config = require('./webpack.config.js');
const run = require('gulp-run');
const inlinesource = require('gulp-inline-source');
// dependencies for npm publishing
const npmDeps = {
  glamor: '^2.20.40',
  glamorous: '^4.11.2',
  'is-valid-coordinates': '^1.0.0',
  'prop-types': '^15.6.0',
  util: '^0.10.3',
  'render-if': '^0.1.1'
};
// additional dependencies for expo app
const expoDeps = {
  expo: '^25.0.0',
  react: '16.2.0',
  'react-dom': '^16.2.0',
  'react-native':
    'https://github.com/expo/react-native/archive/sdk-25.0.0.tar.gz'
};

// main for npm publishing
const npmMain = 'index.js';
// main for expo app
const expoMain = 'node_modules/expo/AppEntry.js';

const paths = {
  src: './Scripts/',
  bundled: './bundled/'
};

/****package.json stuff****/
gulp.task('test', function() {
  console.log('Hello');
});

const updatePackageJSONforNPM = json => {};
// read the package.json and update it for npm publishing
gulp.task('forNPM', done => {
  gulp
    .src('./package.json')
    .pipe(bump())
    .pipe(
      jeditor(function(json) {
        json.dependencies = npmDeps;
        json.main = npmMain;
        return json;
      })
    )
    .pipe(concat('package.json'))
    .pipe(gulp.dest('./'));
  done();
});


// pack the files
gulp.task('webpack', done => {
  return run('webpack').exec();
  done();
});

// build the distribution HTML files with inline JS and CSS
gulp.task('inlinesource', done=>{
  return gulp.src('./bundled/*.html')
  .pipe(intercept(function(file){
    console.log('FILE: ' + file.path );
    return file;
  })) 
  .pipe(inlinesource())
  .pipe(gulp.dest('./assets/dist'));

})

gulp.task('npm-publish', done => {
  return run('npm publish').exec(); // run "npm start".
  done();
});

gulp.task('git-add', done => {
  return run('git add .').exec();
  done();
});

gulp.task('git-commit', done => {
  return run('git commit -m "publishing"').exec();

  done();
});

gulp.task('git-push', done => {
  return run('git push origin master').exec();
  done();
});

gulp.task('forExpo', done => {
  gulp
    .src('./package.json')
    .pipe(
      jeditor({
        dependencies: expoDeps,
        main: expoMain
      })
    )
    .pipe(concat('package.json'))
    .pipe(gulp.dest('./'));
  done();
});



gulp.task(
  'prod',
  gulp.series(
    'forNPM',
    'webpack',
    'inlinesource',
    gulp.parallel(
      gulp.series('git-add', 'git-commit', 'git-push'),
      'npm-publish'
    ),
    'forExpo'
  )
);

