import { Share2 } from "lucide-react";

interface Props {
  label: string;
  bio: string;
  slug: string;
  analyzedAt: string;
}

export default function PersonalityCard({ label, bio, slug, analyzedAt }: Props) {
  const date = new Date(analyzedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1DB954]/20 via-[#1DB954]/5 to-transparent border border-[#1DB954]/20 p-8">
      {/* Background glow */}
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
            Share profile
          </a>
          <span className="text-xs text-white/30">Last updated {date}</span>
        </div>
      </div>
    </div>
  );
}
