import fs from "fs";
import {
  getBoilerPlateForCpp,
  getBoilerPlateForJs,
  getBoilerPlateForPy,
  getBoilerPlateFullForCpp,
  getBoilerPlateFullForJs,
  getBoilerPlateFullForPy,
} from "./boilerPlategenerator";
import { prisma } from "@repo/db/client";

const main = async () => {
  const args = process.argv.slice(2);

  const [problem] = args;

  const path = `/home/arjun/advProjects/algo-arena/apps/problems/${problem}`;

  const file = await getStructureFile(path);

  if (!file) {
    console.log("File not found");
    return;
  }

  const problemTitle = file.split("\n")[0].split(":")[1].trim();
  const problemDescription = file.split("\n")[1].split(":")[1].trim();
  const problemDifficulty = file.split("\n")[2].split(":")[1].trim();

  const problemInDb = await prisma.problem.findUnique({
    where: {
      title: problemTitle,
    },
  });

  if (problemInDb) {
    console.log("Problem already exists");
    return;
  }

  await prisma.problem.create({
    data: {
      title: problemTitle,
      description: problemDescription,
      difficulty:
        (problemDifficulty.toUpperCase() as "EASY") || "MEDIUM" || "HARD",
      creatorId: "9f9b8b95-c8d6-45d2-b55d-f23840136ada",
      // creatorId: "e309e134-629d-427b-b854-1cccadb05399",
    },
  });

  console.log(file);

  const boilerplateJs = getBoilerPlateForJs(file);
  const boilerplateFullJs = getBoilerPlateFullForJs(file);
  const boilerPlatePy = getBoilerPlateForPy(file);
  const boilerplateFullPy = getBoilerPlateFullForPy(file);
  const boilerplateCpp = getBoilerPlateForCpp(file);
  const boilerplateFullCpp = getBoilerPlateFullForCpp(file);

  await createDirectories(path);

  await createBoilerFiles(
    path,
    boilerplateJs,
    boilerplateFullJs,
    boilerPlatePy,
    boilerplateFullPy,
    boilerplateCpp,
    boilerplateFullCpp
  );

  await prisma.problem.update({
    where: {
      title: problemTitle,
    },
    data: {
      boilerPlate: {
        createMany: {
          data: [
            {
              language: "JAVASCRIPT",
              code: boilerplateJs,
            },
            {
              language: "PYTHON",
              code: boilerPlatePy,
            },
            {
              language: "CPP",
              code: boilerplateCpp,
            },
          ],
        },
      },
    },
  });
};

const createDirectories = async (path: string): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await Promise.all([
        new Promise<void>((resolve, reject) => {
          fs.mkdir(`${path}/boilerplate`, { recursive: true }, (err) => {
            if (err) {
              console.error("Error creating boilerplate directory:", err);
              reject(err);
            }
            resolve();
          });
        }),
        new Promise<void>((resolve, reject) => {
          fs.mkdir(`${path}/boilerplate-full`, { recursive: true }, (err) => {
            if (err) {
              console.error("Error creating boilerplate-full directory:", err);
              reject(err);
            }
            resolve();
          });
        }),
      ]);

      resolve();
    } catch (error) {
      console.error("Error creating directories:", error);
      reject(error);
    }
  });
};

const createBoilerFiles = async (
  path: string,
  boilerplateJs: string,
  boilerplateFullJs: string,
  boilerPlatePy: string,
  boilerplateFullPy: string,
  boilerplateCpp: string,
  boilerplateFullCpp: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(`${path}/boilerplate/function.js`, boilerplateJs, (err) => {
      if (err) {
        console.error("Error writing function.js:", err);
        reject(err);
      }
    });
    fs.writeFile(
      `${path}/boilerplate-full/function.js`,
      boilerplateFullJs,
      (err) => {
        if (err) {
          console.error("Error writing function.js:", err);
          reject(err);
        }
      }
    );
    fs.writeFile(`${path}/boilerplate/function.py`, boilerPlatePy, (err) => {
      if (err) {
        console.error("Error writing function.py:", err);
        reject(err);
      }
    });
    fs.writeFile(
      `${path}/boilerplate-full/function.py`,
      boilerplateFullPy,
      (err) => {
        if (err) {
          console.error("Error writing function.py:", err);
          reject(err);
        }
      }
    );
    fs.writeFile(`${path}/boilerplate/function.cpp`, boilerplateCpp, (err) => {
      if (err) {
        console.error("Error writing function.cpp:", err);
        reject(err);
      }
    });
    fs.writeFile(
      `${path}/boilerplate-full/function.cpp`,
      boilerplateFullCpp,
      (err) => {
        if (err) {
          console.error("Error writing function.cpp:", err);
          reject(err);
        }
      }
    );
    resolve();
  });
};

const getStructureFile = async (path: string): Promise<string> => {
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
