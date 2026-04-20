import { ImageResponse } from "next/og";
import { getAnalysisBySlug } from "@/lib/db/queries";

export const runtime = "edge";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const analysis = await getAnalysisBySlug(params.slug);

  if (!analysis) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#fff",
            fontSize: 32,
          }}
        >
          Profile not found
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const energy = Math.round((analysis.avg_energy ?? 0) * 100);
  const valence = Math.round((analysis.avg_valence ?? 0) * 100);
  const danceability = Math.round((analysis.avg_danceability ?? 0) * 100);
  const genres: string[] = (analysis.top_genres ?? []).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #0d1f14 50%, #0a0a0a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#1DB954",
            }}
          />
          <span style={{ color: "#1DB954", fontSize: 16, fontWeight: 700, letterSpacing: 3 }}>
            SPOTIFY LISTENING PERSONALITY
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 22 }}>Your music personality</div>
          <div style={{ color: "#fff", fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
            {analysis.personality_label}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 24, maxWidth: 700, lineHeight: 1.4 }}>
            {analysis.personality_bio?.slice(0, 120)}…
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {/* Mood stats */}
          <div style={{ display: "flex", gap: 32 }}>
            {[
              { label: "Energy", value: energy },
              { label: "Positivity", value: valence },
              { label: "Danceability", value: danceability },
            ].map((stat) => (
              <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, letterSpacing: 1 }}>
                  {stat.label.toUpperCase()}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 100,
                      height: 6,
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 3,
                      overflow: "hidden",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: `${stat.value}%`,
                        height: "100%",
                        background: "#1DB954",
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>
                    {stat.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Genres */}
          <div style={{ display: "flex", gap: 8 }}>
            {genres.map((g) => (
              <div
                key={g}
                style={{
                  padding: "6px 14px",
                  borderRadius: 99,
                  border: "1px solid rgba(29,185,84,0.4)",
                  color: "#1DB954",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {g}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
