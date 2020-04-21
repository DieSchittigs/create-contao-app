const chalk = require("chalk");

function print(...args) {
    console.log(...args);
}

module.exports = {
    err: (...args) => print(chalk.bgRed(" ERR "), ...args),
    wrn: (...args) => print(chalk.bgYellow(" WRN "), ...args),
    nfo: (...args) => print(chalk.bgCyan(" NFO "), ...args),
    log: (...args) => print(chalk.bgGray(" LOG "), ...args),
};
