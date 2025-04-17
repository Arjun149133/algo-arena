import { prisma } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({
        error: "User not found",
      });
    }

    const submission = await prisma.submission.findUnique({
      where: {
        id,
      },
    });

    if (!submission) {
      return NextResponse.json({
        error: "Submission not found",
      });
    }

    return NextResponse.json(submission);
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
