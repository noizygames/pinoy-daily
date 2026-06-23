import { forwardRef } from "react";

type Props = {
  prediction: string;
  luckyNumber: number;
  colorName: string;
  colorHex: string;
  categoryColor: string;
  dateString: string;
  categoryEmoji: string;
  categoryLabel: string;
  isAiGenerated?: boolean;
};

const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  {
    prediction,
    luckyNumber,
    colorName,
    colorHex,
    categoryColor,
    categoryEmoji,
    categoryLabel,
    isAiGenerated = false,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      id="share-card"
      style={{
        boxSizing: "border-box",
        width: "400px",
        height: "400px",
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        border: `3px solid ${categoryColor}`,
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#171717",
        overflow: "hidden",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            🌟 Pinoy Daily
          </span>
          {isAiGenerated && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#171717",
                backgroundColor: "#FFD700",
                borderRadius: "999px",
                padding: "4px 10px",
              }}
            >
              ✨ AI
            </span>
          )}
        </div>

        <span
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: 600,
            color: "#ffffff",
            backgroundColor: categoryColor,
            borderRadius: "999px",
            padding: "4px 12px",
          }}
        >
          {categoryEmoji} {categoryLabel}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 4px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            lineHeight: 1.35,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          &ldquo;{prediction}&rdquo;
        </p>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            🍀 {luckyNumber}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "18px",
                height: "18px",
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
            textAlign: "center",
            fontSize: "10px",
            color: "#9CA3AF",
            letterSpacing: "0.04em",
          }}
        >
          pinoy-daily.vercel.app
        </div>
      </div>
    </div>
  );
});

export default ShareCard;
