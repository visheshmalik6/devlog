"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/me")
        .then(res => res.json())
        .then(data => { if (data.username) setUsername(data.username); })
        .catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (status === "loading") { e.preventDefault(); return; }
    if (!session) { e.preventDefault(); router.push("/signin"); }
  };

  const navLinks = [
    { href: "/explore",   label: "Explore"   },
    { href: "/feed",      label: "Feed"      },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const avatar = session?.user?.image ? (
    <Image src={session.user.image} alt="avatar" width={22} height={22} className="rounded-full" />
  ) : (
    <div className="w-5 h-5 rounded-full bg-[#58a6ff] flex items-center justify-center text-[#0d1117] text-xs font-bold">
      {(username || session?.user?.name)?.[0]?.toUpperCase()}
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#0d1117]/95 backdrop-blur-md border-b border-[#21262d]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-[#58a6ff]/30 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
            <Image
              src="/devlog-logo.jpg"
              alt="DevLog"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              style={{ mixBlendMode: "screen" }}
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1 ml-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={`relative px-3 py-1.5 rounded-md font-mono text-xs tracking-wider uppercase transition-all duration-150 ${
                  pathname === href
                    ? "text-[#e6edf3] bg-[#21262d]"
                    : "text-[#5c7082] hover:text-[#e6edf3] hover:bg-[#161b22]"
                }`}
              >
                {pathname === href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-[#58a6ff]" />
                )}
                {label}
              </Link>
            ))}
          </div>

          <div className="flex-1" />

          {/* Right: auth — desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-[#21262d] animate-pulse" />
            ) : session?.user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 border border-[#30363d] hover:border-[#58a6ff]/50 transition-all duration-150 rounded-md px-2.5 py-1.5 bg-[#0d1117] hover:bg-[#161b22]"
                >
                  {avatar}
                  <span className="font-mono text-xs text-[#e6edf3] max-w-[100px] truncate">
                    {username || session.user.name?.split(" ")[0] || "me"}
                  </span>
                  <svg
                    className={`w-3 h-3 text-[#484f58] transition-transform duration-150 ${profileOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl overflow-hidden z-50">
                    <div className="px-3 py-2.5 border-b border-[#21262d]">
                      <p className="font-mono text-[10px] text-[#5c7082] uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm text-[#e6edf3] font-semibold truncate mt-0.5">{username || session.user.name}</p>
                    </div>
                    <DropdownLink href="/dashboard" onClick={() => setProfileOpen(false)}>Dashboard</DropdownLink>
                    {username ? (
                      <DropdownLink href={`/u/${username}`} onClick={() => setProfileOpen(false)}>Your Profile</DropdownLink>
                    ) : (
                      <DropdownLink href="/dashboard" onClick={() => setProfileOpen(false)} muted>
                        Your Profile <span className="text-[#484f58] text-[10px]">(set username first)</span>
                      </DropdownLink>
                    )}
                    <DropdownLink href="/explore" onClick={() => setProfileOpen(false)}>Explore</DropdownLink>
                    <DropdownLink href="/feed" onClick={() => setProfileOpen(false)}>Feed</DropdownLink>
                    <DropdownLink href="/feedback" onClick={() => setProfileOpen(false)}>Feedback</DropdownLink>
                    <div className="border-t border-[#21262d]" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-3 py-2 text-sm text-[#f85149] hover:bg-[#21262d] transition-colors font-mono"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/signin" className="font-mono text-xs text-[#5c7082] hover:text-[#e6edf3] transition-colors px-3 py-1.5 uppercase tracking-wider">
                  Sign in
                </Link>
                <Link href="/signup" className="font-mono text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] transition-all text-white px-4 py-1.5 rounded-sm uppercase tracking-wider hover:shadow-[0_0_16px_rgba(35,134,54,0.3)]">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: right side */}
          <div className="flex sm:hidden items-center gap-2">
            {status !== "loading" && session?.user && (
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#30363d]">
                {session.user.image
                  ? <Image src={session.user.image} alt="avatar" width={28} height={28} className="rounded-full" />
                  : <div className="w-full h-full bg-[#58a6ff] flex items-center justify-center text-[#0d1117] text-xs font-bold">
                      {(username || session.user.name)?.[0]?.toUpperCase()}
                    </div>
                }
              </div>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 rounded-md border border-[#21262d] hover:border-[#58a6ff]/40 transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`block w-4 h-px bg-[#8b949e] transition-all duration-200 origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-4 h-px bg-[#8b949e] transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-px bg-[#8b949e] transition-all duration-200 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`sm:hidden fixed inset-x-0 top-14 z-40 bg-[#0d1117]/98 backdrop-blur-md border-b border-[#21262d] transition-all duration-200 overflow-hidden ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">

          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={(e) => { handleNavClick(e, href); setMobileOpen(false); }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider transition-colors ${
                pathname === href
                  ? "bg-[#21262d] text-[#e6edf3]"
                  : "text-[#5c7082] hover:text-[#e6edf3] hover:bg-[#161b22]"
              }`}
            >
              {label}
              {pathname === href && <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]" />}
            </Link>
          ))}

          <Link
            href="/feedback"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider transition-colors ${
              pathname === "/feedback"
                ? "bg-[#21262d] text-[#e6edf3]"
                : "text-[#5c7082] hover:text-[#e6edf3] hover:bg-[#161b22]"
            }`}
          >
            Feedback
            {pathname === "/feedback" && <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]" />}
          </Link>

          <div className="h-px bg-[#21262d] my-2" />

          {status !== "loading" && (
            session?.user ? (
              <>
                <div className="px-3 py-2 mb-1">
                  <p className="font-mono text-[10px] text-[#5c7082] uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm text-[#e6edf3] font-semibold mt-0.5">{username || session.user.name}</p>
                </div>
                {username && (
                  <Link href={`/u/${username}`} onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider text-[#5c7082] hover:text-[#e6edf3] hover:bg-[#161b22] transition-colors">
                    Your Profile
                  </Link>
                )}
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="text-left px-3 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider text-[#f85149] hover:bg-[#21262d] transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/signin" onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider text-[#5c7082] hover:text-[#e6edf3] hover:bg-[#161b22] transition-colors text-center border border-[#21262d]">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider font-semibold bg-[#238636] hover:bg-[#2ea043] text-white transition-colors text-center">
                  Sign up
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

function DropdownLink({
  href, onClick, children, muted,
}: {
  href: string; onClick: () => void; children: React.ReactNode; muted?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2 text-sm hover:bg-[#21262d] transition-colors font-mono ${muted ? "text-[#8b949e]" : "text-[#e6edf3]"}`}
    >
      {children}
    </Link>
  );
}