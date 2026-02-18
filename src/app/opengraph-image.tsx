import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "OpenMedicaid — $1.09 Trillion in Medicaid Spending, Exposed";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0f1a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            display: "flex",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            marginBottom: "32px",
            fontSize: "28px",
            fontWeight: 900,
            color: "white",
          }}
        >
          M
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: "16px",
            display: "flex",
          }}
        >
          OpenMedicaid
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: "48px",
            display: "flex",
          }}
        >
          $1.09 Trillion in Medicaid Spending, Exposed
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            fontSize: "22px",
            color: "#3b82f6",
            fontWeight: 600,
          }}
        >
          <span style={{ display: "flex" }}>227M Records</span>
          <span style={{ display: "flex", color: "#475569" }}>·</span>
          <span style={{ display: "flex" }}>618K Providers</span>
          <span style={{ display: "flex", color: "#475569" }}>·</span>
          <span style={{ display: "flex" }}>1,860 Flagged</span>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#475569",
            display: "flex",
          }}
        >
          openmedicaid.org
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
