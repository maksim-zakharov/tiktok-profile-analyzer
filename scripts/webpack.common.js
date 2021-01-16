const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        background: path.resolve(__dirname, "../src/background/background.ts"),
        // content: path.resolve(__dirname, "./src/content/content.ts"),
        content: path.resolve(__dirname, "../src/views/Content/index.tsx"),
        popup: path.resolve(__dirname, "../src/views/Popup/index.tsx"),
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
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
            template: 'src/views/Popup/popup.html',
            chunks: ['popup']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'manifest.json', to: '[name].[ext]' },
                { from: 'src/assets', to: 'assets' },
                { from: 'src/views/Content/Content.css', to: '[name].[ext]' },
                { from: 'src/_locales', to: '_locales' },
            ]
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin()
    ]
}
