import pkg from 'gulp';
import plumber from 'gulp-plumber';
import fileinclude from 'gulp-file-include';
import replace from 'gulp-replace';
import typograf from 'gulp-typograf';
import avifWebpHtml from 'gulp-avif-webp-retina-html';
import prettier from 'gulp-prettier';
import htmlmin from 'gulp-htmlmin';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import webpack from 'webpack-stream';
import TerserPlugin from 'terser-webpack-plugin';
import imagemin, {
  gifsicle, mozjpeg, optipng, svgo,
} from 'gulp-imagemin';
import imageminAvif from 'imagemin-avif';
import imageminWebp from 'imagemin-webp';
import rename from 'gulp-rename';
import svgSprite from 'gulp-svg-sprite';
import plumberNotify from './notify.js';
import config from '../config.js';
import postCssConfig from '../../postcss.config.js';

const { src, dest } = pkg;
const sass = gulpSass(dartSass);

function htmlBackend() {
  return src(`${config.src.html}/*.html`)
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file',
    }))
    .pipe(replace(/<img(?:.|\n|\r)*?>/g, (match) => match.replace(/\r?\n|\r/g, '').replace(/\s{2,}/g, ' ')))
    .pipe(replace(
      /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\\/'"]+(\/))?([^'"]*)\1/gi,
      '$1$4$5$7$1',
    ))
    .pipe(replace('NEW_PROJECT_NAME', `${config.rootFolder}`))
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
      removeComments: true,
      collapseWhitespace: true,
    }))
    .pipe(dest(`${config.dest.html}`));
}

function stylesBackend() {
  return src(`${config.src.scss}/*.scss`)
    .pipe(plumber(plumberNotify('STYLES')))
    .pipe(sass({ includePaths: ['node_modules'] }))
    .pipe(postcss(postCssConfig))
    .pipe(
      replace(
        /(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\\/'"]+(\/))?([^'"]*)\1/gi,
        '$1$2$3$4$6$1',
      ),
    )
    .pipe(dest(config.dest.css));
}

function scriptsBackend() {
  return src(`${config.src.js}/*.js`)
    .pipe(plumber(plumberNotify('SCRIPTS')))
    .pipe(webpack({

      mode: 'development',
      devtool: false,
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: { format: { comments: false } },
            extractComments: false,
          }),
        ],
      },
      output: {
        filename: '[name].js',
        publicPath: '/',
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    targets: 'defaults',
                    useBuiltIns: 'entry',
                    corejs: {
                      version: 3.22,
                    },
                  }],
                ],
              },
            },
          },
        ],
      },
    }))
    .pipe(dest(config.dest.js));
}

function imagesBackend() {
  return src([
    `${config.src.images}/**/**.{jpg,jpeg,png,svg}`,
    `!${config.src.sprites}`,
    `!${config.src.favicons}`,
  ], { encoding: false })
    .pipe(plumber(plumberNotify('IMAGES')))
    .pipe(imagemin([
      gifsicle({ interlaced: true }),
      mozjpeg({ quality: 75, progressive: true }),
      optipng({ optimizationLevel: 5 }),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
        ],
      }),
    ], { verbose: true }))
    .pipe(dest(config.dest.images));
}

function avifBackend() {
  return src(`${config.src.images}/**/**.{jpg,jpeg,png}`, { encoding: false })
    .pipe(plumber(plumberNotify('IMAGES')))
    .pipe(imagemin([
      imageminAvif(),
    ]))
    .pipe(rename({ extname: '.avif' }))
    .pipe(dest(config.dest.images));
}

function webpBackend() {
  return src(`${config.src.images}/**/**.{jpg,jpeg,png}`, { encoding: false })
    .pipe(plumber(plumberNotify('IMAGES')))
    .pipe(imagemin([
      imageminWebp(),
    ]))
    .pipe(rename({ extname: '.webp' }))
    .pipe(dest(config.dest.images));
}

function spritesBackend() {
  return src(`${config.src.sprites}/*.svg`)
    .pipe(plumber(plumberNotify('SPRITES')))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg',
        },
      },
      shape: {
        transform: [
          {
            svgo: {
              js2svg: { indent: 2, pretty: true },
              plugins: [
                {
                  name: 'removeAttrs',
                  params: {
                    attrs: '(fill|stroke)',
                  },
                },
              ],
            },
          },
        ],
      },
    }))
    .pipe(dest(config.dest.sprites));
}

export {
  htmlBackend,
  stylesBackend,
  scriptsBackend,
  imagesBackend,
  avifBackend,
  webpBackend,
  spritesBackend,
};
