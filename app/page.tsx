"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const handleProtectedLink = (href: string) => {
    if (status === "loading") return;
    if (!session) router.push("/signin");
    else router.push(href);
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

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

    const dots = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4,
      o: Math.random() * 0.35 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      dots.forEach((d) => {
        // subtle mouse repulsion
        const dxm = d.x - mx;
        const dym = d.y - my;
        const distM = Math.hypot(dxm, dym);
        if (distM < 100) {
          d.vx += (dxm / distM) * 0.04;
          d.vy += (dym / distM) * 0.04;
        }
        // dampen velocity
        d.vx *= 0.995;
        d.vy *= 0.995;

        d.x = (d.x + d.vx + canvas.width) % canvas.width;
        d.y = (d.y + d.vy + canvas.height) % canvas.height;

        // glow dot
        const grd = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3);
        grd.addColorStop(0, `rgba(88,166,255,${d.o})`);
        grd.addColorStop(1, `rgba(88,166,255,0)`);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(88,166,255,${d.o * 1.5})`;
        ctx.fill();
      });

      // connections
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(88,166,255,${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // mouse glow
      if (mx > 0) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
        grd.addColorStop(0, "rgba(88,166,255,0.04)");
        grd.addColorStop(1, "rgba(88,166,255,0)");
        ctx.beginPath();
        ctx.arc(mx, my, 180, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const features = [
    {
      icon: "📝",
      title: "Dev Logs",
      desc: "Short-form updates for your build journey. Public or private — your call.",
    },
    {
      icon: "🐙",
      title: "GitHub Integration",
      desc: "Link your GitHub to showcase repos and pull your avatar automatically.",
    },
    {
      icon: "👥",
      title: "Follow Developers",
      desc: "Follow other builders and get a personalized feed of their public logs.",
    },
    {
      icon: "❤️",
      title: "Likes & Comments",
      desc: "React to logs, leave threaded comments, and start conversations.",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#0d1117] text-[#e6edf3]">

      {/* canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* top accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-px bg-gradient-to-r from-transparent via-[#58a6ff]/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-32 bg-[radial-gradient(ellipse_at_top,rgba(88,166,255,0.09),transparent_70%)] z-10 pointer-events-none" />

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0d1117] to-transparent z-10 pointer-events-none" />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_20%,#0d1117_100%)] z-10 pointer-events-none" />

      {/* corner brackets */}
      {[
        "top-8 left-8 border-t border-l",
        "top-8 right-8 border-t border-r",
        "bottom-8 left-8 border-b border-l",
        "bottom-8 right-8 border-b border-r",
      ].map((cls) => (
        <div key={cls} className={`absolute w-5 h-5 border-[#58a6ff]/20 z-20 pointer-events-none ${cls}`} />
      ))}

      {/* ── main content ── */}
      <div
        className="relative z-20 flex flex-col items-center text-center max-w-2xl w-full py-20"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* status badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-sm border border-[#21262d] bg-[#0d1117]/80 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] shadow-[0_0_6px_#3fb950] animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5c7082]">
            Built for builders
          </span>
        </div>

        {/* logo */}
        <h1
          className="font-sans font-black tracking-tight leading-none mb-3 select-none"
          style={{ fontSize: "clamp(64px, 13vw, 96px)" }}
        >
          Dev<span className="text-[#58a6ff]">Log</span>
          <span
            className="text-[#58a6ff] font-mono font-light ml-0.5"
            style={{ animation: "blink 1.1s step-end infinite" }}
          >_</span>
        </h1>

        {/* version chip */}
        <span className="font-mono text-[10px] text-[#58a6ff]/50 border border-[#58a6ff]/15 bg-[#58a6ff]/[0.06] rounded-sm px-2 py-0.5 mb-8 tracking-widest">
          v2.0 · stable
        </span>

        {/* tagline */}
        <p className="font-sans text-base text-[#5c7082] leading-relaxed max-w-md mb-3">
          A space for developers to share{" "}
          <span className="text-[#8b949e]">thoughts</span>,{" "}
          <span className="text-[#8b949e]">progress</span>, and{" "}
          <span className="text-[#8b949e]">projects</span>{" "}
          in one clean platform.
        </p>

        <p className="font-mono text-xs text-[#484f58] mb-10 tracking-wide">
          Post logs · Follow devs · Showcase your GitHub · Join the feed
        </p>

        {/* CTAs */}
        <div className="flex gap-3 flex-wrap justify-center mb-14">
          <button
            onClick={() => handleProtectedLink("/dashboard")}
            className="group relative inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white font-mono font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded-sm overflow-hidden transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_24px_rgba(35,134,54,0.3)]"
          >
            <span className="relative z-10">Start Logging</span>
            <span className="relative z-10 text-[#3fb950] group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            <span className="absolute inset-x-0 top-0 h-px bg-white/10" />
          </button>

          <button
            onClick={() => handleProtectedLink("/explore")}
            className="group inline-flex items-center gap-2 border border-[#21262d] hover:border-[#58a6ff]/40 text-[#8b949e] hover:text-[#58a6ff] font-mono font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded-sm transition-all duration-200 hover:-translate-y-px hover:bg-[#58a6ff]/[0.04] hover:shadow-[0_0_20px_rgba(88,166,255,0.06)]"
          >
            Explore Devs
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </button>
        </div>

        {/* divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#21262d] to-transparent mb-12" />

        {/* features grid */}
        <div
          className="grid grid-cols-2 gap-3 w-full mb-12 text-left"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
          }}
        >
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#161b22]/80 backdrop-blur-sm border border-[#21262d] hover:border-[#30363d] rounded-lg p-4 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{icon}</span>
                <span className="text-xs font-semibold text-[#e6edf3] font-mono group-hover:text-[#58a6ff] transition-colors">{title}</span>
              </div>
              <p className="text-xs text-[#484f58] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#21262d] to-transparent mb-10" />

        {/* bottom tagline */}
        <p className="font-mono text-[10px] text-[#484f58] tracking-[0.2em] uppercase">
          Open to all developers · Free forever
        </p>

      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}