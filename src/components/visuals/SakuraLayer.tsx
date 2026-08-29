"use client";

import { useEffect } from "react";

/**
 * Global falling-petal layer. Loads the upstream jhammann/sakura
 * library (sakura-js) as a side-effect by injecting the UMD bundle,
 * then constructs the Sakura instance on a fixed-position host.
 * Petals fall continuously on every page and respect reduced motion.
 */
export function SakuraLayer() {
  useEffect(() => {
    let alive = true;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMq.matches) return;

    function start() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SakuraCtor: any = (window as any).Sakura;
      if (!alive || !SakuraCtor) return;
      try {
        let host = document.getElementById("zen-sakura-host") as HTMLElement | null;
        if (!host) {
          host = document.createElement("div");
          host.id = "zen-sakura-host";
          host.style.cssText =
            "position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;";
          document.body.appendChild(host);
        }
        new SakuraCtor("#zen-sakura-host", {
          fallSpeed: 1.6,
          maxSize: 12,
          minSize: 7,
          delay: 480,
          colors: [
            { gradientColorStart: "rgba(243, 200, 207, 0.85)", gradientColorEnd: "rgba(216, 127, 142, 0.75)", gradientColorDegree: 120 },
            { gradientColorStart: "rgba(255, 226, 232, 0.7)", gradientColorEnd: "rgba(232, 163, 175, 0.55)", gradientColorDegree: 90 },
            { gradientColorStart: "rgba(247, 233, 215, 0.5)", gradientColorEnd: "rgba(193, 74, 58, 0.35)", gradientColorDegree: 110 },
          ],
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[zen] sakura init failed:", err);
      }
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-sakura-bundle]');
    if (existing) {
      if ((window as any).Sakura) start();
      else existing.addEventListener("load", start, { once: true });
    } else {
      const s = document.createElement("script");
      s.src = "/sakura.min.js";
      s.async = true;
      s.dataset.sakuraBundle = "true";
      s.addEventListener("load", start, { once: true });
      document.head.appendChild(s);
    }

    return () => {
      alive = false;
    };
  }, []);

  return null;
}
