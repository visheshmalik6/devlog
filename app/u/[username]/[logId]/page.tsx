"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaGithub, FaHeart, FaReply, FaTrash, FaArrowLeft } from "react-icons/fa";

interface Author  { username: string; githubUsername: string | null; }
interface Reply   { id: string; content: string; createdAt: string; author: Author; }
interface Comment { id: string; content: string; createdAt: string; author: Author; replies: Reply[]; }
interface Log     {
  id: string; title: string; content: string; createdAt: string; isPublic: boolean;
  user: Author & { bio?: string };
  _count: { likes: number; comments: number };
}

const textareaCls = "w-full bg-[#080c10] border border-[#21262d] hover:border-[#30363d] focus:border-[#58a6ff] text-[#e6edf3] placeholder-[#3d444d] rounded-sm px-4 py-3 text-sm font-mono outline-none transition-colors duration-150 resize-none";

export default function LogPage() {
  const { username, logId } = useParams<{ username: string; logId: string }>();
  const router = useRouter();

  const [log, setLog]               = useState<Log | null>(null);
  const [comments, setComments]     = useState<Comment[]>([]);
  const [liked, setLiked]           = useState(false);
  const [likeCount, setLikeCount]   = useState(0);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [currentUser, setCurrentUser]   = useState<{ username: string } | null>(null);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/logs/${logId}`).then(r => r.ok ? r.json() : { error: "Not found" }),
      fetch(`/api/logs/${logId}/comments`).then(r => r.ok ? r.json() : []),
      fetch(`/api/logs/${logId}/like/status`).then(r => r.ok ? r.json() : { liked: false }),
      fetch("/api/me").then(r => r.ok ? r.json() : null),
    ]).then(([logData, commentsData, likeData, meData]) => {
      if (!logData || logData.error) { router.push("/404"); return; }
      setLog(logData);
      setLikeCount(logData._count?.likes ?? 0);
      setComments(Array.isArray(commentsData) ? commentsData : []);
      setLiked(likeData?.liked ?? false);
      if (meData && !meData.error) setCurrentUser(meData);
      setLoading(false);
    });
  }, [logId]);

  const toggleLike = async () => {
    const res = await fetch(`/api/logs/${logId}/like`, { method: "POST" });
    const data = await res.json();
    setLiked(data.liked);
    setLikeCount(c => data.liked ? c + 1 : c - 1);
  };

  const postComment = async (parentId?: string) => {
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;
    const res = await fetch(`/api/logs/${logId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId }),
    });
    const data = await res.json();
    if (data.error) return;
    if (parentId) {
      setComments(prev => prev.map(c => c.id === parentId ? { ...c, replies: [...c.replies, data] } : c));
      setReplyingTo(null); setReplyContent("");
    } else {
      setComments(prev => [...prev, data]); setNewComment("");
    }
  };

  const deleteComment = async (commentId: string, parentId?: string) => {
    await fetch(`/api/logs/${logId}/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    if (parentId) {
      setComments(prev => prev.map(c => c.id === parentId ? { ...c, replies: c.replies.filter(r => r.id !== commentId) } : c));
    } else {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  const Avatar = ({ author, size = "sm" }: { author: Author; size?: "sm" | "md" }) => {
    const cls = size === "md" ? "w-10 h-10 rounded-sm text-sm" : "w-7 h-7 rounded-sm text-xs";
    return author.githubUsername ? (
      <img src={`https://avatars.githubusercontent.com/${author.githubUsername}`}
        className={`${cls} border border-[#21262d] flex-shrink-0 object-cover`} alt={author.username} />
    ) : (
      <div className={`${cls} bg-[#58a6ff] flex items-center justify-center text-[#0d1117] font-black flex-shrink-0 border border-[#21262d]`}>
        {author.username?.[0]?.toUpperCase()}
      </div>
    );
  };

  const CommentBubble = ({ comment, parentId }: { comment: Comment | Reply; parentId?: string }) => {
    const isOwn = currentUser?.username === comment.author.username;
    return (
      <div className="flex gap-3">
        <Avatar author={comment.author} />
        <div className="flex-1 min-w-0">
          <div className="bg-[#0d1117] border border-[#21262d] rounded-sm px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <a href={`/u/${comment.author.username}`}
                className="font-mono text-xs font-semibold text-[#e6edf3] hover:text-[#58a6ff] transition-colors">
                @{comment.author.username}
              </a>
              <span className="font-mono text-[10px] text-[#3d444d]">
                {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="font-mono text-xs text-[#8b949e] leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-3 mt-1.5 pl-1">
            {!parentId && (
              <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#3d444d] hover:text-[#58a6ff] transition-colors">
                <FaReply className="text-[9px]" /> Reply
              </button>
            )}
            {isOwn && (
              <button onClick={() => deleteComment(comment.id, parentId)}
                className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#3d444d] hover:text-[#f85149] transition-colors">
                <FaTrash className="text-[9px]" /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="flex items-center gap-2 font-mono text-xs text-[#3d444d] uppercase tracking-widest">
        <span className="w-3 h-3 rounded-full border border-[#3d444d] border-t-[#58a6ff] animate-spin" />
        Loading
      </div>
    </div>
  );

  if (!log) return null;

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

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">

        {/* back */}
        <button onClick={() => router.push(`/u/${username}`)}
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#3d444d] hover:text-[#5c7082] transition-colors">
          <FaArrowLeft className="text-[9px]" /> Back to profile
        </button>

        {/* ── Log card ── */}
        <section className="bg-[#0d1117]/60 border border-[#21262d] rounded-sm p-6 backdrop-blur-sm"
          style={{ boxShadow: "0 0 0 1px rgba(88,166,255,0.03), 0 8px 32px rgba(0,0,0,0.3)" }}>

          {/* author row */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#21262d]">
            <Avatar author={log.user} size="md" />
            <div>
              <a href={`/u/${log.user.username}`}
                className="font-mono text-sm font-semibold text-[#e6edf3] hover:text-[#58a6ff] transition-colors">
                @{log.user.username}
              </a>
              <p className="font-mono text-[10px] text-[#3d444d] mt-0.5">
                {new Date(log.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>

            {/* public badge */}
            <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-[#58a6ff]/60 border border-[#58a6ff]/15 bg-[#58a6ff]/[0.05] rounded-sm px-2 py-0.5">
              public
            </span>
          </div>

          {/* title + content */}
          <h1 className="text-2xl font-black tracking-tight text-[#e6edf3] mb-4">{log.title}</h1>
          <p className="font-mono text-sm text-[#8b949e] leading-relaxed whitespace-pre-wrap">{log.content}</p>

          {/* like row */}
          <div className="flex items-center gap-4 mt-8 pt-5 border-t border-[#21262d]">
            <button onClick={toggleLike}
              className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-sm border transition-all duration-150 ${
                liked
                  ? "text-[#f85149] border-[#f85149]/25 bg-[#f85149]/[0.06] shadow-[0_0_12px_rgba(248,81,73,0.1)]"
                  : "text-[#3d444d] border-[#21262d] hover:border-[#f85149]/30 hover:text-[#f85149]"
              }`}>
              <FaHeart className="text-[10px]" />
              {likeCount} {likeCount === 1 ? "Like" : "Likes"}
            </button>
            <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-wider">
              {comments.length} comment{comments.length !== 1 ? "s" : ""}
            </span>
          </div>
        </section>

        {/* ── Comments ── */}
        <section className="space-y-6">

          {/* section header */}
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10px] text-[#5c7082] uppercase tracking-[0.2em]">Comments</span>
            {comments.length > 0 && (
              <span className="font-mono text-[10px] text-[#58a6ff]/60 border border-[#58a6ff]/15 bg-[#58a6ff]/[0.05] rounded-sm px-1.5 py-px">
                {comments.length}
              </span>
            )}
            <div className="flex-1 h-px bg-gradient-to-r from-[#21262d] to-transparent" />
          </div>

          {/* new comment */}
          {currentUser ? (
            <div className="space-y-2">
              <textarea className={textareaCls} placeholder="Leave a comment..." rows={3}
                value={newComment} onChange={e => setNewComment(e.target.value)} />
              <button onClick={() => postComment()} disabled={!newComment.trim()}
                className="font-mono text-xs uppercase tracking-wider bg-[#238636] hover:bg-[#2ea043] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white px-4 py-2 rounded-sm hover:shadow-[0_0_16px_rgba(35,134,54,0.25)]">
                Post Comment →
              </button>
            </div>
          ) : (
            <div className="border border-dashed border-[#21262d] rounded-sm py-6 text-center">
              <p className="font-mono text-xs text-[#3d444d]">
                <a href="/signin" className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors">Sign in</a>
                {" "}to leave a comment
              </p>
            </div>
          )}

          {/* comment list */}
          <div className="space-y-5">
            {comments.length === 0 && (
              <div className="border border-dashed border-[#21262d] rounded-sm py-10 flex flex-col items-center gap-2">
                <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest">No comments yet</span>
                <span className="font-mono text-xs text-[#3d444d]">Be the first to share your thoughts</span>
              </div>
            )}

            {comments.map(comment => (
              <div key={comment.id} className="space-y-3">
                <CommentBubble comment={comment} />

                {/* replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-10 space-y-3 border-l border-[#21262d] pl-4">
                    {comment.replies.map(reply => (
                      <CommentBubble key={reply.id} comment={reply as any} parentId={comment.id} />
                    ))}
                  </div>
                )}

                {/* reply box */}
                {replyingTo === comment.id && (
                  <div className="ml-10 space-y-2 border-l border-[#21262d] pl-4">
                    <textarea className={textareaCls} rows={2}
                      placeholder={`Replying to @${comment.author.username}...`}
                      value={replyContent} onChange={e => setReplyContent(e.target.value)} autoFocus />
                    <div className="flex gap-2">
                      <button onClick={() => postComment(comment.id)} disabled={!replyContent.trim()}
                        className="font-mono text-xs uppercase tracking-wider bg-[#238636] hover:bg-[#2ea043] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white px-3 py-1.5 rounded-sm">
                        Reply →
                      </button>
                      <button onClick={() => { setReplyingTo(null); setReplyContent(""); }}
                        className="font-mono text-[10px] uppercase tracking-wider text-[#3d444d] hover:text-[#5c7082] transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}