export default function PrivacyPage() {
  const sections = [
    {
      title: "What we collect",
      content: [
        "**Your email address** — used to identify your account and send auth-related emails only.",
        "**Your name and profile info** — username, bio, GitHub username, and social links you choose to add.",
        "**Your logs** — the content you post, whether public or private.",
        "**Basic usage data** — things like which pages you visit, so we can fix bugs and improve the experience.",
      ],
    },
    {
      title: "What we don't do",
      content: [
        "We don't sell your data. Ever.",
        "We don't show ads. DevLog is ad-free.",
        "We don't share your private logs with anyone — not even us, unless legally required.",
        "We don't store your passwords in plain text. They're hashed with bcrypt.",
      ],
    },
    {
      title: "GitHub integration",
      content: [
        "If you add a GitHub username, we fetch your public repos and avatar from GitHub's public API.",
        "We only store your GitHub username — not your GitHub token or any private data.",
        "Everything fetched from GitHub is already public on GitHub itself.",
      ],
    },
    {
      title: "Authentication",
      content: [
        "You can sign in with Google or email/password.",
        "Google sign-in uses OAuth — we never see your Google password.",
        "Sessions are handled via JWT tokens stored in secure, HTTP-only cookies.",
      ],
    },
    {
      title: "Your data, your call",
      content: [
        "You can delete any log you've posted at any time from your dashboard.",
        "You can update or remove your profile info whenever you want.",
        "Want your account fully deleted? Email us and we'll wipe everything.",
      ],
    },
    {
      title: "Third-party services",
      content: [
        "**Vercel** — hosts the app. They have their own privacy policy.",
        "**Neon / PostgreSQL** — stores your data securely in the cloud.",
        "**NextAuth.js** — handles authentication flows.",
        "**GitHub API** — used only to fetch public profile and repo data.",
      ],
    },
    {
      title: "Changes to this policy",
      content: [
        "If we make significant changes, we'll update this page and change the date below.",
        "We won't spam your email about minor wording tweaks.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-sm border border-[#21262d] bg-[#0d1117]">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5c7082]">
              Last updated · March 2026
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#e6edf3] mb-2">
            Privacy Policy<span className="text-[#58a6ff]">_</span>
          </h1>
          <p className="text-sm text-[#5c7082] leading-relaxed">
            Plain English, no lawyer-speak. Here's exactly what DevLog does with your data.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map(({ title, content }) => (
            <div key={title} className="bg-[#161b22] border border-[#21262d] rounded-xl p-5">
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#58a6ff] mb-4">{title}</h2>
              <ul className="space-y-2.5">
                {content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#8b949e] leading-relaxed">
                    <span className="text-[#484f58] font-mono mt-0.5 flex-shrink-0">—</span>
                    <span dangerouslySetInnerHTML={{
                      __html: item.replace(/\*\*(.*?)\*\*/g, '<span class="text-[#e6edf3] font-semibold">$1</span>')
                    }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#21262d] to-transparent" />

        {/* Contact */}
        <div className="text-center space-y-2">
          <p className="font-mono text-xs text-[#484f58]">Questions about your data?</p>
          <a href="mailto:visheshmalik.dev@gmail.com" className="font-mono text-sm text-[#58a6ff] hover:underline">
            visheshmalik.dev@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}