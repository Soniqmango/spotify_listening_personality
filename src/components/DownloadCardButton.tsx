"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import ShareCard from "./ShareCard";

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
  analysis: Analysis;
}

export default function DownloadCardButton({ analysis }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `spotify-personality-${analysis.share_slug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate card image", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hidden off-screen card used for image capture */}
      <div
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          pointerEvents: "none",
          zIndex: -1,
        }}
        aria-hidden
      >
        <ShareCard ref={cardRef} analysis={analysis} />
      </div>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
      >
        <Download size={14} />
        {loading ? "Generating…" : "Download card"}
      </button>
    </>
  );
}
