import pkg from 'gulp';
import rev from 'gulp-rev';
import revDel from 'gulp-rev-delete-original';
import config from '../config.js';

const { src, dest } = pkg;

function cacheTask() {
  return src(`${config.dest.root}/**/*.{css,js,svg,png,jpg,jpeg,avif,webp,woff2}`, {
    base: config.dest.root,
    encoding: false,
  })
    .pipe(rev())
    .pipe(revDel())
    .pipe(dest(config.dest.root))
    .pipe(rev.manifest('rev.json'))
    .pipe(dest(config.dest.root));
}

export default cacheTask;
