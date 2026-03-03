import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    username,
    githubUsername,
    bio,
    twitterUrl,
    linkedinUrl,
    websiteUrl,
  } = await req.json();

  await prisma.user.update({
    where: { email: session.user?.email! },
    data: {
      username,
      githubUsername,
      bio,
      twitterUrl,
      linkedinUrl,
      websiteUrl,
    },
  });

  return NextResponse.json({ success: true });
}