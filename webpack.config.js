module.exports = {
    entry: ["babel-polyfill", "D:/WalrusEngine2/main.js"],
    devtool: 'source-map',
    output: {
        path: __dirname,
        filename: "walrus.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"},
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015'],
                    plugins: []
                }
            },
            {test: /\.json$/, loader: "json-loader"}
        ]
    },
    node : { fs : "empty"}
};