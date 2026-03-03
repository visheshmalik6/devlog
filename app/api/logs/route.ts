import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = await prisma.log.findMany({
    where: {
      user: { email: session.user?.email! },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, isPublic = false } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const log = await prisma.log.create({
    data: { title, content, isPublic, userId: user.id },
  });

  return NextResponse.json(log);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const log = await prisma.log.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!log || log.user.email !== session.user?.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.log.delete({ where: { id } });

  return NextResponse.json({ success: true });
}