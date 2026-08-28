"use client";

import { useEffect, useState } from "react";

/**
 * Atmospheric, generative background. Pure CSS + canvas.
 * - Subtle vignette gradient base
 * - Sumi-ink mist layer
 * - Floating sakura petals (deterministic, motion-reduced when requested)
 * - Light parallax grain
 */
export function AmbientBackdrop() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <>
      <div className="atmosphere-mist" aria-hidden />
      <div className="paper-grain" aria-hidden />
      <SakuraField reduced={reduced} />
    </>
  );
}

function SakuraField({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(800px 400px at 50% 0%, rgba(232,163,175,0.05), transparent 70%)",
        }}
      />
    );
  }
  // A small static cluster of soft sakura blobs that drift very slowly
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background:
              "radial-gradient(circle at 30% 30%, rgba(243,200,207,0.6), rgba(216,127,142,0.15) 60%, transparent 70%)",
            filter: "blur(0.5px)",
            opacity: p.opacity,
            animation: `sakuraDrift ${p.duration}s ${p.delay}s ease-in-out infinite`,
            mixBlendMode: "screen",
          }}
        />
      ))}
      <style>{`
        @keyframes sakuraDrift {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%  { transform: translate3d(${10}px, ${30}px, 0) rotate(${20}deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 53) % 100,
  y: (i * 37) % 100,
  size: 4 + ((i * 7) % 8),
  duration: 18 + ((i * 3) % 14),
  delay: (i % 7) * 0.7,
  opacity: 0.25 + ((i * 0.07) % 0.5),
}));
