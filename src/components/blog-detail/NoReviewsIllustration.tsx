import { useSettings } from "@/@core/hooks/useSettings";
import { Card } from "@mui/material";

const NoReviewsIllustration = () => {
  const { settings } = useSettings();
  const isDark = settings?.mode === "dark";

  const colors = isDark
    ? {
        cardFill: "#2A2540",
        cardStroke: "#4B3F7A",
        cardHeader: "#312B50",
        lineFill: "#3D3560",
        starStroke: "#5B4E8A",
        badgeFill: "#2E2450",
        badgeStroke: "#7C3AED",
        badgeStar: "#7C3AED",
        pencilBody: "#6D4AE8",
        pencilStroke: "#9B72FF",
        pencilTip: "#5535CC",
        pencilEraser: "#9B72FF",
        pencilDot: "#C4B5FD",
        sparklePrimary: "#7C3AED",
        sparkleSecondary: "#9B72FF",
        sparkleTertiary: "#C4B5FD",
        glowColor: "#7C3AED",
        headingColor: "#E2DCFF",
        subColor: "#6B6490",
      }
    : {
        cardFill: "#F5F3FF",
        cardStroke: "#C4B5FD",
        cardHeader: "#EDE9FE",
        lineFill: "#DDD6FE",
        starStroke: "#A78BFA",
        badgeFill: "#EDE9FE",
        badgeStroke: "#7C3AED",
        badgeStar: "#7C3AED",
        pencilBody: "#7C3AED",
        pencilStroke: "#A78BFA",
        pencilTip: "#5B21B6",
        pencilEraser: "#A78BFA",
        pencilDot: "#7C3AED",
        sparklePrimary: "#7C3AED",
        sparkleSecondary: "#8B5CF6",
        sparkleTertiary: "#A78BFA",
        glowColor: "#8B5CF6",
        headingColor: "#3B1F6E",
        subColor: "#7C6FAE",
      };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        gap: "16px",
        borderRadius:2,
        boxShadow:0
      }}
    >
      <svg
        width="180"
        height="160"
        viewBox="0 0 180 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "floatUp 3.5s ease-in-out infinite" }}
      >
        <style>{`
          @keyframes floatUp {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.9; }
          }
        `}</style>

        {/* Glow base */}
        <ellipse cx="90" cy="148" rx="52" ry="8" fill={colors.glowColor} opacity="0.18" />

        {/* Main card */}
        <rect x="28" y="20" width="124" height="116" rx="14" fill={colors.cardFill} stroke={colors.cardStroke} strokeWidth="1.5" />

        {/* Card header */}
        <rect x="28" y="20" width="124" height="28" rx="14" fill={colors.cardHeader} />
        <rect x="28" y="34" width="124" height="14" fill={colors.cardHeader} />

        {/* Empty line placeholders */}
        <rect x="44" y="60" width="92" height="7" rx="3.5" fill={colors.lineFill} opacity="0.9" />
        <rect x="44" y="75" width="72" height="7" rx="3.5" fill={colors.lineFill} opacity="0.7" />
        <rect x="44" y="90" width="84" height="7" rx="3.5" fill={colors.lineFill} opacity="0.5" />
        <rect x="44" y="105" width="56" height="7" rx="3.5" fill={colors.lineFill} opacity="0.35" />

        {/* Empty stars row on card */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${44 + i * 18} 36 l2 6h6.3l-5.1 3.7 1.9 6-5.1-3.7-5.1 3.7 1.9-6-5.1-3.7h6.3z`}
            fill="none"
            stroke={colors.starStroke}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        ))}

        {/* Floating star badge top-right */}
        <g style={{ animation: "shimmer 2.5s ease-in-out infinite" }}>
          <circle cx="148" cy="26" r="18" fill={colors.badgeFill} stroke={colors.badgeStroke} strokeWidth="1.5" />
          <path
            d="M148 16l2.4 7.3h7.7l-6.2 4.5 2.4 7.3-6.3-4.6-6.3 4.6 2.4-7.3-6.2-4.5h7.7z"
            fill={colors.badgeStar}
            opacity="0.85"
          />
        </g>

        {/* Pencil top-left floating */}
        <g transform="translate(14, 8) rotate(-30, 18, 38)">
          <rect x="13" y="8" width="9" height="42" rx="2.5" fill={colors.pencilBody} stroke={colors.pencilStroke} strokeWidth="1.2" />
          <polygon points="13,50 22,50 17.5,62" fill={colors.pencilTip} stroke={colors.badgeStar} strokeWidth="1" />
          <rect x="13" y="8" width="9" height="7" rx="2" fill={colors.pencilEraser} stroke={colors.badgeStar} strokeWidth="1" />
          <circle cx="17.5" cy="61" r="1.8" fill={colors.pencilDot} opacity="0.6" />
        </g>

        {/* Sparkle dots */}
        <circle cx="160" cy="60" r="2.5" fill={colors.sparklePrimary} opacity="0.6" style={{ animation: "shimmer 1.8s ease-in-out infinite 0.3s" }} />
        <circle cx="20" cy="90" r="2" fill={colors.sparkleSecondary} opacity="0.5" style={{ animation: "shimmer 2.2s ease-in-out infinite 0.7s" }} />
        <circle cx="155" cy="105" r="1.5" fill={colors.sparkleTertiary} opacity="0.4" style={{ animation: "shimmer 2s ease-in-out infinite 0.1s" }} />
      </svg>

      {/* Text */}
      <div style={{ textAlign: "center" }}>
        <h3
          style={{
            color: colors.headingColor,
            fontSize: "1.15rem",
            fontWeight: 600,
            margin: "0 0 6px",
            letterSpacing: "-0.01em",
          }}
        >
          No Reviews Yet
        </h3>
        <p
          style={{
            color: colors.subColor,
            fontSize: "0.875rem",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Be the first to share your thoughts!
        </p>
      </div>
    </Card>
  );
};

export default NoReviewsIllustration;