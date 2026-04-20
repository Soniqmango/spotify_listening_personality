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
import { upsertUser, insertAnalysis, insertTopTracks, getLatestAnalysis } from "@/lib/db/queries";

const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hour between analyses

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accessToken, refreshToken, spotifyId } = session;

  // Rate limit: reject if last analysis was less than 1 hour ago
  const existing = await getLatestAnalysis(spotifyId);
  if (existing) {
    const age = Date.now() - new Date(existing.analyzed_at).getTime();
    if (age < RATE_LIMIT_MS) {
      const retryAfterSec = Math.ceil((RATE_LIMIT_MS - age) / 1000);
      return NextResponse.json(
        { error: "Analysis was run recently. Please wait before refreshing.", retryAfter: retryAfterSec },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
      );
    }
  }

  try {
    const [artists, tracks, recentTracks] = await Promise.all([
      getTopArtists(accessToken, refreshToken),
      getTopTracks(accessToken, refreshToken),
      getRecentTracks(accessToken, refreshToken),
    ]);

    const trackIds = tracks.map((t) => t.id);
    const audioFeatures = await getAudioFeatures(trackIds, accessToken, refreshToken);

    const result = buildAnalysisResult(artists, audioFeatures, recentTracks);

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
