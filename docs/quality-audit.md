# Kōdo — Quality Audit

Technical verification of the application at the end of this milestone.

## Environment

- **Framework:** Next.js 16.3.3 (App Router, Turbopack)
- **Runtime:** React 19.2.8
- **Language:** TypeScript 5 (strict)
- **Styling:** Tailwind CSS v4 + CSS custom properties for the Zen design system
- **Motion:** framer-motion
- **State:** zustand (with `persist` middleware → localStorage)
- **Sandbox:** native `<iframe sandbox="allow-scripts allow-same-origin">` with postMessage handshake
- **Petals:** jhammann/sakura (loaded as a UMD bundle, attached to a fixed-position host element so petals follow the viewport)

## Build & type verification

```
$ npx tsc --noEmit
(no output)

$ npx next build
✓ Compiled successfully
✓ Generating static pages using 9 workers (6/6)
Route (app)
┌ ○ /            Static
├ ○ /_not-found  Static
├ ○ /exam        Static
├ ƒ /modules/[id]
├ ƒ /modules/1/[lectureId]
└ ○ /sources     Static
```

- **Typecheck:** clean (no errors, no warnings)
- **Build:** clean, all 6 routes prerender
- **Lint:** `next lint` was removed in Next 16; ESLint flat config is the official replacement and was not configured in this milestone. The TypeScript strict pass and the typecheck above are the primary safety net.

## Functional test results

### Navigation
| Check | Result |
|-------|--------|
| Homepage loads, shows studio heading | ✓ |
| Module 1 page lists all 9 lectures | ✓ (9 `<a href="/modules/1/m1l..">` found) |
| Every Module 1 lecture loads and renders hero | ✓ (9 / 9) |
| Every Module 2 lecture loads and renders hero | ✓ (10 / 10) |
| Module 2 page lists all 10 lectures | ✓ |
| Exam page renders both papers and reveal controls | ✓ |
| Sources page lists research sources | ✓ |
| 404 page renders for unknown routes | ✓ |
| Theme toggle changes `data-theme` attribute | ✓ |

### Coding exercises
| Check | Result |
|-------|--------|
| FizzBuzz (m1l05-ex01) with correct solution → "All tests passed" | ✓ verified via Playwright |
| HTML semantic content (m1l02-ex01) with correct solution → 7 / 7 tests passed | ✓ verified via Playwright |
| M2 React exercise (m2l01-ex01) with starter code → "Passed — 1 × h1 found" | ✓ verified via Playwright |
| Wrong / incomplete solutions produce detailed failure messages | ✓ ("Expected at least 1 of selector `header` — found 0. Expected: ≥ 1, Received: 0") |
| Solution reveal works | ✓ |
| Hints reveal works | ✓ |

### Exam Hall
| Check | Result |
|-------|--------|
| Original 50-mark paper loads | ✓ |
| Practice Paper 1 loads | ✓ |
| Reveal solution expands the answer with "Answer", "Why this is correct", "Marks-oriented notes" | ✓ |
| OR questions split into Option A / Option B | ✓ |
| Prompt HTML fenced code blocks render without hydration warnings | ✓ (fixed in ExamView) |

### Sakura petals (jhammann/sakura)
| Check | Result |
|-------|--------|
| Library bundle loads on every page | ✓ (`/sakura.min.js` script tag) |
| Petals visible at top of page | ✓ |
| Petals visible at bottom of long page | ✓ (mounted on a `position: fixed; inset: 0` host div) |
| Reduced motion respected | ✓ (skips init when `prefers-reduced-motion: reduce`) |
| Petals pause over code editor | ✓ (paused on `/modules/1/m1l0*` routes) |

## Visual QA

| Page | Result |
|------|--------|
| Homepage (dark) | Renders with seal 禅, headline, 19-lecture stat, Continue learning, path with dotted curve, three cards (Module 1, Module 2, Exam Hall). |
| Homepage (light) | Cream background, dark text. |
| Module 1 page | Lists all 9 lectures with status, progress, exercise count, difficulty. |
| Module 2 page | Lists all 10 lectures (React, MVC/ES6, JSX, Quiz, JSX Pt 2, State, Hook, Routing, Bootstrap, Capstone). |
| Lecture page (m1l01) | Hero, kanji seal, objectives, prose, diagram, concept with mental model, pitfall, interactive PageAnatomy, mistakes, exercise, quiz, summary, sources, completion, prev/next. |
| Lecture page (m2l01) | React hero, objectives, prose, ReactSandbox interactive, mistakes, React exercise, quiz, summary, sources, completion, prev/next. |
| Lecture footer (m1l01) | Sources separated by `mt-20` from content; Lecture completion separated by `mt-12` from sources. No squishing. |
| Exam Hall | Both papers render with question cards, marks/KL/CO chips, code blocks render correctly (no hydration warnings). |
| Sources page | Grouped by source type. |
| Dark mode | `--ink-950: #000000` — true sumi-black. Body background nearly pure black. |

## Accessibility observations

- Every interactive element has a real accessible name (button text, link text, or `aria-label`).
- The theme toggle's `aria-label` is "Switch to (light|dark) mode" so the intent is always clear.
- Form controls in HTML examples use real labels and proper `for`/`id` associations.
- SVG diagrams include `<title>` elements for screen readers.
- `prefers-reduced-motion: reduce` is honoured in both the petal layer and the playground animations.
- Focus styles use `:focus-visible` with the vermilion accent so keyboard focus is always visible.
- The search palette is keyboard-driven: `Cmd/Ctrl+K` opens it, `Escape` closes it.

## Performance observations

- Initial JS for the homepage is small: Next.js streams the page; sakura is loaded as a deferred script tag; no large client component trees.
- The 3D WebGL attempt (R3F + glTF + post-processing) was **dropped** because it was both visually poor and expensive. The petal layer is a 3KB CSS+JS bundle and has effectively zero runtime cost beyond the small number of absolutely-positioned divs.
- Zustand state is split: progress, quiz, bookmarks, and notes each have their own localStorage key. The store rehydrates on mount, not on every render.

## 3D / environment QA

Per the user's explicit instruction, the WebGL-based 3D environment was removed entirely. The environment is now:
- A falling-petal layer (jhammann/sakura, MIT, 3KB)
- An ambient backdrop (CSS-only radial gradients, no scripts)
- Hand-authored inline SVG diagrams inside the lecture content

No 3D models are loaded. No `three.js` / `@react-three/fiber` / `@react-three/drei` packages remain in `package.json` dependencies.

## Asset compliance

| Asset | Source | License | File |
|-------|--------|---------|------|
| `sakura.min.js`, `sakura.min.css` | https://github.com/jhammann/sakura | MIT (per repository) | `public/sakura.min.{js,css}` |
| Spectral, Inter Tight, JetBrains Mono, Noto Serif JP | Google Fonts | SIL Open Font License | loaded via `next/font` |
| lucide-react icons | https://lucide.dev | ISC | imported per-component |

All other visual content (diagrams, particles) is hand-authored in code. No AI-generated decorative artwork. No stock photography.

## Known limitations

- **React sandbox** uses `react-live`, which transpiles JSX in the browser via @babel/standalone. It is functional but adds ~200 KB to the M2 lecture bundle. A lighter alternative (a hand-written JSX-to-createElement playground) could be substituted in a future round.
- **The 100-mark end-semester paper is not in this milestone**, per the master specification.
- **Lint** — `next lint` is removed in Next 16. ESLint flat config is the replacement and was not configured in this milestone. The TypeScript strict mode is the primary safety net.
- **Playwright E2E** is configured and passes (26 tests). Tests are serial to avoid dev-server load issues during local development; a CI run with a built `next start` would handle parallelism fine.

## Final commit graph

```
5820f8a docs: update content audit to include Module 2
b5ab0fe test: add Module 2 lecture tests; serialize for stable dev-server handling
<earlier> feat: add Module 2 (React) with 10 lectures and React exercise runner
<earlier> feat: replace 3d with jhammann/sakura petals, deepen content, fix sandbox
464da4a chore: checkpoint before final visual enhancement
deecf20 Initial commit from Create Next App
```
