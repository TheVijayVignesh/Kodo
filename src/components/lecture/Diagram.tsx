"use client";

/**
 * Inline diagrams drawn with SVG. Hand-authored to match the Zen aesthetic
 * — geometric, restrained, vermilion/cream on ink. No 3D, no gradients
 * beyond what the design tokens define.
 *
 * Each diagram receives a `kind` and renders the matching illustration.
 * Concept explanations in the lesson content can call <Diagram kind="..." />.
 */

import { useId } from "react";
import type { DiagramKind } from "@/lib/curriculum/types";

type Props = { kind: DiagramKind; caption?: string; className?: string };

export function Diagram({ kind, caption, className = "" }: Props) {
  const id = useId();
  return (
    <figure className={`my-6 ${className}`}>
      <div className="paper p-5 md:p-6 overflow-hidden">
        {kind === "client-server" && <ClientServerDiagram id={id} />}
        {kind === "browser-pipeline" && <BrowserPipelineDiagram id={id} />}
        {kind === "dom-tree" && <DomTreeDiagram id={id} />}
        {kind === "box-model" && <BoxModelDiagram id={id} />}
        {kind === "cascade" && <CascadeDiagram id={id} />}
        {kind === "cascade-detail" && <CascadeDetailDiagram id={id} />}
        {kind === "flex-layout" && <FlexLayoutDiagram id={id} />}
        {kind === "grid-layout" && <GridLayoutDiagram id={id} />}
        {kind === "event-flow" && <EventFlowDiagram id={id} />}
        {kind === "ajax-flow" && <AjaxFlowDiagram id={id} />}
        {kind === "react-render" && <ReactRenderDiagram id={id} />}
        {kind === "useeffect-lifecycle" && <UseEffectLifecycleDiagram id={id} />}
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-fg-faint text-center">{caption}</figcaption>
      )}
    </figure>
  );
}

const INK = "var(--ink-200)";
const INK_DIM = "var(--ink-400)";
const INK_BG = "var(--ink-800)";
const VERMILION = "var(--vermilion-500)";
const VERMILION_SOFT = "var(--vermilion-300)";
const CREAM = "var(--ink-50)";
const ACCENT = "var(--accent)";

function ClientServerDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>A request flows from the browser to a server and back.</title>
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={VERMILION} />
        </marker>
        <marker id={`${id}-arrow-ink`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={INK_DIM} />
        </marker>
      </defs>
      {/* Client */}
      <rect x="30" y="50" width="180" height="160" rx="14" fill="none" stroke={INK} strokeWidth="1.5" />
      <text x="120" y="80" textAnchor="middle" fill={CREAM} fontFamily="serif" fontSize="18">Browser</text>
      <text x="120" y="100" textAnchor="middle" fill={INK_DIM} fontSize="11" fontFamily="monospace">the client</text>
      <circle cx="120" cy="160" r="22" fill="none" stroke={VERMILION} strokeWidth="1.5" />
      <text x="120" y="166" textAnchor="middle" fill={VERMILION_SOFT} fontSize="22" fontFamily="serif">人</text>
      {/* Server */}
      <rect x="510" y="50" width="180" height="160" rx="14" fill="none" stroke={INK} strokeWidth="1.5" />
      <text x="600" y="80" textAnchor="middle" fill={CREAM} fontFamily="serif" fontSize="18">Server</text>
      <text x="600" y="100" textAnchor="middle" fill={INK_DIM} fontSize="11" fontFamily="monospace">the responder</text>
      <rect x="540" y="130" width="120" height="60" rx="4" fill="none" stroke={INK_DIM} strokeWidth="1" />
      <line x1="555" y1="150" x2="645" y2="150" stroke={INK_DIM} strokeWidth="1" />
      <line x1="555" y1="166" x2="645" y2="166" stroke={INK_DIM} strokeWidth="1" />
      <line x1="555" y1="182" x2="625" y2="182" stroke={INK_DIM} strokeWidth="1" />
      {/* Protocol in the middle */}
      <line x1="220" y1="130" x2="500" y2="130" stroke={VERMILION} strokeWidth="1.5" markerEnd={`url(#${id}-arrow)`} />
      <text x="360" y="120" textAnchor="middle" fill={VERMILION_SOFT} fontFamily="serif" fontSize="16" fontStyle="italic">HTTP request</text>
      <line x1="500" y1="160" x2="220" y2="160" stroke={INK_DIM} strokeWidth="1.5" markerEnd={`url(#${id}-arrow-ink)`} />
      <text x="360" y="180" textAnchor="middle" fill={INK_DIM} fontFamily="serif" fontSize="14" fontStyle="italic">HTTP response</text>
    </svg>
  );
}

function BrowserPipelineDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 200" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>The browser parses, builds a tree, fetches resources, paints.</title>
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={INK} />
        </marker>
      </defs>
      {[
        { x: 30, y: 60, w: 130, h: 80, title: "HTML bytes", sub: "from the network" },
        { x: 200, y: 60, w: 130, h: 80, title: "Tokenise", sub: "into a stream" },
        { x: 370, y: 60, w: 130, h: 80, title: "Build tree", sub: "DOM + CSSOM" },
        { x: 540, y: 60, w: 150, h: 80, title: "Paint", sub: "layout, paint, composite" },
      ].map((b, i, arr) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill="none" stroke={INK} strokeWidth="1.2" />
          <text x={b.x + b.w / 2} y={b.y + 36} textAnchor="middle" fill={CREAM} fontFamily="serif" fontSize="15">
            {b.title}
          </text>
          <text x={b.x + b.w / 2} y={b.y + 58} textAnchor="middle" fill={INK_DIM} fontSize="11" fontFamily="monospace">
            {b.sub}
          </text>
          {i < arr.length - 1 && (
            <line
              x1={b.x + b.w + 4}
              y1={b.y + b.h / 2}
              x2={arr[i + 1].x - 4}
              y2={b.y + b.h / 2}
              stroke={INK}
              strokeWidth="1.2"
              markerEnd={`url(#${id}-arrow)`}
            />
          )}
        </g>
      ))}
      <text x="360" y="35" textAnchor="middle" fill={VERMILION_SOFT} fontFamily="serif" fontSize="14" fontStyle="italic">
        the path from raw bytes to a painted page
      </text>
    </svg>
  );
}

function DomTreeDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 280" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>The document is a tree the browser hands to your JavaScript.</title>
      {/* Root: document */}
      <Node x={360} y={30} label="document" />
      <Line x1={360} y1={48} x2={360} y2={68} />
      <Node x={360} y={80} label="html" />
      <Line x1={360} y1={98} x2={210} y2={128} />
      <Line x1={360} y1={98} x2={510} y2={128} />
      <Node x={210} y={140} label="head" />
      <Node x={510} y={140} label="body" />
      <Line x1={210} y1={158} x2={130} y2={188} />
      <Line x1={210} y1={158} x2={290} y2={188} />
      <Node x={130} y={200} label="title" small />
      <Node x={290} y={200} label="meta" small />
      <Line x1={510} y1={158} x2={400} y2={188} />
      <Line x1={510} y1={158} x2={510} y2={188} />
      <Line x1={510} y1={158} x2={620} y2={188} />
      <Node x={400} y={200} label="h1" small />
      <Node x={510} y={200} label="p" small />
      <Node x={620} y={200} label="ul" small />
      <text x="540" y="262" fill={INK_DIM} fontSize="11" fontFamily="monospace">
        {"document → html → body → element → text node"}
      </text>
    </svg>
  );
}

function BoxModelDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 240" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>Every element is a box: content, padding, border, margin.</title>
      {/* Outer margin */}
      <rect x="120" y="30" width="480" height="180" fill="none" stroke={INK_DIM} strokeWidth="1" strokeDasharray="4 4" />
      <text x="120" y="22" fill={INK_DIM} fontSize="11" fontFamily="monospace">margin (outside the border)</text>
      {/* Border */}
      <rect x="160" y="60" width="400" height="120" fill="none" stroke={VERMILION} strokeWidth="1.5" />
      <text x="160" y="52" fill={VERMILION_SOFT} fontSize="11" fontFamily="monospace">border</text>
      {/* Padding */}
      <rect x="180" y="80" width="360" height="80" fill="none" stroke={INK} strokeWidth="1" strokeDasharray="2 3" />
      <text x="180" y="74" fill={CREAM} fontSize="11" fontFamily="monospace">padding</text>
      {/* Content */}
      <rect x="220" y="100" width="280" height="40" fill="var(--bg-paper)" stroke={INK} strokeWidth="1" />
      <text x="360" y="124" textAnchor="middle" fill={CREAM} fontFamily="serif" fontSize="14">content</text>
      <text x="360" y="222" textAnchor="middle" fill={INK_DIM} fontSize="11" fontFamily="monospace">
        with box-sizing: border-box, the declared width covers content + padding + border
      </text>
    </svg>
  );
}

function CascadeDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 280" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>The cascade resolves which rule wins.</title>
      {[
        { y: 30, w: 600, label: "Browser default", spec: "0,0,0" },
        { y: 80, w: 480, label: "External stylesheet", spec: "0,0,1" },
        { y: 130, w: 360, label: "Class selector", spec: "0,1,0" },
        { y: 180, w: 200, label: "ID selector", spec: "1,0,0" },
        { y: 230, w: 100, label: "Inline style", spec: "1,0,0,0" },
      ].map((s, i, arr) => (
        <g key={i}>
          <rect
            x={(720 - s.w) / 2}
            y={s.y}
            width={s.w}
            height={32}
            fill="var(--bg-paper)"
            stroke={INK}
            strokeWidth="1"
            opacity={1 - i * 0.12}
          />
          <text
            x={720 / 2}
            y={s.y + 21}
            textAnchor="middle"
            fill={CREAM}
            fontSize="13"
            fontFamily="serif"
            opacity={1 - i * 0.12}
          >
            {s.label}
          </text>
          <text
            x={720 - 20}
            y={s.y + 21}
            textAnchor="end"
            fill={INK_DIM}
            fontSize="11"
            fontFamily="monospace"
            opacity={1 - i * 0.12}
          >
            {s.spec}
          </text>
        </g>
      ))}
      <text x="20" y="50" fill={INK_DIM} fontSize="10" fontFamily="monospace">low</text>
      <text x="20" y="250" fill={VERMILION_SOFT} fontSize="10" fontFamily="monospace">high</text>
      <text x="20" y="270" fill={INK_DIM} fontSize="10" fontFamily="monospace">specificity</text>
    </svg>
  );
}

function CascadeDetailDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>How two rules resolve when they conflict.</title>
      <rect x="40" y="40" width="300" height="100" rx="10" fill="none" stroke={INK} />
      <text x="190" y="68" textAnchor="middle" fill={CREAM} fontFamily="serif" fontSize="15">Rule A</text>
      <text x="190" y="92" textAnchor="middle" fill={INK_DIM} fontFamily="monospace" fontSize="12">{"p { color: red; }"}</text>
      <text x="190" y="114" textAnchor="middle" fill={INK_DIM} fontFamily="monospace" fontSize="11">specificity 0,0,0,1</text>
      <rect x="380" y="40" width="300" height="100" rx="10" fill="none" stroke={VERMILION} />
      <text x="530" y="68" textAnchor="middle" fill={CREAM} fontFamily="serif" fontSize="15">Rule B</text>
      <text x="530" y="92" textAnchor="middle" fill={INK_DIM} fontFamily="monospace" fontSize="12">{".note { color: blue; }"}</text>
      <text x="530" y="114" textAnchor="middle" fill={INK_DIM} fontFamily="monospace" fontSize="11">specificity 0,0,1,0</text>
      <text x="360" y="180" textAnchor="middle" fill={VERMILION_SOFT} fontFamily="serif" fontSize="14" fontStyle="italic">
        the rule with higher specificity wins — order in the file does not matter
      </text>
    </svg>
  );
}

function FlexLayoutDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>Flex container distributes children along a main axis.</title>
      <rect x="40" y="40" width="640" height="120" rx="10" fill="none" stroke={INK} strokeDasharray="2 3" />
      <text x="50" y="60" fill={INK_DIM} fontSize="11" fontFamily="monospace">flex container</text>
      {/* main axis arrow */}
      <line x1="60" y1="175" x2="660" y2="175" stroke={VERMILION} strokeWidth="1.5" markerEnd="url(#flexArrow)" />
      <defs>
        <marker id="flexArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={VERMILION} />
        </marker>
      </defs>
      <text x="60" y="195" fill={VERMILION_SOFT} fontSize="11" fontFamily="monospace">main axis</text>
      {[120, 290, 460, 600].map((cx, i) => (
        <g key={i}>
          <rect x={cx - 50} y="80" width="100" height="50" fill="var(--bg-paper)" stroke={VERMILION} />
          <text x={cx} y="110" textAnchor="middle" fill={CREAM} fontSize="12" fontFamily="monospace">item</text>
        </g>
      ))}
    </svg>
  );
}

function GridLayoutDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>CSS Grid lays out two dimensions: rows and columns.</title>
      <rect x="60" y="40" width="600" height="180" fill="none" stroke={INK} />
      <line x1="60" y1="100" x2="660" y2="100" stroke={INK} strokeWidth="1" />
      <line x1="60" y1="160" x2="660" y2="160" stroke={INK} strokeWidth="1" />
      <line x1="280" y1="40" x2="280" y2="220" stroke={INK} strokeWidth="1" />
      <line x1="500" y1="40" x2="500" y2="220" stroke={INK} strokeWidth="1" />
      {[
        { x: 60, y: 40, w: 220, h: 60, label: "header" },
        { x: 280, y: 40, w: 220, h: 60, label: "header" },
        { x: 500, y: 40, w: 160, h: 60, label: "header" },
        { x: 60, y: 100, w: 220, h: 60, label: "nav" },
        { x: 280, y: 100, w: 220, h: 60, label: "main" },
        { x: 500, y: 100, w: 160, h: 60, label: "aside" },
        { x: 60, y: 160, w: 600, h: 60, label: "footer (spans all columns)" },
      ].map((c, i) => (
        <g key={i}>
          <rect
            x={c.x + 1}
            y={c.y + 1}
            width={c.w - 2}
            height={c.h - 2}
            fill="var(--bg-paper)"
            opacity="0.6"
          />
          <text
            x={c.x + c.w / 2}
            y={c.y + c.h / 2 + 5}
            textAnchor="middle"
            fill={CREAM}
            fontSize="13"
            fontFamily="monospace"
          >
            {c.label}
          </text>
        </g>
      ))}
      <text x="60" y="240" fill={INK_DIM} fontSize="11" fontFamily="monospace">
        {"three columns × three rows; footer spans the full width"}
      </text>
    </svg>
  );
}

function EventFlowDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 280" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>An event fires on the target, then bubbles up to ancestors.</title>
      <defs>
        <marker id={`${id}-arr`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={VERMILION} />
        </marker>
      </defs>
      {[
        { y: 30, label: "document", w: 480 },
        { y: 80, label: "section", w: 360 },
        { y: 130, label: "ul", w: 240 },
        { y: 180, label: "li  (target)", w: 140 },
      ].map((b, i, arr) => (
        <g key={i}>
          <rect
            x={(720 - b.w) / 2}
            y={b.y}
            width={b.w}
            height={36}
            rx="6"
            fill={i === arr.length - 1 ? "var(--bg-paper)" : "none"}
            stroke={i === arr.length - 1 ? VERMILION : INK}
            strokeWidth="1.2"
          />
          <text x={720 / 2} y={b.y + 23} textAnchor="middle" fill={CREAM} fontFamily="monospace" fontSize="13">
            {b.label}
          </text>
        </g>
      ))}
      {/* capture phase */}
      <path
        d="M 360 56 L 360 200"
        stroke={INK_DIM}
        strokeWidth="1.2"
        strokeDasharray="3 3"
        fill="none"
      />
      <text x="60" y="135" fill={INK_DIM} fontSize="11" fontFamily="monospace">capture</text>
      {/* bubble phase */}
      <path
        d="M 380 200 L 380 60"
        stroke={VERMILION}
        strokeWidth="1.5"
        fill="none"
        markerEnd={`url(#${id}-arr)`}
      />
      <text x="680" y="135" textAnchor="end" fill={VERMILION_SOFT} fontSize="11" fontFamily="monospace">bubble</text>
    </svg>
  );
}

function AjaxFlowDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>AJAX: ask the server for data while the page is open.</title>
      <defs>
        <marker id={`${id}-arr`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={VERMILION} />
        </marker>
      </defs>
      <rect x="40" y="50" width="200" height="120" rx="10" fill="none" stroke={INK} />
      <text x="140" y="80" textAnchor="middle" fill={CREAM} fontFamily="serif" fontSize="15">Page in browser</text>
      <text x="140" y="100" textAnchor="middle" fill={INK_DIM} fontFamily="monospace" fontSize="11">fetch('/api/tasks')</text>
      <text x="140" y="146" textAnchor="middle" fill={INK_DIM} fontFamily="monospace" fontSize="11">render data</text>
      <rect x="480" y="50" width="200" height="120" rx="10" fill="none" stroke={INK} />
      <text x="580" y="80" textAnchor="middle" fill={CREAM} fontFamily="serif" fontSize="15">Server</text>
      <text x="580" y="100" textAnchor="middle" fill={INK_DIM} fontFamily="monospace" fontSize="11">/api/tasks</text>
      <text x="580" y="146" textAnchor="middle" fill={INK_DIM} fontFamily="monospace" fontSize="11">JSON</text>
      <line x1="240" y1="100" x2="480" y2="100" stroke={VERMILION} strokeWidth="1.5" markerEnd={`url(#${id}-arr)`} />
      <text x="360" y="92" textAnchor="middle" fill={VERMILION_SOFT} fontSize="11" fontFamily="monospace">request</text>
      <line x1="480" y1="146" x2="240" y2="146" stroke={INK} strokeWidth="1.5" markerEnd={`url(#${id}-arr)`} />
      <text x="360" y="138" textAnchor="middle" fill={INK_DIM} fontSize="11" fontFamily="monospace">response</text>
    </svg>
  );
}

function ReactRenderDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 200" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>React: state change → re-render → diff → update DOM.</title>
      <defs>
        <marker id={`${id}-arr`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={VERMILION} />
        </marker>
      </defs>
      {[
        { x: 30, y: 70, w: 130, h: 70, label: "setState", sub: "trigger" },
        { x: 195, y: 70, w: 150, h: 70, label: "Re-render", sub: "compute new tree" },
        { x: 380, y: 70, w: 130, h: 70, label: "Diff", sub: "vs previous" },
        { x: 545, y: 70, w: 150, h: 70, label: "Patch DOM", sub: "minimal change" },
      ].map((b, i, arr) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill="none" stroke={INK} />
          <text x={b.x + b.w / 2} y={b.y + 30} textAnchor="middle" fill={CREAM} fontFamily="serif" fontSize="14">
            {b.label}
          </text>
          <text x={b.x + b.w / 2} y={b.y + 50} textAnchor="middle" fill={INK_DIM} fontSize="11" fontFamily="monospace">
            {b.sub}
          </text>
          {i < arr.length - 1 && (
            <line
              x1={b.x + b.w + 4}
              y1={b.y + b.h / 2}
              x2={arr[i + 1].x - 4}
              y2={b.y + b.h / 2}
              stroke={VERMILION}
              strokeWidth="1.4"
              markerEnd={`url(#${id}-arr)`}
            />
          )}
        </g>
      ))}
    </svg>
  );
}

function UseEffectLifecycleDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 720 200" role="img" aria-labelledby={`${id}-title`} className="w-full h-auto">
      <title id={`${id}-title`}>useEffect runs after render, then cleans up before the next run.</title>
      <defs>
        <marker id={`${id}-arr`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={VERMILION} />
        </marker>
      </defs>
      {[
        { y: 30, w: 180, label: "Component mounts", color: INK },
        { y: 80, w: 240, label: "Effect runs", color: VERMILION, fill: "var(--bg-paper)" },
        { y: 130, w: 220, label: "Cleanup runs", color: INK_DIM, strokeDash: "4 3" },
        { y: 180, w: 200, label: "Effect runs again", color: VERMILION, fill: "var(--bg-paper)" },
      ].map((b, i) => (
        <g key={i}>
          <rect
            x={(720 - b.w) / 2}
            y={b.y}
            width={b.w}
            height={36}
            rx="8"
            fill={b.fill || "none"}
            stroke={b.color}
            strokeWidth="1.4"
            strokeDasharray={b.strokeDash}
          />
          <text
            x={720 / 2}
            y={b.y + 23}
            textAnchor="middle"
            fill={CREAM}
            fontFamily="monospace"
            fontSize="13"
          >
            {b.label}
          </text>
        </g>
      ))}
      <line x1="360" y1="68" x2="360" y2="80" stroke={VERMILION} strokeWidth="1.4" markerEnd={`url(#${id}-arr)`} />
      <line x1="360" y1="118" x2="360" y2="130" stroke={INK_DIM} strokeWidth="1.4" strokeDasharray="3 3" markerEnd={`url(#${id}-arr)`} />
      <line x1="360" y1="168" x2="360" y2="180" stroke={VERMILION} strokeWidth="1.4" markerEnd={`url(#${id}-arr)`} />
    </svg>
  );
}

function Node({ x, y, label, small = false }: { x: number; y: number; label: string; small?: boolean }) {
  return (
    <g>
      <rect
        x={x - 50}
        y={y - 12}
        width={100}
        height={28}
        rx={6}
        fill="var(--bg-paper)"
        stroke={INK}
        strokeWidth="1"
      />
      <text x={x} y={y + 4} textAnchor="middle" fill={CREAM} fontSize={small ? 12 : 13} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

function Line({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK_DIM} strokeWidth="1" />;
}
