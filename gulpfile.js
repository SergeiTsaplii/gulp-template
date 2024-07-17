import pkg from 'gulp';
import browserSync from 'browser-sync';
import config from './gulp/config.js';
import clean from './gulp/tasks/clean.js';
import server from './gulp/tasks/server.js';
import html from './gulp/tasks/html.js';
import scss from './gulp/tasks/scss.js';
import js from './gulp/tasks/js.js';
import images from './gulp/tasks/images.js';

const { parallel, series, watch } = pkg;
const isBuild = process.argv.includes('--build');
const browserSyncInstance = browserSync.create();
const handleServer = server.bind(null, browserSyncInstance);
const handleHTML = html.bind(null, isBuild, browserSyncInstance);
const handleSCSS = scss.bind(null, isBuild, browserSyncInstance);
const handleJS = js.bind(null, !isBuild, browserSyncInstance);
const handleImages = images.bind(null, isBuild, browserSyncInstance);

function watcher() {
  watch(`${config.src.html}/**/*.html`, handleHTML);
  watch(`${config.src.scss}/**/*.scss`, handleSCSS);
  watch(`${config.src.js}/**/*.js`, handleJS);
  watch(`${config.src.images}/**/**.{jpg,jpeg,png,svg}`, handleImages);
}

const dev = series(
  clean,
  parallel(handleHTML, handleSCSS, handleJS, handleImages),
  parallel(watcher, handleServer),
);
const build = series(clean, parallel(handleHTML, handleSCSS));

export default dev;

export { build };
