import pkg from 'gulp';
import plumber from 'gulp-plumber';
import config from '../config.js';
import plumberNotify from './notify.js';

const { src, dest } = pkg;

function resources() {
  return src(`${config.src.resources}/**`, { encoding: false })
    .pipe(plumber(plumberNotify('RESOURCES')))
    .pipe(dest(config.dest.resources));
}

export default resources;
