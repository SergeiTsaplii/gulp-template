import pkg from 'gulp';
import plumber from 'gulp-plumber';
import gulpIf from 'gulp-if';
import newer from 'gulp-newer';
import imagemin, {
  gifsicle, mozjpeg, optipng, svgo,
} from 'gulp-imagemin';
import config from '../config.js';
import plumberNotify from './notify.js';

const { src, dest } = pkg;

function images(isBuild, serverInstance) {
  return src([
    `${config.src.images}/**/**.{jpg,jpeg,png,svg}`,
    `!${config.src.sprites}`,
    `!${config.src.favicons}`,
  ], { encoding: false })
    .pipe(plumber(plumberNotify('IMAGES')))
    .pipe(newer(config.dest.images))
    .pipe(gulpIf(isBuild, imagemin([
      gifsicle({ interlaced: true }),
      mozjpeg({ quality: 75, progressive: true }),
      optipng({ optimizationLevel: 5 }),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
        ],
      }),
    ], { verbose: true })))
    .pipe(dest(config.dest.images))
    .pipe(serverInstance.stream());
}

export default images;
