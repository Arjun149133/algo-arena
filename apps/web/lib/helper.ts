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
