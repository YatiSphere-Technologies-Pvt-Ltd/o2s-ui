"use client";

interface Props {
  values: number[];
  /** Tailwind text color class to fill/stroke the line. */
  color?: string;
  /** Width/height in tailwind unit pixels. */
  width?: number;
  height?: number;
  /** When true, also fills the area below the line. */
  area?: boolean;
}

/**
 * Lightweight inline-SVG sparkline. No deps.
 */
export function Sparkline({ values, color = "text-brand", width = 96, height = 32, area = true }: Props) {
  if (values.length === 0) return null;
  const max = Math.max(1, ...values);
  const stepX = width / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - (v / max) * (height - 2) - 1;
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const areaPath = `${path} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={color} aria-hidden>
      {area && <path d={areaPath} fill="currentColor" opacity={0.15} />}
      <path d={path} stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5} fill="currentColor" opacity={0.7} />
      ))}
    </svg>
  );
}
