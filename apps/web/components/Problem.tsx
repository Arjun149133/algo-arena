"use client";
import { Language, ProblemType } from "@lib/types";
import CodeEditor from "./CodeEditor";
import ProblemDescription from "./ProblemDescription";
import ExecuteButtons from "./ExecuteButtons";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import TestCases from "./TestCases";

const Problem = ({ problem }: { problem: ProblemType }) => {
  const [language, setLanguage] = useState<Language>(Language.PYTHON);
  const [code, setCode] = useState("");

  return (
    <div className=" h-screen p-1">
      <div>
        <ExecuteButtons
          problemId={problem.id}
          language={language}
          setLanguage={setLanguage}
          boilerPlate={problem.boilerPlate}
          setCode={setCode}
          code={code}
        />
      </div>
      <div className=" grid grid-cols-2 gap-5 m-2">
        <div className=" ">
          <ProblemDescription problem={problem} />
        </div>
        <div className=" flex flex-col">
          <Tabs defaultValue="code">
            <TabsList className=" bg-primary text-white">
              <TabsTrigger
                value="code"
                className=" text-white data-[state=active]:bg-black"
              >
                Code
              </TabsTrigger>
              <TabsTrigger
                value="testcases"
                className=" text-white data-[state=active]:bg-black"
              >
                Test Cases
              </TabsTrigger>
            </TabsList>
            <TabsContent value="code">
              <CodeEditor language={language} code={code} />
            </TabsContent>
            <TabsContent value="testcases">
              <TestCases testCases={problem.testCases} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Problem;
