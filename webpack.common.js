const path = require('path');

module.exports = {
    entry: {
        reuseContainerList: path.resolve(__dirname, './src/scripts/reuseContainerList.js'),
    },
    output: {
        path: path.resolve(__dirname)+'/dist/scripts/.',
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
    }
};
