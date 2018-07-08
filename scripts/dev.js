process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const open = require('open');
const os = require('os');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../config/webpack.config.dev.js');

const compiler = webpack(config);

function getExternalIp() {
  const ifaces = os.networkInterfaces();
  let addresses = [];
  for (const dev in ifaces) { // eslint-disable-line
    const result = ifaces[dev].filter(details => details.family === 'IPv4' && details.internal === false && details.address !== undefined);
    if (result && result.length > 0) {
      addresses = [...addresses, ...result];
    }
  }

  return addresses[0].address;
}

const host = getExternalIp();
const port = 8080;

const server = new WebpackDevServer(compiler, {
  contentBase: './public',
  historyApiFallback: true,
  publicPath: '',
  inline: true,
  hot: true,
});

server.listen(port, host, (err) => {
  if (err) {
    return console.log(err);
  }

  const url = `http://${host}:${port}`;

  console.log();
  console.log(chalk.green('*******************************************'));
  console.log();
  console.log(chalk.cyan(`listening at: ${url}`));
  console.log();
  console.log(chalk.green('*******************************************'));
  console.log();

  return open(url);
});
