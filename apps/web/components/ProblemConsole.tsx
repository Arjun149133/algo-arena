import React, { useEffect, useState } from "react";
import { Button } from "@components/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/components/ui/tabs";
import LoadingSpinner from "./LoadingSpinner";

interface ConsoleOutput {
  status: "success" | "error" | "info";
  message: string;
}

interface TestCaseResult {
  result: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "TIME LIMIT EXCEEDED";
  message?: string;
}

interface ProblemConsoleProps {
  testCases: { input: string; output: string }[];
  className?: string;
  testCaseResults?: TestCaseResult[];
  consoleLoader: boolean;
  setConsoleLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProblemConsole: React.FC<ProblemConsoleProps> = ({
  testCases,
  className,
  testCaseResults,
  consoleLoader,
  setConsoleLoader,
}) => {
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([
    { status: "info", message: 'Click "Run" to execute your code.' },
  ]);
  const [activeTab, setActiveTab] = useState("testcase");
  const [testCasesStatus, setTestCasesStatus] = useState<
    "PENDING" | "ACCEPTED" | "WRONG ANSWER" | "TIME LIMIT EXCEEDED"
  >("PENDING");

  const handleClearConsole = () => {
    setConsoleOutput([{ status: "info", message: "Console cleared." }]);
  };

  useEffect(() => {
    if (!testCaseResults) return;
    if (testCaseResults?.length === testCases.length) {
      setTestCasesStatus("PENDING");

      for (let i = 0; i < testCaseResults.length; i++) {
        const res = testCaseResults[i] as TestCaseResult;
        if (res.status === "REJECTED") {
          if (res.message?.toLowerCase()?.startsWith("time limit exceeded")) {
            setTestCasesStatus("TIME LIMIT EXCEEDED");
          } else {
            setTestCasesStatus("WRONG ANSWER");
          }
          break;
        }
      }

      if (testCasesStatus === "PENDING") {
        setTestCasesStatus("ACCEPTED");
      }
      setConsoleLoader((prev) => !prev);
    }
  }, [testCaseResults]);

  if (consoleLoader) {
    return (
      <div className=" flex items-center justify-center h-full w-full bg-[#1e1e1e]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-[#1e1e1e] ${className} pb-8`}>
      <Tabs defaultValue="testcase" className="w-full h-full text-white">
        <div className="flex items-center justify-between border-b border-[#3e3e3e] px-4">
          <TabsList className="bg-transparent ">
            <TabsTrigger
              value="testcase"
              className=" text-white data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-leetcode-primary rounded-none"
              onClick={() => setActiveTab("testcase")}
            >
              Test Case
            </TabsTrigger>
            <TabsTrigger
              value="output"
              className=" text-white data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-leetcode-primary rounded-none"
              onClick={() => setActiveTab("output")}
            >
              Output
            </TabsTrigger>
          </TabsList>

          {activeTab === "output" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-white"
              onClick={handleClearConsole}
            >
              Clear
            </Button>
          )}
        </div>

        {consoleLoader ? (
          <div className=" flex items-center justify-center h-full w-full bg-[#1e1e1e]">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {testCasesStatus !== "PENDING" && (
              <div
                className={`${testCasesStatus.startsWith("ACCEPTED") ? "text-green-600" : "text-red-400"} font-semibold text-md flex pl-6`}
              >
                {testCasesStatus}
              </div>
            )}
            <TabsContent value="testcase" className="p-4 h-full overflow-auto">
              <div className="flex flex-col space-y-2">
                <Tabs defaultValue="testcase-0">
                  <TabsList className=" bg-transparent ">
                    {testCases.map((_, index) => (
                      <TabsTrigger
                        key={index}
                        value={`testcase-${index}`}
                        className=" bg-leetcode-navbar text-white data-[state=active]:bg-leetcode-primary data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-leetcode-primary rounded p-2 mx-2"
                      >
                        Test Case {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {testCases.map((testCase, index) => (
                    <TabsContent
                      key={index}
                      value={`testcase-${index}`}
                      className="p-0"
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between p-2 mb-2">
                          <div className="flex flex-col space-y-4">
                            <div className=" flex flex-col">
                              <h1 className="text-gray-400">Input:</h1>
                              <div>
                                {testCase.input
                                  .split("\n")
                                  .map((input, index) => (
                                    <span
                                      key={index}
                                      className=" flex flex-col text-sm"
                                    >
                                      {input}
                                    </span>
                                  ))}
                              </div>
                            </div>
                            <div className=" flex flex-col">
                              <h1 className="text-gray-400">
                                Expected Output:
                              </h1>
                              <div>{testCase.output}</div>
                            </div>
                            <div>
                              <h1 className=" text-gray-400">Your Output:</h1>
                              <div>
                                {testCaseResults && testCaseResults[index]
                                  ? (testCaseResults[index] as TestCaseResult)
                                      .result
                                  : "No output yet."}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="output" className="h-full overflow-auto p-0">
              <div className="p-4 space-y-2">
                {consoleOutput.map((output, index) => (
                  <div
                    key={index}
                    className={`font-mono text-sm ${
                      output.status === "error"
                        ? "text-red-400"
                        : output.status === "success"
                          ? "text-green-400"
                          : "text-gray-300"
                    }`}
                  >
                    {output.message}
                  </div>
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ProblemConsole;
