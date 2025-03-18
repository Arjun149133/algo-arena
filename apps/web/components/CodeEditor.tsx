import { getLanguage } from "@lib/helper";
import { Language } from "@lib/types";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";

const CodeEditor = ({
  language,
  code,
}: {
  language: Language;
  code: string;
}) => {
  const [value, setValue] = useState(code);
  const [lang, setLang] = useState(getLanguage(language));
  useEffect(() => {
    setValue(code);
    setLang(getLanguage(language));
  }, [code, language]);
  return (
    <div>
      <Editor
        height="70vh"
        defaultValue="select language"
        language={lang}
        theme="vs-dark"
        value={value}
        // onChange={(e) => {
        //   console.log("e", e);
        // }}
      />
    </div>
  );
};

export default CodeEditor;
