import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLatestAnalysis, getTopTracksForAnalysis } from "@/lib/db/queries";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import AnalyzeTrigger from "@/components/dashboard/AnalyzeTrigger";
import PersonalityCard from "@/components/dashboard/PersonalityCard";
import MoodRadar from "@/components/dashboard/MoodRadar";
import GenreBar from "@/components/dashboard/GenreBar";
import ListeningHeatmap from "@/components/dashboard/ListeningHeatmap";
import TopArtistsList from "@/components/dashboard/TopArtistsList";
import TopTracksList from "@/components/dashboard/TopTracksList";

const STALE_DAYS = 7;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const analysis = await getLatestAnalysis(session.spotifyId);

  // No analysis yet — trigger one automatically
  if (!analysis) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <DashboardHeader session={session} />
        <AnalyzeTrigger />
      </div>
    );
  }

  const topTracks = await getTopTracksForAnalysis(analysis.id);

  const isStale =
    Date.now() - new Date(analysis.analyzed_at).getTime() >
    STALE_DAYS * 24 * 60 * 60 * 1000;

  const genreCounts: Record<string, number> = analysis.genre_counts ?? {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <DashboardHeader session={session} isStale={isStale} />

      <div className="space-y-6">
        {/* Hero personality card */}
        <PersonalityCard
          label={analysis.personality_label}
          bio={analysis.personality_bio}
          slug={analysis.share_slug}
          analyzedAt={analysis.analyzed_at}
        />

        {/* Charts row */}
        <div className="grid gap-6 md:grid-cols-2">
          <MoodRadar
            energy={analysis.avg_energy}
            valence={analysis.avg_valence}
            danceability={analysis.avg_danceability}
            acousticness={analysis.avg_acousticness}
            instrumentalness={analysis.avg_instrumentalness}
          />
          <GenreBar
            genres={analysis.top_genres ?? []}
            counts={genreCounts}
          />
        </div>

        {/* Heatmap full width */}
        <ListeningHeatmap
          heatmap={analysis.listening_heatmap ?? {}}
          peakHour={analysis.peak_hour}
          peakDayOfWeek={analysis.peak_day_of_week}
        />

        {/* Artists + tracks row */}
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

import type { Session } from "next-auth";

function DashboardHeader({
  session,
  isStale,
}: {
  session: Session | null;
  isStale?: boolean;
}) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User"}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">
            {session?.user?.name?.split(" ")[0]}&apos;s Personality
          </h1>
          <p className="text-sm text-white/40">{session?.user?.email}</p>
        </div>
      </div>

      {isStale && (
        <form action="/api/analyze" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-[#1DB954]/40 hover:text-[#1DB954]"
          >
            <RefreshCw size={13} />
            Refresh analysis
          </button>
        </form>
      )}
    </div>
  );
}
