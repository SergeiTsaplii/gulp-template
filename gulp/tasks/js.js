import pkg from 'gulp';
import plumber from 'gulp-plumber';
import webpack from 'webpack-stream';
import config from '../config.js';
import webpackConfig from '../../webpack.config.js';
import plumberNotify from './notify.js';

const { src, dest } = pkg;

async function js(isDev, serverInstance) {
  return src(`${config.src.js}/*.js`)
    .pipe(plumber(plumberNotify('SCRIPTS')))
    .pipe(webpack({ config: await webpackConfig(isDev) }))
    .pipe(dest(config.dest.js))
    .pipe(serverInstance.stream());
}

export default js;
