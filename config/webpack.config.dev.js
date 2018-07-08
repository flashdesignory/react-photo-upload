const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const os = require('os');

const publicPath = '../public/';

function getExternalIp() {
  const ifaces = os.networkInterfaces();
  let addresses = [];
  for (const dev in ifaces) { // eslint-disable-line
    const result = ifaces[dev].filter(details => details.family === 'IPv4' && details.internal === false && details.address !== undefined);
    if (result && result.length > 0) {
      addresses = [...addresses, ...result];
    }
  }

  console.log();
  console.log(chalk.green('*******************************************'));
  console.log();
  for (let i = 0; i < addresses.length; i++) {
    console.log(chalk.cyan(`found the following external ip: ${addresses[i].address}`));
  }
  console.log();
  console.log(chalk.green('*******************************************'));
  console.log();

  return addresses[0].address;
}

const host = getExternalIp();
const port = 8080;

module.exports = {
  entry: [
    `webpack-dev-server/client?http://${host}:${port}`,
    'webpack/hot/only-dev-server',
    './src/index.js',
  ],
  output: {
    path: path.resolve(__dirname, publicPath),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          'sass-loader?sourceMap',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  mode: 'development',
};
