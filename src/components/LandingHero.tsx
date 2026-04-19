"use client";

import { signIn } from "next-auth/react";

const FEATURES = [
  { icon: "🎵", label: "Top genres & artists" },
  { icon: "⚡", label: "Energy & mood profile" },
  { icon: "🌙", label: "Listening time patterns" },
  { icon: "🔗", label: "Shareable profile link" },
];

export default function LandingHero() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1DB954]/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#1DB954]/5 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-1.5 text-sm text-[#1DB954]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
          Connect your Spotify in seconds
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Discover your{" "}
          <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
            music personality
          </span>
        </h1>

        <p className="mb-10 text-lg text-white/60 sm:text-xl">
          Analyze your Spotify listening history and get a beautiful,
          shareable breakdown of who you are as a listener.
        </p>

        <button
          onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
          className="group relative inline-flex items-center gap-3 rounded-full bg-[#1DB954] px-8 py-4 text-lg font-semibold text-black transition hover:bg-[#1ed760] active:scale-95"
        >
          <SpotifyIcon />
          Connect with Spotify
        </button>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-sm"
            >
              <div className="mb-2 text-2xl">{f.icon}</div>
              <div className="text-sm text-white/70">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
