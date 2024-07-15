import pkg from 'gulp';
import plumber from 'gulp-plumber';
import zip from 'gulp-zip';
import { deleteAsync } from 'del';
import plumberNotify from './notify.js';
import config from '../config.js';

const { src, dest } = pkg;

function zipFiles() {
  deleteAsync([`${config.dest.root}/*.zip`]);
  return src(`${config.dest.root}/**/*.*`, { encoding: false })
    .pipe(plumber(plumberNotify('ZIP')))
    .pipe(zip(`${config.rootFolder}.zip`))
    .pipe(dest(config.dest.root));
}

export default zipFiles;
