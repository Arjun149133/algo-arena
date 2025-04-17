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

    const options = {
      method: "POST",
      url: `https://${process.env.X_RAPIDAPI_HOST}/submissions/batch`,
      params: {
        base64_encoded: "true",
      },
      headers: {
        "x-rapidapi-key": `${process.env.X_RAPIDAPI_KEY}`,
        "x-rapidapi-host": `${process.env.X_RAPIDAPI_HOST}`,
        "Content-Type": "application/json",
      },
      data: {
        submissions: submissions,
      },
    };

    const submissionTokenArray = await axios.request(options);

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
