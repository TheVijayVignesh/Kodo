"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CodeBlock({
  code,
  language,
  caption,
}: {
  code: string;
  language: "html" | "css" | "js" | "ts" | "tsx" | "text";
  caption?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <figure className="my-4">
      <div className="relative group">
        <div className="absolute right-2 top-2 z-10">
          <button
            onClick={async () => {
              await navigator.clipboard?.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1100);
            }}
            className="btn btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Copy code"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <pre className="!my-0 overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-fg-faint">{caption}</figcaption>
      )}
    </figure>
  );
}
