const fs = require("fs");
const path = require("path");
const mix = require("laravel-mix");

mix.setPublicPath("files");
mix.setResourceRoot("/files/dist");
mix.webpackConfig({
    output: {
        publicPath: "/files/dist/",
        path: path.join(__dirname, "./files/dist"),
        chunkFilename: "js/chunks/[name].[hash].js",
    },
    resolve: {
        alias: {
            "~": path.join(__dirname, "/src"),
            "@": path.join(__dirname, "/src/js"),
        },
    },
});

mix.js("src/js/app.js", "js");
/**
 * Replace this line with
 * mix.react("src/js/app.js", "js");
 * if you are using React.js
 */

mix.sass("src/scss/app.scss", "css");
