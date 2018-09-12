const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: "development",
    entry: {
        index: './app/scripts/app.js',
        embed: './app/scripts/embed/embed.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'app/dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js?/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            outputStyle: 'compressed',
                            sourceMap: true
                        }
                    }
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.js']
    }
}

