import { Language } from "@lib/types";
import { prisma } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, description, difficulty, boilerPlate, testCases } =
    await req.json();

  if (boilerPlate.length === 0) {
    return NextResponse.json(
      {
        error: "BoilerPlate is required",
      },
      {
        status: 400,
      }
    );
  }

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
    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        creatorId: "e309e134-629d-427b-b854-1cccadb05399",
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
