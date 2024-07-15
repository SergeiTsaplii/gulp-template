import { resolve, join } from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import readDir from './gulp/tasks/dir.js';

// eslint-disable-next-line consistent-return

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
