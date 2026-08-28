import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export const metadata = { title: "Not found — Zen Atlas" };

export default function NotFound() {
  return (
    <div className="container-zen py-24 text-center">
      <div className="seal text-3xl w-16 h-16 mx-auto mb-5" aria-hidden>禅</div>
      <div className="text-eyebrow text-fg-faint mb-2">404</div>
      <h1 className="headline-display">This path is not on the map</h1>
      <p className="body-prose mt-5 mx-auto text-fg-muted max-w-md">
        The page you were looking for is not in the curriculum. Use the navigation
        to return to a known lecture, or revisit the studio.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          <ArrowLeft size={14} /> Return to the studio
        </Link>
        <Link href="/modules/1" className="btn btn-ghost">
          <Compass size={14} /> Browse Module 1
        </Link>
      </div>
    </div>
  );
}
