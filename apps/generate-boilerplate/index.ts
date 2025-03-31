import fs from "fs";
import {
  getBoilerPlateForCpp,
  getBoilerPlateForJs,
  getBoilerPlateForPy,
  getBoilerPlateFullForCpp,
  getBoilerPlateFullForJs,
  getBoilerPlateFullForPy,
} from "./boilerPlategenerator";

const main = async () => {
  const args = process.argv.slice(2);

  const [problem] = args;

  const path = `/home/arjun/advProjects/algo-arena/apps/problems/${problem}`;

  const file = await getFiles(path);

  console.log(file);

  const boilerplateJs = getBoilerPlateForJs(file);
  const boilerplateFullJs = getBoilerPlateFullForJs(file);
  const boilerPlatePy = getBoilerPlateForPy(file);
  const boilerplateFullPy = getBoilerPlateFullForPy(file);
  const boilerplateCpp = getBoilerPlateForCpp(file);
  const boilerplateFullCpp = getBoilerPlateFullForCpp(file);

  fs.mkdir(`${path}/boilerplate`, (err) => {
    if (err) {
      console.log(err);
    }
  });
  fs.mkdir(`${path}/boilerplate-full`, (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.writeFile(`${path}/boilerplate/function.js`, boilerplateJs, (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.writeFile(
    `${path}/boilerplate-full/function.js`,
    boilerplateFullJs,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  fs.writeFile(`${path}/boilerplate/function.py`, boilerPlatePy, (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.writeFile(
    `${path}/boilerplate-full/function.py`,
    boilerplateFullPy,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  fs.writeFile(`${path}/boilerplate/function.cpp`, boilerplateCpp, (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.writeFile(
    `${path}/boilerplate-full/function.cpp`,
    boilerplateFullCpp,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

const getFiles = async (path: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      const structureFile = files.find((file) => file === "Structure.md");
      if (!structureFile) {
        reject("Structure.md not found");
      }

      await new Promise<string>((resolve, reject) => {
        fs.readFile(`${path}/${structureFile}`, "utf-8", (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  });
};

main();
