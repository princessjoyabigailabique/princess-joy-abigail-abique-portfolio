import { ImageResponse } from "next/og";
export const alt = "Princess Joy Abigail Abique — IT Student Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#0a0714,#2a1560)", color: "#f4f1ff" }}>
        <div style={{ fontSize: 30, color: "#a855f7" }}>ABIQUE</div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 16 }}>Princess Joy Abigail Abique</div>
        <div style={{ fontSize: 34, marginTop: 20, color: "#c9bfe8" }}>4th-year BSIT student · Cybersecurity · AI &amp; Automation · Networking · IT Support</div>
      </div>
    ),
    size,
  );
}
