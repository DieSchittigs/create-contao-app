const spawn = require("child_process").spawn;
const readline = require("readline");
const printLn = require("./printLn");

module.exports = async function exec(command, args) {
    printLn.nfo("🏃", command, args.join(" "));
    return new Promise((resolve, reject) => {
        const child = spawn(command, args);
        child.stdout.setEncoding("utf8");
        const stdout = readline.createInterface({ input: child.stdout });
        stdout.on("line", (line) => printLn.log(line));
        child.stderr.setEncoding("utf8");
        const stderr = readline.createInterface({ input: child.stderr });
        stderr.on("line", (line) => printLn.log(line));
        child.on("close", function (code) {
            code == 0 ? resolve(code) : reject(code);
        });
    });
};
