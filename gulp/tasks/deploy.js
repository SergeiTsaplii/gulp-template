import pkg from 'gulp';
import plumber from 'gulp-plumber';
import gutil from 'gulp-util';
import ftp from 'vinyl-ftp';
import plumberNotify from './notify.js';
import config from '../config.js';

const { src } = pkg;

function deploy() {
  const pathHost = '';
  const conn = ftp.create({
    host: '', // Адрес FTP сервера
    user: '', // Имя пользователя
    password: '', // Пароль
    parallel: 20,
    log: gutil.log,
  });

  return src(`${config.dest.root}/**/*.*`, { encoding: false })
    .pipe(plumber(plumberNotify('DEPLOY')))
    .pipe(conn.dest(`/${pathHost}/${config.rootFolder}`));
}

export default deploy;
