const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number) {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  return h < 12 ? `${h}a` : `${h - 12}p`;
}

interface Props {
  heatmap: Record<string, number>;
  peakHour: number;
  peakDayOfWeek: number;
}

export default function ListeningHeatmap({ heatmap, peakHour, peakDayOfWeek }: Props) {
  const maxCount = Math.max(...Object.values(heatmap), 1);

  // Since heatmap only has hour data (not hour×day), distribute evenly across days
  // and use hour intensity for colour
  function intensity(hour: number) {
    const count = heatmap[hour.toString()] ?? 0;
    return count / maxCount;
  }

  function bgClass(hour: number) {
    const v = intensity(hour);
    if (v === 0) return "bg-white/5";
    if (v < 0.2) return "bg-[#1DB954]/20";
    if (v < 0.4) return "bg-[#1DB954]/35";
    if (v < 0.6) return "bg-[#1DB954]/55";
    if (v < 0.8) return "bg-[#1DB954]/75";
    return "bg-[#1DB954]";
  }

  const peakLabel = `${DAYS[peakDayOfWeek]}s around ${formatHour(peakHour)}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-widest text-white/50">
        Listening Patterns
      </h3>
      <p className="mb-4 text-xs text-white/40">
        Peak listening time: <span className="text-[#1DB954]">{peakLabel}</span>
      </p>

      {/* Hour labels */}
      <div className="mb-1 ml-8 grid grid-cols-12 gap-0.5">
        {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((h) => (
          <span key={h} className="text-center text-[9px] text-white/30">
            {formatHour(h)}
          </span>
        ))}
      </div>

      <div className="space-y-0.5">
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="flex items-center gap-0.5">
            <span className="w-7 text-right text-[10px] text-white/30 mr-1">{day}</span>
            {HOURS.map((hour) => (
              <div
                key={hour}
                title={`${day} ${formatHour(hour)}: ${heatmap[hour.toString()] ?? 0} plays`}
                className={`h-4 flex-1 rounded-sm transition-colors ${bgClass(hour)} ${
                  hour === peakHour && dayIdx === peakDayOfWeek
                    ? "ring-1 ring-white/40"
                    : ""
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 justify-end">
        <span className="text-[10px] text-white/30">Less</span>
        {["bg-white/5", "bg-[#1DB954]/20", "bg-[#1DB954]/40", "bg-[#1DB954]/70", "bg-[#1DB954]"].map(
          (cls, i) => (
            <div key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
          )
        )}
        <span className="text-[10px] text-white/30">More</span>
      </div>
    </div>
  );
}
