const spawn = require("child_process").spawn;
const printLn = require("./printLn");

module.exports = async function exec(command, args) {
    printLn.log("Executing", command, args.join(" "));
    return new Promise((resolve, reject) => {
        const child = spawn(command, args);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", function (data) {
            printLn.log(data);
        });
        child.stderr.setEncoding("utf8");
        child.stderr.on("data", function (data) {
            printLn.log(data);
        });
        child.on("close", function (code) {
            code == 0 ? resolve(code) : reject(code);
        });
    });
};
