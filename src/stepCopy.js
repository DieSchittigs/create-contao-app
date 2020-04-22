const fs = require("fs").promises;
const path = require("path");
const copy = require("recursive-copy");
const printLn = require("./printLn");

const templateDirs = ["src", "files", "web", "templates"];

async function mkdir(dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
        printLn.log("Created dir", dir);
    } catch (e) {}
}

module.exports = async function(answers) {
    if (answers.deploy) {
        await fs.copyFile(
            path.join(__dirname, "../template/dploy.yml"),
            "./dploy.yml"
        );
    }
    if (answers.localDev.indexOf("enableDebug") >= 0) {
        await fs.copyFile(path.join(__dirname, "../template/.env"), "./.env");
        await fs.appendFile("./.gitignore", ".env\n");
    }
    if (answers.localDev.indexOf("prependLocale") >= 0) {
        await mkdir("app");
        await copy(path.join(__dirname, "../template/app"), "./app");
    }

    if (answers.webpack) {
        await fs.copyFile(
            path.join(__dirname, "../template/webpack.config.js"),
            "./webpack.config.js"
        );
        for (const dir of templateDirs) {
            await mkdir(dir);
            await copy(path.join(__dirname, `../template/${dir}`), `./${dir}`, {
                dot: true
            });
        }
    }
};
