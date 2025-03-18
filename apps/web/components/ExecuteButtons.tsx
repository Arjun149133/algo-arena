"use client";
import { Language } from "@lib/types";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

const ExecuteButtons = ({
  problemId,
  language,
  setLanguage,
  boilerPlate,
  setCode,
  code,
}: {
  problemId: string;
  language: Language;
  setLanguage: (language: Language) => void;
  boilerPlate: { language: string; code: string }[];
  setCode: (code: string) => void;
  code?: string;
}) => {
  return (
    <div className=" flex justify-center items-center space-x-2">
      <div>
        <Button className=" cursor-pointer bg-btn-primary">Run</Button>
      </div>
      <div>
        <Button className=" cursor-pointer bg-green-400 hover:bg-green-500">
          Submit
        </Button>
      </div>
      <div>
        <Select
          onValueChange={(e) => {
            setLanguage(e as Language);
            setCode(boilerPlate.find((b) => b.language === e)?.code || "");
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {boilerPlate.map((b) => (
              <SelectItem key={b.language} value={b.language}>
                {b.language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ExecuteButtons;
