import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// POST /api/follow  { username: "target-username" }
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username } = await req.json();

  const [follower, following] = await Promise.all([
    prisma.user.findUnique({ where: { email: session.user.email } }),
    prisma.user.findUnique({ where: { username } }),
  ]);

  if (!follower || !following)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (follower.id === following.id)
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: follower.id, followingId: following.id } },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId: follower.id, followingId: following.id } },
    });
    return NextResponse.json({ following: false });
  }

  await prisma.follow.create({
    data: { followerId: follower.id, followingId: following.id },
  });
  return NextResponse.json({ following: true });
}

// GET /api/follow?username=target  — check if current user follows target
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username)
    return NextResponse.json({ error: "Username required" }, { status: 400 });

  const [follower, following] = await Promise.all([
    prisma.user.findUnique({ where: { email: session.user.email } }),
    prisma.user.findUnique({ where: { username } }),
  ]);

  if (!follower || !following)
    return NextResponse.json({ following: false });

  const exists = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: follower.id, followingId: following.id } },
  });

  return NextResponse.json({ following: !!exists });
}