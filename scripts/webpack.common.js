const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        background: path.resolve(__dirname, "../src/pages/Background/background.service.ts"),
        content: path.resolve(__dirname, "../src/pages/Content.jsx"),
        popup: path.resolve(__dirname, "../src/pages/Popup/index.tsx")
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.jsx' ],
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
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
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
        new HtmlWebpackPlugin({
            filename: 'background.html',
            template: 'src/pages/Background/background.html',
            chunks: ['background']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'manifest.json', to: '[name].[ext]' },
                { from: 'src/assets/*.png', to: 'assets/[name].[ext]' },
                { from: 'src/styles.css', to: '[name].[ext]' },
                // { from: 'src/pages/Background/*', to: '[name].[ext]' },
                { from: 'src/_locales', to: '_locales' },
            ]
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "style.css"
        })
    ]
}
