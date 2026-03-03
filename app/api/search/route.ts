import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  // ── Default feed (no query) ──────────────────────────────────────────────
  if (!query) {
    // Random public logs from DB
    const publicLogs = await prisma.log.findMany({
      where: { isPublic: true },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Shuffle and pick 6
    const shuffledLogs = publicLogs
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    // Trending GitHub repos via GitHub search API
    let trendingRepos: any[] = [];
    try {
      const topics = ["typescript", "nextjs", "react", "python", "rust", "golang"];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const ghRes = await fetch(
        `https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=6`,
        { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 3600 } }
      );
      if (ghRes.ok) {
        const ghData = await ghRes.json();
        trendingRepos = ghData.items ?? [];
      }
    } catch (_) {}

    return NextResponse.json({ feed: true, logs: shuffledLogs, repos: trendingRepos });
  }

  // ── Search ───────────────────────────────────────────────────────────────
  const [users, logs] = await Promise.all([
    prisma.user.findMany({
      where: { username: { contains: query, mode: "insensitive" } },
      take: 5,
    }),
    prisma.log.findMany({
      where: {
        isPublic: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { user: { select: { username: true } } },
      take: 5,
    }),
  ]);

  // GitHub repo search
  let repos: any[] = [];
  try {
    const ghRes = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=6`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (ghRes.ok) {
      const ghData = await ghRes.json();
      repos = ghData.items ?? [];
    }
  } catch (_) {}

  return NextResponse.json({ feed: false, users, logs, repos });
}