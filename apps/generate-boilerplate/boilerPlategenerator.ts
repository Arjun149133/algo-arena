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
  let returnType = "void";
  let functionName = "";
  let params: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith("Function Name:")) {
      functionName = line.split(":")[1].trim();
    }

    if (line.startsWith("Input Field:")) {
      const inputField = line.split(":")[1].trim();
      const [type, name] = inputField.split(" ");

      let cppType = "auto";
      if (type === "int") cppType = "int";
      else if (type === "string") cppType = "string";
      else if (type === "boolean") cppType = "bool";
      else if (type === "array[number]") cppType = "vector<int>";
      else if (type === "array[string]") cppType = "vector<string>";
      else if (type === "array[boolean") cppType = "vector<bool>";
      else if (type === "array[array[number]") cppType = "vector<vector<int>>";
      else if (type === "array[array[string]")
        cppType = "vector<vector<string>>";
      else if (type === "array[array[array[number]")
        cppType = "vector<vector<vector<int>>>";
      else if (type === "array[array[array[string]")
        cppType = "vector<vector<vector<string>>>";

      params.push(`${cppType} ${name}`);
    }

    if (line.startsWith("Output Field:")) {
      const outputField = line.split(":")[1].trim();
      const [type, name] = outputField.split(" ");

      if (type === "int") returnType = "int";
      else if (type === "string") returnType = "string";
      else if (type === "boolean") returnType = "bool";
      else if (type === "array[number]") returnType = "vector<int>";
      else if (type === "array[string]") returnType = "vector<string>";
      else if (type === "array[boolean") returnType = "vector<bool>";
      else if (type === "array[array[number]")
        returnType = "vector<vector<int>>";
      else if (type === "array[array[string]")
        returnType = "vector<vector<string>>";
      else if (type === "array[array[array[number]")
        returnType = "vector<vector<vector<int>>>";
      else if (type === "array[array[array[string]")
        returnType = "vector<vector<vector<string>>>";

      boilerplate += `${returnType} ${functionName}(${params.join(", ")}) {\n  // return ${name};\n}`;
    }
  });

  return boilerplate;
};

export const getBoilerPlateFullForCpp = (structure: string) => {
  let boilerplate = `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\n##USER_CODE_HERE##\n\nint main() {\n`;

  const lines = structure.split("\n");

  let functionName = "";
  let params = "";
  const declaredVars = new Set<string>();

  lines.forEach((line) => {
    if (line.startsWith("Input Field:")) {
      const inputField = line.split(":")[1].trim();
      const [type, input] = inputField.split(" ");
      params += `${input}, `;
      declaredVars.add(input);

      if (type === "int") {
        boilerplate += `  int ${input}; cin >> ${input};\n`;
      } else if (type === "string") {
        boilerplate += `  string ${input}; cin >> ${input};\n`;
      } else if (type === "boolean") {
        boilerplate += `  string ${input}_str; cin >> ${input}_str;\n  bool ${input} = ${input}_str == "true";\n`;
      } else if (type === "array[number]") {
        // Try to find existing declared int to use as array size
        const sizeVar = [...declaredVars].find(
          (v) => v === "n" || v === `n_${input}`
        );
        if (sizeVar) {
          boilerplate += `  vector<int> ${input}(${sizeVar});\n  for (int i = 0; i < ${sizeVar}; ++i) cin >> ${input}[i];\n`;
        } else {
          const lenVar = `n_${input}`;
          boilerplate += `  int ${lenVar}; cin >> ${lenVar};\n  vector<int> ${input}(${lenVar});\n  for (int i = 0; i < ${lenVar}; ++i) cin >> ${input}[i];\n`;
        }
      } else if (type === "array[string]") {
        const sizeVar = [...declaredVars].find(
          (v) => v === "n" || v === `n_${input}`
        );
        if (sizeVar) {
          boilerplate += `  vector<string> ${input}(${sizeVar});\n  for (int i = 0; i < ${sizeVar}; ++i) cin >> ${input}[i];\n`;
        } else {
          const lenVar = `n_${input}`;
          boilerplate += `  int ${lenVar}; cin >> ${lenVar};\n  vector<string> ${input}(${lenVar});\n  for (int i = 0; i < ${lenVar}; ++i) cin >> ${input}[i];\n`;
        }
      } else if (type === "array[boolean") {
        const sizeVar = [...declaredVars].find(
          (v) => v === "n" || v === `n_${input}`
        );
        if (sizeVar) {
          boilerplate += `  vector<bool> ${input}(${sizeVar});\n  for (int i = 0; i < ${sizeVar}; ++i) {\n    string temp; cin >> temp;\n    ${input}[i] = temp == "true";\n  }\n`;
        } else {
          const lenVar = `n_${input}`;
          boilerplate += `  int ${lenVar}; cin >> ${lenVar};\n  vector<bool> ${input}(${lenVar});\n  for (int i = 0; i < ${lenVar}; ++i) {\n    string temp; cin >> temp;\n    ${input}[i] = temp == "true";\n  }\n`;
        }
      } else if (type === "array[array[number]") {
        boilerplate += `  int rows_${input}, cols_${input}; cin >> rows_${input} >> cols_${input};\n`;
        boilerplate += `  vector<vector<int>> ${input}(rows_${input}, vector<int>(cols_${input}));\n`;
        boilerplate += `  for (int i = 0; i < rows_${input}; ++i)\n    for (int j = 0; j < cols_${input}; ++j) cin >> ${input}[i][j];\n`;
      } else if (type === "array[array[string]") {
        boilerplate += `  int rows_${input}, cols_${input}; cin >> rows_${input} >> cols_${input};\n`;
        boilerplate += `  vector<vector<string>> ${input}(rows_${input}, vector<string>(cols_${input}));\n`;
        boilerplate += `  for (int i = 0; i < rows_${input}; ++i)\n    for (int j = 0; j < cols_${input}; ++j) cin >> ${input}[i][j];\n`;
      } else if (type === "array[array[array[number]") {
        boilerplate += `  int d1, d2, d3; cin >> d1 >> d2 >> d3;\n`;
        boilerplate += `  vector<vector<vector<int>>> ${input}(d1, vector<vector<int>>(d2, vector<int>(d3)));\n`;
        boilerplate += `  for (int i = 0; i < d1; ++i)\n    for (int j = 0; j < d2; ++j)\n      for (int k = 0; k < d3; ++k) cin >> ${input}[i][j][k];\n`;
      } else if (type === "array[array[array[string]") {
        boilerplate += `  int d1, d2, d3; cin >> d1 >> d2 >> d3;\n`;
        boilerplate += `  vector<vector<vector<string>>> ${input}(d1, vector<vector<string>>(d2, vector<string>(d3)));\n`;
        boilerplate += `  for (int i = 0; i < d1; ++i)\n    for (int j = 0; j < d2; ++j)\n      for (int k = 0; k < d3; ++k) cin >> ${input}[i][j][k];\n`;
      }
    }

    if (line.startsWith("Function Name:")) {
      functionName = line.split(":")[1].trim();
    }
  });

  boilerplate += `\n  cout << ${functionName}(${params.slice(0, -2)});\n  return 0;\n}`;
  return boilerplate;
};

// const typesForCpp = (type: string) => {
//   if (type === "int") {
//     return "int";
//   } else if (type === "string") {
//     return "string";
//   } else if (type === "array[number]") {
//     return "vector<int>";
//   } else if (type === "array[string]") {
//     return "vector<string>";
//   } else if (type === "array[boolean") {
//     return "vector<bool>";
//   } else if (type === "array[array[number]") {
//     return "vector<vector<int>>";
//   } else if (type === "array[array[string]") {
//     return "vector<vector<string>>";
//   } else if (type === "array[array[array[number]") {
//     return "vector<vector<vector<int>>>";
//   } else if (type === "array[array[array[string]") {
//     return "vector<vector<vector<string>>>";
//   } else if (type === "boolean") {
//     return "bool";
//   }
// };
