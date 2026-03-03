"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaComment } from "react-icons/fa";

interface FeedLog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: { username: string; githubUsername: string | null };
  _count: { likes: number; comments: number };
}

export default function FeedPage() {
  const [logs, setLogs] = useState<FeedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/feed")
      .then(r => r.json())
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        <div>
          <h1 className="text-xl font-bold text-[#e6edf3]">Following Feed</h1>
          <p className="text-xs text-[#8b949e] mt-1">Public logs from people you follow</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#161b22] border border-[#21262d] rounded-xl p-5 animate-pulse space-y-3">
                <div className="h-3 bg-[#21262d] rounded w-1/4" />
                <div className="h-4 bg-[#21262d] rounded w-1/2" />
                <div className="h-3 bg-[#21262d] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-10 text-center space-y-3">
            <p className="text-2xl">👥</p>
            <p className="text-[#8b949e] text-sm">Nothing here yet.</p>
            <p className="text-[#484f58] text-xs">Follow some developers to see their logs here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div
                key={log.id}
                onClick={() => router.push(`/u/${log.user.username}/${log.id}`)}
                className="bg-[#161b22] border border-[#21262d] hover:border-[#30363d] transition-colors rounded-xl p-5 cursor-pointer"
              >
                {/* Author */}
                <div className="flex items-center gap-2 mb-3">
                  {log.user.githubUsername ? (
                    <img
                      src={`https://avatars.githubusercontent.com/${log.user.githubUsername}`}
                      className="w-6 h-6 rounded-full border border-[#30363d]"
                      alt={log.user.username}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#58a6ff] flex items-center justify-center text-[#0d1117] font-black text-xs">
                      {log.user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <a
                    href={`/u/${log.user.username}`}
                    onClick={e => e.stopPropagation()}
                    className="text-xs font-semibold text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                  >
                    {log.user.username}
                  </a>
                  <span className="text-[#484f58] text-xs font-mono ml-auto">
                    {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <h3 className="font-semibold text-[#e6edf3] mb-1">{log.title}</h3>
                <p className="text-[#8b949e] text-sm leading-relaxed line-clamp-3">{log.content}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#21262d]">
                  <span className="flex items-center gap-1.5 text-xs text-[#484f58]">
                    <FaHeart className="text-[#f85149]" /> {log._count.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#484f58]">
                    <FaComment className="text-[#58a6ff]" /> {log._count.comments}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}