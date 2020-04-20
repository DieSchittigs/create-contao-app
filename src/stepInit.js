const fs = require("fs").promises;
const chalk = require("chalk");

module.exports = async function (dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (e) {
    } finally {
        try {
            await fs.access(dir);
        } catch {
            console.error(chalk.red(`Could not access directory ${dir}.`));
            return false;
        }
    }
    const filesInDir = await fs.readdir(dir);
    if (filesInDir.length) {
        console.error(chalk.red(`There are files in ${dir}, aborting.`));
        return false;
    }
    process.chdir(dir);
    return true;
};
