const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'regap.js'
    },
    resolve: {
        root: [
            path.join(__dirname, 'node_modules')
        ],
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel'
            }
        ]
    }
};
