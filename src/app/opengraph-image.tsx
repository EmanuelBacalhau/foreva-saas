import { ImageResponse } from "next/og";

export const alt = "Foreva — Cartas de amor eternas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #ffd1e8 0%, #ffe6f1 35%, #f5d6ff 70%, #d6e8ff 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            fontSize: 44,
            color: "#ff3d8a",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 56 }}>♡</span>
          <span style={{ fontWeight: 700, letterSpacing: -1 }}>Foreva</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#a83370",
              letterSpacing: 8,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            ✿ Cartas de amor eternas ✿
          </div>
          <div
            style={{
              fontSize: 112,
              fontWeight: 800,
              color: "#2a0a1a",
              letterSpacing: -4,
              lineHeight: 1,
              maxWidth: 1000,
            }}
          >
            Uma carta que <span style={{ color: "#ff3d8a" }}>não some</span>.
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#5a2a40",
              maxWidth: 900,
              lineHeight: 1.3,
              marginTop: 12,
            }}
          >
            Fotos, senha e PIX único. Eterna na internet.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "#7a3a55",
            fontWeight: 500,
          }}
        >
          <span style={{ color: "#ff3d8a", fontSize: 32 }}>♡</span>
          foreva.com.br
          <span style={{ color: "#ff3d8a", fontSize: 32 }}>♡</span>
        </div>
      </div>
    ),
    size,
  );
}
