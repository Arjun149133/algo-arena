"use client";
import React, { useEffect, useState } from "react";
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
import axios from "axios";

type Problem = {
  id: string;
  title: string;
  difficulty: string;
  acceptance: string;
  solved: boolean;
  premium: boolean;
  tags: string[];
};

const ProblemList = ({ problems }: { problems: Problem[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>(problems);
  //a hashmap where key is title and value is solved
  const [solvedProblems, setSolvedProblems] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/solved`
      );

      if (res.status !== 200) {
        console.error("Error fetching solved problems");
        return;
      }

      const solvedProblemsMap: { [key: string]: boolean } = {};
      res.data.forEach((problem: { problemId: string; solved: boolean }) => {
        solvedProblemsMap[problem.problemId] = problem.solved;
      });

      setSolvedProblems(solvedProblemsMap);
    };

    fetchSolvedProblems();
  }, []);

  useEffect(() => {
    const filtered = problems.filter((problem) => {
      const matchesSearchTerm = problem.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // || problem.tags.some((tag) =>
      //   tag.toLowerCase().includes(searchTerm.toLowerCase())
      // );

      const matchesDifficulty =
        selectedDifficulty === "All" ||
        problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Solved" && solvedProblems[problem.title]) ||
        (selectedStatus === "Unsolved" && !solvedProblems[problem.title]);

      return matchesSearchTerm && matchesDifficulty && matchesStatus;
    });

    setFilteredProblems(filtered);
  }, [problems, searchTerm, selectedDifficulty, selectedStatus]);

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
            onValueChange={(value) => {
              setSelectedDifficulty(value);
            }}
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
        </div>

        {filteredProblems.map((problem, index) => (
          <Link href={`/problems/${problem.title}`} key={problem.title}>
            <div className="grid grid-cols-12 text-sm py-4 px-6 hover:bg-leetcode-hover border-b border-[#3e3e3e]">
              <div className="col-span-1">
                {solvedProblems[problem.title] ? (
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
              <div className="col-span-6 capitalize">
                <span className={problem.premium ? "text-yellow-500" : ""}>
                  {index + 1}. {problem.title}
                  {problem.premium && " 🔒"}
                </span>
              </div>
              <div className="col-span-2">
                <DifficultyTag difficulty={problem.difficulty as any} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
