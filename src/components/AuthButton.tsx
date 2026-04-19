"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-9 w-32 animate-pulse rounded-full bg-white/10" />
    );
  }

  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Log out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
      className="rounded-full bg-[#1DB954] px-5 py-2 text-sm font-semibold text-black transition hover:bg-[#1ed760]"
    >
      Connect Spotify
    </button>
  );
}
