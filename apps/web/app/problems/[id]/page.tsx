"use client";
import React, { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/components/ui/resizable";
import { Button } from "@components/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/components/ui/tabs";
import DifficultyTag from "@components/DifficultyTag";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import CodeEditor from "@components/CodeEditor";
import ProblemConsole from "@components/ProblemConsole";
import Link from "next/link";

// Mock data for a single problem
const problemData = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  description: `
  <h2>Two Sum</h2>
  <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
  <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
  <p>You can return the answer in any order.</p>
  <h3>Example 1:</h3>
  <pre>
  <strong>Input:</strong> nums = [2,7,11,15], target = 9
  <strong>Output:</strong> [0,1]
  <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
  </pre>
  <h3>Example 2:</h3>
  <pre>
  <strong>Input:</strong> nums = [3,2,4], target = 6
  <strong>Output:</strong> [1,2]
  </pre>
  <h3>Example 3:</h3>
  <pre>
  <strong>Input:</strong> nums = [3,3], target = 6
  <strong>Output:</strong> [0,1]
  </pre>
  <h3>Constraints:</h3>
  <ul>
    <li><code>2 <= nums.length <= 10<sup>4</sup></code></li>
    <li><code>-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup></code></li>
    <li><code>-10<sup>9</sup> <= target <= 10<sup>9</sup></code></li>
    <li><strong>Only one valid answer exists.</strong></li>
  </ul>
  <h3>Follow-up:</h3>
  <p>Can you come up with an algorithm that is less than <code>O(n<sup>2</sup>)</code> time complexity?</p>
  `,
  hints: [
    "A naive approach would be to use two nested loops and check each pair of numbers.",
    "Try using a hash map to store the numbers you've seen so far.",
    "For each number, check if the complement (target - current number) exists in the hash map.",
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
    
}`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
  },
};

const ProblemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState(problemData);
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    // In a real app, we would fetch the problem data from an API
    // For now, we'll just simulate a delay
    const timer = setTimeout(() => {
      setProblem(problemData);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(problem.starterCode[lang as keyof typeof problem.starterCode]);
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRun = () => {
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

    // Simulate a delay
    setTimeout(() => {
      toast("Execution complete", {
        description: "Output: [0, 1]",
        style: {
          background: "#1e1e1e",
          color: "#eff2f699",
        },
        action: {
          label: "View Output",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }, 1500);
  };

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
          <h1 className="text-lg font-medium mr-3">
            {problem.id}. {problem.title}
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
              className="prose prose-invert max-w-none prose-pre:bg-[#1e1e1e] prose-pre:text-sm prose-pre:p-4 prose-pre:rounded-md prose-code:bg-[#1e1e1e] prose-code:p-1 prose-code:rounded prose-code:text-sm"
              dangerouslySetInnerHTML={{ __html: problem.description }}
            />

            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">Hints</h3>
              <ul className="space-y-3">
                {problem.hints.map((hint, index) => (
                  <li key={index} className="bg-[#1e1e1e] p-4 rounded-md">
                    <span className="text-leetcode-primary font-medium">
                      Hint {index + 1}:
                    </span>{" "}
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-[#3e3e3e] w-[1px]" />

        {/* Code editor and console panel */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">
            <div className="border-b border-[#3e3e3e] p-2 bg-leetcode-dark">
              <Tabs defaultValue="javascript" className="w-full ">
                <TabsList className="bg-[#2a2a2a] p-1 text-white">
                  <TabsTrigger
                    value="javascript"
                    onClick={() => handleLanguageChange("javascript")}
                    className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white"
                  >
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger
                    value="python"
                    onClick={() => handleLanguageChange("python")}
                    className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white"
                  >
                    Python
                  </TabsTrigger>
                  <TabsTrigger
                    value="java"
                    onClick={() => handleLanguageChange("java")}
                    className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-white"
                  >
                    Java
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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
                  <ProblemConsole className="flex-grow" />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProblemDetailPage;
