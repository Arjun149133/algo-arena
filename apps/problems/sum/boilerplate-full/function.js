##USER_CODE_HERE##

const input = require("fs")
  .readFileSync("/dev/stdin", "utf8")
  .trim()
  .split(" ");
const a = parseInt(input.shift());
const b = parseInt(input.shift());
console.log(findSum(a, b));
