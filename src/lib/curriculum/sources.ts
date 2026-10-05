import type { SourceRef } from "./types";
import { MODULE_3 } from "./lectures/index";

/**
 * Research sources used across the curriculum.
 *   type "course" = supplied SNUC lecture material
 *   type "mdn"   = MDN Web Docs
 *   type "react-docs" = official React documentation
 *   type "w3c"   = W3C specifications
 *   type "book"   = a referenced textbook
 *   type "other"  = other official or project documentation
 */
const sources: SourceRef[] = [
  // Course materials
  { id: "course-m1l01", title: "SJ_Lecture 1-Introduction.pptx", topic: "Course Introduction", type: "course", dateAccessed: "2026-08-28" },
  { id: "course-m1l02", title: "SJ_Lecture 2-HTML.pptx", topic: "HTML", type: "course", dateAccessed: "2026-08-28" },
  { id: "course-m1l03", title: "SJ_Lecture 3HTML.pptx", topic: "HTML Elements", type: "course", dateAccessed: "2026-08-28" },
  { id: "course-m1l04", title: "SJ_Lecture 4_CSS.pptx", topic: "CSS", type: "course", dateAccessed: "2026-08-28" },
  { id: "course-m1l05", title: "SJ_Lecture 5 - Javascript.pptx", topic: "JavaScript", type: "course", dateAccessed: "2026-08-28" },
  { id: "course-m1l06", title: "SJ_Lecture 6 - Javascript_DataType_Array_Functions.pptx", topic: "JS Data Types", type: "course", dateAccessed: "2026-08-28" },
  { id: "course-m1l08", title: "SJ_Lecture 8 - DOM Manipulation and Event Handling.pptx", topic: "DOM and Events", type: "course", dateAccessed: "2026-08-28" },
  { id: "course-m1l09", title: "SJ_Lecture 9-AJAX.pptx", topic: "AJAX", type: "course", dateAccessed: "2026-08-28" },
  { id: "course-m2l01", title: "SJ_Lecture 10 React JS.pptx", topic: "React", type: "course", dateAccessed: "2026-08-28" },
  // MDN
  { id: "mdn-html", title: "MDN — HTML: Hypertext Markup Language", topic: "HTML", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { id: "mdn-css", title: "MDN — CSS: Cascading Style Sheets", topic: "CSS", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { id: "mdn-js", title: "MDN — JavaScript", topic: "JavaScript", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { id: "mdn-dom", title: "MDN — DOM", topic: "DOM", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" },
  { id: "mdn-fetch", title: "MDN — fetch()", topic: "AJAX", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" },
  { id: "mdn-xhr", title: "MDN — XMLHttpRequest", topic: "AJAX", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest" },
  { id: "mdn-events", title: "MDN — Introduction to events", topic: "Events", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events" },
  { id: "mdn-boxmodel", title: "MDN — The box model", topic: "CSS", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model" },
  { id: "mdn-flexbox", title: "MDN — Flexbox", topic: "CSS", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox" },
  { id: "mdn-grid", title: "MDN — CSS Grid Layout", topic: "CSS", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout" },
  { id: "mdn-strict-equality", title: "MDN — Equality comparisons and sameness", topic: "JavaScript", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness" },
  // React
  { id: "react-learn", title: "React — Quick Start", topic: "React", type: "react-docs", url: "https://react.dev/learn" },
  { id: "react-thinking", title: "React — Thinking in React", topic: "React", type: "react-docs", url: "https://react.dev/learn/thinking-in-react" },
  { id: "react-hooks", title: "React — Hooks reference", topic: "React", type: "react-docs", url: "https://react.dev/reference/react/hooks" },
  // Server-side development
  { id: "nodejs-docs", title: "Node.js Documentation", topic: "Server-side JavaScript", type: "other", url: "https://nodejs.org/docs/latest/api/" },
  { id: "npm-docs", title: "npm Documentation", topic: "Package management", type: "other", url: "https://docs.npmjs.com/" },
  { id: "express-docs", title: "Express Documentation", topic: "Server-side routing and middleware", type: "other", url: "https://expressjs.com/en/" },
  { id: "mysql-manual", title: "MySQL 8.4 Reference Manual", topic: "Relational databases", type: "other", url: "https://dev.mysql.com/doc/refman/8.4/en/" },
  { id: "mongodb-manual", title: "MongoDB Manual", topic: "Document databases", type: "other", url: "https://www.mongodb.com/docs/manual/" },
  { id: "mongodb-node-driver", title: "MongoDB Node.js Driver Documentation", topic: "Node.js database drivers", type: "other", url: "https://www.mongodb.com/docs/drivers/node/current/" },
  // Books
  { id: "deitel", title: "Deitel & Deitel — Internet and the World Wide Web: How to Program", topic: "Web Foundations", type: "book" },
];

const sourceUrls = new Set(sources.flatMap((source) => (source.url ? [source.url] : [])));
const sourceIds = new Set(sources.map((source) => source.id));

for (const lecture of MODULE_3.lectures) {
  for (const source of lecture.sources) {
    if (!source.url || sourceUrls.has(source.url)) continue;

    sourceUrls.add(source.url);
    const sourceSlug = source.url
      .replace(/^https?:\/\//i, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
    const id = `m3-${sourceSlug}`;
    if (sourceIds.has(id)) throw new Error(`Duplicate source ID: ${id}`);

    sourceIds.add(id);
    sources.push({
      id,
      title: source.label,
      topic: `Module 3 · ${lecture.title}`,
      type: "other",
      url: source.url,
    });
  }
}

export const SOURCES: SourceRef[] = sources;
export const SOURCES_BY_ID = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
