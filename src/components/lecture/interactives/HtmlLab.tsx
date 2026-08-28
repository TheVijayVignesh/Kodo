"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "../CodeBlock";
import { runSandbox, type RunResult } from "@/components/playground/sandbox";
import { Play, CheckCircle2, XCircle } from "lucide-react";

/**
 * HTML lab — the student writes HTML, the page renders immediately, and
 * a structural validator reports issues like missing alt, label-without-input,
 * improperly nested elements, or invalid tag combinations.
 */
export function HtmlLab() {
  const [source, setSource] = useState(STARTER);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  const previewDoc = useMemo(
    () => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="data:text/css;base64,"></head><body>${source}</body></html>`,
    [source]
  );

  async function validate() {
    setRunning(true);
    setResult(null);
    try {
      const r = await runSandbox(source, [
        { kind: "html-contains", selector: "img", min: 0 },
        { kind: "html-contains", selector: "label", min: 0 },
      ]);
      setResult(r);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="paper overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b lg:border-b-0 lg:border-r border-rule">
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">HTML source</div>
          <textarea
            spellCheck={false}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full min-h-[280px] lg:min-h-[380px] bg-[var(--ink-950)] text-[var(--ink-50)] p-4 outline-none font-mono text-[13px] leading-[1.6] resize-y"
          />
          <div className="p-3 border-t border-rule flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={validate} disabled={running}>
              <Play size={14} /> {running ? "Checking…" : "Check structure"}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSource(STARTER)}
            >
              Reset
            </button>
          </div>
        </div>
        <div>
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">Live preview</div>
          <iframe title="html-lab-preview" sandbox="" srcDoc={previewDoc} className="w-full bg-white min-h-[280px] lg:min-h-[380px]" />
        </div>
      </div>
      <StructuralReport source={source} result={result} />
    </div>
  );
}

const STARTER = `<article>
  <h1>Field guide to the urban fox</h1>
  <p>The red fox has colonised cities on five continents.</p>
  <img src="https://placehold.co/640x360?text=Fox">
  <section>
    <h2>Diet</h2>
    <p>Foxes are omnivores. They eat small mammals, fruit, and scraps.</p>
  </section>
  <form>
    <label>Email
      <input type="email" name="email">
    </label>
    <button type="submit">Subscribe</button>
  </form>
</article>`;

function StructuralReport({ source, result }: { source: string; result: RunResult | null }) {
  const findings = analyze(source);
  return (
    <div className="border-t border-rule p-4 space-y-3 bg-[var(--bg-elevated)]">
      <div className="text-eyebrow text-fg-faint">Structural check</div>
      {findings.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-[var(--moss-400)]">
          <CheckCircle2 size={14} /> No issues found.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {findings.map((f, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm rounded-md px-2.5 py-1.5 border border-[color:var(--vermilion-700)]/30 bg-[color:var(--vermilion-700)]/12"
            >
              <XCircle size={14} className="text-[var(--vermilion-300)] mt-0.5 shrink-0" />
              <div>
                <div className="text-fg-strong">{f.title}</div>
                <div className="text-xs text-fg-muted mt-0.5">{f.detail}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function analyze(source: string): { title: string; detail: string }[] {
  const findings: { title: string; detail: string }[] = [];
  // 1. <img> without alt
  const imgs = source.match(/<img\b[^>]*>/gi) || [];
  imgs.forEach((tag) => {
    if (!/\balt\s*=/.test(tag)) {
      findings.push({
        title: "Image is missing alt text",
        detail: "Every <img> should have an alt attribute. If the image is decorative, use alt=\"\".",
      });
    }
  });
  // 2. <label> without input/select/textarea
  const labels = source.match(/<label\b[^>]*>[\s\S]*?<\/label>/gi) || [];
  labels.forEach((lab) => {
    if (!/<(input|select|textarea)\b/i.test(lab) && !/\bfor\s*=/.test(lab.match(/<label\b[^>]*>/i)![0])) {
      findings.push({
        title: "<label> is not associated with a form control",
        detail: "A <label> should either wrap a form control or use the for attribute to point to one.",
      });
    }
  });
  // 3. <a> without href
  const anchors = source.match(/<a\b[^>]*>/gi) || [];
  anchors.forEach((tag) => {
    if (!/\bhref\s*=/.test(tag)) {
      findings.push({
        title: "<a> is missing href",
        detail: "Without href the link is not focusable, not clickable, and not announced as a link.",
      });
    }
  });
  // 4. <button> without type (browsers default to submit, which can be surprising)
  const buttons = source.match(/<button\b[^>]*>/gi) || [];
  buttons.forEach((tag) => {
    if (!/\btype\s*=/.test(tag)) {
      findings.push({
        title: "<button> is missing type attribute",
        detail: "Without type, the button defaults to type=\"submit\" inside a form — which can submit unexpectedly.",
      });
    }
  });
  // 5. <table> without <th> or <thead>
  const tables = source.match(/<table\b[\s\S]*?<\/table>/gi) || [];
  tables.forEach((t) => {
    if (!/<th\b/i.test(t) && !/<thead\b/i.test(t)) {
      findings.push({
        title: "<table> has no header cells",
        detail: "Use <th> (and ideally <thead>) to mark header cells. Screen readers use this to announce column relationships.",
      });
    }
  });
  // 6. <p> wrapping block elements
  const pWrap = source.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
  pWrap.forEach((p) => {
    if (/<(div|section|article|ul|ol|table|form|h[1-6])\b/i.test(p)) {
      findings.push({
        title: "<p> wraps a block element",
        detail: "Paragraphs can only contain phrasing content. Move the block element outside.",
      });
    }
  });
  // 7. unclosed tags (very rough)
  const openTags = (source.match(/<(?![\/!?])([a-zA-Z][a-zA-Z0-9]*)/g) || []).map((t) => t.slice(1).toLowerCase());
  const closeTags = (source.match(/<\/([a-zA-Z][a-zA-Z0-9]*)/g) || []).map((t) => t.slice(2).toLowerCase());
  const voidTags = new Set(["br", "img", "input", "meta", "link", "hr", "source", "area", "base", "col", "embed", "param", "track", "wbr"]);
  for (const t of openTags) {
    if (voidTags.has(t)) continue;
    if ((openTags.filter((x) => x === t).length) !== (closeTags.filter((x) => x === t).length)) {
      findings.push({
        title: `Unbalanced <${t}>`,
        detail: "An opening tag is not balanced with a matching closing tag. Check your nesting.",
      });
      break;
    }
  }
  return findings;
}
