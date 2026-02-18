import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            fontSize: "18px",
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
