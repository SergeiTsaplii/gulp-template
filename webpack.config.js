import promises from 'fs';
import { resolve, join, extname } from 'path';
import TerserPlugin from 'terser-webpack-plugin';

// eslint-disable-next-line consistent-return
async function readDir(directoryPath) {
  const result = {};
  try {
    const files = await promises.readdir(directoryPath);
    // Фильтрация файлов с расширением .js
    const jsFiles = files.filter((file) => extname(file) === '.js');
    // Вывод найденных .js файлов
    console.log('JS файлы в директории: ', jsFiles);

    jsFiles.forEach((file) => {
      const [name] = file.split('.');
      result[name] = `./${file}`;
    });

    return result;
  } catch (err) {
    console.error('Ошибка чтения директории:', err);
  }
}

const webpackConfig = async (isMode) => {
  const paths = {
    src: resolve('src'),
    build: resolve('dist'),
  };

  const context = join(paths.src, 'js');

  return {
    context,
    entry: await readDir(context),
    mode: isMode ? 'development' : 'production',
    devtool: isMode ? 'source-map' : false,
    optimization: isMode ? {} : {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: { format: { comments: false } },
          extractComments: false,
        }),
      ],
      // splitChunks: {
      //   cacheGroups: {
      //     vendor: {
      //       test: /node_modules/,
      //       chunks: 'initial',
      //       name: 'vendor',
      //       enforce: true,
      //     },
      //   },
      // },
    },
    output: {
      path: join(paths.build, 'js'),
      filename: isMode ? '[name].js' : '[name].min.js',
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
  };
};

export default webpackConfig;
