const path = require("path");

module.exports = {
    entry: ["babel-polyfill", path.join(__dirname, "main.js")],
    devtool: 'source-map',
    output: {
        path: __dirname,
        filename: "walrus.js"
    },
    module: {
        rules: [
            {test: /\.scss$/, loader: "style-loader!css-loader!sass-loader"},
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['react', 'es2015'],
                            plugins: ['transform-object-rest-spread', 'transform-regenerator']
                        }
                    },
                    { loader: 'eslint-loader'},
                ],
                exclude: /node_modules/,
            },
            {test: /\.json$/, loader: "json-loader"},
        ]
    },
    node: { fs: "empty"}
};
