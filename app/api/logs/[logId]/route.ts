import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  const { logId } = await params;

  const log = await prisma.log.findUnique({
    where: { id: logId },
    include: {
      user: { select: { username: true, githubUsername: true, bio: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!log || !log.isPublic)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(log);
}