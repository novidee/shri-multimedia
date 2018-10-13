const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
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
          autoprefixer()
        ]
      }
    },
    'less-loader'
  ];

  return {
    entry: `./${SOURCE_FOLDER}/scripts/index.js`,
    output: {
      path: path.resolve(__dirname, BUILD_FOLDER),
      filename: 'script.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
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
    ]
  };
};
