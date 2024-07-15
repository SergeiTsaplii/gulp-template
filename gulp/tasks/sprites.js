import pkg from 'gulp';
import plumber from 'gulp-plumber';
import svgSprite from 'gulp-svg-sprite';
import config from '../config.js';
import plumberNotify from './notify.js';

const { src, dest } = pkg;

function sprites(isBuild, serverInstance) {
  return src(`${config.src.sprites}/*.svg`)
    .pipe(plumber(plumberNotify('SPRITES')))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg',
        },
      },
      shape: {
        transform: [
          {
            svgo: {
              js2svg: { indent: 2, pretty: isBuild },
              plugins: [
                {
                  name: 'removeAttrs',
                  params: {
                    attrs: '(fill|stroke)',
                  },
                },
              ],
            },
          },
        ],
      },
    }))
    .pipe(dest(config.dest.sprites))
    .pipe(serverInstance.stream());
}

export default sprites;
