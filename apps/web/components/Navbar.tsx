"use client";
import React from "react";
import { Button } from "@components/components/ui/button";
import { LogIn, Menu, Search } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const session = useSession();

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
              className="text-[#eff2f699] hover:text-white hover:bg-leetcode-hover cursor-pointer"
            >
              <Link href="/problems">Problems</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-[#eff2f699] hover:text-white hover:bg-leetcode-hover"
            >
              <span>Contests</span>
            </Button>
            <Button
              variant="ghost"
              className="text-[#eff2f699] hover:text-white hover:bg-leetcode-hover"
            >
              <span>Discuss</span>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {session.status === "authenticated" ? (
            <div className=" flex justify-center items-center space-x-3">
              <h2 className=" font-mono">{session.data.user?.name} </h2>
              <Button
                onClick={() => signOut()}
                className=" cursor-pointer border border-gray-500"
              >
                SignOut
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-[#eff2f699] hover:text-white hover:bg-leetcode-hover cursor-pointer"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-leetcode-primary hover:bg-leetcode-primary/90 text-white cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
