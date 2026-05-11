"use client";

/**
 * Lightweight SVG sparkline (no recharts). Renders a 7-day activity series.
 */
export function AgentSparkline({
  data,
  height = 24,
  width = 70,
  strokeClass = "stroke-current",
}: {
  data: number[];
  height?: number;
  width?: number;
  strokeClass?: string;
}) {
  if (data.length === 0) return null;
  const max = Math.max(1, ...data);
  const step = width / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - (v / max) * (height - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="text-current">
      <polyline
        points={points.join(" ")}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={strokeClass}
      />
    </svg>
  );
}
