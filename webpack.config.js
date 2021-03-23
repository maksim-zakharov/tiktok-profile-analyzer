var webpack = require('webpack'),
    path = require('path'),
    fileSystem = require('fs-extra'),
    env = require('./utils/env'),
    {CleanWebpackPlugin} = require('clean-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

var alias = {
    'react-dom': '@hot-loader/react-dom',
    '@services': path.resolve(__dirname, "src/services")
};

var fileExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'eot',
    'otf',
    'svg',
    'ttf',
    'woff',
    'woff2',
];

const buildDir = process.env.NODE_ENV !== 'development' ? 'build' : 'dev-build';

var options = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        content: path.resolve(__dirname, "src", "pages/Content.js"),
        popup: path.resolve(__dirname, "src","index-popup.tsx"),
        background: path.resolve(__dirname, "src", "background/tracker.ts"),
        options: path.resolve(__dirname, "src", "index-options.tsx"),
    },
    chromeExtensionBoilerplate: {
        // notHotReload: ['content', 'devtools'],
        notHotReload: [],
    },
    resolve: {
        alias: alias,
        extensions: fileExtensions
            .map((extension) => '.' + extension)
            .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
    },
    output: {
        path: path.resolve(__dirname, buildDir),
        filename: '[name].js',
        publicPath: ASSET_PATH,
    },
    module: {
        rules: [
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
                test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/,
            },
            {test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/},
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'source-map-loader',
                    },
                    {
                        loader: 'babel-loader',
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        // clean the build folder
        new CleanWebpackPlugin({
            verbose: true,
            cleanStaleWebpackAssets: true,
        }),
        // expose and write the allowed env vars on the compiled bundle
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'manifest.json', to: '[name].[ext]' },
                { from: 'src/images/*.png', to: 'images/[name].[ext]' },
                { from: 'src/content/styles.css', to: 'content/[name].[ext]' },
                { from: 'src/_locales', to: '_locales' },
            ]
        }),
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: path.join(__dirname, 'src/popup.html'),
            chunks: ['popup']
        }),
        new HtmlWebpackPlugin({
            filename: 'background.html',
            template: path.join(__dirname, 'src/background/background.html'),
            chunks: ['background']
        }),
        new HtmlWebpackPlugin({
            filename: 'options.html',
            template: path.join(__dirname, 'src/options.html'),
            chunks: ['options']
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin()
    ],
    infrastructureLogging: {
        level: 'info',
    },
}

if (env.NODE_ENV === 'development') {
    options.devtool = 'cheap-module-source-map';
} else {
    options.optimization = {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
    };
}

module.exports = options;
