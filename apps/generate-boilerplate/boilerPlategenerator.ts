export const getBoilerPlateForJs = (structure: string) => {
  const lines = structure.split("\n");

  let boilerplate = "";

  lines.forEach((line) => {
    if (line.startsWith("Function Name:")) {
      const functionName = line.split(":")[1].trim();
      boilerplate += `function ${functionName} (`;
    }

    if (line.startsWith("Input Field:")) {
      const inputField = line.split(":")[1].trim();
      let input = inputField.split(" ")[1];
      if (boilerplate.endsWith("(")) {
        boilerplate += `${input}`;
      } else {
        boilerplate += `, ${input}`;
      }
    }

    if (line.startsWith("Output Structure:")) {
      boilerplate += ") {\n";
    }

    if (line.startsWith("Output Field:")) {
      const outputField = line.split(":")[1].trim();
      let output = outputField.split(" ")[1];
      boilerplate += `  // return ${output};\n}`;
    }
  });

  return boilerplate;
};

export const getBoilerPlateFullForJs = (structure: string) => {
  let boilerplate = `##USER_CODE_HERE##\n`;

  const lines = structure.split("\n");

  boilerplate += `const input = require("fs")
    .readFileSync("/dev/stdin", "utf8")
    .trim()
    .split("\\n");\n`;

  let functionName = "";
  let params = "";

  lines.forEach((line) => {
    if (line.startsWith("Input Field:")) {
      const inputField = line.split(":");

      const type = inputField[1].trim().split(" ")[0];
      const input = inputField[1].trim().split(" ")[1];

      params += `${input}, `;

      if (type === "int") {
        boilerplate += `const ${input} = parseInt(input.shift());\n`;
      } else if (type === "string") {
        boilerplate += `const ${input} = input.shift();\n`;
      } else if (type === "array[number]") {
        boilerplate += `const ${input} = input.shift().split(" ").map(Number);\n`;
      } else if (type === "array[string]") {
        boilerplate += `const ${input} = input.shift().split(" ");\n`;
      } else if (type === "array[boolean") {
        boilerplate += `const ${input} = input.shift().split(" ").map((el) => el === "true");\n`;
      } else if (type === "array[array[number]") {
        boilerplate += `const ${input} = input.shift().map((el) => el.split(" ").map(Number));\n`;
      } else if (type === "array[array[string]") {
        boilerplate += `const ${input} = input.shift().map((el) => el.split(" "));\n`;
      } else if (type === "array[array[array[number]") {
        boilerplate += `const ${input} = input.shift().map((el) => el.map((el) => el.split(" ").map(Number)));\n`;
      } else if (type === "array[array[array[string]") {
        boilerplate += `const ${input} = input.shift().map((el) => el.map((el) => el.split(" ")));\n`;
      } else if (type === "boolean") {
        boilerplate += `const ${input} = input.shift() === "true";\n`;
      }
    }

    if (line.startsWith("Function Name:")) {
      functionName += line.split(":")[1].trim();
    }
  });

  boilerplate += `\nconsole.log(${functionName}(${params.slice(0, -2)}));`;

  return boilerplate;
};

export const getBoilerPlateForPy = (structure: string) => {
  const lines = structure.split("\n");

  let boilerplate = "";

  lines.forEach((line) => {
    if (line.startsWith("Function Name:")) {
      const functionName = line.split(":")[1].trim();
      boilerplate += `def ${functionName}(`;
    }

    if (line.startsWith("Input Field:")) {
      const inputField = line.split(":")[1].trim();
      let input = inputField.split(" ")[1];
      if (boilerplate.endsWith("(")) {
        boilerplate += `${input}`;
      } else {
        boilerplate += `, ${input}`;
      }
    }

    if (line.startsWith("Output Structure:")) {
      boilerplate += "):\n";
    }

    if (line.startsWith("Output Field:")) {
      const outputField = line.split(":")[1].trim();
      let output = outputField.split(" ")[1];
      boilerplate += `  # return ${output}\n`;
    }
  });

  return boilerplate;
};

export const getBoilerPlateFullForPy = (structure: string) => {
  let boilerplate = `import sys\n\n`;

  boilerplate += `##USER_CODE_HERE##\n\n`;

  boilerplate += `input = sys.stdin.read().strip().split("\\n")\n`;

  const lines = structure.split("\n");

  let functionName = "";
  let params = "";

  lines.forEach((line) => {
    if (line.startsWith("Input Field:")) {
      const inputField = line.split(":");

      const type = inputField[1].trim().split(" ")[0];
      const input = inputField[1].trim().split(" ")[1];

      params += `${input}, `;

      if (type === "int") {
        boilerplate += `${input} = int(input.pop(0))\n`;
      } else if (type === "string") {
        boilerplate += `${input} = input.pop(0)\n`;
      } else if (type === "array[number]") {
        boilerplate += `${input} = list(map(int, input.pop(0).split()))\n`;
      } else if (type === "array[string]") {
        boilerplate += `${input} = input.pop(0).split()\n`;
      } else if (type === "array[boolean") {
        boilerplate += `${input} = list(map(lambda x: x == "true", input.pop(0).split()))\n`;
      } else if (type === "array[array[number]") {
        boilerplate += `${input} = [list(map(int, x.split())) for x in input.pop(0)]\n`;
      } else if (type === "array[array[string]") {
        boilerplate += `${input} = [x.split() for x in input.pop(0)]\n`;
      } else if (type === "array[array[array[number]") {
        boilerplate += `${input} = [[list(map(int, x.split())) for x in y] for y in input.pop(0)]\n`;
      } else if (type === "array[array[array[string]") {
        boilerplate += `${input} = [[x.split() for x in y] for y in input.pop(0)]\n`;
      } else if (type === "boolean") {
        boilerplate += `${input} = input.pop(0) == "true"\n`;
      }
    }

    if (line.startsWith("Function Name:")) {
      functionName += line.split(":")[1].trim();
    }
  });

  boilerplate += `\nprint(${functionName}(${params.slice(0, -2)}))`;

  return boilerplate;
};

export const getBoilerPlateForCpp = (structure: string) => {
  const lines = structure.split("\n");

  let boilerplate = "";

  let returnType = "";

  lines.forEach((line) => {
    if (line.startsWith("Function Name:")) {
      const functionName = line.split(":")[1].trim();
      boilerplate += `${functionName}(`;
    }

    if (line.startsWith("Input Field:")) {
      const inputField = line.split(":")[1].trim();
      const type = inputField.split(" ")[0];
      const input = inputField.split(" ")[1];
      if (boilerplate.endsWith("(")) {
        boilerplate += `${typesForCpp(type)} ${input}`;
      } else {
        boilerplate += `, ${typesForCpp(type)} ${input}`;
      }
    }

    if (line.startsWith("Output Structure:")) {
      boilerplate += ")\n{\n";
    }

    if (line.startsWith("Output Field:")) {
      const outputField = line.split(":")[1].trim();
      returnType += outputField.split(" ")[0];
      let output = outputField.split(" ")[1];
      boilerplate += `  // return ${output}\n}\n`;
    }
  });

  return typesForCpp(returnType) + " " + boilerplate;
};

export const getBoilerPlateFullForCpp = (structure: string) => {
  let boilerplate = `#include <iostream>\n#include <string>\n#include <vector>\n\n`;

  boilerplate += `##USER_CODE_HERE##\n\n`;

  boilerplate += `int main() {\n`;

  boilerplate += `std::string line;\nstd::vector<std::string> input;\nwhile (std::getline(std::cin, line)) {\n  input.push_back(line);\n}\n`;

  const lines = structure.split("\n");

  let functionName = "";
  let params = "";

  let ind = -1;
  lines.forEach((line) => {
    if (line.startsWith("Input Field:")) {
      ind += 1;
      const inputField = line.split(":");

      const type = inputField[1].trim().split(" ")[0];
      const input = inputField[1].trim().split(" ")[1];

      params += `${input}, `;

      if (type === "int") {
        boilerplate += `int ${input} = std::stoi(input[${ind}]);\n`;
      } else if (type === "string") {
        boilerplate += `std::string ${input} = input[${ind}];\n`;
      } else if (type === "array[number]") {
        boilerplate += `std::vector<int> ${input};\nstd::string temp;\nstd::stringstream ss(input[${ind}]);\nwhile (ss >> temp) ${input}.push_back(std::stoi(temp));\n`;
      } else if (type === "array[string]") {
        boilerplate += `std::vector<std::string> ${input};\nstd::string temp;\nstd::stringstream ss(input[${ind}]);\nwhile (ss >> temp) ${input}.push_back(temp);\n`;
      } else if (type === "array[boolean") {
        boilerplate += `std::vector<bool> ${input};\nstd::string temp;\nstd::stringstream ss(input[${ind}]);\nwhile (ss >> temp) ${input}.push_back(temp == "true");\n`;
      } else if (type === "array[array[number]") {
        boilerplate += `std::vector<std::vector<int>> ${input};\nstd::vector<int> temp;\nstd::string temp2;\nstd::stringstream ss(input[${ind}]);\nwhile (std::getline(ss, temp2, ' ')) temp.push_back(std::stoi(temp2));\n${input}.push_back(temp);\n`;
      } else if (type === "array[array[string]") {
        boilerplate += `std::vector<std::vector<std::string>> ${input};\nstd::vector<std::string> temp;\nstd::string temp2;\nstd::stringstream ss(input[${ind}]);\nwhile (std::getline(ss, temp2, ' ')) temp.push_back(temp2);\n${input}.push_back(temp);\n`;
      } else if (type === "array[array[array[number]") {
        boilerplate += `std::vector<std::vector<std::vector<int>>> ${input};\nstd::vector<std::vector<int>> temp;\nstd::vector<int> temp2;\nstd::string temp3;\nstd::stringstream ss(input[${ind}]);\nwhile (std::getline(ss, temp3, ' ')) temp2.push_back(std::stoi(temp3));\nwhile (std::getline(ss, temp3, ' ')) temp.push_back(temp2);\n${input}.push_back(temp);\n`;
      } else if (type === "array[array[array[string]") {
        boilerplate += `std::vector<std::vector<std::vector<std::string>>> ${input};\nstd::vector<std::vector<std::string>> temp;\nstd::vector<std::string> temp2;\nstd::string temp3;\nstd::stringstream ss(input[${ind}]);\nwhile (std::getline(ss, temp3, ' ')) temp2.push_back(temp3);\nwhile (std::getline(ss, temp3, ' ')) temp.push_back(temp2);\n${input}.push_back(temp);\n`;
      } else if (type === "boolean") {
        boilerplate += `bool ${input} = input[${ind}] == "true";\n`;
      }
    }

    if (line.startsWith("Function Name:")) {
      functionName += line.split(":")[1].trim();
    }
  });

  boilerplate += `\nstd::cout << ${functionName}(${params.slice(0, -2)}) << std::endl;\n  return 0;\n}`;

  return boilerplate;
};

const typesForCpp = (type: string) => {
  if (type === "int") {
    return "int";
  } else if (type === "string") {
    return "string";
  } else if (type === "array[number]") {
    return "vector<int>";
  } else if (type === "array[string]") {
    return "vector<string>";
  } else if (type === "array[boolean") {
    return "vector<bool>";
  } else if (type === "array[array[number]") {
    return "vector<vector<int>>";
  } else if (type === "array[array[string]") {
    return "vector<vector<string>>";
  } else if (type === "array[array[array[number]") {
    return "vector<vector<vector<int>>>";
  } else if (type === "array[array[array[string]") {
    return "vector<vector<vector<string>>>";
  } else if (type === "boolean") {
    return "bool";
  }
};
