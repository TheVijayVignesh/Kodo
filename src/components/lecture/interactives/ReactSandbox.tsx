"use client";

import { LiveProvider, LiveEditor, LivePreview } from "react-live";

/**
 * A free-form React playground. Students edit JSX in the editor and see
 * the result live. The preview pane shows the rendered component.
 *
 * Intentionally simple — no checker, no test runner. The real checking
 * happens in the ReactExercise component (the dedicated "react-exercise"
 * section type).
 */
export function ReactSandbox() {
  return (
    <div className="paper overflow-hidden">
      <div className="px-4 py-1.5 bg-[var(--bg-ink)] border-b border-rule text-xs text-fg-faint font-mono flex items-center gap-2">
        <span>JSX · react-live</span>
      </div>
      <LiveProvider
        code={`<div className="p-6">
  <h1 className="text-2xl font-bold text-rose-900">Hello, Zen</h1>
  <p className="text-slate-700 mt-2">Edit the code on the left. The preview updates as you type.</p>
  <button
    className="mt-4 px-4 py-2 rounded bg-rose-900 text-white"
    onClick={() => alert('clicked')}
  >
    Click me
  </button>
</div>`}
        noInline={false}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="border-b lg:border-b-0 lg:border-r border-rule overflow-hidden">
            <div className="bg-[var(--ink-950)] max-h-[420px] overflow-auto">
              <LiveEditor
                className="text-[12.5px] font-mono leading-[1.6]"
                style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}
              />
            </div>
          </div>
          <div className="bg-white p-4 min-h-[220px] text-slate-900 overflow-auto">
            <LivePreview />
          </div>
        </div>
      </LiveProvider>
    </div>
  );
}
