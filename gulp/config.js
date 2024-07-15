import * as nodePath from 'path';

const rootFolder = nodePath.basename(nodePath.resolve());
const srcPath = 'src';
const destPath = 'dist';

const config = {
  src: {
    root: srcPath,
    html: `${srcPath}/html`,
    scss: `${srcPath}/scss`,
    js: `${srcPath}/js`,
    images: `${srcPath}/images`,
    sprites: `${srcPath}/icons`,
    fonts: `${srcPath}/fonts`,
    favicons: `${srcPath}/favicons`,
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
