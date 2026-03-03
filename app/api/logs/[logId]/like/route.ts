import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { logId } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await prisma.like.findUnique({
    where: { userId_logId: { userId: user.id, logId } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_logId: { userId: user.id, logId } },
    });
    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({ data: { userId: user.id, logId } });
  return NextResponse.json({ liked: true });
}