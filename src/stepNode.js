const fs = require("fs").promises;
const path = require("path");
const npmScripts = require(path.join(__dirname, "../template/package.json"))
    .scripts;
const exec = require("./exec");

const devNpmModules = [
    "stmux",
    "cross-env",
    "laravel-mix",
    "resolve-url-loader",
    "sass",
    "sass-loader",
    "vue-template-compiler"
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
    const devModules = [];
    if (devServer) devModules.push("@dieschittigs/contao-dev-server");
    if (answers.deploy) devModules.push("dploy");
    if (answers.webpack) {
        devModules.push(...devNpmModules);
        await exec("npm", ["i", ...answers.jsPackages]);
    }
    if (devModules.length)
        await exec("npm", ["i", ...devModules, "--save-dev"]);
};
