"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import AuthButton from "./AuthButton";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">
            Spotify <span className="text-[#1DB954]">Personality</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {session?.user && (
            <Link
              href="/dashboard"
              className="hidden text-sm text-white/70 transition hover:text-white sm:block"
            >
              My Dashboard
            </Link>
          )}
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User avatar"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
