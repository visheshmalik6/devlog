"use client";

import { useState } from "react";

export default function FollowButton({
  username,
  initialFollowing,
}: {
  username: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setFollowing(data.following);
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-md border transition-colors disabled:opacity-50 ${
        following
          ? "text-[#8b949e] border-[#30363d] bg-[#21262d] hover:border-[#f85149] hover:text-[#f85149]"
          : "text-white bg-[#238636] border-[#238636] hover:bg-[#2ea043] hover:border-[#2ea043]"
      }`}
    >
      {loading ? "..." : following ? "Unfollow" : "Follow"}
    </button>
  );
}