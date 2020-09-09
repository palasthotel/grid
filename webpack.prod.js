const {merge} = require("webpack-merge")
const common = require("./webpack.common.js")
// const CompressionPlugin = require('compression-webpack-plugin')

module.exports =  common.map(c=>merge(c, {
    mode: 'production',
    devtool: 'source-map',
    // plugins:[
    // 	new CompressionPlugin(),
    // ]
}));
