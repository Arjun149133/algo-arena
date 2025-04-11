import { ArrowRight, Code, Check } from "lucide-react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Button } from "@components/components/ui/button";
import Link from "next/link";

const LandingPage = async () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Prepare for Your Next
              <br />
              Coding Interview
            </h1>
            <p className="text-xl text-[#eff2f699] mb-10 max-w-2xl mx-auto">
              Practice coding challenges, prepare for technical interviews, and
              become a better programmer with Algo-arena.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/problems">
                <Button className="bg-leetcode-primary hover:bg-leetcode-primary/90 text-white px-8 py-6 cursor-pointer">
                  Start Practicing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  className="px-8 py-6 cursor-pointer bg-leetcode-background ease-in text-white hover:bg-leetcode-primary/90"
                >
                  Sign Up for Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-leetcode-dark">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Algo-arena?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#1e1e1e] p-6 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-leetcode-primary/20 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-leetcode-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  2400+ Coding Problems
                </h3>
                <p className="text-[#eff2f699]">
                  Master algorithms through our extensive collection of coding
                  challenges across various topics and difficulty levels.
                </p>
              </div>

              <div className="bg-[#1e1e1e] p-6 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-leetcode-primary/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-leetcode-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m14.5 9-5 5"></path>
                    <path d="m9.5 9 5 5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Online Judge System</h3>
                <p className="text-[#eff2f699]">
                  Get instant feedback on your code with our powerful online
                  judge that evaluates solution correctness and efficiency.
                </p>
              </div>

              <div className="bg-[#1e1e1e] p-6 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-leetcode-primary/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-leetcode-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
                <p className="text-[#eff2f699]">
                  Monitor your improvement with detailed statistics and
                  personalized recommendations for your skill level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-href-r from-[#222222] href-[#1a1a1a]">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-xl text-[#eff2f699] mb-10 max-w-xl mx-auto">
              Join thousands of developers who have landed their dream jobs
              through consistent practice.
            </p>
            <Link href="/auth/signup">
              <Button className="bg-leetcode-primary hover:bg-leetcode-primary/90 text-white px-8 py-6">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
