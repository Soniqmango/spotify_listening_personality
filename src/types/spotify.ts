export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; width: number; height: number }[];
  popularity: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  preview_url: string | null;
  duration_ms: number;
}

export interface SpotifyAudioFeatures {
  id: string;
  energy: number;
  valence: number;
  danceability: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  loudness: number;
}

export interface SpotifyRecentTrack {
  track: SpotifyTrack;
  played_at: string;
}

export interface MoodProfile {
  energy: number;
  valence: number;
  danceability: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
}

export interface ListeningPatterns {
  peakHour: number;
  peakDayOfWeek: number;
  heatmap: Record<string, number>;
}

export interface AnalysisResult {
  topGenres: string[];
  genreCounts: Record<string, number>;
  topArtistNames: string[];
  topArtistIds: string[];
  moodProfile: MoodProfile;
  listeningPatterns: ListeningPatterns;
  personalityLabel: string;
  personalityBio: string;
}
