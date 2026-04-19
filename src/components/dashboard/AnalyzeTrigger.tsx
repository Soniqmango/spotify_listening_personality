"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzeTrigger() {
  const router = useRouter();
  const [status, setStatus] = useState<"running" | "error">("running");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/analyze", { method: "POST" })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Analysis failed");
        }
        router.refresh();
      })
      .catch((err: Error) => {
        setStatus("error");
        setErrorMsg(err.message);
      });
  }, [router]);

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-4xl">⚠️</div>
        <p className="text-lg font-medium text-white">Analysis failed</p>
        <p className="text-white/50">{errorMsg}</p>
        <button
          onClick={() => { setStatus("running"); setErrorMsg(""); }}
          className="rounded-full bg-[#1DB954] px-6 py-2 text-sm font-semibold text-black hover:bg-[#1ed760]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#1DB954]/30" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#1DB954]/20">
          <span className="text-2xl">🎧</span>
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-white">Analyzing your listening history…</p>
        <p className="mt-1 text-sm text-white/50">Fetching top artists, tracks, and audio features</p>
      </div>
    </div>
  );
}
