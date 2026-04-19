import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getTopArtists,
  getTopTracks,
  getAudioFeatures,
  getRecentTracks,
} from "@/lib/spotify/fetchers";
import { buildAnalysisResult } from "@/lib/spotify/analyzer";
import { upsertUser, insertAnalysis, insertTopTracks } from "@/lib/db/queries";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accessToken, refreshToken, spotifyId } = session;

  try {
    // Fetch all Spotify data in parallel where possible
    const [artists, tracks, recentTracks] = await Promise.all([
      getTopArtists(accessToken, refreshToken),
      getTopTracks(accessToken, refreshToken),
      getRecentTracks(accessToken, refreshToken),
    ]);

    // Audio features depends on track IDs
    const trackIds = tracks.map((t) => t.id);
    const audioFeatures = await getAudioFeatures(trackIds, accessToken, refreshToken);

    // Build analysis
    const result = buildAnalysisResult(artists, audioFeatures, recentTracks);

    // Persist to DB
    const userId = await upsertUser({
      spotifyId,
      displayName: session.user?.name ?? null,
      avatarUrl: session.user?.image ?? null,
      email: session.user?.email ?? null,
    });

    const { id: analysisId, slug } = await insertAnalysis({ userId, spotifyId, result });

    await insertTopTracks({ analysisId, tracks, features: audioFeatures });

    return NextResponse.json({ slug, label: result.personalityLabel });
  } catch (err) {
    console.error("[analyze]", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
