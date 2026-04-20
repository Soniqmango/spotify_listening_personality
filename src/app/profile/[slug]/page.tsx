import { notFound } from "next/navigation";
import { getAnalysisBySlug, getTopTracksForAnalysis } from "@/lib/db/queries";
import MoodRadar from "@/components/dashboard/MoodRadar";
import GenreBar from "@/components/dashboard/GenreBar";
import ListeningHeatmap from "@/components/dashboard/ListeningHeatmap";
import TopArtistsList from "@/components/dashboard/TopArtistsList";
import TopTracksList from "@/components/dashboard/TopTracksList";
import DownloadCardButton from "@/components/DownloadCardButton";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const analysis = await getAnalysisBySlug(params.slug);
  if (!analysis) return { title: "Profile not found" };

  return {
    title: `${analysis.personality_label} — Spotify Personality`,
    description: analysis.personality_bio,
    openGraph: {
      title: analysis.personality_label,
      description: analysis.personality_bio,
      images: [`/api/og/${params.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: analysis.personality_label,
      description: analysis.personality_bio,
      images: [`/api/og/${params.slug}`],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const analysis = await getAnalysisBySlug(params.slug);
  if (!analysis) notFound();

  const topTracks = await getTopTracksForAnalysis(analysis.id);
  const genreCounts: Record<string, number> = analysis.genre_counts ?? {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#1DB954]">
          Spotify Listening Personality
        </p>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          {analysis.personality_label}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-white/60">
          {analysis.personality_bio}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <DownloadCardButton analysis={analysis} />
          <a
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:border-[#1DB954]/40 hover:text-[#1DB954]"
          >
            Get your own →
          </a>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <MoodRadar
            energy={analysis.avg_energy}
            valence={analysis.avg_valence}
            danceability={analysis.avg_danceability}
            acousticness={analysis.avg_acousticness}
            instrumentalness={analysis.avg_instrumentalness}
          />
          <GenreBar genres={analysis.top_genres ?? []} counts={genreCounts} />
        </div>

        <ListeningHeatmap
          heatmap={analysis.listening_heatmap ?? {}}
          peakHour={analysis.peak_hour}
          peakDayOfWeek={analysis.peak_day_of_week}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <TopArtistsList
            names={analysis.top_artist_names ?? []}
            ids={analysis.top_artist_ids ?? []}
          />
          <TopTracksList tracks={topTracks} />
        </div>
      </div>

    </div>
  );
}
