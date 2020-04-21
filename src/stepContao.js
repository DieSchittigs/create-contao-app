const fs = require("fs").promises;
const path = require("path");
const tmp = require("tmp-promise");
const copy = require("recursive-copy");
const _ = require("lodash");
const exec = require("./exec");
const chalk = require("chalk");

const contaoCoreBundles = [
    "contao/calendar-bundle",
    "contao/comments-bundle",
    "contao/faq-bundle",
    "contao/news-bundle",
    "contao/newsletter-bundle",
];

module.exports = async function (answers) {
    const tmpDir = await tmp.dir();

    await exec("php", [
        path.join(__dirname, "../scripts/install_composer.php"),
    ]);
    const tmpComposer = path.join(tmpDir.path, "composer.phar");
    await fs.copyFile("composer.phar", tmpComposer);
    await fs.unlink("composer.phar");
    await exec("php", [
        tmpComposer,
        "create-project",
        "contao/managed-edition",
        ".",
        answers.contaoVersion,
    ]);
    await fs.copyFile(tmpComposer, "composer.phar");
    await fs.unlink(tmpComposer);
    let removeCore = _.difference(contaoCoreBundles, answers.contaoCoreBundles);
    await exec("php", ["composer.phar", "remove", ...removeCore]);
    let addCore = answers.contaoCoreBundles.map(
        (item) => `${item}:^${answers.contaoVersion}`
    );
    await exec("php", [
        "composer.phar",
        "require",
        ...addCore,
        ...answers.contaoPluginBundles,
    ]);
    if (answers.localDev.indexOf("contaoManager") >= 0)
        await exec("php", [
            path.join(__dirname, "../scripts/install_contao-manager.php"),
        ]);

    tmpDir.cleanup();
};
