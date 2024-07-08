import pkg from 'gulp';
import browserSync from 'browser-sync';
import clean from './gulp/tasks/clean.js';
import server from './gulp/tasks/server.js'

const { parallel, series, watch } = pkg;
const browserSyncInstance = browserSync.create();
const handleServer = server.bind(null, browserSyncInstance);

function watcher() {
  watch();
};

const dev = series(clean, parallel(watcher, handleServer));
const build = series(clean);

export default dev;
