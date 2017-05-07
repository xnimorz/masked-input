var path = require('path');

module.exports = {
    entry: './examples/index.js',
    output: {
        path: __dirname + '/examples/',
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules|vendor/,
                loader: 'babel-loader'
            },
        ]
    }
};
