
module.exports = {
	entry: {
		/**
		 * script for the grid
		 */
		the_grid: './src/the-grid.js',
		/**
		 * demo of a whole grid
		 */
		demo_the_grid: './demo/the-grid.js',
		/**
		 * demo of only the grid content part
		 */
		demo_grid: './demo/grid.js',
		/**
		 * demo of grid model
		 */
		demo_grid_model: './demo/grid-model.js',
		/**
		 * demo of box editor
		 */
		demo_box_editor: './demo/box-editor.js',
		/**
		 * container drag and drop demo
		 */
		demo_container_dnd: './demo/container-dnd.js',
		/**
		 * demo of styles editor
		 */
		demo_styles_editor: './demo/styles-editor.js',
		/**
		 * demo of container factory
		 */
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