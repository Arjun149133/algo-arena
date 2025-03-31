import React from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ProblemList from "@components/ProblemList";

const ProblemsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ProblemList />
      </main>
      <Footer />
    </div>
  );
};

export default ProblemsPage;
