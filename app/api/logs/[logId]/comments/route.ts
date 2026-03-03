import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  const { logId } = await params;

  const comments = await prisma.comment.findMany({
    where: { logId, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { username: true, githubUsername: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { username: true, githubUsername: true } },
        },
      },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { logId } = await params;
  const { content, parentId } = await req.json();

  if (!content?.trim())
    return NextResponse.json({ error: "Content required" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const log = await prisma.log.findUnique({ where: { id: logId } });
  if (!log || !log.isPublic)
    return NextResponse.json({ error: "Log not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: { content, logId, authorId: user.id, parentId: parentId ?? null },
    include: {
      author: { select: { username: true, githubUsername: true } },
      replies: {
        include: {
          author: { select: { username: true, githubUsername: true } },
        },
      },
    },
  });

  return NextResponse.json(comment);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { logId } = await params;
  const { commentId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment || comment.logId !== logId || comment.authorId !== user?.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.comment.delete({ where: { id: commentId } });
  return NextResponse.json({ success: true });
}