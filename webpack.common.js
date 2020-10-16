const path = require('path');

const editorConfig = {
    entry: {
        ["grid-editor"]: path.resolve(__dirname, './src/grid-editor/grid-editor.js'),
    },
    output: {
        path: path.resolve(__dirname)+'/js/dist/.',
        filename: '[name].js',
        sourceMapFilename: '[name].map',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules|bower_components/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                        ],
                    }
                },
            }
        ]
    },
    externals:{
        "jquery": "jQuery",
        "jquery-ui": "jQuery",
    },
};

const reuseContainerListConfig = {
    entry: {
        reuseContainerList: path.resolve(__dirname, './src/reuseContainerList.js'),
    },
    output: {
        path: path.resolve(__dirname)+'/js/dist/.',
        filename: '[name].js',
        sourceMapFilename: '[name].map',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules|bower_components/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                        ],
                        plugins: [
                            "@babel/plugin-proposal-object-rest-spread",
                            "@babel/plugin-transform-runtime",
                        ],
                    }
                },
            }
        ]
    },
    externals:{
        "react": "React",
        "react-dom": "ReactDOM",
    },
};

module.exports = [editorConfig, reuseContainerListConfig]
