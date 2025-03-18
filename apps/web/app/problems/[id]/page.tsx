import Problem from "@components/Problem";
import { ProblemType } from "@lib/types";
import axios from "axios";

const ProblemPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { id } = await params;
  const problem = await axios.get(
    `${process.env.BACKEND_URL}/api/problems/${id}`
  );

  return (
    <div>
      <Problem problem={problem.data} />
    </div>
  );
};

export default ProblemPage;
