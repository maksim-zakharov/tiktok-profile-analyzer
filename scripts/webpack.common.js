const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        content: path.resolve(__dirname, "../src/pages/Content.js"),
        popup: path.resolve(__dirname, "../src/pages/Popup/index.tsx")
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            '@services': path.resolve(__dirname, "../src/services")
        }
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
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
            template: 'src/pages/Popup/popup.html',
            chunks: ['popup']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'manifest.json', to: '[name].[ext]' },
                { from: 'src/assets/*.png', to: 'assets/[name].[ext]' },
                { from: 'src/styles.css', to: '[name].[ext]' },
                { from: 'src/pages/Background/*', to: '[name].[ext]' },
                { from: 'src/_locales', to: '_locales' },
            ]
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "style.css"
        })
    ]
}
