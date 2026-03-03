"use client";

import { useEffect, useState } from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaGlobe, FaStar, FaCodeBranch } from "react-icons/fa";

type View = "profile" | "edit" | "createLog";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", CSS: "#563d7c", HTML: "#e34c26",
  Java: "#b07219", "C++": "#f34b7d", C: "#555555", Ruby: "#701516", Swift: "#F05138",
};

// ── Shared input styles ──────────────────────────────────────────────────────
const inputCls = "w-full bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] focus:border-[#58a6ff] text-[#e6edf3] placeholder-[#3d444d] rounded-sm px-3 py-2.5 text-sm font-mono outline-none transition-colors duration-150";

export default function Dashboard() {
  const [view, setView]                     = useState<View>("profile");
  const [logs, setLogs]                     = useState<any[]>([]);
  const [repos, setRepos]                   = useState<Repo[]>([]);
  const [reposLoading, setReposLoading]     = useState(false);
  const [username, setUsername]             = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [bio, setBio]                       = useState("");
  const [twitterUrl, setTwitterUrl]         = useState("");
  const [linkedinUrl, setLinkedinUrl]       = useState("");
  const [websiteUrl, setWebsiteUrl]         = useState("");
  const [profileLoaded, setProfileLoaded]   = useState(false);
  const [profileSaved, setProfileSaved]     = useState(false);
  const [title, setTitle]                   = useState("");
  const [content, setContent]               = useState("");
  const [isPublic, setIsPublic]             = useState(false);

  useEffect(() => {
    fetch("/api/logs")
      .then(res => res.ok ? res.json() : [])
      .then(data => setLogs(Array.isArray(data) ? data : []));

    fetch("/api/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data || data.error) return;
        setUsername(data.username ?? "");
        setGithubUsername(data.githubUsername ?? "");
        setBio(data.bio ?? "");
        setTwitterUrl(data.twitterUrl ?? "");
        setLinkedinUrl(data.linkedinUrl ?? "");
        setWebsiteUrl(data.websiteUrl ?? "");
        setProfileLoaded(true);
        if (!data.username) setView("edit");
        if (data.githubUsername) fetchRepos(data.githubUsername);
      });
  }, []);

  const fetchRepos = async (ghUser: string) => {
    if (!ghUser) return;
    setReposLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${ghUser}/repos?sort=updated&per_page=6&type=public`);
      const data = await res.json();
      setRepos(Array.isArray(data) ? data : []);
    } catch { setRepos([]); }
    finally { setReposLoading(false); }
  };

  const updateProfile = async () => {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, githubUsername, bio, twitterUrl, linkedinUrl, websiteUrl }),
    });
    setProfileSaved(true);
    if (githubUsername) fetchRepos(githubUsername);
    setTimeout(() => { setProfileSaved(false); setView("profile"); }, 1500);
  };

  const createLog = async () => {
    if (!title.trim() || !content.trim()) return;
    const res = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, isPublic }),
    });
    const newLog = await res.json();
    setLogs([newLog, ...logs]);
    setTitle(""); setContent(""); setIsPublic(false);
    setView("profile");
  };

  const deleteLog = async (id: string) => {
    await fetch("/api/logs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* subtle top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[50%] h-px bg-gradient-to-r from-transparent via-[#58a6ff]/20 to-transparent pointer-events-none z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Profile View ─────────────────────────────────────────────── */}
        {view === "profile" && (
          <div className="space-y-6">

            {/* Section header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black tracking-tight text-[#e6edf3]">Dashboard</h1>
                <p className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest mt-0.5">Your space</p>
              </div>
              <button
                onClick={() => setView("edit")}
                className="font-mono text-xs text-[#5c7082] hover:text-[#e6edf3] border border-[#21262d] hover:border-[#30363d] px-3 py-1.5 rounded-sm transition-all duration-150 uppercase tracking-wider"
              >
                Edit Profile
              </button>
            </div>

            {/* Profile card */}
            <section className="bg-[#0d1117] border border-[#21262d] rounded-sm p-5">
              {!profileLoaded ? (
                <div className="space-y-3 animate-pulse">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-sm bg-[#161b22]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-[#161b22] rounded w-1/3" />
                      <div className="h-2.5 bg-[#161b22] rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ) : !username ? (
                <div className="flex flex-col items-center py-8 gap-3">
                  <div className="w-12 h-12 rounded-sm bg-[#161b22] flex items-center justify-center text-xl border border-[#21262d]">👤</div>
                  <p className="text-[#5c7082] text-sm font-mono">Profile not set up yet.</p>
                  <button
                    onClick={() => setView("edit")}
                    className="font-mono text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white px-5 py-2 rounded-sm transition-colors uppercase tracking-wider"
                  >
                    Set up profile
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 items-start">
                  {githubUsername ? (
                    <img
                      src={`https://avatars.githubusercontent.com/${githubUsername}`}
                      alt="avatar"
                      className="w-14 h-14 rounded-sm border border-[#21262d] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-sm bg-[#58a6ff] flex items-center justify-center text-[#0d1117] text-2xl font-black flex-shrink-0 border border-[#21262d]">
                      {username[0]?.toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-[#e6edf3] tracking-tight">{username}</h3>
                      <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest">· developer</span>
                    </div>
                    {bio && <p className="text-[#5c7082] text-xs mt-1.5 leading-relaxed font-mono">{bio}</p>}

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {githubUsername && (
                        <SocialLink href={`https://github.com/${githubUsername}`} icon={<FaGithub />} label="GitHub" />
                      )}
                      {twitterUrl && (
                        <SocialLink href={twitterUrl} icon={<FaTwitter />} label="Twitter" hoverColor="hover:text-[#1da1f2] hover:border-[#1da1f2]/40" />
                      )}
                      {linkedinUrl && (
                        <SocialLink href={linkedinUrl} icon={<FaLinkedin />} label="LinkedIn" hoverColor="hover:text-[#0a66c2] hover:border-[#0a66c2]/40" />
                      )}
                      {websiteUrl && (
                        <SocialLink href={websiteUrl} icon={<FaGlobe />} label="Website" />
                      )}
                    </div>

                    <a
                      href={`/u/${username}`}
                      className="inline-flex items-center gap-1.5 mt-3 font-mono text-[10px] uppercase tracking-wider text-[#58a6ff] hover:text-[#79b8ff] transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#58a6ff]" />
                      View public profile →
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total",   value: logs.length,                        accent: "#e6edf3" },
                { label: "Public",  value: logs.filter(l => l.isPublic).length,  accent: "#58a6ff" },
                { label: "Private", value: logs.filter(l => !l.isPublic).length, accent: "#5c7082" },
              ].map(({ label, value, accent }) => (
                <div key={label} className="bg-[#0d1117] border border-[#21262d] rounded-sm p-4 text-center group hover:border-[#30363d] transition-colors">
                  <div className="font-black text-2xl tabular-nums tracking-tight" style={{ color: accent }}>{value}</div>
                  <div className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest mt-1">{label} Logs</div>
                </div>
              ))}
            </div>

            {/* GitHub Repos */}
            {githubUsername && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest">GitHub Repos</span>
                  <a
                    href={`https://github.com/${githubUsername}?tab=repositories`}
                    target="_blank"
                    className="font-mono text-[10px] text-[#58a6ff] hover:text-[#79b8ff] uppercase tracking-wider transition-colors"
                  >
                    View all →
                  </a>
                </div>

                {reposLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-[#0d1117] border border-[#21262d] rounded-sm p-4 animate-pulse space-y-2">
                        <div className="h-3 bg-[#161b22] rounded w-1/2" />
                        <div className="h-2 bg-[#161b22] rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : repos.length === 0 ? (
                  <p className="font-mono text-xs text-[#3d444d]">No public repositories found.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {repos.map(repo => (
                      <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        className="group bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/40 transition-all duration-150 rounded-sm p-4 flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <FaGithub className="text-[#3d444d] flex-shrink-0 text-xs" />
                          <span className="font-mono text-sm font-semibold text-[#58a6ff] group-hover:text-[#79b8ff] truncate transition-colors">
                            {repo.name}
                          </span>
                        </div>
                        {repo.description && (
                          <p className="font-mono text-[11px] text-[#5c7082] leading-relaxed line-clamp-2">{repo.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-auto pt-1">
                          {repo.language && (
                            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#5c7082]">
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: LANG_COLORS[repo.language] ?? "#5c7082" }} />
                              {repo.language}
                            </span>
                          )}
                          {repo.stargazers_count > 0 && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-[#5c7082]">
                              <FaStar className="text-[#e3b341] text-[10px]" /> {repo.stargazers_count}
                            </span>
                          )}
                          {repo.forks_count > 0 && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-[#5c7082]">
                              <FaCodeBranch className="text-[10px]" /> {repo.forks_count}
                            </span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* New log buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setIsPublic(false); setView("createLog"); }}
                className="flex items-center justify-center gap-2 border border-[#21262d] hover:border-[#30363d] bg-[#0d1117] hover:bg-[#161b22] transition-all font-mono text-xs uppercase tracking-wider text-[#5c7082] hover:text-[#e6edf3] py-3 rounded-sm"
              >
                <span className="text-[#3d444d]">🔒</span> Private Log
              </button>
              <button
                onClick={() => { setIsPublic(true); setView("createLog"); }}
                className="flex items-center justify-center gap-2 border border-[#21262d] hover:border-[#58a6ff]/40 bg-[#0d1117] hover:bg-[#58a6ff]/[0.04] transition-all font-mono text-xs uppercase tracking-wider text-[#5c7082] hover:text-[#58a6ff] py-3 rounded-sm"
              >
                <span className="text-[#58a6ff]/50">🌐</span> Public Log
              </button>
            </div>

            {/* Logs list */}
            <section>
              <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest block mb-3">Your Logs</span>

              {logs.length === 0 ? (
                <div className="border border-dashed border-[#21262d] rounded-sm py-10 flex flex-col items-center gap-2">
                  <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest">No logs yet</span>
                  <span className="font-mono text-xs text-[#3d444d]">Create your first log above</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="group bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-all rounded-sm p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-sm text-[#e6edf3] leading-snug">{log.title}</h3>
                        <span className={`flex-shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-sm border uppercase tracking-wider ${
                          log.isPublic
                            ? "text-[#58a6ff] border-[#58a6ff]/20 bg-[#58a6ff]/[0.06]"
                            : "text-[#3d444d] border-[#21262d] bg-[#0d1117]"
                        }`}>
                          {log.isPublic ? "public" : "private"}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-[#5c7082] leading-relaxed mt-2 line-clamp-2">{log.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-mono text-[10px] text-[#3d444d]">
                          {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <button
                          onClick={() => deleteLog(log.id)}
                          className="font-mono text-[10px] uppercase tracking-wider text-[#3d444d] hover:text-[#f85149] transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ── Edit Profile ─────────────────────────────────────────────── */}
        {view === "edit" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-black tracking-tight">Edit Profile</h2>
                <p className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest mt-0.5">Update your info</p>
              </div>
              <button
                onClick={() => setView("profile")}
                className="font-mono text-xs text-[#3d444d] hover:text-[#5c7082] transition-colors uppercase tracking-wider"
              >
                ← Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <input
                  className={inputCls}
                  placeholder="Username (e.g. john-doe)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, ""))}
                />
                <p className="font-mono text-[10px] text-[#3d444d] mt-1.5 pl-1 uppercase tracking-wider">Letters, numbers, hyphens only</p>
              </div>

              {[
                { placeholder: "GitHub Username", value: githubUsername, onChange: setGithubUsername },
                { placeholder: "Twitter URL", value: twitterUrl, onChange: setTwitterUrl },
                { placeholder: "LinkedIn URL", value: linkedinUrl, onChange: setLinkedinUrl },
                { placeholder: "Personal Website", value: websiteUrl, onChange: setWebsiteUrl },
              ].map(({ placeholder, value, onChange }) => (
                <input key={placeholder} className={inputCls} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
              ))}

              <textarea
                className={`${inputCls} resize-none`}
                placeholder="Bio — tell people what you're building"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={updateProfile}
                className="font-mono text-xs font-semibold uppercase tracking-wider bg-[#238636] hover:bg-[#2ea043] transition-all text-white px-5 py-2.5 rounded-sm hover:shadow-[0_0_16px_rgba(35,134,54,0.25)]"
              >
                Save Profile
              </button>
              {profileSaved && (
                <span className="font-mono text-xs text-[#3fb950] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] shadow-[0_0_6px_#3fb950]" />
                  Saved
                </span>
              )}
            </div>
          </section>
        )}

        {/* ── Create Log ───────────────────────────────────────────────── */}
        {view === "createLog" && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-lg font-black tracking-tight">New Log</h2>
                  <p className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest mt-0.5">Share your progress</p>
                </div>
                <span className={`font-mono text-[10px] px-2.5 py-1 rounded-sm border uppercase tracking-wider ${
                  isPublic
                    ? "text-[#58a6ff] border-[#58a6ff]/20 bg-[#58a6ff]/[0.06]"
                    : "text-[#3d444d] border-[#21262d]"
                }`}>
                  {isPublic ? "🌐 Public" : "🔒 Private"}
                </span>
              </div>
              <button
                onClick={() => setView("profile")}
                className="font-mono text-xs text-[#3d444d] hover:text-[#5c7082] transition-colors uppercase tracking-wider"
              >
                ← Cancel
              </button>
            </div>

            <div className="space-y-3">
              <input
                className={inputCls}
                placeholder="Log title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className={`${inputCls} resize-none`}
                placeholder="What are you working on today?"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 rounded-sm border transition-all ${
                  isPublic
                    ? "text-[#58a6ff] border-[#58a6ff]/25 bg-[#58a6ff]/[0.06]"
                    : "text-[#3d444d] border-[#21262d] hover:border-[#30363d] hover:text-[#5c7082]"
                }`}
              >
                {isPublic ? "🌐 Visible on Explore" : "🔒 Only you can see this"}
              </button>

              <button
                onClick={createLog}
                disabled={!title.trim() || !content.trim()}
                className="font-mono text-xs font-semibold uppercase tracking-wider bg-[#238636] hover:bg-[#2ea043] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white px-5 py-2.5 rounded-sm hover:shadow-[0_0_16px_rgba(35,134,54,0.25)]"
              >
                Post Log
              </button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

// ── Social link chip ──────────────────────────────────────────────────────────
function SocialLink({
  href, icon, label, hoverColor = "hover:text-[#e6edf3] hover:border-[#30363d]"
}: {
  href: string; icon: React.ReactNode; label: string; hoverColor?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#3d444d] border border-[#21262d] px-2.5 py-1 rounded-sm transition-all duration-150 ${hoverColor}`}
    >
      {icon} {label}
    </a>
  );
}