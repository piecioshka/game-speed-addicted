module.exports = {
    resolve: {
        extensions: ['.scss', '.es6.js', '.js', '']
    },

    entry: __dirname + '/app/scripts/main.es6.js',

    output: {
        path: __dirname + '/app/dist/',
        filename: 'bundle.js'
    },

    // http://webpack.github.io/docs/configuration.html#devtool
    // devtool: "#cheap-module-source-map",

    module: {
        loaders: [
            {
                test: /\.es6.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: "style!css!sass"
            },
            {
                test: /\.(htm|html)$/,
                exclude: /node_modules/,
                loader: 'raw-loader'
            }
        ]
    }
};
