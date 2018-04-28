const path = require("path");
const chalk = require('chalk');
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const publicPath = "../public/"

function getExternalIp(){
	let address;
	let ifaces = require('os').networkInterfaces();
	let addresses = [];
	for (let dev in ifaces) {
	   // ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address: undefined);
		 ifaces[dev].filter(function(details){
			 if(details.family === 'IPv4' && details.internal === false && details.address != undefined){
				 addresses.push(details.address);
			 }
		 })
	}

	console.log();
	console.log(chalk.green("*******************************************"));
	console.log();
	for(let i = 0; i<addresses.length; i++){
		console.log(chalk.cyan("found the following external ip: " + addresses[i]));
	}
	console.log();
	console.log(chalk.green("*******************************************"));
	console.log();

	return addresses[0];
}

const host = getExternalIp();
const port = 8080;

module.exports = {
	entry: [
		"webpack-dev-server/client?http://" + host + ":" + port,
		"webpack/hot/only-dev-server",
		"./src/index.js"
	],
	output: {
		path: path.resolve(__dirname, publicPath),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					"babel-loader"
				]
			},
			{
				test: /\.css$/,
				include: /node_modules/,
				use: [
					"style-loader",
					"css-loader",
					'postcss-loader'
				]
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					"style-loader",
					"css-loader",
					"resolve-url-loader",
					"sass-loader?sourceMap"
				]
			},
			{
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
          }
        ]
      },
			{
        test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: ["file-loader"]
        //loader: 'file?name=public/fonts/[name].[ext]'
      }
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	resolve: {
	    extensions: ['.js', '.jsx', '.json']
	},
	mode: 'development'
}
