module.exports = {
    entry: ["babel-polyfill", "D:/WalrusEngine2/main.js"],
    devtool: 'source-map',
    output: {
        path: __dirname,
        filename: "walrus.js"
    },
    module: {
        loaders: [
            {test: /\.scss$/, loader: "style-loader!css-loader!sass-loader"},
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-object-rest-spread', 'transform-regenerator']
                }
            },
            {test: /\.json$/, loader: "json-loader"},
        ]
    },
    node : { fs : "empty"}
};