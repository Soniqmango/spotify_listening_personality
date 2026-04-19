import Image from "next/image";
import { Music } from "lucide-react";

interface Track {
  id: string;
  spotify_id: string;
  track_name: string;
  artist_name: string;
  album_art: string | null;
  energy: number | null;
  valence: number | null;
  danceability: number | null;
  rank: number;
}

interface Props {
  tracks: Track[];
}

function StatBar({ value, color }: { value: number | null; color: string }) {
  if (value === null) return null;
  return (
    <div className="h-1 w-12 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.round(value * 100)}%`, background: color }}
      />
    </div>
  );
}

export default function TopTracksList({ tracks }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">
        Top Tracks
      </h3>
      <div className="space-y-2">
        {tracks.map((track) => (
          <a
            key={track.id}
            href={`https://open.spotify.com/track/${track.spotify_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/5"
          >
            <span className="w-5 text-right text-xs font-bold text-white/20">
              {track.rank}
            </span>

            {track.album_art ? (
              <Image
                src={track.album_art}
                alt={track.track_name}
                width={40}
                height={40}
                className="rounded-md"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
                <Music size={16} className="text-white/30" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white group-hover:text-[#1DB954] transition-colors">
                {track.track_name}
              </p>
              <p className="truncate text-xs text-white/50">{track.artist_name}</p>
            </div>

            <div className="hidden flex-col items-end gap-1 sm:flex">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/30">E</span>
                <StatBar value={track.energy} color="#1DB954" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/30">V</span>
                <StatBar value={track.valence} color="#a855f7" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
