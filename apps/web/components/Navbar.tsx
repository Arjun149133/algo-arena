import React from "react";
import { Button } from "@components/components/ui/button";
import { LogIn, Menu, Search } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-leetcode-navbar border-b border-[#3e3e3e] sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center h-14 px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link
            href="/"
            className="text-xl font-bold text-white tracking-tight"
          >
            Algo Arena
          </Link>
          <nav className="hidden md:flex gap-1">
            <Button
              variant="ghost"
              className="text-[#eff2f699] hover:text-white hover:bg-leetcode-hover"
            >
              <Link href="/problems">Problems</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-[#eff2f699] hover:text-white hover:bg-leetcode-hover"
            >
              <Link href="/contests">Contests</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-[#eff2f699] hover:text-white hover:bg-leetcode-hover"
            >
              <Link href="/discuss">Discuss</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-[#eff2f699] hover:text-white hover:bg-leetcode-hover"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-leetcode-primary hover:bg-leetcode-primary/90 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
