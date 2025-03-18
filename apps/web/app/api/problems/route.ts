import { prisma } from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const problems = await prisma.problem.findMany();

  return NextResponse.json(problems);
}

// export const dynamic = "force-static";
