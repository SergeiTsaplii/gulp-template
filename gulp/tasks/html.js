/* eslint-disable no-shadow */
import pkg from 'gulp';
import fs from 'fs';
import path from 'path';
import plumber from 'gulp-plumber';
import cached from 'gulp-cached';
import dependents from 'gulp-dependents';
import filter from 'gulp-filter';
import pug from 'gulp-pug';
import replace from 'gulp-replace';
import typograf from 'gulp-typograf';
import avifWebpHtml from 'gulp-avif-webp-retina-html';
import prettier from 'gulp-prettier';
import htmlmin from 'gulp-htmlmin';
import gulpIf from 'gulp-if';
import config from '../config.js';
import plumberNotify from './notify.js';

const { src, dest } = pkg;
const data = {};
const dir = `${config.src.root}/html/data/`;

try {
  const modules = fs.readdirSync(dir);
  modules.forEach((item) => {
    const module = path.join(dir, item);
    if (!fs.lstatSync(module).isDirectory()) return;
    const jsons = fs.readdirSync(module).filter((item) => path.extname(item) === '.json');
    jsons.forEach((json) => {
      const name = path.basename(json, path.extname(json));
      const file = path.join(dir, item, json);
      data[name] = JSON.parse(fs.readFileSync(file));
    });
  });
} catch (e) {
  console.log(e);
}

function html(isBuild, serverInstance) {
  return src(`${config.src.html}/*.pug`)
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(cached('pugCache'))
    .pipe(dependents({
      '.pug': {
        parserSteps: [/^\s*(?:extends|include)\s+(.+?)\s*$/gm],
        postfixes: ['.pug', '.jade'],
      },
    }))
    .pipe(filter(`${config.src.html}/*.pug`))
    .pipe(pug({ pretty: isBuild, locals: { jsons: data } }))
    .pipe(replace(/<img(?:.|\n|\r)*?>/g, (match) => match.replace(/\r?\n|\r/g, '').replace(/\s{2,}/g, ' ')))
    .pipe(replace(
      /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\\/'"]+(\/))?([^'"]*)\1/gi,
      '$1$4$5$7$1',
    ))
    .pipe(replace('NEW_PROJECT_NAME', `${config.rootFolder}`))
    .pipe(gulpIf(isBuild, replace('.css', '.min.css')))
    .pipe(gulpIf(isBuild, replace('.js', '.min.js')))
    .pipe(typograf({
      locale: ['ru', 'en-US'],
      htmlEntity: { type: 'digit' },
      safeTags: [
        ['<\\?php', '\\?>'],
        ['<no-typography>', '</no-typography>'],
      ],
    }))
    .pipe(avifWebpHtml({
      extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
      retina: {
        1: '',
        2: '@2x',
      },
    }))
    .pipe(prettier({
      printWidth: 182,
      trailingComma: 'es5',
      bracketSpacing: false,
    }))
    .pipe(htmlmin({
      useShortDoctype: true,
      sortClassName: true,
      removeComments: isBuild,
      collapseWhitespace: isBuild,
    }))
    .pipe(dest(`${config.dest.html}`))
    .pipe(serverInstance.stream());
}

export default html;
