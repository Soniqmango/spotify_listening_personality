"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
}

export default function MoodRadar({
  energy,
  valence,
  danceability,
  acousticness,
  instrumentalness,
}: Props) {
  const data = [
    { axis: "Energy", value: Math.round(energy * 100) },
    { axis: "Positivity", value: Math.round(valence * 100) },
    { axis: "Danceability", value: Math.round(danceability * 100) },
    { axis: "Acousticness", value: Math.round(acousticness * 100) },
    { axis: "Instrumental", value: Math.round(instrumentalness * 100) },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">
        Mood Profile
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
              fontSize: 13,
            }}
            formatter={(value) => [`${value}%`, ""]}
          />
          <Radar
            dataKey="value"
            stroke="#1DB954"
            fill="#1DB954"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
