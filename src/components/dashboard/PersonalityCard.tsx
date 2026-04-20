"use client";

import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import DownloadCardButton from "@/components/DownloadCardButton";

interface Analysis {
  personality_label: string;
  personality_bio: string;
  top_genres: string[] | null;
  top_artist_names: string[] | null;
  avg_energy: number;
  avg_valence: number;
  avg_danceability: number;
  share_slug: string;
}

interface Props {
  label: string;
  bio: string;
  slug: string;
  analyzedAt: string;
  analysis: Analysis;
}

export default function PersonalityCard({ label, bio, slug, analyzedAt, analysis }: Props) {
  const [copied, setCopied] = useState(false);

  const date = new Date(analyzedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  async function copyLink() {
    const url = `${window.location.origin}/profile/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1DB954]/20 via-[#1DB954]/5 to-transparent border border-[#1DB954]/20 p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#1DB954]/10 blur-3xl" />

      <div className="relative">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1DB954]">
          Your music personality
        </p>
        <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">{label}</h2>
        <p className="mb-6 max-w-xl text-base leading-relaxed text-white/70">{bio}</p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/profile/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#1ed760]"
          >
            <Share2 size={14} />
            View public profile
          </a>

          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#1DB954]/40 hover:text-[#1DB954]"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy link"}
          </button>

          <DownloadCardButton analysis={analysis} />

          <span className="text-xs text-white/30">Last updated {date}</span>
        </div>
      </div>
    </div>
  );
}
