const spawn = require("child_process").spawn;
const chalk = require("chalk");

module.exports = async function exec(command, args) {
    console.log("Executing", command, args.join(" "));
    return new Promise((resolve, reject) => {
        const child = spawn(command, args);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function (data) {
            console.log(chalk.dim(data));
        });
        child.stderr.setEncoding("utf8");
        child.stderr.on("data", function (data) {
            console.warn(chalk.yellow(data));
        });
        child.on("close", function (code) {
            code == 0 ? resolve(code) : reject(code);
        });
    });
};
