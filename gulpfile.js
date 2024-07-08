import pkg from 'gulp';
import browserSync from 'browser-sync';
import config from './gulp/config.js';
import clean from './gulp/tasks/clean.js';
import server from './gulp/tasks/server.js';
import html from './gulp/tasks/html.js';

const { parallel, series, watch } = pkg;
const isBuild = process.argv.includes('--build');
const browserSyncInstance = browserSync.create();
const handleServer = server.bind(null, browserSyncInstance);
const handleHTML = html.bind(null, isBuild, browserSyncInstance);

function watcher() {
  watch(`${config.src.html}/**/*.html`, handleHTML);
};

const dev = series(clean, parallel(handleHTML), parallel(watcher, handleServer));
const build = series(clean);

export default dev;
