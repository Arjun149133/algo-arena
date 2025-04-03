import React, { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Language } from "@lib/types";

const getLanguage = (lang: Language) => {
  switch (lang) {
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
      return "plaintext";
  }
};

interface CodeEditorProps {
  code: string;
  language: Language;
  onChange: (value: string | undefined) => void;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChange,
  className,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <div className={`editor-container ${className}`}>
      <Editor
        height="100%"
        language={getLanguage(language)}
        value={code}
        defaultLanguage={getLanguage(language)}
        defaultValue={code}
        theme="vs-dark"
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 20 },
        }}
      />
    </div>
  );
};

export default CodeEditor;
