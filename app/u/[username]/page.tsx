import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import Image from "next/image";
import { FaTwitter, FaLinkedin, FaGlobe, FaGithub, FaHeart, FaComment } from "react-icons/fa";
import FollowButton from "./FollowButton";

interface Log {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isPublic: boolean;
  _count: { likes: number; comments: number };
}

const langColors: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", Ruby: "#701516",
  "C++": "#f34b7d", CSS: "#563d7c", HTML: "#e34c26", Swift: "#F05138",
  default: "#5c7082",
};

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  if (!username) notFound();

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      logs: {
        where: { isPublic: true },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { likes: true, comments: true } } },
      },
      _count: { select: { followers: true, following: true } },
    },
  });

  if (!user) notFound();

  let isFollowing = false;
  let isSelf = false;
  if (session?.user?.email) {
    const me = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (me) {
      isSelf = me.id === user.id;
      if (!isSelf) {
        const follow = await prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: me.id, followingId: user.id } },
        });
        isFollowing = !!follow;
      }
    }
  }

  let repos: any[] = [];
  if (user.githubUsername) {
    const res = await fetch(
      `https://api.github.com/users/${user.githubUsername}/repos?sort=updated&per_page=20&type=public`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) repos = await res.json();
  }

  const featuredRepos = repos
    .filter((r: any) => !r.fork)
    .sort((a: any, b: any) =>
      b.stargazers_count !== a.stargazers_count
        ? b.stargazers_count - a.stargazers_count
        : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] relative overflow-x-hidden">

      {/* ── Background ── */}
      <div className="pointer-events-none fixed top-[-100px] left-[-60px] w-[500px] h-[420px] rounded-full z-0"
        style={{ background: "radial-gradient(circle, rgba(88,166,255,0.055) 0%, transparent 65%)" }} />
      <div className="pointer-events-none fixed bottom-[-60px] right-[-60px] w-[380px] h-[380px] rounded-full z-0"
        style={{ background: "radial-gradient(circle, rgba(63,185,80,0.03) 0%, transparent 65%)" }} />
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(88,166,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
        }}
      />
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[55%] h-px bg-gradient-to-r from-transparent via-[#58a6ff]/25 to-transparent z-0" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* ── Profile header ── */}
        <section className="bg-[#0d1117]/60 border border-[#21262d] rounded-sm p-6 backdrop-blur-sm"
          style={{ boxShadow: "0 0 0 1px rgba(88,166,255,0.03), 0 8px 32px rgba(0,0,0,0.3)" }}>

          <div className="flex items-start gap-5">
            {/* avatar */}
            {user.githubUsername ? (
              <Image
                src={`https://avatars.githubusercontent.com/${user.githubUsername}`}
                alt="avatar"
                width={80}
                height={80}
                className="rounded-sm border border-[#21262d] flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-sm bg-[#58a6ff] flex items-center justify-center text-[#0d1117] text-3xl font-black flex-shrink-0 border border-[#21262d]">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-black text-xl tracking-tight text-[#e6edf3]">{user.username}</h1>
                  <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest">· developer</span>
                </div>
                {!isSelf && session && (
                  <FollowButton username={username} initialFollowing={isFollowing} />
                )}
              </div>

              {user.bio && (
                <p className="font-mono text-xs text-[#5c7082] mt-2 leading-relaxed max-w-md">{user.bio}</p>
              )}

              {/* follower stats */}
              <div className="flex gap-5 mt-3">
                <span className="font-mono text-[11px] text-[#3d444d]">
                  <span className="font-bold text-[#e6edf3]">{user._count.followers}</span>
                  {" "}followers
                </span>
                <span className="font-mono text-[11px] text-[#3d444d]">
                  <span className="font-bold text-[#e6edf3]">{user._count.following}</span>
                  {" "}following
                </span>
                <span className="font-mono text-[11px] text-[#3d444d]">
                  <span className="font-bold text-[#e6edf3]">{user.logs.length}</span>
                  {" "}logs
                </span>
              </div>

              {/* social links */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {user.githubUsername && (
                  <SocialLink href={`https://github.com/${user.githubUsername}`} icon={<FaGithub />} label="GitHub" />
                )}
                {user.twitterUrl && (
                  <SocialLink href={user.twitterUrl} icon={<FaTwitter />} label="Twitter" hover="hover:text-[#1da1f2] hover:border-[#1da1f2]/40" />
                )}
                {user.linkedinUrl && (
                  <SocialLink href={user.linkedinUrl} icon={<FaLinkedin />} label="LinkedIn" hover="hover:text-[#0a66c2] hover:border-[#0a66c2]/40" />
                )}
                {user.websiteUrl && (
                  <SocialLink href={user.websiteUrl} icon={<FaGlobe />} label="Website" />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── GitHub Repos ── */}
        {featuredRepos.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-6">
              <span className="font-mono text-[10px] text-[#5c7082] uppercase tracking-[0.2em]">Featured Repos</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#21262d] to-transparent" />
              <a href={`https://github.com/${user.githubUsername}?tab=repositories`} target="_blank"
                className="font-mono text-[10px] text-[#58a6ff] hover:text-[#79b8ff] uppercase tracking-wider transition-colors">
                View all →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuredRepos.map((repo: any) => (
                <a key={repo.id} href={repo.html_url} target="_blank"
                  className="group flex flex-col bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/40 transition-all duration-150 rounded-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaGithub className="text-[#3d444d] text-xs flex-shrink-0" />
                    <span className="font-mono text-sm font-semibold text-[#58a6ff] group-hover:text-[#79b8ff] truncate transition-colors">
                      {repo.name}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-[#5c7082] leading-relaxed line-clamp-2 flex-1 mb-3">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[#161b22]">
                    {repo.language && (
                      <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#5c7082]">
                        <span className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: langColors[repo.language] ?? langColors.default }} />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="font-mono text-[10px] text-[#5c7082]">
                        <span className="text-[#e3b341]">★</span> {repo.stargazers_count}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="font-mono text-[10px] text-[#5c7082]">⑂ {repo.forks_count}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── Dev Logs ── */}
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <span className="font-mono text-[10px] text-[#5c7082] uppercase tracking-[0.2em]">Dev Logs</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#21262d] to-transparent" />
            {user.logs.length > 0 && (
              <span className="font-mono text-[10px] text-[#58a6ff]/60 border border-[#58a6ff]/15 bg-[#58a6ff]/[0.05] rounded-sm px-1.5 py-px">
                {user.logs.length}
              </span>
            )}
          </div>

          {user.logs.length === 0 ? (
            <div className="border border-dashed border-[#21262d] rounded-sm py-12 flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest">No logs yet</span>
              <span className="font-mono text-xs text-[#3d444d]">Nothing published by this developer</span>
            </div>
          ) : (
            <div className="space-y-3">
              {user.logs.map((log: Log) => (
                <a key={log.id} href={`/u/${username}/${log.id}`}
                  className="group block bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-all duration-150 rounded-sm p-5">
                  <h3 className="font-semibold text-sm text-[#e6edf3] group-hover:text-[#79b8ff] transition-colors leading-snug mb-2">
                    {log.title}
                  </h3>
                  <p className="font-mono text-[11px] text-[#5c7082] leading-relaxed line-clamp-2 mb-4">
                    {log.content}
                  </p>
                  <div className="flex items-center gap-4 pt-3 border-t border-[#161b22]">
                    <span className="font-mono text-[10px] text-[#3d444d]">
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#3d444d] ml-auto">
                      <FaHeart className="text-[#f85149]/60 text-[10px]" /> {log._count.likes}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#3d444d]">
                      <FaComment className="text-[#58a6ff]/60 text-[10px]" /> {log._count.comments}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

function SocialLink({ href, icon, label, hover = "hover:text-[#e6edf3] hover:border-[#30363d]" }: {
  href: string; icon: React.ReactNode; label: string; hover?: string;
}) {
  return (
    <a href={href} target="_blank"
      className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#3d444d] border border-[#21262d] px-2.5 py-1 rounded-sm transition-all duration-150 ${hover}`}>
      {icon} {label}
    </a>
  );
}