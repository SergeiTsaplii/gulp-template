import * as nodePath from 'path';

const rootFolder = nodePath.basename(nodePath.resolve());
const srcPath = 'src';
const destPath = 'dist';

const config = {
  src: {
    root: srcPath,
    html: `${srcPath}/pages`,
    scss: `${srcPath}/scss`,
    js: `${srcPath}/js`,
    images: `${srcPath}/images`,
    sprites: `${srcPath}/images/sprites`,
    fonts: `${srcPath}/fonts`,
    favicons: `${srcPath}/images/favicons`,
    resources: `${srcPath}/resources`,
  },
  dest: {
    root: destPath,
    html: destPath,
    css: `${destPath}/css`,
    js: `${destPath}/js`,
    images: `${destPath}/images`,
    sprites: `${destPath}/images/sprites`,
    fonts: `${destPath}/fonts`,
    favicons: `${destPath}/images/favicons`,
    resources: `${destPath}/resources`,
  },
  rootFolder,
};

export default config;
