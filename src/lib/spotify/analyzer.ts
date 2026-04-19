import type {
  AnalysisResult,
  ListeningPatterns,
  MoodProfile,
  SpotifyArtist,
  SpotifyAudioFeatures,
  SpotifyRecentTrack,
} from "@/types/spotify";

export function extractTopGenres(
  artists: SpotifyArtist[],
  topN = 5
): { genres: string[]; counts: Record<string, number> } {
  const counts: Record<string, number> = {};
  for (const artist of artists) {
    for (const genre of artist.genres) {
      counts[genre] = (counts[genre] ?? 0) + 1;
    }
  }
  const genres = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([g]) => g);
  return { genres, counts };
}

export function computeMoodProfile(
  features: SpotifyAudioFeatures[]
): MoodProfile {
  if (features.length === 0) {
    return {
      energy: 0.5,
      valence: 0.5,
      danceability: 0.5,
      tempo: 120,
      acousticness: 0.5,
      instrumentalness: 0,
    };
  }
  const sum = features.reduce(
    (acc, f) => ({
      energy: acc.energy + f.energy,
      valence: acc.valence + f.valence,
      danceability: acc.danceability + f.danceability,
      tempo: acc.tempo + f.tempo,
      acousticness: acc.acousticness + f.acousticness,
      instrumentalness: acc.instrumentalness + f.instrumentalness,
    }),
    {
      energy: 0,
      valence: 0,
      danceability: 0,
      tempo: 0,
      acousticness: 0,
      instrumentalness: 0,
    }
  );
  const n = features.length;
  return {
    energy: round3(sum.energy / n),
    valence: round3(sum.valence / n),
    danceability: round3(sum.danceability / n),
    tempo: round2(sum.tempo / n),
    acousticness: round3(sum.acousticness / n),
    instrumentalness: round3(sum.instrumentalness / n),
  };
}

export function computeListeningTimePatterns(
  recentTracks: SpotifyRecentTrack[]
): ListeningPatterns {
  const heatmap: Record<string, number> = {};
  const dayCount: Record<number, number> = {};

  for (const { played_at } of recentTracks) {
    const date = new Date(played_at);
    const hour = date.getUTCHours().toString();
    const day = date.getUTCDay();
    heatmap[hour] = (heatmap[hour] ?? 0) + 1;
    dayCount[day] = (dayCount[day] ?? 0) + 1;
  }

  const peakHour = Object.entries(heatmap).sort((a, b) => b[1] - a[1])[0];
  const peakDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0];

  return {
    peakHour: peakHour ? parseInt(peakHour[0]) : 12,
    peakDayOfWeek: peakDay ? parseInt(peakDay[0]) : 0,
    heatmap,
  };
}

// Archetypes: deterministic mapping from mood + genre signals
const ARCHETYPES: {
  label: string;
  bio: string;
  match: (m: MoodProfile, genres: string[]) => boolean;
}[] = [
  {
    label: "The Midnight Dreamer",
    bio: "You gravitate toward atmospheric, introspective soundscapes — music that feels like 3am thoughts. Low energy doesn't mean low depth; your taste runs deep and contemplative.",
    match: (m, g) =>
      m.energy < 0.45 &&
      m.valence < 0.45 &&
      hasGenre(g, ["ambient", "lo-fi", "lo fi", "chillwave", "dream pop", "shoegaze"]),
  },
  {
    label: "The Hype Machine",
    bio: "Your playlist is basically a pre-game warmup that never ends. High energy, high valence, built to move — you listen to music like it owes you a good time.",
    match: (m) => m.energy > 0.72 && m.valence > 0.65 && m.danceability > 0.65,
  },
  {
    label: "The Deep Thinker",
    bio: "Lyrics matter to you. Your listening skews acoustic and emotionally complex — music as meaning, not just sound. You probably have strong opinions about artists 'selling out'.",
    match: (m, g) =>
      m.acousticness > 0.55 &&
      m.valence < 0.5 &&
      hasGenre(g, ["singer-songwriter", "folk", "indie folk", "alternative folk"]),
  },
  {
    label: "The Genre Explorer",
    bio: "You don't have a genre — you have genres. Your listening spans multiple worlds, and you're probably the friend who always has a recommendation nobody's heard of.",
    match: (_, g) => countDistinctParentGenres(g) >= 4,
  },
  {
    label: "The Nostalgia Seeker",
    bio: "The past sounds better to you, and honestly? Fair. Your listening leans toward sounds with history — music with weight, stories, and a few decades of earned credibility.",
    match: (_, g) =>
      hasGenre(g, ["classic rock", "oldies", "80s", "70s", "soul", "motown", "classic"]),
  },
  {
    label: "The Dance Floor Architect",
    bio: "Whether or not you're actually dancing is irrelevant — your music was built for movement. High danceability, steady tempo, and a relentless forward momentum.",
    match: (m) => m.danceability > 0.72 && m.energy > 0.6,
  },
  {
    label: "The Lone Wolf",
    bio: "Instrumental, introspective, and built for solitude. You listen to music that doesn't need words — the kind that fills space without demanding attention.",
    match: (m) => m.instrumentalness > 0.4 && m.energy < 0.55,
  },
  {
    label: "The Intensity Chaser",
    bio: "You listen loud and you listen hard. High energy, low valence — your music has teeth. Whether it's metal, post-punk, or aggressive hip-hop, it hits with purpose.",
    match: (m) => m.energy > 0.72 && m.valence < 0.4,
  },
  {
    label: "The Sunshine Curator",
    bio: "Your library is basically a mood board for good vibes. High valence, accessible energy — you make playlists people actually want to listen to.",
    match: (m) => m.valence > 0.68 && m.energy > 0.45 && m.energy < 0.72,
  },
  {
    label: "The Balanced Listener",
    bio: "Your taste is broad, balanced, and hard to pin down — which is exactly the point. You adapt to context, discover constantly, and resist easy labels.",
    match: () => true, // fallback
  },
];

export function derivePersonalityLabel(
  moodProfile: MoodProfile,
  topGenres: string[]
): { label: string; bio: string } {
  for (const archetype of ARCHETYPES) {
    if (archetype.match(moodProfile, topGenres)) {
      return { label: archetype.label, bio: archetype.bio };
    }
  }
  return {
    label: "The Balanced Listener",
    bio: "Your taste is broad, balanced, and hard to pin down — which is exactly the point.",
  };
}

export function buildAnalysisResult(
  artists: SpotifyArtist[],
  audioFeatures: SpotifyAudioFeatures[],
  recentTracks: SpotifyRecentTrack[]
): AnalysisResult {
  const { genres, counts } = extractTopGenres(artists, 5);
  const moodProfile = computeMoodProfile(audioFeatures);
  const listeningPatterns = computeListeningTimePatterns(recentTracks);
  const { label, bio } = derivePersonalityLabel(moodProfile, genres);

  return {
    topGenres: genres,
    genreCounts: counts,
    topArtistNames: artists.slice(0, 5).map((a) => a.name),
    topArtistIds: artists.slice(0, 5).map((a) => a.id),
    moodProfile,
    listeningPatterns,
    personalityLabel: label,
    personalityBio: bio,
  };
}

// ── helpers ────────────────────────────────────────────────────────────────

function hasGenre(genres: string[], keywords: string[]): boolean {
  return genres.some((g) => keywords.some((kw) => g.toLowerCase().includes(kw)));
}

const PARENT_GENRES = [
  ["rock", "metal", "punk", "grunge", "alternative"],
  ["pop", "dance", "electro", "edm", "house", "techno"],
  ["hip hop", "rap", "trap", "r&b", "soul"],
  ["jazz", "blues", "swing", "bebop"],
  ["classical", "orchestral", "opera", "chamber"],
  ["folk", "country", "americana", "bluegrass"],
  ["reggae", "ska", "dancehall", "dub"],
  ["ambient", "lo-fi", "chillwave", "downtempo"],
  ["latin", "bossa nova", "samba", "flamenco"],
  ["world", "afrobeats", "k-pop", "j-pop"],
];

function countDistinctParentGenres(genres: string[]): number {
  const matched = new Set<number>();
  for (const genre of genres) {
    for (let i = 0; i < PARENT_GENRES.length; i++) {
      if (PARENT_GENRES[i].some((kw) => genre.toLowerCase().includes(kw))) {
        matched.add(i);
      }
    }
  }
  return matched.size;
}

function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
