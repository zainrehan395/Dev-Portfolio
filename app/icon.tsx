import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const BRAND = "#34d399";
const INK = "#0c0f0d";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: INK,
          borderRadius: 7,
          color: BRAND,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: -1,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Z
      </div>
    ),
    { ...size }
  );
}
