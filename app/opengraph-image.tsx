import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/config";

export const alt = SITE_CONFIG.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#34d399";
const INK = "#0c0f0d";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            color: "rgba(243,243,243,0.45)",
            textTransform: "uppercase",
          }}
        >
          <span>{SITE_CONFIG.location}</span>
          <span>Open to work</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 24,
              letterSpacing: 6,
              color: BRAND,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Software Engineer
          </span>
          <span
            style={{
              fontSize: 92,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            Zain-ul-Abideen
          </span>
          <span
            style={{
              marginTop: 26,
              fontSize: 28,
              color: "rgba(243,243,243,0.62)",
              lineHeight: 1.4,
              maxWidth: 920,
            }}
          >
            React · Next.js · TypeScript · Node.js · AWS
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 4, background: BRAND }} />
          <span
            style={{
              fontSize: 22,
              letterSpacing: 2,
              color: "rgba(243,243,243,0.8)",
              textTransform: "uppercase",
            }}
          >
            2 years shipping production product software
          </span>
        </div>
      </div>
    ),
    size
  );
}
