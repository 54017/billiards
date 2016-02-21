module.exports = {
    entry: "./js/index.js",
    output: {
        path: __dirname + "/js",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit=8192' },
        ]
    }
};