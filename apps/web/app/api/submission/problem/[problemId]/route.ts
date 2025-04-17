import { prisma } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
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

    const { problemId } = await params;

    const problemAttempts = await prisma.problemAttempt.findMany({
      where: {
        problemId,
        userId: user.email,
      },
      include: {
        submissions: true,
      },
    });

    return NextResponse.json(problemAttempts);
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
