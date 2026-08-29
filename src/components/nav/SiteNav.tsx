"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/system/ThemeToggle";
import { SearchPalette } from "@/components/nav/SearchPalette";

const LINKS = [
  { href: "/", label: "Studio" },
  { href: "/modules/1", label: "Module 1" },
  { href: "/modules/2", label: "Module 2" },
  { href: "/exam", label: "Exam Hall" },
  { href: "/sources", label: "Sources" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30">
      <div className="glass border-x-0 border-t-0 rounded-none">
        <div className="container-zen flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <span className="seal" aria-hidden>禅</span>
            <span className="font-display text-[1.05rem] tracking-tight text-fg-strong">
              Zen Atlas
            </span>
            <span className="hidden md:inline text-eyebrow ml-1 group-hover:text-fg-base transition-colors">
              Web Technologies
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    "px-3 py-1.5 rounded-full text-sm transition-colors " +
                    (active
                      ? "text-fg-strong bg-[var(--bg-ink)]"
                      : "text-fg-muted hover:text-fg-strong")
                  }
                >
                  {l.label}
                </Link>
              );
            })}
            <span className="w-px h-5 bg-rule mx-2" />
            <SearchPalette />
            <ThemeToggle />
          </nav>

          <button
            className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-rule"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block w-4 h-px bg-fg-base relative before:content-[''] before:absolute before:left-0 before:-top-1.5 before:w-4 before:h-px before:bg-fg-base after:content-[''] after:absolute after:left-0 after:top-1.5 after:w-4 after:h-px after:bg-fg-base" />
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-rule">
            <div className="container-zen py-3 flex flex-col gap-1">
              {LINKS.map((l) => {
                const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={
                      "px-3 py-2 rounded-md text-sm " +
                      (active ? "bg-[var(--bg-ink)] text-fg-strong" : "text-fg-muted")
                    }
                  >
                    {l.label}
                  </Link>
                );
              })}
              <div className="pt-2 flex items-center gap-2">
                <ThemeToggle />
                <span className="text-xs text-fg-faint">Theme</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
