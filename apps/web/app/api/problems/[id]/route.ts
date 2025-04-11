import { Language } from "@lib/types";
import { prisma } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const problem = await prisma.problem.findUnique({
    where: {
      title: id,
    },
    include: {
      boilerPlate: true,
      testCases: true,
    },
  });

  if (!problem) {
    return NextResponse.json({
      error: "Problem not found",
    });
  }

  return NextResponse.json(problem);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  let { testCases, boilerPlate } = await req.json();
  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },
  });

  if (testCases.length === 0) {
    testCases = [];
  }

  if (boilerPlate.length === 0) {
    boilerPlate = [];
  }

  if (!problem) {
    return NextResponse.json({
      error: "Problem not found",
    });
  }

  try {
    await prisma.problem.update({
      where: {
        id,
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
        boilerPlate: {
          createMany: {
            data: boilerPlate.map(
              (item: { language: Language; code: string }) => ({
                language: item.language,
                code: item.code,
              })
            ),
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Problem updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
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
