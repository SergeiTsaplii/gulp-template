import pkg from 'gulp';
import plumber from 'gulp-plumber';
import gulpIf from 'gulp-if';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import imageminWebp from 'imagemin-webp';
import rename from 'gulp-rename';
import config from '../config.js';
import plumberNotify from './notify.js';

const { src, dest } = pkg;

function webp(isBuild, serverInstance) {
  return src(`${config.src.images}/**/**.{jpg,jpeg,png}`, { encoding: false })
    .pipe(plumber(plumberNotify('IMAGES')))
    .pipe(newer(config.dest.images))
    .pipe(gulpIf(isBuild, imagemin([
      imageminWebp(),
    ])))
    .pipe(rename({ extname: '.webp' }))
    .pipe(dest(config.dest.images))
    .pipe(serverInstance.stream());
}

export default webp;
