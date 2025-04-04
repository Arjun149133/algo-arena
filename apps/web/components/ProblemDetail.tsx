"use client";
import React, { useState, useEffect } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/components/ui/resizable";
import { Button } from "@components/components/ui/button";
import DifficultyTag from "@components/DifficultyTag";
import { ArrowLeft, Play } from "lucide-react";
import { toast } from "sonner";
import CodeEditor from "@components/CodeEditor";
import ProblemConsole from "@components/ProblemConsole";
import Link from "next/link";
import { Language, ProblemType, TestCaseType } from "@lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import axios from "axios";

// return language as js, py, java, c, cpp, rs, go
const getLanguageShort = (language: Language) => {
  switch (language) {
    case Language.JAVASCRIPT:
      return "js";
    case Language.PYTHON:
      return "py";
    case Language.C:
      return "c";
    case Language.CPP:
      return "cpp";
    case Language.GO:
      return "go";
    case Language.RUST:
      return "rs";
    default:
      return "py";
  }
};

const ProblemDetail = ({ problem }: { problem: ProblemType }) => {
  const [language, setLanguage] = useState<Language>(Language.PYTHON);
  const [code, setCode] = useState(
    problem.boilerPlate.find(
      (boilerPlate) => boilerPlate.language === Language.PYTHON
    )?.code || "// Write your code here"
  );
  const [runId, setRunId] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCaseType[]>(
    problem.testCases ?? []
  );
  const [testCaseResults, setTestCaseResults] = useState<
    {
      result: string;
      status: "PENDING" | "ACCEPTED" | "REJECTED";
      message?: string;
    }[]
  >([]);
  const [consoleLoader, setConsoleLoader] = useState(false);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRun = async () => {
    setConsoleLoader(true);
    setTestCaseResults([]);
    toast("Running your code...", {
      description: "Please wait while we execute your code.",
      style: {
        background: "#1e1e1e",
        color: "#eff2f699",
      },
      action: {
        label: "Cancel",
        onClick: () => {
          toast.dismiss();
        },
      },
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/run`,
      {
        problemId: problem.title,
        code: code,
        language: getLanguageShort(language),
      }
    );

    if (res.data.error) {
      toast.dismiss();
      toast.error(res.data.error, {
        description: "Please check your code and try again.",
        style: {
          background: "#1e1e1e",
          color: "#eff2f699",
        },
      });
      return;
    }

    console.log("running");

    const runId = res.data.runId;
    setRunId(runId);
    toast.dismiss();
  };

  useEffect(() => {
    const fetchRunId = async () => {
      console.log("Fetching runId...");
      if (runId) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_WEBHOOK_CALLBACK_URL}/run/check`,
          {
            runId: runId,
          }
        );

        if (res.data.error) {
          toast.dismiss();
          toast.error(res.data.error, {
            description: "Please check your code and try again.",
            style: {
              background: "#1e1e1e",
              color: "#eff2f699",
            },
          });
          return res.data.error;
        }

        if (res.data.status === "PENDING") {
          return "PENDING";
        } else if (res.data.status === "COMPLETED") {
          return res.data.results;
        }
      }
    };

    if (!runId) return;

    const interval = setInterval(async () => {
      const status = await fetchRunId();

      if (status === "PENDING") {
        console.log("Code is still running...");
      } else {
        setRunId(null);

        for (let i = 0; i < status.length; i++) {
          const token = status[i];
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=false`
          );

          console.log(res.data);

          if (res.data.error) {
            toast.error(res.data.error, {
              description: "Please check your code and try again.",
              style: {
                background: "#1e1e1e",
                color: "#eff2f699",
              },
            });
            return;
          }
          if (res.data.status.description === "Accepted") {
            setTestCaseResults((prev) => [
              ...prev,
              {
                result: res.data.stdout,
                status: "ACCEPTED",
              },
            ]);
          } else if (res.data.status.description === "Wrong Answer") {
            setTestCaseResults((prev) => [
              ...prev,
              {
                result: res.data.stdout,
                status: "REJECTED",
                message: res.data.message,
              },
            ]);
          } else {
            setTestCaseResults((prev) => [
              ...prev,
              {
                result: res.data.stderr,
                status: "REJECTED",
                message: res.data.message,
              },
            ]);
          }
        }

        console.log(status);
        console.log(testCaseResults);
      }
    }, 5000);

    return () => {
      setRunId(null);
      clearInterval(interval);
    };
  }, [runId]);

  const handleSubmit = () => {
    toast("Submitting your solution...", {
      description: "Please wait while we submit your solution.",
      style: {
        background: "#1e1e1e",
        color: "#eff2f699",
      },
      action: {
        label: "Cancel",
        onClick: () => {
          toast.dismiss();
        },
      },
    });

    // Simulate a delay
    setTimeout(() => {
      toast("Submission successful", {
        description: "Your solution has been submitted for review.",
        style: {
          background: "#1e1e1e",
          color: "#eff2f699",
        },
        action: {
          label: "View Results",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center px-4 py-2 border-b border-[#3e3e3e] bg-leetcode-dark">
        <Link href="/problems">
          <Button
            variant="ghost"
            className="text-[#eff2f699] cursor-pointer mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>

        <div className="flex items-center">
          <h1 className="text-lg capitalize font-medium mr-3">
            {problem.title}
          </h1>
          <DifficultyTag difficulty={problem.difficulty as any} />
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        {/* Problem description panel */}
        <ResizablePanel
          defaultSize={40}
          minSize={30}
          className="bg-leetcode-dark"
        >
          <div className="h-full overflow-auto p-6">
            <div
              className="prose prose-invert max-w-none prose-pre:bg-[#1e1e1e] prose-pre:text-sm prose-pre:p-4 prose-pre:rounded-md prose-code:bg-[#1e1e1e] prose-code:p-1 prose-code:rounded prose-code:text-sm mb-4"
              dangerouslySetInnerHTML={{ __html: problem.description }}
            />
            <div>
              {problem.testCases.map((testCase, index) => (
                <div
                  key={testCase.id}
                  className="flex items-center justify-between p-2 mb-2"
                >
                  <div className="flex flex-col">
                    <div className=" flex items-center justify-start">
                      <h1 className=" ">Test Case {index + 1}:</h1>
                    </div>
                    <div className=" flex flex-col w-full items-start justify-center border-l-2 border-[#3e3e3e] pl-4">
                      <h1 className=" text-gray-400">
                        Input:{" "}
                        {testCase.input.split("\\n").map((input, index) => (
                          <span key={index} className=" flex flex-col text-sm">
                            {input}
                          </span>
                        ))}
                      </h1>
                      <h1 className=" text-gray-400">
                        Output: {testCase.output}
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-[#3e3e3e] w-[1px]" />

        {/* Code editor and console panel */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">
            <div className="border-b border-[#3e3e3e] p-2 bg-leetcode-dark">
              <Select
                onValueChange={(value) => {
                  setLanguage(value as Language);
                  setCode(
                    problem.boilerPlate.find(
                      (boilerPlate) => boilerPlate.language === value
                    )?.code || "// Write your code here"
                  );
                }}
                defaultValue="PYTHON"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {problem.boilerPlate.map((boilerPlate) => (
                      <SelectItem
                        key={boilerPlate.id}
                        value={boilerPlate.language}
                      >
                        {boilerPlate.language}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <ResizablePanelGroup direction="vertical" className="flex-grow">
              <ResizablePanel defaultSize={70} minSize={30}>
                <CodeEditor
                  code={code}
                  language={language}
                  onChange={handleCodeChange}
                />
              </ResizablePanel>

              <ResizableHandle className="horizontal bg-[#3e3e3e] h-[1px]" />

              <ResizablePanel defaultSize={30} minSize={20}>
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2 border-b border-[#3e3e3e]">
                    <h3 className="text-sm font-medium">Console</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-leetcode-primary hover:bg-leetcode-primary/90 text-white"
                        onClick={handleRun}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                      <Button size="sm" onClick={handleSubmit}>
                        Submit
                      </Button>
                    </div>
                  </div>
                  <ProblemConsole
                    testCases={problem.testCases}
                    testCaseResults={testCaseResults}
                    className="flex-grow"
                    consoleLoader={consoleLoader}
                    setConsoleLoader={setConsoleLoader}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProblemDetail;
