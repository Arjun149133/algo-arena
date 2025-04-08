import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ProblemList from "@components/ProblemList";
import axios from "axios";

const ProblemsPage = async () => {
  const res = await axios.get(`${process.env.BACKEND_URL}/api/problems`);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ProblemList problems={res.data} />
      </main>
      <Footer />
    </div>
  );
};

export default ProblemsPage;
