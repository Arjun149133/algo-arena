import { prisma } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { problemTitle, testCases } = await req.json();

  if (testCases.length === 0) {
    return NextResponse.json(
      {
        error: "TestCases is required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const problem = await prisma.problem.update({
      where: {
        title: problemTitle,
      },
      data: {
        testCases: {
          createMany: {
            data: testCases.map((item: { input: string; output: string }) => ({
              input: item.input,
              output: item.output,
            })),
          },
        },
      },
    });

    return NextResponse.json(
      {
        problem,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}
