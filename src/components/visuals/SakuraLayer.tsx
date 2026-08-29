"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Global falling-petal layer. Loads the upstream jhammann/sakura
 * library (sakura-js) as a side-effect by injecting the UMD bundle,
 * then constructs the Sakura instance on `body`. Petals are kept
 * subtle and respect reduced motion.
 *
 * The script is mounted once on the client, on every page (not just
 * the homepage), so the environment feels consistent across the site.
 */
export function SakuraLayer() {
  const pathname = usePathname();
  const sakuraRef = useRef<any>(null);

  useEffect(() => {
    let alive = true;

    // Honour user motion preference
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMq.matches) return;

    function start() {
      // The UMD bundle assigns the constructor to the global `Sakura`.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SakuraCtor: any = (window as any).Sakura;
      if (!alive || !SakuraCtor) return;
      try {
        // The library positions petals absolutely relative to the target
        // and removes them when they leave the viewport. If we mount on
        // <body> directly, petals only fall within the document's
        // initial viewport and disappear as the user scrolls. To make
        // petals appear throughout the scroll, we attach them to a
        // fixed-position container that always covers the current
        // viewport — new petals spawn at the top of the visible area
        // and fall to the bottom regardless of scroll position.
        let host = document.getElementById("zen-sakura-host") as HTMLElement | null;
        if (!host) {
          host = document.createElement("div");
          host.id = "zen-sakura-host";
          host.style.cssText =
            "position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;";
          document.body.appendChild(host);
        }
        sakuraRef.current = new SakuraCtor("#zen-sakura-host", {
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

    // Load the UMD bundle if not already on the page.
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
      try {
        sakuraRef.current?.stop?.(true);
      } catch {}
      sakuraRef.current = null;
    };
  }, []);

  // Pause petals on the exam coding exercises so they don't sit
  // over the editor. They are a decorative layer; they should not
  // compete with content.
  useEffect(() => {
    if (!sakuraRef.current) return;
    const isPlayground = pathname?.startsWith("/modules/1/m1l0") && pathname !== "/";
    try {
      if (isPlayground) sakuraRef.current.stop?.(true);
      else sakuraRef.current.start?.();
    } catch {}
  }, [pathname]);

  return null;
}
