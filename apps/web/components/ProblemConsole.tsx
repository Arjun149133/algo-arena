import React, { useState } from "react";
import { Button } from "@components/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/components/ui/tabs";

interface ConsoleOutput {
  status: "success" | "error" | "info";
  message: string;
}

interface ProblemConsoleProps {
  className?: string;
}

const ProblemConsole: React.FC<ProblemConsoleProps> = ({ className }) => {
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([
    { status: "info", message: 'Click "Run" to execute your code.' },
  ]);
  const [activeTab, setActiveTab] = useState("testcase");

  const handleClearConsole = () => {
    setConsoleOutput([{ status: "info", message: "Console cleared." }]);
  };

  return (
    <div className={`flex flex-col h-full bg-[#1e1e1e] ${className}`}>
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

        <TabsContent value="testcase" className="p-4 h-full overflow-auto">
          <textarea
            className="w-full h-full bg-[#1e1e1e] text-white resize-none p-2 focus:outline-none border border-[#3e3e3e] rounded"
            placeholder="Enter your test case here..."
            defaultValue="[1, 2, 3]"
          />
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
      </Tabs>
    </div>
  );
};

export default ProblemConsole;
