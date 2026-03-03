"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const langColors: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", Ruby: "#701516",
  "C++": "#f34b7d", CSS: "#563d7c", HTML: "#e34c26", Swift: "#F05138",
  default: "#5c7082",
};

export default function Explore() {
  const [query, setQuery]             = useState("");
  const [results, setResults]         = useState<any>(null);
  const [feed, setFeed]               = useState<any>(null);
  const [feedLoading, setFeedLoading] = useState(true);
  const [focused, setFocused]         = useState(false);
  const [mounted, setMounted]         = useState(false);
  const inputRef                      = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/search")
      .then(res => res.json())
      .then(data => { setFeed(data); setFeedLoading(false); })
      .catch(() => setFeedLoading(false));
  }, []);

  useEffect(() => {
    if (!query) { setResults(null); return; }
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setResults(data));
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const hasResults = results && (results.users?.length || results.repos?.length || results.logs?.length);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] relative overflow-x-hidden">

      {/* ── Background atmosphere ── */}
      {/* Large radial glow top-left */}
      <div className="pointer-events-none fixed top-[-120px] left-[-80px] w-[520px] h-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(88,166,255,0.055) 0%, transparent 65%)" }} />
      {/* Mid-page glow right */}
      <div className="pointer-events-none fixed top-[40%] right-[-100px] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(63,185,80,0.035) 0%, transparent 65%)" }} />
      {/* Bottom glow */}
      <div className="pointer-events-none fixed bottom-[-80px] left-[30%] w-[360px] h-[360px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(88,166,255,0.04) 0%, transparent 65%)" }} />

      {/* Subtle dot-grid */}
      <div className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(88,166,255,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Top accent line */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[55%] h-px bg-gradient-to-r from-transparent via-[#58a6ff]/25 to-transparent pointer-events-none z-10" />

      <div
        className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-12"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >

        {/* ── Hero ── */}
        <div className="space-y-3 pb-2">
          <p className="font-mono text-[10px] text-[#3d444d] uppercase tracking-[0.25em]">/ explore</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
            Discover<span className="text-[#58a6ff]">.</span>
          </h1>
          <p className="font-mono text-sm text-[#5c7082] max-w-sm leading-relaxed">
            Browse developers, dev logs, and GitHub repos from the community.
          </p>
        </div>

        {/* ── Search ── */}
        <div className="relative max-w-2xl">
          <div
            className={`flex items-center gap-3 border rounded-sm px-4 py-3.5 transition-colors duration-150 ${
              focused ? "border-[#58a6ff]/40" : "border-[#21262d] hover:border-[#30363d]"
            }`}
            style={focused ? { boxShadow: "0 0 24px rgba(88,166,255,0.08)" } : {}}
          >
            <svg className="flex-shrink-0 text-[#3d444d]" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent font-mono text-sm text-[#e6edf3] placeholder-[#3d444d] outline-none"
              placeholder="Search developers, logs, repos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {query ? (
              <button onClick={() => setQuery("")}
                className="font-mono text-[10px] text-[#3d444d] hover:text-[#5c7082] uppercase tracking-wider transition-colors px-1">
                Clear
              </button>
            ) : (
              <kbd className="hidden sm:flex items-center font-mono text-[10px] text-[#3d444d] border border-[#21262d] rounded px-1.5 py-0.5">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* ── Search Results ── */}
        {query && (
          <div className="space-y-12">
            {!hasResults && results ? (
              <div className="flex flex-col items-center py-20 gap-3">
                <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest">No results</span>
                <p className="font-mono text-xs text-[#3d444d]">Nothing found for "{query}"</p>
              </div>
            ) : (
              <>
                {results?.users?.length > 0 && (
                  <Section label="Developers" count={results.users.length}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.users.map((user: any) => <UserCard key={user.id} user={user} />)}
                    </div>
                  </Section>
                )}
                {results?.repos?.length > 0 && (
                  <Section label="GitHub Repos" count={results.repos.length}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.repos.map((repo: any) => <RepoCard key={repo.id} repo={repo} />)}
                    </div>
                  </Section>
                )}
                {results?.logs?.length > 0 && (
                  <Section label="Dev Logs" count={results.logs.length}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.logs.map((log: any) => <LogCard key={log.id} log={log} />)}
                    </div>
                  </Section>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Default Feed ── */}
        {!query && (
          feedLoading ? (
            <div className="space-y-12">
              <SkeletonSection count={3} cols={3} />
              <SkeletonSection count={4} cols={2} />
            </div>
          ) : (
            <div className="space-y-16">
              {feed?.repos?.length > 0 && (
                <Section label="Trending on GitHub" icon="🔥">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feed.repos.map((repo: any) => <RepoCard key={repo.id} repo={repo} />)}
                  </div>
                </Section>
              )}
              {feed?.logs?.length > 0 && (
                <Section label="Latest from Builders" icon="📡">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {feed.logs.map((log: any) => <LogCard key={log.id} log={log} />)}
                  </div>
                </Section>
              )}
              {!feed?.logs?.length && !feed?.repos?.length && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {[
                    { icon: "🔥", label: "Trending Projects", desc: "Most active repos this week" },
                    { icon: "✨", label: "Popular Snippets",  desc: "Code shared by top devs" },
                    { icon: "📡", label: "Latest Updates",    desc: "Fresh logs from builders" },
                  ].map(({ icon, label, desc }) => (
                    <div key={label} className="bg-[#0d1117] border border-[#21262d] rounded-sm p-6 hover:border-[#30363d] transition-colors">
                      <div className="text-2xl mb-4">{icon}</div>
                      <div className="font-semibold text-sm text-[#e6edf3] mb-1">{label}</div>
                      <div className="font-mono text-xs text-[#3d444d]">{desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ label, icon, count, children }: {
  label: string; icon?: string; count?: number; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-6">
        {icon && <span className="text-base">{icon}</span>}
        <span className="font-mono text-[10px] text-[#5c7082] uppercase tracking-[0.2em]">{label}</span>
        {count !== undefined && (
          <span className="font-mono text-[10px] text-[#58a6ff]/60 border border-[#58a6ff]/15 bg-[#58a6ff]/[0.05] rounded-sm px-1.5 py-px">
            {count}
          </span>
        )}
        <div className="flex-1 h-px bg-gradient-to-r from-[#21262d] to-transparent ml-1" />
      </div>
      {children}
    </div>
  );
}

// ── User card ─────────────────────────────────────────────────────────────────
function UserCard({ user }: { user: any }) {
  return (
    <Link href={`/u/${user.username}`}
      className="group flex items-center gap-4 bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/35 transition-all duration-150 rounded-sm px-5 py-4">
      {user.githubUsername ? (
        <img src={`https://avatars.githubusercontent.com/${user.githubUsername}`}
          className="w-10 h-10 rounded-sm border border-[#21262d] flex-shrink-0" alt={user.username} />
      ) : (
        <div className="w-10 h-10 rounded-sm bg-[#58a6ff] flex items-center justify-center text-[#0d1117] font-black text-base flex-shrink-0">
          {user.username?.[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-semibold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors truncate">
          @{user.username}
        </p>
        {user.bio && <p className="font-mono text-[11px] text-[#3d444d] truncate mt-0.5">{user.bio}</p>}
      </div>
      <span className="font-mono text-xs text-[#3d444d] group-hover:text-[#58a6ff]/50 transition-colors flex-shrink-0">→</span>
    </Link>
  );
}

// ── Repo card ─────────────────────────────────────────────────────────────────
function RepoCard({ repo }: { repo: any }) {
  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
      className="group flex flex-col bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/35 transition-all duration-150 rounded-sm p-5">
      <div className="flex items-center gap-1.5 mb-3">
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#3d444d" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <span className="font-mono text-[10px] text-[#3d444d] truncate">{repo.full_name}</span>
      </div>
      <p className="font-mono text-sm font-semibold text-[#58a6ff] group-hover:text-[#79b8ff] truncate transition-colors mb-2">
        {repo.name}
      </p>
      <p className="font-mono text-[11px] text-[#5c7082] leading-relaxed line-clamp-2 flex-1 mb-4">
        {repo.description || "No description provided."}
      </p>
      <div className="flex items-center gap-3 pt-3 border-t border-[#161b22]">
        <span className="flex items-center gap-1 font-mono text-[10px] text-[#5c7082]">
          <span className="text-[#e3b341]">★</span> {repo.stargazers_count?.toLocaleString()}
        </span>
        <span className="flex items-center gap-1 font-mono text-[10px] text-[#5c7082]">
          ⑂ {repo.forks_count?.toLocaleString()}
        </span>
        {repo.language && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#5c7082] ml-auto">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: langColors[repo.language] ?? langColors.default }} />
            {repo.language}
          </span>
        )}
      </div>
    </a>
  );
}

// ── Log card ──────────────────────────────────────────────────────────────────
function LogCard({ log }: { log: any }) {
  return (
    <Link href={`/u/${log.user?.username}/${log.id}`}
      className="group flex flex-col bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-all duration-150 rounded-sm p-5">
      <div className="flex items-center gap-2.5 mb-4">
        {log.user?.githubUsername ? (
          <img src={`https://avatars.githubusercontent.com/${log.user.githubUsername}`}
            className="w-6 h-6 rounded-sm border border-[#21262d] flex-shrink-0" alt={log.user.username} />
        ) : (
          <div className="w-6 h-6 rounded-sm bg-[#58a6ff] flex items-center justify-center text-[#0d1117] font-black text-[10px] flex-shrink-0">
            {log.user?.username?.[0]?.toUpperCase()}
          </div>
        )}
        <span className="font-mono text-[11px] text-[#58a6ff]/70 font-semibold">@{log.user?.username}</span>
        <span className="ml-auto font-mono text-[10px] text-[#3d444d]">
          {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
      <p className="font-semibold text-sm text-[#e6edf3] group-hover:text-[#79b8ff] transition-colors leading-snug mb-2">
        {log.title}
      </p>
      <p className="font-mono text-[11px] text-[#5c7082] leading-relaxed line-clamp-3 flex-1 mb-4">
        {log.content}
      </p>
      <div className="flex items-center justify-between pt-3 border-t border-[#161b22]">
        <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-wider">Dev Log</span>
        <span className="font-mono text-[10px] text-[#3d444d] group-hover:text-[#58a6ff]/60 transition-colors">Read →</span>
      </div>
    </Link>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonSection({ count, cols }: { count: number; cols: number }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="h-2 w-28 bg-[#161b22] rounded animate-pulse" />
        <div className="flex-1 h-px bg-[#161b22]" />
      </div>
      <div className={`grid gap-4 grid-cols-1 ${cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-[#0d1117] border border-[#21262d] rounded-sm p-5 animate-pulse space-y-3">
            <div className="h-2 bg-[#161b22] rounded w-1/3" />
            <div className="h-3.5 bg-[#161b22] rounded w-2/3" />
            <div className="h-2 bg-[#161b22] rounded w-full" />
            <div className="h-2 bg-[#161b22] rounded w-4/5" />
            <div className="h-px bg-[#161b22] rounded w-full mt-4" />
            <div className="flex gap-3">
              <div className="h-2 bg-[#161b22] rounded w-8" />
              <div className="h-2 bg-[#161b22] rounded w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}