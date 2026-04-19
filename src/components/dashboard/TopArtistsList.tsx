interface Props {
  names: string[];
  ids: string[];
}

export default function TopArtistsList({ names, ids }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">
        Top Artists
      </h3>
      <ol className="space-y-3">
        {names.map((name, i) => (
          <li key={ids[i] ?? i} className="flex items-center gap-4">
            <span className="w-5 text-right text-sm font-bold text-white/20">{i + 1}</span>
            <a
              href={`https://open.spotify.com/artist/${ids[i]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-sm font-medium text-white transition hover:text-[#1DB954]"
            >
              {name}
            </a>
            <div
              className="h-1.5 rounded-full bg-[#1DB954]"
              style={{ width: `${Math.max(8, 100 - i * 18)}%`, maxWidth: 80 }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
