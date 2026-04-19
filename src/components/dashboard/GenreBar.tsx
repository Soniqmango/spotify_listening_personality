"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  genres: string[];
  counts: Record<string, number>;
}

export default function GenreBar({ genres, counts }: Props) {
  const data = genres.map((genre) => ({
    genre: genre.length > 18 ? genre.slice(0, 16) + "…" : genre,
    fullGenre: genre,
    count: counts[genre] ?? 1,
  }));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/50">
        Top Genres
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="genre"
            width={130}
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
              fontSize: 13,
            }}
            formatter={(value, _, props) => [
              `${value} artist${value !== 1 ? "s" : ""}`,
              (props as { payload?: { fullGenre?: string } }).payload?.fullGenre ?? "",
            ]}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={`rgba(29,185,84,${1 - i * 0.15})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
