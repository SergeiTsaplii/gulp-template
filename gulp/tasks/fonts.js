/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-tabs */
/* eslint-disable no-restricted-syntax */
import pkg from 'gulp';
import fs from 'fs';
import plumber from 'gulp-plumber';
import ttf2woff2 from 'gulp-ttf2woff2';
import plumberNotify from './notify.js';
import config from '../config.js';

const { src, dest } = pkg;
const fontsFile = `${config.src.scss}/_fonts.scss`;
const italicRegex = /italic/i;
const cleanSeparator = /(?:_|__|-|\s)?(italic)/i;

const fontWeights = {
  thin: 100,
  hairline: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900,
  extrablack: 950,
  ultrablack: 950,
};

const fontFaceTemplate = (name, file, weight, style) => `@font-face {
	font-family: ${name};
	font-display: swap;
	src: url("../fonts/${file}.woff2") format("woff2");
	font-weight: ${weight};
	font-style: ${style};
}\n`;

function font() {
  if (fs.existsSync(fontsFile)) {
    return src(`${config.src.fonts}/*.woff2`, {})
      .pipe(plumber(plumberNotify('FONTS [ttfToWoff2]')))
      .pipe(dest(config.dist.fonts));
  }
  return src(`${config.src.fonts}/*.ttf`)
    .pipe(plumber(plumberNotify('FONTS [ttfToWoff2]')))
    .pipe(ttf2woff2())
    .pipe(config.src.fonts)
    .pipe(src(`${config.src.fonts}/*.woff2`))
    .pipe(dest(config.dest.fonts));
}

async function fontStyle() {
  try {
    if (fs.existsSync(fontsFile)) {
      console.warning('Файл scss/config/fonts.scss уже существует.\nДля обновления файла его нужно удалить!');
      return;
    }

    const fontFiles = await fs.promises.readdir(config.fonts.dist);

    if (!fontFiles) {
      console.error('Нет сконвертированных шрифтов');
      return;
    }

    await fs.promises.writeFile(fontsFile, '');
    let newFileOnly;

    for (const file of fontFiles) {
      const [fileName] = file.split('.');

      if (newFileOnly !== fileName) {
        const [name, weight = 'regular'] = fileName.split('-');
        const weightString = fontWeights[weight.replace(cleanSeparator, '').toLowerCase()];
        const fontStyle = italicRegex.test(fileName) ? 'italic' : 'normal';

        await fs.promises.appendFile(fontsFile, fontFaceTemplate(name, fileName, weightString, fontStyle));
        newFileOnly = fileName;
      }
    }
  } catch (err) {
    console.error('Ошибка при обработке шрифтов:\n', err);
  }
}

export { font, fontStyle };
