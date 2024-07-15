import pkg from 'gulp';
import favicon from 'gulp-favicons';
import filter from 'gulp-filter';
import plumber from 'gulp-plumber';
import config from '../config.js';
import plumberNotify from './notify.js';

const { src, dest } = pkg;

function favicons() {
  return src(`${config.src.favicons}/*.{svg}`)
    .pipe(plumber(plumberNotify('FAVICONS')))
    .pipe(dest(config.dest.favicons))
    .pipe(favicon({
      icons: {
        favicons: true,
        appleIcon: true,
        online: false,
        appleStartup: false,
        android: true,
        firefox: false,
        yandex: false,
        windows: false,
        coast: false,
      },
      path: 'images/favicons',
    }))
    .pipe(dest(config.dest.favicons))
    .pipe(filter(['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'site.webmanifest']))
    .pipe(config.dest.root);
}

export default favicons;
