import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0f1a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "36px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "150px",
            height: "150px",
            borderRadius: "32px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            fontSize: "96px",
            fontWeight: 900,
            color: "white",
          }}
        >
          M
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
