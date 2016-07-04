module.exports = {
	entry: './src/app.js',
	output: {
		path: './bundle',
		filename: 'app.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules|bower_components/,
			loader: 'babel-loader',
		}]
	}
};