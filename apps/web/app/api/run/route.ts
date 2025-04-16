import { prisma } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { SubmmissionBatch } from "@lib/submissions";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const { problemId, code, language } = await req.json();

    if (!session?.user?.email) {
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

    const submissions = await SubmmissionBatch({
      code,
      problemTitle: problem.title,
      language,
      url_end: `run`,
    });

    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        base64_encoded: "true",
      },
      headers: {
        "x-rapidapi-key": "76a6eb60b0mshad6fe6c266b0898p1f2eb7jsn3ef685ccc25a",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        submissions: submissions,
      },
    };

    const submissionTokenArray = await axios.request(options);

    // const result = await axios.post(
    //   `${process.env.WEBHOOK_CALLBACK_URL}/run/create`,
    //   {
    //     submissionTokenArray: submissionTokenArray.data,
    //   }
    // );

    return NextResponse.json({
      submissionTokenArray: submissionTokenArray.data,
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
