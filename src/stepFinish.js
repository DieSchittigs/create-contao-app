const exec = require("./exec");

module.exports = async function (answers) {
    await exec("npm", ["run", "production"]);
    await exec("vendor/bin/contao-console", ["contao:symlinks"]);
    await exec("npm", ["run"]);
};
