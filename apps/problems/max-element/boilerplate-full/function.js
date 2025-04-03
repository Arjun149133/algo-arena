##USER_CODE_HERE##
const input = require("fs")
    .readFileSync("/dev/stdin", "utf8")
    .trim()
    .split("\n");
const n = parseInt(input.shift());
const arr = input.shift().split(" ").map(Number);

console.log(findMaxElement(n, arr));