import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-leetcode-navbar py-8 border-t border-[#3e3e3e]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-medium mb-4">AlgoSandbox</h3>
            <p className="text-[#eff2f699] text-sm">
              A platform for learning algorithms and preparing for technical
              interviews.
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/problems"
                  className="text-[#eff2f699] hover:text-white"
                >
                  Problems
                </Link>
              </li>
              <li>
                <Link
                  href="/contests"
                  className="text-[#eff2f699] hover:text-white"
                >
                  Contests
                </Link>
              </li>
              <li>
                <Link
                  href="/discuss"
                  className="text-[#eff2f699] hover:text-white"
                >
                  Discuss
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tutorials"
                  className="text-[#eff2f699] hover:text-white"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#eff2f699] hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[#eff2f699] hover:text-white"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-[#eff2f699] hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-[#eff2f699] hover:text-white"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#eff2f699] hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#3e3e3e] flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#eff2f699] text-sm">
            © 2023 AlgoSandbox. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-[#eff2f699] hover:text-white text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[#eff2f699] hover:text-white text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
