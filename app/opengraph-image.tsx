import { ImageResponse } from "next/og";

export const alt = "Ora: Draw near to God";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#0f1626",
          color: "#f8f4ea",
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: 8, color: "#d9b45a", textTransform: "uppercase" }}>Ora</div>
        <div style={{ fontSize: 108, marginTop: 24, lineHeight: 1.05, fontFamily: "serif" }}>Draw near to God</div>
        <div style={{ fontSize: 36, marginTop: 36, color: "#c9cfdd" }}>
          A Catholic prayer app: pray the Rosary, keep your prayers.
        </div>
      </div>
    ),
    size,
  );
}
