import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ProblemList from "@components/ProblemList";
import { prisma } from "@repo/db/client";

const ProblemsPage = async () => {
  const problems = await prisma.problem.findMany();

  //console log the current working directory and its subdirectories
  console.log("Current working directory1:", __dirname);
  console.log("Current working directory2:", process.env.PWD);
  // console.log("Current working directory3:", process.env.NODE_PATH);
  console.log("Current working directory4:", process.env.PATH);
  console.log("Current working directory5:", process.env.HOME);
  // console.log("Current working directory6:", process.env.USERPROFILE);
  console.log("Current working directory7:", process.cwd());

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
