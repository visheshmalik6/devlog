"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID  = "service_3fk1kom";
const TEMPLATE_ID = "template_o818gy6";
const PUBLIC_KEY  = "1m7Idf9JhQiXNVqBe";

export default function FeedbackPage() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!validate()) return;
    setStatus("loading");

    const now = new Date();
    const formattedTime = now.toLocaleString("en-US", {
      weekday: "short", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
    });

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name,
          email,
          subject: subject || "DevLog Feedback",
          message,
          time: formattedTime,
        },
        PUBLIC_KEY
      );
      setStatus("success");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please email visheshmalik.dev@gmail.com directly.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-sm border border-[#21262d] bg-[#0d1117]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] shadow-[0_0_6px_#3fb950] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5c7082]">
              Open to feedback
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#e6edf3] mb-2">
            Send Feedback<span className="text-[#58a6ff]">_</span>
          </h1>
          <p className="text-sm text-[#5c7082] leading-relaxed">
            Found a bug? Have a suggestion? Want to say hi? Drop a message below.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6 space-y-4">

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-[#5c7082]">
                Name <span className="text-[#f85149]">*</span>
              </label>
              <input
                className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] text-[#e6edf3] placeholder-[#484f58] rounded-md px-3 py-2.5 text-sm outline-none transition-colors"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-[#5c7082]">
                Email <span className="text-[#f85149]">*</span>
              </label>
              <input
                type="email"
                className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] text-[#e6edf3] placeholder-[#484f58] rounded-md px-3 py-2.5 text-sm outline-none transition-colors"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-widest text-[#5c7082]">
              Subject
            </label>
            <input
              className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] text-[#e6edf3] placeholder-[#484f58] rounded-md px-3 py-2.5 text-sm outline-none transition-colors"
              placeholder="Bug report, feature request, general feedback..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-widest text-[#5c7082]">
              Message <span className="text-[#f85149]">*</span>
            </label>
            <textarea
              rows={5}
              className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] text-[#e6edf3] placeholder-[#484f58] rounded-md px-3 py-2.5 text-sm outline-none transition-colors resize-none"
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <p className="font-mono text-[10px] text-[#484f58] text-right">{message.length} chars</p>
          </div>

          {/* Error */}
          {(status === "error" || errorMsg) && (
            <div className="flex items-start gap-2 bg-[rgba(248,81,73,0.08)] border border-[rgba(248,81,73,0.3)] rounded-md px-4 py-3">
              <span className="text-[#f85149] text-sm mt-0.5 flex-shrink-0">✕</span>
              <p className="text-sm text-[#f85149]">{errorMsg}</p>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="flex items-start gap-2 bg-[rgba(63,185,80,0.08)] border border-[rgba(63,185,80,0.3)] rounded-md px-4 py-3">
              <span className="text-[#3fb950] text-sm mt-0.5 flex-shrink-0">✓</span>
              <p className="text-sm text-[#3fb950]">
                Message sent! Thanks for the feedback — we'll get back to you soon.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-mono font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded-md flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : "Send Message →"}
          </button>

        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#21262d] to-transparent" />

        {/* Alt contact */}
        <div className="text-center space-y-2">
          <p className="font-mono text-xs text-[#484f58]">Prefer email directly?</p>
          <a href="mailto:visheshmalik.dev@gmail.com" className="font-mono text-sm text-[#58a6ff] hover:underline">
            visheshmalik.dev@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}