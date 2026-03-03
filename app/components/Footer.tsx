import Link from "next/link";

const navLinks = [
  { label: "Home",      href: "/"          },
  { label: "Explore",   href: "/explore"   },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sign In",   href: "/signin"    },
  { label: "Sign Up",   href: "/signup"    },
];

const legalLinks = [
  { label: "Privacy",  href: "#" },
  { label: "Terms",    href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#21262d] bg-[#0d1117] overflow-hidden">

      {/* top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-px bg-gradient-to-r from-transparent via-[#58a6ff]/20 to-transparent pointer-events-none" />

      {/* subtle glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px]"
        style={{ background: "radial-gradient(ellipse at bottom, rgba(88,166,255,0.04) 0%, transparent 70%)" }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black tracking-tight text-[#e6edf3]">Dev</span>
              <span className="text-xl font-black tracking-tight text-[#58a6ff]">Log</span>
              <span className="text-[#58a6ff] font-mono font-light text-lg ml-px"
                style={{ animation: "blink 1.1s step-end infinite" }}>_</span>
            </div>
            <p className="font-mono text-[11px] text-[#3d444d] leading-relaxed max-w-[200px]">
              A space for developers to share thoughts, progress, and projects.
            </p>
            {/* version chip */}
            <span className="inline-block font-mono text-[10px] text-[#58a6ff]/40 border border-[#58a6ff]/10 bg-[#58a6ff]/[0.04] rounded-sm px-2 py-0.5 tracking-widest">
              v2.0 · stable
            </span>
          </div>

          {/* Nav column */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3d444d] mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}
                    className="font-mono text-xs text-[#5c7082] hover:text-[#e6edf3] transition-colors duration-150 no-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Built by column */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3d444d] mb-4">Built by</p>
            <div className="space-y-3">
              <a
                href="https://visheshmalik6.github.io/MyPortfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 no-underline"
              >
                <div className="w-7 h-7 rounded-sm bg-[#58a6ff] flex items-center justify-center text-[#0d1117] font-black text-xs flex-shrink-0 border border-[#58a6ff]/20">
                  V
                </div>
                <div>
                  <p className="font-mono text-xs text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors">Vishesh Malik</p>
                  <p className="font-mono text-[10px] text-[#3d444d]">Developer · Designer</p>
                </div>
              </a>
              <p className="font-mono text-[11px] text-[#3d444d] leading-relaxed">
                Crafted with{" "}
                <span className="text-[#f85149]/60">♥</span>
                {" "}using Next.js, Prisma &amp; Tailwind.
              </p>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 border-t border-[#21262d] flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="font-mono text-[10px] text-[#3d444d] uppercase tracking-widest">
            © {new Date().getFullYear()} DevLog · All rights reserved
          </p>

          <div className="flex items-center gap-4">
            {legalLinks.map(({ label, href }) => (
              <Link key={label} href={href}
                className="font-mono text-[10px] uppercase tracking-wider text-[#3d444d] hover:text-[#5c7082] transition-colors no-underline">
                {label}
              </Link>
            ))}
            <span className="text-[#21262d]">·</span>
            <a
              href="https://visheshmalik6.github.io/MyPortfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-wider text-[#3d444d] hover:text-[#58a6ff] transition-colors no-underline"
            >
              Portfolio ↗
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}