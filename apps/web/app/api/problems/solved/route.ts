import { prisma } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({
        error: "User not found",
      });
    }

    const { submissionId, solved } = await request.json();

    if (!submissionId) {
      return NextResponse.json({
        error: "Submission ID is required",
      });
    }

    const problemAttempt = await prisma.problemAttempt.findFirst({
      where: {
        submissions: {
          some: {
            id: submissionId,
          },
        },
      },
    });

    if (!problemAttempt) {
      return NextResponse.json({
        error: "Problem attempt not found",
      });
    }

    await prisma.problemAttempt.update({
      where: {
        id: problemAttempt.id,
      },
      data: {
        solved,
      },
    });

    return NextResponse.json("Problem attempt updated successfully");
  } catch (error) {
    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
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

    const solvedProblems = await prisma.problemAttempt.findMany({
      where: {
        userId: session?.user?.email,
        solved: true,
      },
    });

    return NextResponse.json(solvedProblems);
  } catch (error) {
    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}
