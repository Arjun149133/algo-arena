"use client";
import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/components/ui/select";
import DifficultyTag from "./DifficultyTag";
import Link from "next/link";

// Mock data for problems
const PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: "48%",
    tags: ["Array", "Hash Table"],
    premium: false,
    solved: false,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    acceptance: "39%",
    tags: ["Linked List", "Math"],
    premium: false,
    solved: true,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: "33%",
    tags: ["String", "Sliding Window"],
    premium: false,
    solved: false,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    acceptance: "35%",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    premium: false,
    solved: false,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    acceptance: "31%",
    tags: ["String", "Dynamic Programming"],
    premium: false,
    solved: false,
  },
  {
    id: 6,
    title: "Zigzag Conversion",
    difficulty: "Medium",
    acceptance: "41%",
    tags: ["String"],
    premium: false,
    solved: false,
  },
  {
    id: 7,
    title: "Reverse Integer",
    difficulty: "Medium",
    acceptance: "26%",
    tags: ["Math"],
    premium: false,
    solved: false,
  },
  {
    id: 8,
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    acceptance: "16%",
    tags: ["String", "Math"],
    premium: false,
    solved: false,
  },
  {
    id: 9,
    title: "Palindrome Number",
    difficulty: "Easy",
    acceptance: "52%",
    tags: ["Math"],
    premium: false,
    solved: true,
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    acceptance: "28%",
    tags: ["String", "Dynamic Programming", "Backtracking"],
    premium: false,
    solved: false,
  },
];

const ProblemList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredProblems = PROBLEMS.filter((problem) => {
    // Filter by search term
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by difficulty
    const matchesDifficulty =
      selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;

    // Filter by status
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Solved" && problem.solved) ||
      (selectedStatus === "Unsolved" && !problem.solved);

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Problem Set</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems"
            className="bg-[#323232] w-full rounded-md pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-leetcode-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Select
            onValueChange={(value) => setSelectedDifficulty(value)}
            defaultValue="All"
          >
            <SelectTrigger className="w-[130px] bg-[#323232] border-none">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Difficulty" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => setSelectedStatus(value)}
            defaultValue="All"
          >
            <SelectTrigger className="w-[130px] bg-[#323232] border-none">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Solved">Solved</SelectItem>
              <SelectItem value="Unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-leetcode-dark rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 text-sm font-medium text-[#eff2f699] py-4 px-6 border-b border-[#3e3e3e]">
          <div className="col-span-1">Status</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2">Acceptance</div>
          <div className="col-span-1 text-right">Tags</div>
        </div>

        {filteredProblems.map((problem) => (
          <Link href={`/problems/${problem.id}`} key={problem.id}>
            <div className="grid grid-cols-12 text-sm py-4 px-6 hover:bg-leetcode-hover border-b border-[#3e3e3e]">
              <div className="col-span-1">
                {problem.solved ? (
                  <div className="h-5 w-5 rounded-full bg-leetcode-primary flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border border-[#4d4d4d]"></div>
                )}
              </div>
              <div className="col-span-6">
                <span className={problem.premium ? "text-yellow-500" : ""}>
                  {problem.id}. {problem.title}
                  {problem.premium && " 🔒"}
                </span>
              </div>
              <div className="col-span-2">
                <DifficultyTag difficulty={problem.difficulty as any} />
              </div>
              <div className="col-span-2 text-[#eff2f699]">
                {problem.acceptance}
              </div>
              <div className="col-span-1 text-right text-[#eff2f699]">
                {problem.tags.length}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
