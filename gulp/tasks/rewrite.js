import pkg from 'gulp';
import revRewrite from 'gulp-rev-rewrite';
import readFileSync from 'fs';
import config from '../config.js';

const { src, dest } = pkg;

function rewrite() {
  const manifest = readFileSync('app/rev.json');

  src(`${config.dest.css}/*.css`)
    .pipe(revRewrite({
      manifest,
    }))
    .pipe(dest(config.dest.css));
  return src(`${config.dest.root}/**/*.html`)
    .pipe(revRewrite({
      manifest,
    }))
    .pipe(dest(config.dest.root));
}

export default rewrite;
