
module.exports = {
	entry: {
		the_grid: './src/the-grid.js',
		demo_grid: './demo/grid.js',
		demo_grid_model: './demo/grid-model.js',
		demo_container_dnd: './demo/container-dnd.js',
		demo_styles_editor: './demo/styles-editor.js',
		demo_container_factory: './demo/container-factory.js'
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