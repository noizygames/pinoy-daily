type ShareCardProps = {
  prediction: string;
  luckyNumber: number;
  colorName: string;
  colorHex: string;
  dateString: string;
};

export default function ShareCard({
  prediction,
  luckyNumber,
  colorName,
  colorHex,
  dateString,
}: ShareCardProps) {
  return (
    <div
      id="share-card"
      style={{
        boxSizing: "border-box",
        width: 400,
        height: 400,
        backgroundColor: "#ffffff",
        border: `6px solid ${colorHex}`,
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#171717",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          🌟 Pinoy Daily
        </span>
        <span
          style={{
            fontSize: 11,
            color: "#737373",
            textAlign: "right",
            maxWidth: 140,
            lineHeight: 1.3,
          }}
        >
          {dateString}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 4px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.35,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          &ldquo;{prediction}&rdquo;
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          🍀 {luckyNumber}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: colorHex,
              border: "1px solid rgba(0, 0, 0, 0.1)",
              flexShrink: 0,
            }}
          />
          {colorName}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 9,
          color: "#a3a3a3",
          letterSpacing: "0.04em",
        }}
      >
        pinoydaily.app
      </div>
    </div>
  );
}
