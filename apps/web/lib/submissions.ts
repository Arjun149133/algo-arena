import { getLanguageId } from "./helper";
import { SubmissionType } from "./types";
import fs from "fs";

export async function SubmmissionBatch({
  code,
  problemTitle,
  language,
  url_end,
}: {
  code: string;
  problemTitle: string;
  language: string;
  url_end: string;
}) {
  const filePath = `${process.env.PROBLEMS_PATH}/${problemTitle}/boilerplate-full/function.${language}`;

  const file = await getFullBoilerPlate(filePath);

  const finalCode = file.replace("##USER_CODE_HERE##", code);

  const testsFolderPath = `${process.env.PROBLEMS_PATH}/${problemTitle}/tests`;

  const inputFiles = await getInputFiles(`${testsFolderPath}/inputs`);
  const outputFiles = await getOutputFiles(`${testsFolderPath}/outputs`);

  const submissions: SubmissionType[] = [];
  inputFiles.forEach((inputFile, index) => {
    submissions.push({
      source_code: finalCode,
      language_id: getLanguageId(language),
      stdin: inputFile,
      expected_output: outputFiles[index]!,
      callback_url: `${process.env.WEBHOOK_CALLBACK_URL}/${url_end}`,
    });
  });

  return submissions;
}

const getFullBoilerPlate = async (filePath: string) => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const getInputFiles = async (path: string): Promise<string[]> => {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        await Promise.all(
          files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              fs.readFile(`${path}/${file}`, "utf-8", (err, data) => {
                if (err) {
                  reject(err);
                }
                resolve(data);
              });
            });
          })
        )
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      }
    });
  });
};

const getOutputFiles = async (path: string): Promise<string[]> => {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        await Promise.all(
          files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              fs.readFile(`${path}/${file}`, "utf-8", (err, data) => {
                if (err) {
                  reject(err);
                }
                resolve(data);
              });
            });
          })
        )
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      }
    });
  });
};
