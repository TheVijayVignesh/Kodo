"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, BookOpen, FileText, GraduationCap, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LECTURE_BY_ID, MODULE_1 } from "@/lib/curriculum/lectures/index";
import { PAPER_BY_ID } from "@/lib/exam/papers";

type Hit = {
  title: string;
  subtitle?: string;
  href: string;
  kind: "lecture" | "exam" | "section" | "exercise";
};

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hits: Hit[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const out: Hit[] = [];
    for (const l of MODULE_1.lectures) {
      if (l.title.toLowerCase().includes(query) || l.subtitle.toLowerCase().includes(query)) {
        out.push({ title: l.title, subtitle: `Module 1 · Lecture ${l.number}`, href: `/modules/1/${l.id}`, kind: "lecture" });
      }
      for (const sec of l.sections) {
        if (sec.type === "concept" && sec.title.toLowerCase().includes(query)) {
          out.push({ title: sec.title, subtitle: `${l.title} · concept`, href: `/modules/1/${l.id}`, kind: "section" });
        }
        if (sec.type === "exercise" && sec.exerciseId.toLowerCase().includes(query)) {
          out.push({ title: `Exercise · ${l.title}`, subtitle: "coding exercise", href: `/modules/1/${l.id}`, kind: "exercise" });
        }
      }
    }
    for (const p of Object.values(PAPER_BY_ID)) {
      if (p.label.toLowerCase().includes(query)) {
        out.push({ title: p.label, subtitle: "Exam paper", href: `/exam#${p.id}`, kind: "exam" });
      }
    }
    return out.slice(0, 20);
  }, [q]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-ghost btn-sm"
        aria-label="Open search"
        title="Search (Cmd/Ctrl + K)"
      >
        <Search size={14} />
        <span className="hidden md:inline text-xs">Search</span>
        <span className="hidden md:inline text-[10px] text-fg-faint border border-rule rounded px-1 ml-1">⌘K</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[color:var(--ink-950)]/70 backdrop-blur-sm grid place-items-start pt-[12vh]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="paper max-w-xl w-[92vw] mx-auto p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-rule">
                <Search size={16} className="text-fg-faint" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search lectures, concepts, exercises, exams…"
                  className="flex-1 bg-transparent outline-none text-fg-strong placeholder:text-fg-faint"
                />
                <button onClick={() => setOpen(false)} className="text-fg-faint hover:text-fg-base">
                  <X size={14} />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-1">
                {q.trim() === "" ? (
                  <div className="text-xs text-fg-faint p-4">Type to search. Try "HTML", "DOM", "fetch", "React".</div>
                ) : hits.length === 0 ? (
                  <div className="text-xs text-fg-faint p-4">No results.</div>
                ) : (
                  <ul>
                    {hits.map((h, i) => (
                      <li key={i}>
                        <Link
                          href={h.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--bg-ink)] text-sm"
                        >
                          {h.kind === "lecture" ? <BookOpen size={14} className="text-fg-faint" /> :
                           h.kind === "exam" ? <GraduationCap size={14} className="text-fg-faint" /> :
                           h.kind === "exercise" ? <Code2 size={14} className="text-fg-faint" /> :
                           <FileText size={14} className="text-fg-faint" />}
                          <div className="flex-1 min-w-0">
                            <div className="text-fg-strong truncate">{h.title}</div>
                            {h.subtitle && <div className="text-fg-faint text-xs">{h.subtitle}</div>}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
