import { SOURCES } from "@/lib/curriculum/sources";
import { BookOpen, Library, ExternalLink, FileText, Globe, BookMarked } from "lucide-react";

export const metadata = {
  title: "Sources — Zen Atlas",
  description: "Course materials, MDN references, official React documentation, and other sources that informed each page.",
};

const ICONS: Record<string, React.JSX.Element> = {
  course: <FileText size={14} />,
  mdn: <Globe size={14} />,
  "react-docs": <BookMarked size={14} />,
  w3c: <Globe size={14} />,
  book: <BookOpen size={14} />,
  other: <Library size={14} />,
};

export default function Page() {
  const grouped: Record<string, typeof SOURCES> = {};
  for (const s of SOURCES) {
    const k = s.type;
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(s);
  }
  const order = ["course", "mdn", "react-docs", "book", "w3c", "other"];

  return (
    <div className="container-zen py-12 md:py-20">
      <header className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-3">
          <Library size={12} /> Research sources
        </div>
        <h1 className="headline-display">What informed each page</h1>
        <p className="body-prose mt-5 text-fg-muted">
          The course materials supplied for the unit are the primary source. Where they were
          terse, the curriculum was expanded with material from authoritative public references —
          MDN for the web platform, the official React documentation for React, and the textbook
          cited on the course slides.
        </p>
      </header>

      <div className="space-y-10">
        {order
          .filter((k) => grouped[k])
          .map((k) => (
            <section key={k}>
              <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-3">
                {ICONS[k] ?? <Library size={14} />}
                {labelFor(k)}
              </div>
              <ul className="space-y-2">
                {grouped[k].map((s) => (
                  <li key={s.id} className="paper px-4 py-3 flex items-baseline justify-between gap-3">
                    <div>
                      <div className="text-fg-strong text-sm">{s.title}</div>
                      <div className="text-xs text-fg-faint mt-0.5">{s.topic}</div>
                    </div>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm shrink-0"
                      >
                        <ExternalLink size={12} /> Open
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}

function labelFor(k: string) {
  return {
    course: "Course materials",
    mdn: "MDN Web Docs",
    "react-docs": "React documentation",
    w3c: "W3C / web standards",
    book: "Textbooks",
    other: "Other",
  }[k] ?? k;
}
