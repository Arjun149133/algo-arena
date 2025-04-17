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
