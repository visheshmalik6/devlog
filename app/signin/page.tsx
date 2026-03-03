"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const inputCls = "w-full bg-[#080c10] border border-[#21262d] hover:border-[#30363d] focus:border-[#58a6ff] text-[#e6edf3] placeholder-[#3d444d] rounded-sm px-4 py-3 text-sm font-mono outline-none transition-colors duration-150";

export default function SignInPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted]   = useState(false);
  const canvasRef               = useRef<HTMLCanvasElement>(null);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.2 + 0.3,
      o: Math.random() * 0.25 + 0.06,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x = (d.x + d.vx + canvas.width) % canvas.width;
        d.y = (d.y + d.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(88,166,255,${d.o})`;
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(88,166,255,${0.05 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c10] relative overflow-hidden">

      {/* animated particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_20%,#080c10_100%)] z-10 pointer-events-none" />

      {/* top-left glow */}
      <div className="pointer-events-none absolute top-[-80px] left-[-60px] w-[500px] h-[400px] rounded-full z-10"
        style={{ background: "radial-gradient(circle, rgba(88,166,255,0.07) 0%, transparent 65%)" }} />

      {/* bottom-right glow */}
      <div className="pointer-events-none absolute bottom-[-80px] right-[-60px] w-[400px] h-[360px] rounded-full z-10"
        style={{ background: "radial-gradient(circle, rgba(63,185,80,0.04) 0%, transparent 65%)" }} />

      {/* top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-px bg-gradient-to-r from-transparent via-[#58a6ff]/30 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-20 bg-[radial-gradient(ellipse_at_top,rgba(88,166,255,0.06),transparent_70%)] z-20 pointer-events-none" />

      {/* corner brackets */}
      {["top-7 left-7 border-t border-l", "top-7 right-7 border-t border-r",
        "bottom-7 left-7 border-b border-l", "bottom-7 right-7 border-b border-r"].map(cls => (
        <div key={cls} className={`absolute w-5 h-5 border-[#58a6ff]/15 pointer-events-none z-20 ${cls}`} />
      ))}

      {/* ── card ── */}
      <div
        className="relative z-30 w-full max-w-[380px] mx-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* card surface */}
        <div className="border border-[#21262d] rounded-sm bg-[#0d1117]/80 backdrop-blur-sm px-8 py-10"
          style={{ boxShadow: "0 0 0 1px rgba(88,166,255,0.03), 0 24px 64px rgba(0,0,0,0.4)" }}>

          {/* back link */}
          <Link href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#3d444d] hover:text-[#5c7082] mb-8 transition-colors">
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>

          {/* logo / heading */}
          <div className="mb-8">
            <div className="flex items-baseline gap-0.5 mb-2">
              <span className="text-2xl font-black tracking-tight text-[#e6edf3]">Dev</span>
              <span className="text-2xl font-black tracking-tight text-[#58a6ff]">Log</span>
              <span className="text-[#58a6ff] font-mono font-light text-xl ml-px"
                style={{ animation: "blink 1.1s step-end infinite" }}>_</span>
            </div>
            <p className="font-mono text-xs text-[#5c7082]">Sign in to continue building</p>
          </div>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="group w-full flex items-center justify-center gap-2.5 border border-[#21262d] hover:border-[#58a6ff]/30 bg-transparent hover:bg-[#58a6ff]/[0.03] transition-all duration-150 text-[#8b949e] hover:text-[#e6edf3] font-mono text-xs uppercase tracking-wider py-3 rounded-sm mb-5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#21262d]" />
            <span className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#21262d]" />
          </div>

          {/* form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-3">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#3d444d] mb-1.5">
                Email
              </label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#3d444d] mb-1.5">
                Password
              </label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} className={inputCls} />
            </div>

            <button type="submit"
              className="relative w-full overflow-hidden bg-[#238636] hover:bg-[#2ea043] transition-all duration-200 text-white font-mono font-semibold text-xs uppercase tracking-wider py-3 rounded-sm !mt-5 hover:shadow-[0_0_24px_rgba(35,134,54,0.3)] group"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-white/10" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Sign In
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
              </span>
            </button>
          </form>

          {/* signup link */}
          <p className="text-center font-mono text-[11px] text-[#3d444d] mt-6">
            No account?{" "}
            <Link href="/signup" className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors">
              Sign up free
            </Link>
          </p>

        </div>

        {/* version tag below card */}
        <p className="text-center font-mono text-[10px] text-[#3d444d] mt-4 tracking-widest uppercase">
          DevLog · v2.0
        </p>

      </div>
    </div>
  );
}