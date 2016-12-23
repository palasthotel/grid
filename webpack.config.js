
let config = {
	entry: {
		/**
		 * all plugin information
		 */
		plugins: './src/plugins.js',
		/**
		 * script for the grid
		 */
		the_grid: './src/the-grid.js',
		/**
		 * demo of a whole grid
		 */
		// demo_the_grid: './demo/the-grid.js',
		/**
		 * demo of only the grid content part
		 */
		// demo_grid: './demo/grid.js',
		/**
		 * demo of grid model
		 */
		demo_grid_model: './demo/grid-model.js',
		/**
		 * demo of box editor
		 */
		// demo_box_editor: './demo/box-editor.js',
		/**
		 * container drag and drop demo
		 */
		// demo_container_dnd: './demo/container-dnd.js',
		/**
		 * demo of styles editor
		 */
		// demo_styles_editor: './demo/styles-editor.js',
		/**
		 * demo of container factory
		 */
		// demo_container_factory: './demo/container-factory.js',
		/**
		 * demo of tabview with container and boxes
		 */
		// demo_tab_view: './demo/tab-view.js',
	},
	output: {
		path: './js/app',
		filename: '[name].js',
		sourceMapFilename: '[name].map'
	},
	devtool: 'source-map',
	module: {
		loaders: [{
			test: /\.(js|jsx)$/,
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

if(process.env.NODE_ENV == "production"){
	config.output.filename = "[name].min.js";
	config.output.sourceMapFilename = "[name].min.map";
}

module.exports = config;