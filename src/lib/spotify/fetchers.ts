import type {
  SpotifyArtist,
  SpotifyAudioFeatures,
  SpotifyRecentTrack,
  SpotifyTrack,
} from "@/types/spotify";

const BASE = "https://api.spotify.com/v1";

async function spotifyFetch<T>(
  path: string,
  accessToken: string,
  refreshToken: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  // Token expired — refresh and retry once
  if (res.status === 401) {
    const newToken = await refreshSpotifyToken(refreshToken);
    const retried = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!retried.ok) throw new Error(`Spotify API error: ${retried.status}`);
    return retried.json() as Promise<T>;
  }

  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
  return res.json() as Promise<T>;
}

async function refreshSpotifyToken(refreshToken: string): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to refresh Spotify token");
  return data.access_token as string;
}

export async function getTopArtists(
  accessToken: string,
  refreshToken: string,
  limit = 20
): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch<{ items: SpotifyArtist[] }>(
    `/me/top/artists?limit=${limit}&time_range=medium_term`,
    accessToken,
    refreshToken
  );
  return data.items;
}

export async function getTopTracks(
  accessToken: string,
  refreshToken: string,
  limit = 20
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ items: SpotifyTrack[] }>(
    `/me/top/tracks?limit=${limit}&time_range=medium_term`,
    accessToken,
    refreshToken
  );
  return data.items;
}

export async function getAudioFeatures(
  trackIds: string[],
  accessToken: string,
  refreshToken: string
): Promise<SpotifyAudioFeatures[]> {
  if (trackIds.length === 0) return [];
  const data = await spotifyFetch<{ audio_features: SpotifyAudioFeatures[] }>(
    `/audio-features?ids=${trackIds.slice(0, 100).join(",")}`,
    accessToken,
    refreshToken
  );
  return data.audio_features.filter(Boolean);
}

export async function getRecentTracks(
  accessToken: string,
  refreshToken: string,
  limit = 50
): Promise<SpotifyRecentTrack[]> {
  const data = await spotifyFetch<{ items: SpotifyRecentTrack[] }>(
    `/me/player/recently-played?limit=${limit}`,
    accessToken,
    refreshToken
  );
  return data.items;
}
