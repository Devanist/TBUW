var path = require('path');

module.exports = {
    entry: "./main.js",
    output: {
        path: __dirname + '/output/',
        filename: "bundle.js"
    },
    module: {
        preLoaders: [
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json'
            },
        ],
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader',
                include: path.join(__dirname, 'lib', 'pixi.js')
            }
        ]
    }
};