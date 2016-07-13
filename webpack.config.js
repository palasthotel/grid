
module.exports = {
	entry: {
		index: './src/index.js',
		demo_grid: './demo/grid.js',
		demo_container_dnd: './demo/container-dnd.js',
		demo_styles_editor: './demo/styles-editor.js'
	},
	output: {
		path: './bundle',
		filename: '[name].js',
		sourceMapFilename: '[name].map'
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
	watch: true,
};