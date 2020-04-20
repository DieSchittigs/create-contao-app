const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        main: "./src/scss/main.scss",
        js: "./src/js/app.js",
    },
    output: {
        path: path.resolve(__dirname, "../files/dist"),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};
