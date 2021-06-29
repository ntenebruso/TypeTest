const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
    mode: "development",
    target: "web",
    entry: "./src/main.js",
    devServer: {
        historyApiFallback: true,
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        assetModuleFilename: "images/[hash][ext][query]"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    hotReload: true
                }
            },
            {
                test: /\.css$/,
                use: [
                  'vue-style-loader',
                  'css-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: "asset/resource"
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "TypeTest",
            template: path.join(__dirname, "public", "index.html")
        }),
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
}