const srcPath = 'src';
const destPath = 'dist';

const config = {
  src: {
    root: srcPath,
    html: `${srcPath}/html`,
    scss: `${srcPath}/scss`,
    js: `${srcPath}/js`,
    images: `${srcPath}/assets/images`,
    sprites: `${srcPath}/assets/icons`,
    fonts: `${srcPath}/assets/fonts`,
    favicons: `${srcPath}/assets/favicons`,
    resources: `${srcPath}/assets/resources`
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
    resources: `${destPath}/resources`
  }
};

export default config;
