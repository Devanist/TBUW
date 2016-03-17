var path = require('path');

module.exports = {
    entry: "./main.js",
    output: {
        path: __dirname + '/output/',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                include: path.join(__dirname, 'lib', 'pixi.js'),
                loader: "json"
            }
        ]
    }
};