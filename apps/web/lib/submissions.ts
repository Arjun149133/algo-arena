import axios from "axios";
import { getLanguageId } from "./helper";
import { SubmissionType } from "./types";

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
  const gitUrl = `${process.env.GITHUB_CONTENT_API}/${problemTitle}/boilerplate-full/function.${language}`;

  const res = await axios.get(gitUrl);

  if (res.status !== 200) {
    throw new Error("Error fetching the file");
  }

  const file = res.data;

  const finalCode = file.replace("##USER_CODE_HERE##", code);

  const testsFolderPath = `${process.env.GITHUB_API}/${problemTitle}/tests`;

  const inputFiles = await getInputFiles(
    `${testsFolderPath}/inputs`,
    problemTitle
  );
  const outputFiles = await getOutputFiles(
    `${testsFolderPath}/outputs`,
    problemTitle
  );

  const submissions: SubmissionType[] = [];
  inputFiles.forEach((inputFile, index) => {
    submissions.push({
      source_code: Buffer.from(finalCode).toString("base64"),
      language_id: getLanguageId(language),
      stdin: Buffer.from(inputFile).toString("base64"),
      expected_output: Buffer.from(outputFiles[index]!).toString("base64"),
      callback_url: `${process.env.WEBHOOK_CALLBACK_URL}/${url_end}`,
    });
  });

  return submissions;
}

const getInputFiles = async (url: string, problemTitle: string) => {
  const res = await axios.get(url);
  if (res.status !== 200) {
    throw new Error("Error fetching the file");
  }

  const dir = res.data;
  const noOfTestCases = dir.length;

  const inputFiles: string[] = [];

  for (let i = 0; i < noOfTestCases; i++) {
    const response = await axios.get(
      `${process.env.GITHUB_CONTENT_API}/${problemTitle}/tests/inputs/${i}.txt`
    );
    if (response.status !== 200) {
      throw new Error("Error fetching the file");
    }
    const file = response.data;
    inputFiles.push(file);
  }

  return inputFiles;
};

const getOutputFiles = async (path: string, problemTitle: string) => {
  const res = await axios.get(path);
  if (res.status !== 200) {
    throw new Error("Error fetching the file");
  }

  const dir = res.data;
  const noOfTestCases = dir.length;

  const outputFiles: string[] = [];

  for (let i = 0; i < noOfTestCases; i++) {
    const response = await axios.get(
      `${process.env.GITHUB_CONTENT_API}/${problemTitle}/tests/outputs/${i}.txt`
    );
    if (response.status !== 200) {
      throw new Error("Error fetching the file");
    }
    const file = response.data;
    // convert file to string if its a number
    const fileString = typeof file === "number" ? file.toString() : file;
    outputFiles.push(fileString);
  }

  return outputFiles;
};
