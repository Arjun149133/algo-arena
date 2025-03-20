import { prisma } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { SubmmissionBatch } from "@lib/submissions";
import { getSession } from "next-auth/react";
import { getLanguageForDb } from "@lib/helper";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const { problemId, code, language } = await req.json();

    if (!session?.user?.email) {
      return NextResponse.json({
        error: "User not found",
      });
    }

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

    let existingProblemAttemp = await prisma.problemAttempt.findFirst({
      where: {
        problemId,
        userId: session?.user?.email,
      },
    });

    if (!existingProblemAttemp) {
      existingProblemAttemp = await prisma.problemAttempt.create({
        data: {
          problemId,
          userId: session?.user?.email,
        },
      });
    }

    const newSubmmision = await prisma.submission.create({
      data: {
        problemAttemptId: existingProblemAttemp?.id,
        code,
        language: getLanguageForDb(language),
      },
    });

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

    submissionTokenArray.data.map(async (value: { token: string }) => {
      await prisma.submission.update({
        where: {
          id: newSubmmision.id,
        },
        data: {
          testCases: {
            create: {
              tokenId: value.token,
            },
          },
        },
      });
    });

    return NextResponse.json({
      submissionId: newSubmmision.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
