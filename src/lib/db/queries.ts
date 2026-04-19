import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import type { AnalysisResult, SpotifyTrack, SpotifyAudioFeatures } from "@/types/spotify";

// Service-role client for server-side writes (bypasses RLS)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface UpsertUserParams {
  spotifyId: string;
  displayName: string | null;
  avatarUrl: string | null;
  email: string | null;
}

export async function upsertUser(params: UpsertUserParams): Promise<string> {
  const db = getServiceClient();

  const { data, error } = await db
    .from("users")
    .upsert(
      {
        spotify_id: params.spotifyId,
        display_name: params.displayName,
        avatar_url: params.avatarUrl,
        email: params.email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "spotify_id" }
    )
    .select("id")
    .single();

  if (error) throw new Error(`upsertUser: ${error.message}`);
  return data.id as string;
}

export interface InsertAnalysisParams {
  userId: string;
  spotifyId: string;
  result: AnalysisResult;
}

export async function insertAnalysis(
  params: InsertAnalysisParams
): Promise<{ id: string; slug: string }> {
  const db = getServiceClient();
  const slug = nanoid(10);

  const { data, error } = await db
    .from("analyses")
    .insert({
      user_id: params.userId,
      spotify_id: params.spotifyId,
      analyzed_at: new Date().toISOString(),
      top_genres: params.result.topGenres,
      top_artist_names: params.result.topArtistNames,
      top_artist_ids: params.result.topArtistIds,
      avg_energy: params.result.moodProfile.energy,
      avg_valence: params.result.moodProfile.valence,
      avg_danceability: params.result.moodProfile.danceability,
      avg_tempo: params.result.moodProfile.tempo,
      avg_acousticness: params.result.moodProfile.acousticness,
      avg_instrumentalness: params.result.moodProfile.instrumentalness,
      peak_hour: params.result.listeningPatterns.peakHour,
      peak_day_of_week: params.result.listeningPatterns.peakDayOfWeek,
      listening_heatmap: params.result.listeningPatterns.heatmap,
      genre_counts: params.result.genreCounts,
      personality_label: params.result.personalityLabel,
      personality_bio: params.result.personalityBio,
      share_slug: slug,
      is_public: true,
    })
    .select("id, share_slug")
    .single();

  if (error) throw new Error(`insertAnalysis: ${error.message}`);
  return { id: data.id as string, slug: data.share_slug as string };
}

export interface InsertTopTracksParams {
  analysisId: string;
  tracks: SpotifyTrack[];
  features: SpotifyAudioFeatures[];
}

export async function insertTopTracks(params: InsertTopTracksParams): Promise<void> {
  const db = getServiceClient();
  const featureMap = new Map(params.features.map((f) => [f.id, f]));

  const rows = params.tracks.slice(0, 20).map((track, i) => {
    const f = featureMap.get(track.id);
    return {
      analysis_id: params.analysisId,
      spotify_id: track.id,
      track_name: track.name,
      artist_name: track.artists[0]?.name ?? "",
      album_name: track.album.name,
      album_art: track.album.images[0]?.url ?? null,
      preview_url: track.preview_url,
      energy: f?.energy ?? null,
      valence: f?.valence ?? null,
      danceability: f?.danceability ?? null,
      tempo: f?.tempo ?? null,
      rank: i + 1,
    };
  });

  const { error } = await db.from("top_tracks").insert(rows);
  if (error) throw new Error(`insertTopTracks: ${error.message}`);
}

export async function getLatestAnalysis(spotifyId: string) {
  const db = getServiceClient();

  const { data, error } = await db
    .from("analyses")
    .select("*")
    .eq("spotify_id", spotifyId)
    .order("analyzed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`getLatestAnalysis: ${error.message}`);
  return data;
}

export async function getAnalysisBySlug(slug: string) {
  const db = getServiceClient();

  const { data, error } = await db
    .from("analyses")
    .select("*")
    .eq("share_slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (error) throw new Error(`getAnalysisBySlug: ${error.message}`);
  return data;
}

export async function getTopTracksForAnalysis(analysisId: string) {
  const db = getServiceClient();

  const { data, error } = await db
    .from("top_tracks")
    .select("*")
    .eq("analysis_id", analysisId)
    .order("rank", { ascending: true });

  if (error) throw new Error(`getTopTracksForAnalysis: ${error.message}`);
  return data ?? [];
}
