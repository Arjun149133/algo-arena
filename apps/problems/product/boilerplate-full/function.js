##USER_CODE_HERE##
const input = require("fs")
    .readFileSync("/dev/stdin", "utf8")
    .trim()
    .split("\n");
const a = parseInt(input.shift());
const b = parseInt(input.shift());

console.log(findProduct(a, b));