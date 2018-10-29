const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const inputStyle = require('postcss-input-style');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const SOURCE_FOLDER = 'src';
const BUILD_FOLDER = 'docs';

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const cssLoaders = [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: [
          autoprefixer(),
          inputStyle()
        ]
      }
    },
    'less-loader'
  ];

  return {
    entry: `./${SOURCE_FOLDER}/scripts/index.ts`,
    output: {
      path: path.resolve(__dirname, BUILD_FOLDER),
      filename: 'script.js'
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          loader: 'awesome-typescript-loader'
        },
        {
          test: /\.less$/,
          loader: cssLoaders
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.css'
      }),
      new CopyWebpackPlugin([
        {
          from: `${SOURCE_FOLDER}/index.html`
        }
      ])
    ],
    resolve: {
      extensions: ['.ts', '.js']
    },
  };
};
