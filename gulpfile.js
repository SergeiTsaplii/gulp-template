import pkg from 'gulp';
import browserSync from 'browser-sync';
import config from './gulp/config.js';
import clean from './gulp/tasks/clean.js';
import server from './gulp/tasks/server.js';
import html from './gulp/tasks/html.js';
import scss from './gulp/tasks/scss.js';
import js from './gulp/tasks/js.js';
import images from './gulp/tasks/images.js';
import avif from './gulp/tasks/avif.js';
import webp from './gulp/tasks/webp.js';
import sprites from './gulp/tasks/sprites.js';
import { font, fontStyle } from './gulp/tasks/fonts.js';
import favicons from './gulp/tasks/favicons.js';
import resources from './gulp/tasks/resources.js';
import cacheTask from './gulp/tasks/cache.js';
import rewrite from './gulp/tasks/rewrite.js';
import zipFiles from './gulp/tasks/zip.js';

const { parallel, series, watch } = pkg;
const isBuild = process.argv.includes('--build');
const browserSyncInstance = browserSync.create();
const handleServer = server.bind(null, browserSyncInstance);
const handleHTML = html.bind(null, isBuild, browserSyncInstance);
const handleSCSS = scss.bind(null, isBuild, browserSyncInstance);
const handleJS = js.bind(null, !isBuild, browserSyncInstance);
const handleImages = images.bind(null, isBuild, browserSyncInstance);
const handleAvif = avif.bind(null, isBuild, browserSyncInstance);
const handleWebp = webp.bind(null, isBuild, browserSyncInstance);
const handleSprites = sprites.bind(null, isBuild, browserSyncInstance);

function watcher() {
  watch(`${config.src.html}/**/*.html`, handleHTML);
  watch(`${config.src.scss}/**/*.scss`, handleSCSS);
  watch(`${config.src.js}/**/*.js`, handleJS);
  watch(`${config.src.images}/**/**.{jpg,jpeg,png,svg}`, handleImages);
  watch(`${config.src.images}/**/**.{jpg,jpeg,png}`, handleAvif);
  watch(`${config.src.images}/**/**.{jpg,jpeg,png}`, handleWebp);
  watch(`${config.src.sprites}/**/**.svg`, handleSprites);
  watch(`${config.src.resources}/**`, resources);
}

const dev = series(
  clean,
  handleHTML,
  handleSCSS,
  handleJS,
  handleImages,
  handleAvif,
  handleWebp,
  handleSprites,
  font,
  fontStyle,
  favicons,
  resources,
  parallel(watcher, handleServer),
);
const build = series(
  clean,
  parallel(handleHTML, handleSCSS, handleJS, handleImages, handleAvif, handleWebp),
);

const cache = series(cacheTask, rewrite);
const zip = zipFiles;

export default dev;

export { build, cache, zip };
