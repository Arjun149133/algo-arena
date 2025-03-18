import { ProblemType } from "@lib/types";

const ProblemDescription = ({ problem }: { problem: ProblemType }) => {
  return (
    <div className=" flex flex-col p-2 space-y-10">
      <div className=" flex flex-col space-y-2">
        <div>
          <h1 className=" text-xl font-bold">{problem.title}</h1>
        </div>
        <div className=" flex flex-wrap leading-7">{problem.description}</div>
      </div>
      <div className=" flex flex-col space-y-2">
        <div>
          <h1 className=" text-lg font-semibold">Test Cases</h1>
        </div>
        <div className=" space-y-2">
          {problem.testCases.map((testCase, index) => (
            <div key={testCase.id} className=" flex flex-col">
              <h2>Example {index + 1}</h2>
              <div className=" flex flex-col ml-5 w-fit">
                <div className=" flex items-center">
                  <div>
                    <h1 className=" text-md font-semibold">Input:</h1>
                  </div>
                  <div className="  p-2">{testCase.input}</div>
                </div>
                <div className=" flex items-center">
                  <div>
                    <h1 className=" text-md font-semibold">Output:</h1>
                  </div>
                  <div className=" p-2">{testCase.output}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
