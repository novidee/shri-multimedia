const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SOURCE_FOLDER = 'src';
const BUILD_FOLDER = 'docs';

module.exports = (env, argv) => {
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
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: `${SOURCE_FOLDER}/index.html`
        },
        {
          from: `${SOURCE_FOLDER}/style.css`
        }
      ])
    ]
  };
};
