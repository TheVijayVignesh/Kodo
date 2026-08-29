import type { Lecture, Quiz, Exercise } from "../types";

export const lecture: Lecture = {
  id: "m1l01",
  module: 1,
  number: 1,
  title: "Course Introduction",
  subtitle:
    "How a browser turns text into a living page, and where HTML, CSS, JavaScript, the DOM, AJAX, and React fit in that picture.",
  estimatedMinutes: 40,
  difficulty: "foundational",
  prerequisites: [],
  objectives: [
    "Explain what the web is, in terms of clients, servers, and the HTTP protocol that joins them.",
    "Distinguish the three core languages of the browser — HTML, CSS, JavaScript — and what each is for.",
    "Describe the document as a tree (the DOM) and how JavaScript reaches into it.",
    "Place AJAX and React in the wider arc from static pages to component-driven single-page apps.",
    "Use the interactive page anatomy to see what each language does to the same page.",
  ],
  sources: [
    { label: "Course slides — Introduction to Web Technology", type: "course" },
    { label: "MDN — How the Web works", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work" },
    { label: "Deitel & Deitel — Internet and the WWW: How to Program", type: "book" },
  ],
  sections: [
    {
      type: "context",
      body:
        "Before any framework, before any library, the browser does the same work it has done since 1993. It receives a text file, decides what kind of file it is, asks for more if it needs them, and turns the result into a document you can read, click, and type into. This lecture lays out that machinery so the rest of the course has a place to attach itself to. We will look at the pieces, then look at how they fit together, and finally at the page as a complete document.",
    },
    {
      type: "objectives",
      items: [
        "Sketch the client–server–protocol triangle and name each role.",
        "List the three languages that make a page run in the browser, and what each one decides.",
        "Identify the DOM as a tree the browser builds from your HTML.",
        "Locate AJAX and React in the timeline of how pages evolved.",
        "Use the interactive page anatomy to see what each language does to the same page.",
      ],
    },
    {
      type: "prose",
      title: "The web is machines talking to machines",
      paragraphs: [
        "Strip the web down and it is a conversation. A program on your laptop (or phone, or watch) wants a document. It writes a request that follows a language both sides agreed on — HTTP, the Hypertext Transfer Protocol. It sends that request across wires, fibre, and radio to another program running on a different machine. That second program, the server, reads the request, decides what to send back, and writes a response.",
        "Three things matter: a client that initiates, a server that responds, and a protocol they both speak. Without the protocol, the client does not know when the response ends, what kind of content it is, or whether the request even arrived. HTTP gives the conversation shape. Without the client, no request is ever made. Without the server, nothing answers.",
        "Most of the time when developers say \"the web\" they mean this whole loop. When they say \"front-end\" they mean the client side of it — everything that runs in the browser. When they say \"back-end\" they mean the server side. The languages you learn in this course live almost entirely on the client side, even though they are reaching outward constantly toward servers.",
      ],
    },
    {
      type: "diagram",
      kind: "client-server",
      caption: "The browser sends a request; the server answers. HTTP is the language they share.",
    },
    {
      type: "concept",
      title: "Three languages, one document",
      body:
        "A page that does anything interesting is built from three languages with three different jobs. HTML describes what the document is — its structure, its headings, its links, its forms. CSS describes what it looks like — colours, spacing, layout, type. JavaScript describes what it does — what happens when the user clicks, types, or waits.",
      mentalModel:
        "Think of a building. HTML is the floor plan: walls, doors, rooms. CSS is the interior design: paint, lights, the shape of the lobby. JavaScript is the building's behaviour: the elevator that arrives when you press the button, the door that opens when you approach it.",
      example: {
        language: "html",
        code:
`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Field guide to the urban fox</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>Welcome</h1>
    <p class="note">This paragraph is styled by CSS.</p>
    <button id="ping">Click me</button>
    <script src="app.js" defer></script>
  </body>
</html>`,
        caption: "HTML holds the document; a <link> brings in CSS; a <script> brings in JavaScript.",
      },
      walkthrough:
        "The <!doctype html> declaration says \"this is an HTML5 document\". The <head> contains metadata and links to resources — the <link rel=\"stylesheet\"> asks for the CSS file, and the <script src> asks for the JavaScript file. The <body> contains what the user actually sees. The three languages stay in separate files and the browser pulls them together.",
      pitfall:
        "It is tempting to do everything in JavaScript because JavaScript can do anything. Resist this. Mixing structure (HTML), presentation (CSS), and behaviour (JS) into one file is the original sin of front-end code. Each language has a job; letting it do its job is what makes pages robust.",
    },
    {
      type: "concept",
      title: "The browser is a renderer, a parser, and a runtime",
      body:
        "When you type a URL and press Enter, the browser performs a recognisable sequence. It resolves the domain name to an IP address. It opens a connection, usually encrypted. It sends an HTTP GET request. It waits for a response. The first response is usually an HTML file. The browser reads that file character by character, tokenises it, and builds a tree-shaped model of the document. While doing that, it pauses to fetch the CSS, the JavaScript, the images, the fonts — every external thing the document asks for. It then combines structure and style into a paint tree, lays the result out, and shows it to you.",
      mentalModel:
        "Three concurrent pipelines: parsing HTML into a document tree, parsing CSS into computed rules, and executing JavaScript that can reach into either tree. The moment JavaScript can run, the page becomes interactive.",
    },
    {
      type: "diagram",
      kind: "browser-pipeline",
      caption: "The browser pipeline: raw bytes become a tree become a painted page.",
    },
    {
      type: "concept",
      title: "The DOM is a tree the browser hands you",
      body:
        "Once the browser finishes parsing, the document is exposed to your JavaScript as a tree of objects. Each element becomes a node. Each text run becomes a text node. Each comment becomes a comment node. The whole thing has a single root — `document`. This tree is the Document Object Model, and it is what your JavaScript reaches when it calls `document.querySelector` or `element.appendChild`. It is the same document you see on screen, but exposed as data a program can manipulate.",
      example: {
        language: "html",
        code:
`<ul id="list">
  <li>One</li>
  <li>Two</li>
</ul>`,
        caption: "This HTML becomes a tree: document → html → body → ul#list → li → text 'One', li → text 'Two'.",
      },
      walkthrough:
        "Notice that attributes become properties of the node — id=\"list\" is reachable as `node.id` from JavaScript. The text inside an element is a child text node, not a property of the element. This is why `element.textContent` returns the text but `element.innerHTML` returns the markup including the tags. The DOM is a structured, navigable representation of the same document the user sees.",
    },
    {
      type: "diagram",
      kind: "dom-tree",
      caption: "The DOM: each element is a node, each text run is a child text node.",
    },
    {
      type: "prose",
      title: "From static pages to single-page apps",
      paragraphs: [
        "Pages in the early web were documents. The browser fetched a complete HTML file every time you clicked a link. If the developer wanted to update one word on the page, they shipped a brand new file. AJAX changed that. AJAX is the practice of asking the server for a small piece of data while the page is already open, then weaving that data into the existing document with JavaScript. The page stops being a document you navigate between, and starts being a workspace that updates in place.",
        "React is the next step in the same direction. Instead of reaching into the DOM by hand every time data changes, you describe the page as a function of its data and let React reconcile the difference between what the page looked like before and what it should look like now. The mental model changes from imperative DOM updates to declarative UI: you say what the page should be, the library works out how to make it that way.",
        "You will not use React in this module, but you will use the foundations it relies on: well-formed HTML, scoped CSS, and JavaScript that can read and rewrite the document tree. Module 2 builds on that.",
      ],
    },
    {
      type: "interactive",
      componentKey: "PageAnatomy",
      title: "Anatomy of a page",
      description:
        "Toggle HTML, CSS, and JavaScript on and off. Watch what each language contributes. Without HTML the page is empty. Without CSS it is still readable but unstyled. Without JavaScript the button does nothing. The structure, the style, the behaviour — each is the work of a different language.",
    },
    {
      type: "mistakes",
      title: "Common mistakes at the start of the course",
      items: [
        {
          mistake: "Treating JavaScript as the only real language.",
          fix:
            "HTML, CSS, and JavaScript are siblings. Most accessibility, performance, and rendering problems come from poor HTML or CSS, not from poor JavaScript. Reach for JavaScript last, not first.",
        },
        {
          mistake: "Assuming the browser runs JavaScript the moment the script tag is parsed.",
          fix:
            "A <script> tag without defer or async blocks parsing while it downloads and executes. That is why production code places scripts at the end of <body> or uses defer. The script does not run as soon as you see the tag.",
        },
        {
          mistake: "Reaching into the DOM before the document has finished loading.",
          fix:
            "If your script runs in <head>, wrap the code in DOMContentLoaded, place the script at the end of <body>, or use defer on the <script> tag. The elements it touches must already exist.",
        },
        {
          mistake: "Mixing structure and style (e.g. inline styles for everything).",
          fix:
            "Inline styles and inline event handlers are sometimes necessary, but as a default they make code impossible to maintain. The structure (HTML) and the appearance (CSS) belong in different files.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m1l01-ex01",
      title: "Tag the languages",
      description:
        "Given a small HTML document, mark which lines are HTML, which are CSS, and which are JavaScript. The checker inspects your labels and tells you which were right.",
    },
    {
      type: "quiz",
      quizId: "m1l01-q",
    },
    {
      type: "summary",
      body:
        "The web is a protocol-driven conversation between clients and servers. A browser receives HTML, builds a document tree, fetches the supporting CSS and JavaScript, and gives the JavaScript a programmatic handle on the document (the DOM). HTML is structure, CSS is presentation, JavaScript is behaviour. The rest of this course is an extended tour of those three jobs, plus AJAX (reaching outward for data) and React (describing UI as a function of state).",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m1l01-q",
    title: "Course Introduction check",
    questions: [
      {
        kind: "mcq",
        id: "m1l01-q1",
        prompt: "Which protocol do browsers and web servers use to talk to each other?",
        options: ["SMTP", "HTTP", "FTP", "WebSocket"],
        correctIndex: 1,
        explanation:
          "HTTP — the Hypertext Transfer Protocol — is the language browsers and servers use to exchange requests and responses. WebSockets are an additional upgrade path, not the default.",
      },
      {
        kind: "truefalse",
        id: "m1l01-q2",
        prompt:
          "JavaScript can be used to change the contents of a web page after it has loaded in the browser.",
        correct: true,
        explanation:
          "JavaScript has full access to the DOM — the live document tree — and can change text, attributes, structure, and styles at any time after the page is loaded.",
      },
      {
        kind: "mcq",
        id: "m1l01-q3",
        prompt: "Which language is responsible for the colours and layout of a page?",
        options: ["HTML", "CSS", "JavaScript", "SQL"],
        correctIndex: 1,
        explanation: "CSS — Cascading Style Sheets — describes presentation: colours, type, layout, motion.",
      },
      {
        kind: "mcq",
        id: "m1l01-q4",
        prompt: "What is the DOM?",
        options: [
          "A database of MIME types",
          "A tree-shaped model of the document, exposed to JavaScript as objects",
          "A styling language",
          "A server-side templating engine",
        ],
        correctIndex: 1,
        explanation:
          "The Document Object Model is the in-memory, tree-shaped representation of an HTML document that the browser hands to your JavaScript. Each element becomes a node you can read and modify.",
      },
      {
        kind: "mcq",
        id: "m1l01-q5",
        prompt: "What does AJAX primarily change about how the web works?",
        options: [
          "It lets the browser ask for a small piece of data without leaving the current page.",
          "It replaces HTML with a new markup language.",
          "It is a new way to draw graphics in the browser.",
          "It removes the need for a server.",
        ],
        correctIndex: 0,
        explanation:
          "AJAX is the practice of asking the server for data while the page is already open, then weaving that data into the existing document with JavaScript. The page updates in place instead of navigating.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m1l01-ex01",
    lectureId: "m1l01",
    title: "Tag the languages",
    brief:
      "Look at the snippet. For each line, decide whether it is HTML (markup), CSS (style), or JavaScript (script). Add a labelled HTML comment immediately above each non-comment line. The checker verifies the structure and presence of a <style> and a <script> block.",
    kind: "html",
    starter:
`<!-- Rewrite this page so each line is labelled. -->
<!doctype html>
<html>
  <head>
    <title>Demo</title>
    <style>
      body { background: #faf6ec; }
      h1 { color: #a23a2c; }
    </style>
  </head>
  <body>
    <h1>Welcome</h1>
    <p>Hello there.</p>
    <button id="b">Click</button>
    <script>
      document.getElementById('b').addEventListener('click', () => {
        alert('Hi');
      });
    </script>
  </body>
</html>
`,
    tests: [
      { kind: "html-contains", selector: "head style", min: 1 },
      { kind: "html-contains", selector: "script", min: 1 },
      { kind: "html-equals", selector: "title", value: "Demo" },
      { kind: "html-contains", selector: "h1", min: 1 },
    ],
    hints: [
      "Open the page in your head and identify which language each block is using.",
      "Anything inside <style> is CSS, anything inside <script> is JavaScript, anything else (with tags) is HTML.",
      "You don't need to change the snippet — you just need to add labelled comments above each block.",
    ],
    solution:
`<!-- HTML -->
<!doctype html>
<!-- HTML -->
<html>
  <!-- HTML -->
  <head>
    <!-- HTML -->
    <title>Demo</title>
    <!-- CSS -->
    <style>
      body { background: #faf6ec; }
      h1 { color: #a23a2c; }
    </style>
  </head>
  <!-- HTML -->
  <body>
    <!-- HTML -->
    <h1>Welcome</h1>
    <!-- HTML -->
    <p>Hello there.</p>
    <!-- HTML -->
    <button id="b">Click</button>
    <!-- JS -->
    <script>
      document.getElementById('b').addEventListener('click', () => {
        alert('Hi');
      });
    </script>
  </body>
</html>`,
    solutionExplanation:
      "A labelled comment above each block is enough. The checker confirms the structure is intact: a <style> block, a <script> block, a <title> with the expected text, and at least one <h1>.",
  },
];
