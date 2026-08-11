import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.legalName} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#10130f",
          padding: "72px 80px",
          color: "#f7f4ec",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* soft glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(127,200,162,0.32), rgba(127,200,162,0))",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#1a1e18",
              border: "2px solid #7fc8a2",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 34, letterSpacing: -0.5 }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 34,
              color: "#146b4a",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Solar · Inverters · Batteries · Service
          </div>
          <div style={{ fontSize: 74, lineHeight: 1.02, letterSpacing: -1.5, maxWidth: 960 }}>
            End the blackouts. Silence the generator.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "rgba(247,244,236,0.6)" }}>
          Genuine products · Expert installation · Trusted after-sales
        </div>
      </div>
    ),
    { ...size },
  );
}
