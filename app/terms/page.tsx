export default function TermsPage() {
  const sections = [
    {
      title: "The short version",
      content: [
        "Be a decent human. Don't abuse the platform.",
        "Don't post content that is illegal, hateful, or harmful.",
        "Your content is yours. We just host it.",
        "We can suspend accounts that violate these terms.",
      ],
    },
    {
      title: "Your account",
      content: [
        "You're responsible for keeping your login credentials secure.",
        "Don't impersonate other developers or create fake profiles.",
        "One account per person — no bots, no spam accounts.",
        "You must be at least 13 years old to use DevLog.",
      ],
    },
    {
      title: "Your content",
      content: [
        "You own everything you post — logs, comments, profile info.",
        "By posting public content, you give DevLog permission to display it on the platform.",
        "Private logs are only visible to you. We won't share them.",
        "Don't post content you don't have the rights to.",
      ],
    },
    {
      title: "What we provide",
      content: [
        "DevLog is provided as-is. We're a small project and stuff can break.",
        "We don't guarantee 100% uptime — but we'll do our best.",
        "Features may change or be removed as the platform evolves.",
        "We're not responsible for content posted by other users.",
      ],
    },
    {
      title: "Things that will get your account suspended",
      content: [
        "Spamming logs, comments, or follows.",
        "Harassment or targeted abuse of other users.",
        "Attempting to exploit or hack the platform.",
        "Posting illegal content of any kind.",
      ],
    },
    {
      title: "Termination",
      content: [
        "You can stop using DevLog and request account deletion at any time.",
        "We reserve the right to suspend or delete accounts that violate these terms.",
        "On termination, your public logs may remain briefly cached but will be fully removed.",
      ],
    },
    {
      title: "Changes to these terms",
      content: [
        "We may update these terms as the platform grows.",
        "Significant changes will be reflected with an updated date below.",
        "Continuing to use DevLog after changes means you accept the new terms.",
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
            Terms of Service<span className="text-[#58a6ff]">_</span>
          </h1>
          <p className="text-sm text-[#5c7082] leading-relaxed">
            No walls of legalese. Just the rules that keep DevLog a good place for everyone.
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
          <p className="font-mono text-xs text-[#484f58]">Questions about these terms?</p>
          <a href="mailto:visheshmalik.dev@gmail.com" className="font-mono text-sm text-[#58a6ff] hover:underline">
            visheshmalik.dev@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}