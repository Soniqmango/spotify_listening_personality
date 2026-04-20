import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-5xl">🎵</div>
      <h2 className="text-2xl font-bold text-white">Page not found</h2>
      <p className="max-w-sm text-sm text-white/50">
        This profile or page doesn&apos;t exist, or may have been made private.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[#1DB954] px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#1ed760]"
      >
        Go home
      </Link>
    </div>
  );
}
