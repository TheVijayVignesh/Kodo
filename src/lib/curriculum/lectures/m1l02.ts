import type { Lecture, Quiz, Exercise } from "../types";

export const lecture: Lecture = {
  id: "m1l02",
  module: 1,
  number: 2,
  title: "HTML",
  subtitle:
    "Hypertext, markup, and the structure that holds every web page together. Why HTML is the floor plan and not the paint.",
  estimatedMinutes: 40,
  difficulty: "foundational",
  prerequisites: ["m1l01"],
  objectives: [
    "Define HTML as a declarative, tag-based language for describing document structure.",
    "Identify the parts of a minimal HTML5 document — doctype, html, head, body — and what each is for.",
    "Use headings, paragraphs, lists, links, images, and tables correctly.",
    "Distinguish semantic elements (header, nav, main, article, section, footer) from generic containers like div and span.",
    "Build a small, valid HTML page with meaningful structure.",
  ],
  sources: [
    { label: "Course slides — HTML", type: "course" },
    { label: "MDN — HTML", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { label: "MDN — HTML element reference", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element" },
  ],
  sections: [
    {
      type: "context",
      body:
        "HTML is the language of structure. The browser reads your file, builds a tree from it, and that tree is what you see. This lecture walks through what HTML is, how a document is shaped, and how to write it so the tree is meaningful — not just valid, but useful to assistive technology, to search engines, and to your future self.",
    },
    {
      type: "objectives",
      items: [
        "Read a minimal HTML5 document and explain the role of the doctype, html, head, and body.",
        "Write a valid HTML structure for a small content page (heading, paragraphs, list, link, image, table).",
        "Choose a semantic element over a generic div when one is appropriate.",
        "Recognise elements that are block-level vs inline, and void vs paired.",
        "Use the HTML lab to construct a page and see it render as you type.",
      ],
    },
    {
      type: "prose",
      title: "HTML is a markup language, not a programming language",
      paragraphs: [
        "HTML is a way of describing what each piece of a document is. A piece of text in <h1> is a top-level heading. A piece of text in <p> is a paragraph. A piece in <a href=\"...\"> is a link to somewhere else. There is no logic in HTML. There is no variable, no condition, no loop. The browser interprets the markup and builds a tree, but the markup itself is descriptive.",
        "This is the difference between HTML and the languages that surround it. CSS is a styling language — it tells the browser what the tree should look like. JavaScript is a programming language — it can reach into the tree and change it. HTML does neither. It only says what each node is.",
        "When you keep that separation clear, your code becomes easier to read, easier to test, and more accessible by default. The cleaner your HTML, the less work CSS and JavaScript have to do to compensate.",
      ],
    },
    {
      type: "concept",
      title: "Anatomy of a minimal document",
      body:
        "Every HTML5 document starts with the same skeleton. The <!doctype html> declaration tells the browser this is an HTML5 file (it is not a tag, despite the angle brackets). The <html> element wraps the whole document. Inside, <head> contains metadata and links to resources the document needs. <body> contains the visible content. A <title> inside <head> sets the browser tab text and is also the default bookmark name.",
      mentalModel:
        "If the document is a book, <head> is the title page and copyright page, and <body> is the actual content. <!doctype> is the convention on the cover that says what edition this is.",
      example: {
        language: "html",
        code:
`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Field guide to the urban fox</title>
  </head>
  <body>
    <h1>Field guide to the urban fox</h1>
    <p>The red fox has colonised cities on five continents.</p>
  </body>
</html>`,
        caption: "A minimal HTML5 document. Save as .html and open in any browser.",
      },
      pitfall:
        "Forgetting the lang attribute on <html> removes a piece of information that screen readers and translation tools rely on. Set it on every page, even a one-off demo.",
    },
    {
      type: "concept",
      title: "Tags, elements, and void elements",
      body:
        "A tag is the markup between angle brackets: <p>. An element is the tag plus its content plus the closing tag: <p>A paragraph.</p>. Some elements have no content and no closing tag — these are void elements. They are written as a single tag: <br>, <hr>, <img>, <input>, <meta>, <link>. Writing <br></br> is wrong and will trip up a strict parser.",
      mentalModel:
        "Tag is the marker. Element is the marker plus what it marks.",
      pitfall:
        "Some elements are not void but are often written that way. <script src=\"...\"></script> needs a closing tag, even if the content is empty. <input> is void; <textarea> is not.",
    },
    {
      type: "concept",
      title: "Attributes — the properties of an element",
      body:
        "Attributes live inside the opening tag and tune the element. Some are required (the src of an <img>, the href of an <a>), others are optional (alt, title, class, id). A boolean attribute is present or absent — you do not write checked=\"true\", you just write checked. Some attributes are global — id, class, title, data-* — and work on every element. Others only make sense on specific tags.",
      example: {
        language: "html",
        code:
`<a href="https://snuchennai.edu.in/" target="_blank" rel="noopener">SNU Chennai</a>
<img src="fox.jpg" alt="A red fox in a city park" width="640" height="360">
<input type="email" name="contact" required placeholder="you@example.com">`,
        caption: "Attributes are name/value pairs in the opening tag. The values are quoted.",
      },
    },
    {
      type: "concept",
      title: "Block vs inline — the default flow",
      body:
        "Most elements are either block or inline. Block elements start on a new line and stretch the full width of their container. <p>, <h1>–<h6>, <ul>, <li>, <div>, <section>, <article> are block. Inline elements sit inside a line of text and only take up as much space as they need. <a>, <span>, <strong>, <em>, <img> are inline. The distinction matters because the same CSS property behaves differently on each, and because nesting rules forbid inline containers from wrapping block content.",
      pitfall:
        "Putting a <div> inside a <p> is invalid. The browser will close the <p> early, which can change your layout in surprising ways. Use inline elements inside paragraphs, and block elements for the structure of the page.",
    },
    {
      type: "concept",
      title: "Semantic elements — say what you mean",
      body:
        "HTML5 introduced a set of elements that describe the role of a chunk of content. <header> introduces a page or a section. <nav> holds navigation links. <main> contains the unique content of the page. <article> wraps a self-contained piece (a blog post, a card). <section> groups related content under a heading. <aside> holds content tangentially related to what surrounds it. <footer> closes a page or a section.",
      mentalModel:
        "The browser does not render <article> any differently from <div> by default. The value is in what the tag tells assistive technology, search engines, and your future self about the role of that part of the page.",
    },
    {
      type: "example",
      title: "A semantic content page",
      code:
`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Field guide to the urban fox</title>
  </head>
  <body>
    <header>
      <h1>Field guide to the urban fox</h1>
      <p>A brief introduction to the species we share our cities with.</p>
    </header>
    <nav aria-label="Sections">
      <ul>
        <li><a href="#diet">Diet</a></li>
        <li><a href="#habitat">Habitat</a></li>
        <li><a href="#behaviour">Behaviour</a></li>
      </ul>
    </nav>
    <main>
      <article>
        <section id="diet">
          <h2>Diet</h2>
          <p>Foxes are omnivores. They eat small mammals, fruit, and scraps.</p>
        </section>
        <section id="habitat">
          <h2>Habitat</h2>
          <p>Urban foxes den in disused structures and under sheds.</p>
        </section>
      </article>
    </main>
    <footer>
      <p>Last updated <time datetime="2026-08-01">1 August 2026</time>.</p>
    </footer>
  </body>
</html>`,
      language: "html",
      walkthrough:
        "Every region of the page is named: <header> for the introduction, <nav> for the section links, <main> for the content, <article> for the self-contained guide, <section> for each chapter, <footer> for the metadata. A screen reader user can jump to <main>, then to <nav>, then to <footer> without reading the whole page. The <h1>–<h2> heading hierarchy is correct: one h1, h2s only under it.",
    },
    {
      type: "interactive",
      componentKey: "HtmlLab",
      title: "HTML lab",
      description:
        "Edit the HTML on the left. The page on the right renders live. The structural check below flags issues like missing alt text, unlabelled form controls, missing href on anchors, and unbalanced tags.",
    },
    {
      type: "mistakes",
      title: "Common mistakes in HTML",
      items: [
        {
          mistake: "Using <div> for everything.",
          fix:
            "Default to a semantic element (<article>, <section>, <nav>, <header>, <main>, <footer>, <aside>). Reach for <div> only when no semantic element fits.",
        },
        {
          mistake: "Skipping the alt attribute on <img>.",
          fix:
            "Every image has an alt. If the image is purely decorative, write alt=\"\". Otherwise, describe what the image communicates in context.",
        },
        {
          mistake: "Multiple <h1>s on a page.",
          fix:
            "Use one <h1> per page, and step down through the heading levels without skipping. <h1> → <h2> → <h3> is the pattern. Avoid <h1> → <h4>.",
        },
        {
          mistake: "Putting block elements inside inline elements.",
          fix:
            "Inline elements can only contain phrasing content. <p><div>...</div></p> is invalid. Restructure so the block element sits beside or outside the inline one.",
        },
        {
          mistake: "Closing void elements.",
          fix:
            "Don't write <br/>, <img/>, <input/>. The slash is HTML5-XHTML confusion. <br> is enough.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m1l02-ex01",
      title: "Build a small content page",
      description:
        "Create an HTML page with a header, a navigation, two sections of content, and a footer. The checker inspects the rendered structure.",
    },
    {
      type: "quiz",
      quizId: "m1l02-q",
    },
    {
      type: "summary",
      body:
        "HTML describes the structure of a document. A minimal HTML5 document has a doctype, an <html lang> element, a <head> with metadata, and a <body> with content. Tags mark content; elements are the marked-up content. Block elements break the flow; inline elements run inside it. Semantic elements — header, nav, main, article, section, footer — describe the role of a region. When the markup is right, the rest of the stack is easier to write.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m1l02-q",
    title: "HTML check",
    questions: [
      {
        kind: "mcq",
        id: "m1l02-q1",
        prompt: "What is the role of the <head> element?",
        options: [
          "It contains the visible content of the page.",
          "It contains metadata and links to resources the page needs.",
          "It defines the document's background colour.",
          "It is optional and can be removed without consequence.",
        ],
        correctIndex: 1,
        explanation:
          "<head> holds metadata (title, charset, viewport, description) and links to resources (stylesheets, scripts, fonts). It is not visible to the reader.",
      },
      {
        kind: "mcq",
        id: "m1l02-q2",
        prompt: "Which of these is a void element (does not need a closing tag)?",
        options: ["<p>", "<div>", "<img>", "<span>"],
        correctIndex: 2,
        explanation:
          "<img> is void. <p>, <div>, and <span> all need closing tags. Other void elements include <br>, <hr>, <input>, <meta>, and <link>.",
      },
      {
        kind: "truefalse",
        id: "m1l02-q3",
        prompt: "An image without an alt attribute is considered an accessibility problem.",
        correct: true,
        explanation:
          "Without alt, screen readers cannot describe the image to blind users, and the image becomes invisible to assistive technology. Always set alt — use alt=\"\" for purely decorative images.",
      },
      {
        kind: "mcq",
        id: "m1l02-q4",
        prompt: "Which element best represents a self-contained piece of content such as a blog post?",
        options: ["<div>", "<section>", "<article>", "<aside>"],
        correctIndex: 2,
        explanation:
          "<article> represents a self-contained composition that could be syndicated or reused independently. <section> is a thematic grouping; <aside> is tangentially related; <div> has no semantic meaning.",
      },
      {
        kind: "mcq",
        id: "m1l02-q5",
        prompt: "Which pattern is valid in HTML?",
        options: [
          "<p><div>...</div></p>",
          "<a><p>...</p></a>",
          "<section><h2>Title</h2><p>...</p></section>",
          "<h1>One</h1><h4>Another</h4>",
        ],
        correctIndex: 2,
        explanation:
          "Block elements (section, p, h1) are siblings or nested correctly. Wrapping a <div> in a <p> is invalid — the browser will close the <p> early. <a> is inline and cannot contain block elements. Heading levels should not skip.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m1l02-ex01",
    lectureId: "m1l02",
    title: "A semantic content page",
    brief:
      "Build a small HTML page with a <header>, a <nav>, a <main> containing at least two <section>s, and a <footer>. Use one <h1>, then <h2>s for the section headings. Include a list of links in the nav.",
    kind: "html",
    starter:
`<!-- Build the page here. -->
`,
    tests: [
      { kind: "html-contains", selector: "header", min: 1 },
      { kind: "html-contains", selector: "nav", min: 1 },
      { kind: "html-contains", selector: "main", min: 1 },
      { kind: "html-contains", selector: "footer", min: 1 },
      { kind: "html-contains", selector: "h1", min: 1 },
      { kind: "html-contains", selector: "section", min: 2 },
      { kind: "html-contains", selector: "nav a", min: 1 },
    ],
    hints: [
      "Start with <!doctype html> and the lang attribute on <html>.",
      "Each <section> needs a heading (<h2>) to be useful to assistive technology.",
      "Make sure the <nav> contains at least one link.",
    ],
    solution:
`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Field guide to the urban fox</title>
  </head>
  <body>
    <header>
      <h1>Field guide to the urban fox</h1>
    </header>
    <nav aria-label="Sections">
      <ul>
        <li><a href="#diet">Diet</a></li>
        <li><a href="#habitat">Habitat</a></li>
      </ul>
    </nav>
    <main>
      <section id="diet">
        <h2>Diet</h2>
        <p>Foxes are omnivores. They eat small mammals, fruit, and scraps.</p>
      </section>
      <section id="habitat">
        <h2>Habitat</h2>
        <p>Urban foxes den in disused structures and under sheds.</p>
      </section>
    </main>
    <footer>
      <p>Last updated 1 August 2026.</p>
    </footer>
  </body>
</html>`,
    solutionExplanation:
      "The page is a real document. Each landmark is named (header, nav, main, footer). The heading hierarchy is correct (one h1, h2 inside each section). The nav contains real anchor links to in-page sections. Save it as .html and open it in a browser to see it.",
  },
];
