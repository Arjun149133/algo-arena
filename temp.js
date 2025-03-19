const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter two numbers separated by space: ", (answer) => {
  const [a, b] = answer.split(" ").map(Number);
  console.log(findSum(a, b));
  rl.close();
});
