import { TestCaseType } from "@lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

const TestCases = ({ testCases }: { testCases: TestCaseType[] }) => {
  return (
    <div className=" flex">
      <Tabs defaultValue="account" className="flex">
        <div className=" flex space-x-2">
          {testCases.map((testCase, index) => (
            <TabsList key={index + 1} className="bg-primary text-white ">
              <TabsTrigger
                value={index.toString()}
                className="text-white data-[state=active]:bg-black"
              >
                Test Case {index + 1}
              </TabsTrigger>
            </TabsList>
          ))}
        </div>
        <div className=" mt-5">
          {testCases.map((testCase, index) => (
            <TabsContent key={index} value={index.toString()}>
              <div className="flex flex-col space-y-3">
                <div>
                  <h1>Input:</h1>
                  <pre>{testCase.input}</pre>
                </div>
                <div>
                  <h1>Expected Output:</h1>
                  <pre>{testCase.output}</pre>
                </div>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default TestCases;
