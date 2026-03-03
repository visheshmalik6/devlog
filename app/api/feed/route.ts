import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const follows = await prisma.follow.findMany({
    where: { followerId: user.id },
    select: { followingId: true },
  });

  const followingIds = follows.map((f) => f.followingId);

  if (followingIds.length === 0) return NextResponse.json([]);

  const logs = await prisma.log.findMany({
    where: {
      userId: { in: followingIds },
      isPublic: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { username: true, githubUsername: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return NextResponse.json(logs);
}