import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#004A80",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 800 }}>INFO-L@N</div>
      <div style={{ marginTop: 24, fontSize: 34 }}>
        Equipment · Installation · Maintenance
      </div>
    </div>,
    size,
  );
}
