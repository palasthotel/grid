
module.exports = {
	entry: require('./webpack.entries.js'),
	output: {
		path: './bundle/min',
		filename: '[name].min.js',
		sourceMapFilename: '[name].min.map'
	},
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules|bower_components/,
			loader: 'babel-loader',
			query: {
				presets: ["es2015", "react"],
				plugins: ["transform-object-rest-spread"]
			}
		}]
	},
};