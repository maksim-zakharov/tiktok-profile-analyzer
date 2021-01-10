const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        content: path.resolve(__dirname, "./src/content/content.js"),
        popup: path.resolve(__dirname, "./src/index-popup.tsx"),
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', {
                        loader: "less-loader",
                        options: {
                            lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
                                javascriptEnabled: true,
                            },
                        },
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                {
                                    'plugins': ['@babel/plugin-proposal-class-properties']
                                }
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: 'src/popup.html',
            chunks: ['popup']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: '[name].[ext]' },
                { from: 'src/images/*.png', to: 'images/[name].[ext]' },
                { from: 'src/content/styles.css', to: 'content/[name].[ext]' },
                { from: 'src/background/*', to: '[name].[ext]' },
                // TODO Переделать на мультипапочность
                { from: 'src/_locales/en/*', to: '_locales/en/[name].[ext]' },
                { from: 'src/_locales/ru/*', to: '_locales/ru/[name].[ext]' }
            ]
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin()
    ]
}
