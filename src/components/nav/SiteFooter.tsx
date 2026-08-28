export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="container-zen py-10 flex flex-col md:flex-row gap-6 items-start md:items-end justify-between text-sm text-fg-muted">
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-2">
            <span className="seal" aria-hidden>禅</span>
            <span className="font-display text-fg-strong text-base">Zen Atlas</span>
          </div>
          <p className="leading-relaxed text-fg-faint">
            An interactive study studio for the CS3005 Web Technologies curriculum. Built as a deliberate,
            art-directed learning environment — not a generic dashboard.
          </p>
        </div>
        <div className="text-xs text-fg-faint leading-relaxed">
          <div>Code execution is sandboxed in iframes.</div>
          <div>Progress is stored locally in your browser.</div>
        </div>
      </div>
    </footer>
  );
}
