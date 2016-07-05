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
			query: {
				presets: ["es2015", "react"],
				plugins: ["transform-object-rest-spread"]
			}
		}]
	},
	watch: true,
};