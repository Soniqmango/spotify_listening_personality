import { forwardRef } from "react";

interface Analysis {
  personality_label: string;
  personality_bio: string;
  top_genres: string[] | null;
  top_artist_names: string[] | null;
  avg_energy: number;
  avg_valence: number;
  avg_danceability: number;
  share_slug: string;
}

interface Props {
  analysis: Analysis;
}

const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { analysis },
  ref
) {
  const energy = Math.round((analysis.avg_energy ?? 0) * 100);
  const valence = Math.round((analysis.avg_valence ?? 0) * 100);
  const danceability = Math.round((analysis.avg_danceability ?? 0) * 100);
  const genres = (analysis.top_genres ?? []).slice(0, 3);
  const artists = (analysis.top_artist_names ?? []).slice(0, 5);

  return (
    <div
      ref={ref}
      style={{
        width: 540,
        height: 960,
        background: "linear-gradient(160deg, #0a0a0a 0%, #0d2016 40%, #0a0a0a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 40px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(29,185,84,0.08)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#1DB954",
            }}
          />
          <span
            style={{
              color: "#1DB954",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Spotify Personality
          </span>
        </div>

        <div
          style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 8 }}
        >
          My music personality is
        </div>
        <div
          style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}
        >
          {analysis.personality_label}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          {analysis.personality_bio?.slice(0, 140)}
          {(analysis.personality_bio?.length ?? 0) > 140 ? "…" : ""}
        </div>
      </div>

      {/* Genres */}
      <div>
        <div
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Top Genres
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {genres.map((g) => (
            <div
              key={g}
              style={{
                padding: "5px 14px",
                borderRadius: 99,
                border: "1px solid rgba(29,185,84,0.35)",
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

      {/* Top artists */}
      <div>
        <div
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Top Artists
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {artists.map((name, i) => (
            <div
              key={name}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <span
                style={{
                  width: 20,
                  color: "rgba(255,255,255,0.2)",
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: "right",
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{name}</span>
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: `rgba(29,185,84,${0.9 - i * 0.15})`,
                  borderRadius: 1,
                  maxWidth: 100 - i * 15,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mood bars */}
      <div>
        <div
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Mood Profile
        </div>
        {[
          { label: "Energy", value: energy },
          { label: "Positivity", value: valence },
          { label: "Danceability", value: danceability },
        ].map((stat) => (
          <div key={stat.label} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                {stat.label}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1DB954" }}>
                {stat.value}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 4,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  width: `${stat.value}%`,
                  height: "100%",
                  background: "#1DB954",
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
          spotify-personality.vercel.app
        </span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
          #{analysis.share_slug}
        </span>
      </div>
    </div>
  );
});

export default ShareCard;
