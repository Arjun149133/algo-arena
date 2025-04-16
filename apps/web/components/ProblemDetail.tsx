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
import {
  Language,
  ProblemType,
  SubmissionStatus,
  TestCaseType,
} from "@lib/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import SubmissionsList from "./SubmissionsList";
import { useSession } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";

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
  // const [runId, setRunId] = useState<string | null>(null);
  const [submissionTokenArray, setSubmissionTokenArray] = useState<
    { token: string }[]
  >([]);
  const [submisionId, setSubmisionId] = useState<string | null>(null);
  const [testCaseResults, setTestCaseResults] = useState<
    {
      // input: string;
      result: string;
      status: "PENDING" | "ACCEPTED" | "REJECTED";
      message?: string;
    }[]
  >([]);
  const [consoleLoader, setConsoleLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.PENDING
  );
  const [tokenSeen, setTokenSeen] = useState([]);
  const session = useSession();

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRun = async () => {
    setConsoleLoader(true);
    setTestCaseResults([]);
    setSubmissionTokenArray([]);
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

    const { submissionTokenArray } = res.data;
    console.log("submissionTokenArray", submissionTokenArray);
    setSubmissionTokenArray(submissionTokenArray);
    toast.dismiss();
  };

  useEffect(() => {
    const fetchRunStatus = async () => {
      if (submissionTokenArray.length > 0) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_WEBHOOK_CALLBACK_URL}/run/check`,
          {
            submissionTokenArray: submissionTokenArray,
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

        return res.data.status;
      }
    };

    if (submissionTokenArray.length === 0) return;

    const interval = setInterval(async () => {
      const status = await fetchRunStatus();

      console.log("status", status);

      if (status === "PENDING") {
        console.log("Code is still running...");
      } else {
        clearInterval(interval);
        for (let i = 0; i < submissionTokenArray.length; i++) {
          const token = submissionTokenArray[i]?.token;
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
            {
              headers: {
                "x-rapidapi-key":
                  "76a6eb60b0mshad6fe6c266b0898p1f2eb7jsn3ef685ccc25a",
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                "Content-Type": "application/json",
              },
            }
          );

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
          let testResult = res.data.stdout;
          // const input = Buffer.from(res.data.stdin, "base64").toString("utf8");
          if (res.data.stderr) {
            testResult = Buffer.from(res.data.stderr, "base64").toString(
              "utf8"
            );
          } else if (res.data.compile_output) {
            testResult = Buffer.from(
              res.data.compile_output,
              "base64"
            ).toString("utf8");
          } else if (
            res.data.stdout === null &&
            res.data.stderr === null &&
            res.data.compile_output === null
          ) {
            if (res.data.message) {
              testResult = Buffer.from(res.data.message, "base64").toString(
                "utf8"
              );
            } else {
              testResult = res.data.status.description;
            }
          } else {
            testResult = Buffer.from(res.data.stdout, "base64").toString(
              "utf8"
            );
          }

          if (res.data.status.description === "Accepted") {
            setTestCaseResults((prev) => [
              ...prev,
              {
                // input: input,
                result: testResult,
                status: "ACCEPTED",
              },
            ]);
          } else if (res.data.status.description === "Wrong Answer") {
            setTestCaseResults((prev) => [
              ...prev,
              {
                // input: input,
                result: testResult,
                status: "REJECTED",
                message: res.data.message,
              },
            ]);
          } else {
            setTestCaseResults((prev) => [
              ...prev,
              {
                // input: input,
                result: testResult,
                status: "REJECTED",
              },
            ]);
          }
        }
      }
    }, 1000);

    return () => {
      setSubmissionTokenArray([]);
      clearInterval(interval);
    };
  }, [submissionTokenArray]);

  const handleSubmit = async () => {
    setSubmitLoader(true);
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

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submission`,
      {
        problemId: problem.title,
        code: code,
        language: getLanguageShort(language),
      }
    );

    setSubmisionId(res.data.submissionId);
    toast.dismiss();
  };

  useEffect(() => {
    const fetchSubmissionId = async () => {
      if (submisionId) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_WEBHOOK_CALLBACK_URL}/submission/check`,
          {
            submissionId: submisionId,
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
          return res.data;
        }
      }
    };

    if (!submisionId) return;

    const interval = setInterval(async () => {
      const status = await fetchSubmissionId();

      if (status === "PENDING") {
        console.log("Code is still running...");
      } else {
        clearInterval(interval);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submission/${submisionId}`
        );

        if (res.data.status === "ACCEPTED") {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/solved`,
            {
              submissionId: submisionId,
              solved: true,
            }
          );

          toast.success("Submission Accepted", {
            description: "Your solution has been accepted.",
            style: {
              background: "#1e1e1e",
              color: "#eff2f699",
            },
          });
        }

        setSubmissionStatus(res.data.status);
        setSubmisionId(null);
        setSubmitLoader(false);
      }
    }, 1000);

    return () => {
      setSubmisionId(null);
      setSubmitLoader(false);
      clearInterval(interval);
    };
  }, [submisionId]);

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
          <Tabs defaultValue="description" className=" p-2">
            <TabsList className=" bg-transparent border-b border-[#3e3e3e] px-2">
              <TabsTrigger
                value="description"
                className="text-white data-[state=active]:text-black"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="submissions"
                className=" text-white data-[state=active]:text-black"
              >
                Submissions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
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
                        <div className=" flex flex-col w-full items-start justify-center border-l-2 border-[#3e3e3e] pl-4 space-y-2">
                          <h1 className=" text-gray-400">
                            Input:
                            {testCase.input.split("\n").map((input, index) => (
                              <span
                                key={index}
                                className=" flex flex-col text-sm"
                              >
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
            </TabsContent>
            <TabsContent value="submissions">
              <div>
                <SubmissionsList
                  problemId={problem.title}
                  submissionId={submisionId}
                />
              </div>
            </TabsContent>
          </Tabs>
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
                    <div className=" flex space-x-2 items-center">
                      <h3 className="text-sm font-medium">Console:</h3>
                      {submissionStatus !== "PENDING" && (
                        <h3
                          className={`${submissionStatus.startsWith("ACCEPTED") ? "text-green-500" : "text-red-500"} font-medium`}
                        >
                          <span className=" text-gray-500">Submission - </span>
                          {submissionStatus}
                        </h3>
                      )}
                    </div>
                    {session.status === "authenticated" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-leetcode-primary hover:bg-leetcode-primary/90 text-white"
                          onClick={handleRun}
                          disabled={consoleLoader}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Run
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSubmit}
                          disabled={submitLoader}
                        >
                          {submitLoader ? (
                            <span className=" flex items-center justify-center">
                              Submitting...
                              <LoadingSpinner />
                            </span>
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button>
                        <Link href="/auth/login" className="text-white">
                          SignIn to submit
                        </Link>
                      </Button>
                    )}
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
