import { ImageResponse } from "next/og";

export const alt = "Foreva - Cartas de amor eternas";
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
          fontFamily: "sans-serif",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 56,
              color: "#ff3d8a",
              marginRight: 16,
              display: "flex",
            }}
          >
            💌
          </div>
          <div
            style={{
              fontSize: 44,
              color: "#ff3d8a",
              fontWeight: 700,
              letterSpacing: -1,
              display: "flex",
            }}
          >
            Foreva
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#a83370",
              letterSpacing: 8,
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 24,
              display: "flex",
            }}
          >
            Cartas de amor eternas
          </div>
          <div
            style={{
              fontSize: 108,
              fontWeight: 800,
              color: "#2a0a1a",
              letterSpacing: -4,
              lineHeight: 1,
              maxWidth: 1000,
              display: "flex",
            }}
          >
            Uma carta que não some.
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#5a2a40",
              maxWidth: 900,
              lineHeight: 1.3,
              marginTop: 36,
              display: "flex",
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
            fontSize: 26,
            color: "#7a3a55",
            fontWeight: 500,
          }}
        >
          <div style={{ marginRight: 16, display: "flex" }}>💕</div>
          <div style={{ display: "flex" }}>foreva.com.br</div>
          <div style={{ marginLeft: 16, display: "flex" }}>💕</div>
        </div>
      </div>
    ),
    size,
  );
}
