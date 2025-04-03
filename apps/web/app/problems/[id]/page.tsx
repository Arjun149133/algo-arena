import ProblemDetail from "@components/ProblemDetail";
import axios from "axios";

const ProblemDetailPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const problem = await axios.get(
    `${process.env.BACKEND_URL}/api/problems/${id}`
  );

  if (!problem.data) {
    return <div>Problem not found</div>;
  }

  if (problem.data.error) {
    return <div>{problem.data.error}</div>;
  }

  return (
    <div>
      <ProblemDetail problem={problem.data} />
    </div>
  );
};

export default ProblemDetailPage;
