const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const config = {
    entry: [
        './src/app/App.js'
    ],
    output: {
        filename: 'index_bundle.js',
        path: __dirname + '/../assets'
    },
    module: {
        rules: [
            {test: /\.js$/, include: __dirname + '/src', loader: 'babel-loader'},
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.(woff|woff2)$/, loader: 'url', options: {prefix: "font", limit: 5000}},
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url',
                options: {
                    limit: 10000,
                    mimetype: "application/octet-stream"
                }
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url', options: {
                    limit: 10000,
                    mimetype: "image/svg+xml"
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'SmbWebAdmin',
            template: 'src/index.ejs'
        })
    ]
};

if (process.env.DEBUG) {
    config.devtool = 'eval-source-map';
} else {
    config.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }));
}

module.exports = config;
