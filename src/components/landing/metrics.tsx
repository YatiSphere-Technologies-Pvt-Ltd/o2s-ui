"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const metrics = [
  { value: 35, suffix: "%", label: "Reduction in time-to-hire" },
  { value: 12, suffix: " hrs", label: "Saved per recruiter, per week" },
  { value: 95, suffix: "%", label: "Bias compliance rate" },
  { value: 3, prefix: "< ", suffix: " wks", label: "Full implementation" },
];

function CountUpNumber({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <div
      ref={ref}
      className="text-4xl md:text-6xl font-black bg-linear-to-r from-[#3B82F6] via-[#8B5CF6] to-[#14B8A6] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-shift_4s_ease_infinite] leading-tight"
    >
      {prefix}{count}{suffix}
    </div>
  );
}

export function Metrics() {
  return (
    <section className="py-24 bg-[#0E0E18]/50 border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <CountUpNumber
                value={metric.value}
                suffix={metric.suffix}
                prefix={metric.prefix}
              />
              <div className="text-sm text-[#8892A8] mt-2">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
