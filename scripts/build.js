process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config/webpack.config.build.js');

const compiler = webpack(config);
const distPath = './dist/';
const publicPath = './public/';

console.log();
console.log(chalk.green('*******************************************'));
console.log();
console.log(chalk.cyan('building your app..'));
console.log();
console.log(chalk.green('*******************************************'));
console.log();

fs.emptyDirSync(distPath);
fs.copySync(publicPath, distPath);

compiler.run(() => {
  console.log(chalk.cyan('done..'));
  console.log();
  console.log(chalk.green('*******************************************'));
});
