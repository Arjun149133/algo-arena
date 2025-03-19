import { Language } from "./types";

export const getLanguage = (language: Language) => {
  switch (language) {
    case Language.JAVASCRIPT:
      return "javascript";
    case Language.PYTHON:
      return "python";
    case Language.JAVA:
      return "java";
    case Language.C:
      return "c";
    case Language.CPP:
      return "cpp";
    case Language.RUST:
      return "rust";
    case Language.GO:
      return "go";
    default:
      return "python";
  }
};

export const getLanguageId = (language: string) => {
  switch (language) {
    case "js":
      return "63";
    case "py":
      return "71";
    case "java":
      return "62";
    case "c":
      return "50";
    case "cpp":
      return "54";
    case "rs":
      return "73";
    case "go":
      return "60";
    default:
      return "71";
  }
};
