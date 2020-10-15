const fs = require("fs").promises;
const path = require("path");
const copy = require("recursive-copy");
const printLn = require("./printLn");

const templateDirs = ["files/uploads", "web", "templates"];
const webpackDirs = ["src", "files/dist"];

async function mkdir(dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
        printLn.log("Created dir", dir);
    } catch (e) { }
}

module.exports = async function (answers) {
    if (answers.dploy) {
        await fs.copyFile(
            path.join(__dirname, "../template/dploy.yml"),
            "./dploy.yml"
        );
    }
    if (answers.localDev.indexOf("enableDebug") >= 0) {
        await fs.copyFile(path.join(__dirname, "../template/.env"), "./.env");
        await fs.appendFile("./.gitignore", ".env\n");
    }
    await mkdir("config");
    await copy(path.join(__dirname, "../template/config"), "./config");
    if (answers.localDev.indexOf("prependLocale") >= 0)
        await fs.appendFile("./config/config.yml", "  prepend_locale: true\n");

    if (answers.localDev.indexOf("removeSuffix") >= 0)
        await fs.appendFile("./config/config.yml", '  url_suffix: ""\n');

    await mkdir("files");
    for (const dir of templateDirs) {
        await mkdir(dir);
        await copy(path.join(__dirname, `../template/${dir}`), `./${dir}`, {
            dot: true,
        });
    }
    if (answers.webpack) {
        await fs.copyFile(
            path.join(__dirname, "../template/webpack.mix.js"),
            "./webpack.mix.js"
        );
        for (const dir of webpackDirs) {
            await mkdir(dir);
            await copy(path.join(__dirname, `../template/${dir}`), `./${dir}`, {
                dot: true,
            });
        }
    }
};
