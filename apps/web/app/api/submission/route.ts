import { prisma } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { SubmmissionBatch } from "@lib/submissions";
import { getLanguageForDb } from "@lib/helper";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const { problemId, code, language } = await req.json();

    if (!problemId || !code || !language) {
      return NextResponse.json({
        error: "Missing required fields",
      });
    }

    console.log(session, "session");
    if (!session?.user?.email) {
      return NextResponse.json({
        error: "User not found",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    if (!user) {
      return NextResponse.json({
        error: "User not found",
      });
    }

    //language should be js, py, java, c, cpp, rs, go
    const problem = await prisma.problem.findUnique({
      where: {
        title: problemId,
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
          userId: user.email,
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
      url_end: `submission`,
    });

    const submissionTokenArray = await axios.post(
      `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`,
      {
        submissions: submissions,
      }
    );

    await Promise.all(
      submissionTokenArray.data.map((value: { token: string }) =>
        prisma.submission.update({
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
        })
      )
    );

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
