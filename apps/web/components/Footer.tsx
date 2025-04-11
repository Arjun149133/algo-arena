import React from "react";

const Footer = () => {
  return (
    <footer className="bg-leetcode-navbar py-8 border-t border-[#3e3e3e]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-medium mb-4">Algo-arena</h3>
            <p className="text-[#eff2f699] text-sm">
              A platform for learning algorithms and preparing for technical
              interviews.
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-[#eff2f699] hover:text-white">
                  Problems
                </span>
              </li>
              <li>
                <span className="text-[#eff2f699] hover:text-white">
                  Contests
                </span>
              </li>
              <li>
                <span className="text-[#eff2f699] hover:text-white">
                  Discuss
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-[#eff2f699] hover:text-white">
                  Tutorials
                </span>
              </li>
              <li>
                <span className="text-[#eff2f699] hover:text-white">FAQ</span>
              </li>
              <li>
                <span className="text-[#eff2f699] hover:text-white">Blog</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-[#eff2f699] hover:text-white">
                  About Us
                </span>
              </li>
              <li>
                <span className="text-[#eff2f699] hover:text-white">
                  Careers
                </span>
              </li>
              <li>
                <span className="text-[#eff2f699] hover:text-white">
                  Contact
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#3e3e3e] flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#eff2f699] text-sm">
            © 2023 Algo-arena. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-[#eff2f699] hover:text-white text-sm">
              Privacy Policy
            </span>
            <span className="text-[#eff2f699] hover:text-white text-sm">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
