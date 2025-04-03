export type ProblemType = {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  boilerPlate: BoilerPlateType[];
  testCases: TestCaseType[];
};

export type BoilerPlateType = {
  id: string;
  problemId: string;
  language: Language;
  code: string;
};

export type TestCaseType = {
  id: string;
  problemId: string;
  input: string;
  output: string;
  result?: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
};

export type SubmissionType = {
  source_code: string;
  language_id: string;
  stdin: string;
  expected_output: string;
  callback_url?: string;
};

export enum Language {
  JAVASCRIPT = "JAVASCRIPT",
  PYTHON = "PYTHON",
  JAVA = "JAVA",
  C = "C",
  CPP = "CPP",
  RUST = "RUST",
  GO = "GO",
}
