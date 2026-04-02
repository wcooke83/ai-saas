const fs = require("fs");
const file = process.argv[2] || "server.log";
const out = fs.createWriteStream(file);
process.stdin.pipe(out);
process.stdin.pipe(process.stdout);
