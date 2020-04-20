const fs = require("fs").promises;
const path = require("path");
const npmScripts = require(path.join(__dirname, "../template/package.json"))
    .scripts;
const copy = require("recursive-copy");
const exec = require("./exec");
const chalk = require("chalk");

const devNpmModules = [
    "stmux",
    "webpack",
    "webpack-cli",
    "@babel/core",
    "@babel/preset-env",
    "css-loader",
    "babel-loader",
    "file-loader",
    "mini-css-extract-plugin",
    "sass-loader",
    "style-loader",
    "node-sass",
];

module.exports = async function (answers) {
    const devServer = answers.localDev.indexOf("contaoDevServer") >= 0;
    const scripts = {};
    for (const key in npmScripts) {
        if (npmScripts[key].indexOf("contao-dev-server") >= 0) {
            if (devServer) scripts[key] = npmScripts[key];
        } else if (npmScripts[key].indexOf("deploy") >= 0) {
            if (answers.deploy) scripts[key] = npmScripts[key];
        } else if (npmScripts[key].indexOf("webpack") >= 0) {
            if (answers.webpack) scripts[key] = npmScripts[key];
        } else {
            scripts[key] = npmScripts[key];
        }
    }
    await fs.writeFile("package.json", JSON.stringify({ scripts }, null, 2));
    if (devServer) {
        await exec("npm", [
            "i",
            "@dieschittigs/contao-dev-server",
            "--save-dev",
        ]);
    }
    if (answers.deploy) {
        await fs.copyFile(
            path.join(__dirname, "../template/dploy.yml"),
            "./dploy.yml"
        );
        await exec("npm", ["i", "dploy", "--save-dev"]);
    }
    if (answers.webpack) {
        await exec("npm", ["i", ...devNpmModules, "--save-dev"]);
        await exec("npm", ["i", ...answers.jsPackages]);
        await fs.copyFile(
            path.join(__dirname, "../template/webpack.config.js"),
            "./webpack.config.js"
        );
        try {
            await fs.mkdir("src");
            await copy(path.join(__dirname, "../template/src"), "./src", {
                dot: true,
            });
            await copy(path.join(__dirname, "../template/files"), "./files", {
                dot: true,
            });
        } catch (e) {}
    }
};
