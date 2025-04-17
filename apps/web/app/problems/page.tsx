import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ProblemList from "@components/ProblemList";
import { prisma } from "@repo/db/client";

const ProblemsPage = async () => {
  const problems = await prisma.problem.findMany();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ProblemList problems={problems} />
      </main>
      <Footer />
    </div>
  );
};

export default ProblemsPage;
