import React from "react";
import { cn } from "./lib/utils";

type DifficultyLevel = "Easy" | "Medium" | "Hard";

interface DifficultyTagProps {
  difficulty: DifficultyLevel;
  className?: string;
}

const DifficultyTag: React.FC<DifficultyTagProps> = ({
  difficulty,
  className,
}) => {
  const getColor = () => {
    switch (difficulty) {
      case "Easy":
        return "text-leetcode-easy border-leetcode-easy";
      case "Medium":
        return "text-leetcode-medium border-leetcode-medium";
      case "Hard":
        return "text-leetcode-hard border-leetcode-hard";
      default:
        return "text-gray-500 border-gray-500";
    }
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium border",
        getColor(),
        className
      )}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyTag;
