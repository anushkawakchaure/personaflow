interface ConfidenceRingProps {
  confidence: number;
  size?: number;
}

export default function ConfidenceRing({ confidence, size = 48 }: ConfidenceRingProps) {
  // Guard against invalid inputs
  const safeConfidence = typeof confidence === "number" && !isNaN(confidence) ? confidence : 0;
  const clamped = Math.min(100, Math.max(0, safeConfidence));
  const safeSize = typeof size === "number" && size > 0 ? size : 48;
  const radius = safeSize / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: safeSize, height: safeSize }}>
      <svg className="transform -rotate-90" width={safeSize} height={safeSize}>
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          fill="none"
          stroke="#5B8DEF"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-medium text-text-primary">{clamped}%</span>
    </div>
  );
}
