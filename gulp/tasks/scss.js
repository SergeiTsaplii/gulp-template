import pkg from 'gulp';
import plumber from 'gulp-plumber';
import replace from 'gulp-replace';
import gulpIf from 'gulp-if';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import config from '../config.js';
import plumberNotify from './notify.js';
import postCssConfig from '../../postcss.config.js';

const { src, dest } = pkg;
const sass = gulpSass(dartSass);

function scss(isBuild, serverInstance) {
  return src(`${config.src.scss}/*.scss`, { sourcemaps: !isBuild })
    .pipe(plumber(plumberNotify('STYLES')))
    .pipe(sass({ includePaths: ['node_modules'] }))
    .pipe(gulpIf(isBuild, postcss(postCssConfig)))
    .pipe(
      replace(
        /(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\\/'"]+(\/))?([^'"]*)\1/gi,
        '$1$2$3$4$6$1',
      ),
    )
    .pipe(gulpIf(isBuild, cleanCss({ level: 2 })))
    .pipe(gulpIf(isBuild, rename({ suffix: '.min' })))
    .pipe(dest(config.dest.css, { sourcemaps: '.' }))
    .pipe(serverInstance.stream());
}

export default scss;
