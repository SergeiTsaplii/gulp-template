import autoprefixer from 'autoprefixer';
import postCssPresetEnv from 'postcss-preset-env';
import postcssGroupMedia from 'postcss-sort-media-queries';

const postCssConfig = {
  plugins: [
    autoprefixer({ cascade: false, grid: 'autoplace', overrideBrowserslist: ['last 5 versions']}),
    postCssPresetEnv(),
    postcssGroupMedia({ sort: 'desktop-first' })
  ]
};

export default postCssConfig;
