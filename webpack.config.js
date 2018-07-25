
const path = require('path');
const webpack = require('webpack');

let config = {
	entry: {
		/**
		 * all plugin information
		 */
		plugins: './src/plugins.js',
		/**
		 * script for the grid
		 */
		"the-grid": './src/the-grid.js',
		/**
		 * demo of a whole grid
		 */
		// demo_the_grid: './demo/the-grid.js',
		// demo_app_grid: './demo/app-grid.js',
		/**
		 * demo of only the grid content part
		 */
		// demo_grid: './demo/grid.js',
		/**
		 * demo of grid model
		 */
		// demo_grid_model: './demo/grid-model.js',
		/**
		 * demo of the redux implementation
		 */
		// demo_redux: './demo/redux.js',
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
		path: path.resolve(__dirname, 'js/app'),
		filename: '[name].js',
		sourceMapFilename: '[name].map'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ["es2015", "react"],
						plugins: ["transform-object-rest-spread"]
					},
				}
			}
		],
	},
	externals: [
		{
			"react-dom": {
				root: "ReactDOM",
				commonjs2: "react-dom",
				commonjs: "react-dom",
				amd: "react-dom"
			}
		},
		{
			react: {
				root: "React",
				commonjs2: "react",
				commonjs: "react",
				amd: "react"
			}
		},
	],
};

if(process.env.NODE_ENV === "production"){
	config.plugins = [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
	];
}

module.exports = config;