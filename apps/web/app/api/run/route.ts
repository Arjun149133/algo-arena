import { prisma } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { SubmmissionBatch } from "@lib/submissions";

export async function POST(req: NextRequest) {
  const { problemId, code, language } = await req.json();

  //language should be js, py, java, c, cpp, rs, go
  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId,
    },
  });

  if (!problem) {
    return NextResponse.json({
      error: "Problem not found",
    });
  }

  const submissions = await SubmmissionBatch({
    code,
    problemTitle: problem.title,
    language,
  });

  const submissionTokenArray = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions: submissions,
    }
  );

  return NextResponse.json({
    submissionTokenArray: submissionTokenArray.data,
  });
}
