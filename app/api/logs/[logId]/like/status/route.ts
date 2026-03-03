import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ liked: false });

  const { logId } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ liked: false });

  const like = await prisma.like.findUnique({
    where: { userId_logId: { userId: user.id, logId } },
  });

  return NextResponse.json({ liked: !!like });
}