import type { Lecture, Quiz, Exercise } from "../types";

export const lecture: Lecture = {
  id: "m1l08",
  module: 1,
  number: 8,
  title: "DOM and JS Events",
  subtitle:
    "The bridge between JavaScript and the document. How to find elements, change them, listen to the user, and turn a static page into an interface.",
  estimatedMinutes: 75,
  difficulty: "applied",
  prerequisites: ["m1l07"],
  objectives: [
    "Describe the DOM as a tree of nodes that JavaScript can read and write.",
    "Select elements with getElementById, querySelector, and querySelectorAll.",
    "Create, modify, and remove elements.",
    "Attach event listeners and understand the event object.",
    "Explain event bubbling, and use event delegation to handle lists efficiently.",
  ],
  sources: [
    { label: "Course slides — DOM Manipulation and Event Handling", type: "course" },
    { label: "MDN — DOM", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" },
    { label: "MDN — Events", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events" },
    { label: "MDN — Event bubbling", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture" },
  ],
  sections: [
    {
      type: "context",
      body:
        "The Document Object Model is the browser's live representation of your page. Once the browser has finished parsing the HTML, every element, every text run, every attribute is reachable as a JavaScript object. This lecture covers how to find elements, how to change them, how to listen to the user, and how the event system routes interactions through the tree.",
    },
    {
      type: "objectives",
      items: [
        "Find elements with getElementById, querySelector, and querySelectorAll.",
        "Read and change text, HTML, attributes, and styles of an element.",
        "Create elements, insert them into the document, and remove them.",
        "Attach click, input, submit, and keydown listeners.",
        "Predict the order in which nested elements receive an event, and use delegation.",
      ],
    },
    {
      type: "concept",
      title: "The DOM is a tree of nodes",
      body:
        "When the browser parses your HTML, it builds a tree where each element is a node, each text run is a text node, and each comment is a comment node. The root is `document`. JavaScript can read this tree (query), modify it (append, remove, replace), or walk it (parent, child, sibling). The same tree is what CSS matches against, and what assistive technology navigates.",
      example: {
        language: "html",
        code:
`<ul id="list">
  <li>One</li>
  <li>Two</li>
</ul>`,
        caption: "This becomes a tree: document → html → body → ul#list → li → text 'One', li → text 'Two'.",
      },
    },
    {
      type: "concept",
      title: "Selecting elements",
      body:
        "Three ways to find an element, in order of specificity: getElementById(id) returns the single element with that id, or null. querySelector(css) returns the first element matching the CSS selector, or null. querySelectorAll(css) returns a NodeList of all matching elements (you can iterate it with forEach or for-of). querySelector is the most flexible — it accepts any CSS selector.",
      example: {
        language: "js",
        code:
`const list = document.getElementById("list");
const firstItem = document.querySelector("#list li");
const allItems = document.querySelectorAll("#list li");

allItems.forEach(item => {
  item.classList.add("seen");
});`,
      },
    },
    {
      type: "concept",
      title: "Reading and changing content",
      body:
        "Three properties for content. textContent gives the text without any markup. innerText is similar but aware of CSS — it skips hidden elements. innerHTML gives the markup as a string; assigning to it parses the string and replaces the children. Use textContent for plain text. Use innerHTML only with strings you trust — untrusted input parsed as HTML is a security hole.",
      example: {
        language: "js",
        code:
`const h1 = document.querySelector("h1");
h1.textContent;          // "Welcome"
h1.textContent = "Hi.";  // set text, no markup

// safe: text
// risky: markup
h1.innerHTML = "<em>Hi.</em>";  // parses as HTML`,
      },
      pitfall:
        "Setting innerHTML with a value that includes user input is an XSS vulnerability. Always use textContent when the value might contain characters that mean something in HTML.",
    },
    {
      type: "concept",
      title: "Attributes, classes, and styles",
      body:
        "Three ways to address an element's properties. getAttribute / setAttribute handle HTML attributes. classList handles the class attribute as a list (add, remove, toggle, contains). The style property reads and writes inline styles one declaration at a time. Prefer classList to toggling className as a string, and prefer toggling a class to writing inline styles for anything beyond a one-off value.",
      example: {
        language: "js",
        code:
`const link = document.querySelector("a");
link.getAttribute("href");
link.setAttribute("target", "_blank");
link.setAttribute("rel", "noopener");

link.classList.add("active");
link.classList.toggle("visited");
link.classList.contains("active");   // true

link.style.color = "#a23a2c";        // inline style`,
      },
    },
    {
      type: "concept",
      title: "Creating, inserting, and removing elements",
      body:
        "createElement(tag) creates a new element. Set its properties, then attach it with appendChild, prepend, before, after, or replaceWith. To remove, call remove() on the element. The document is a live tree — inserting a node that already exists moves it rather than copying it.",
      example: {
        language: "js",
        code:
`const list = document.querySelector("#list");
const item = document.createElement("li");
item.textContent = "Three";
list.appendChild(item);

// remove
item.remove();`,
      },
    },
    {
      type: "concept",
      title: "Events — listening to the user",
      body:
        "addEventListener(type, handler) attaches a function to an event. The handler receives an Event object with details about what happened: which element, which key, the mouse position, whether the default action was prevented, and so on. The event types you will use most: click, input, change, submit, keydown, keyup, focus, blur, mouseenter, mouseleave. Inside a handler, this is the element the listener is attached to (when using a regular function).",
      example: {
        language: "js",
        code:
`const button = document.querySelector("button");
button.addEventListener("click", (event) => {
  console.log("Clicked at", event.clientX, event.clientY);
  button.textContent = "Clicked";
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();  // don't navigate
  const data = new FormData(e.target);
  console.log(Object.fromEntries(data));
});`,
      },
    },
    {
      type: "concept",
      title: "Bubbling and delegation",
      body:
        "When an event fires on a child element, it also fires on each of its ancestors, all the way up to document. This is bubbling. You can listen on a parent and handle events from any of its children, which is the basis of event delegation. The target property on the event tells you which element actually received the event.",
      example: {
        language: "js",
        code:
`// One listener for the whole list.
const list = document.querySelector("ul");
list.addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    e.target.classList.toggle("done");
  }
});`,
        caption: "This handles clicks on any li inside the list, even ones added after the listener was attached.",
      },
      pitfall:
        "If you do not need delegation, calling event.stopPropagation() can prevent the event from bubbling further. But reach for it rarely — usually the right fix is to attach the listener to the right element in the first place.",
    },
    {
      type: "example",
      title: "A small interactive list",
      code:
`const form = document.querySelector("#add-item");
const list = document.querySelector("#list");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = form.elements.item.value.trim();
  if (!value) return;
  const li = document.createElement("li");
  li.textContent = value;
  list.appendChild(li);
  form.reset();
});

list.addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    e.target.remove();
  }
});`,
      language: "js",
      walkthrough:
        "Two listeners, both attached to a parent. The form's submit handler is told to prevent the default reload, reads the value, creates a new li, and appends it. The list's click handler uses delegation: when the click target is an li, it removes it. New items work with the click handler without re-binding anything.",
    },
    {
      type: "interactive",
      componentKey: "DomLab",
      title: "DOM lab",
      description:
        "Write JavaScript that runs against a small live page. Change the heading, add list items, attach a click handler. The page re-renders on every change.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with the DOM and events",
      items: [
        {
          mistake: "Querying for an element that has not been parsed yet.",
          fix: "Either place the script at the end of <body>, or wrap the code in DOMContentLoaded, or use defer on the <script> tag.",
        },
        {
          mistake: "Using innerHTML with untrusted input.",
          fix: "Use textContent for any string that might contain user-provided text. Reserve innerHTML for strings you control.",
        },
        {
          mistake: "Attaching a click handler to every item in a long list.",
          fix: "Use event delegation — attach one handler to the parent and check e.target inside it.",
        },
        {
          mistake: "Calling event.preventDefault() in a delegated submit handler and being surprised that the form still navigates.",
          fix: "preventDefault stops the form's default submission (the navigation), but the submit event still fires. Make sure the listener is on the form, not on a button.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m1l08-ex01",
      title: "Toggle a class on click",
      description:
        "Write JavaScript that toggles a `done` class on a button each time it is clicked, and updates its text between 'Start' and 'Done'.",
    },
    {
      type: "quiz",
      quizId: "m1l08-q",
    },
    {
      type: "summary",
      body:
        "The DOM is a live tree of nodes. Use querySelector to find an element, textContent or innerHTML to change its content, classList to manage its class, and createElement/appendChild/remove to build and tear down. Events bubble up from child to parent; addEventListener attaches a handler to a specific event type, and the event object carries details. Delegation lets one parent handle events from many children — useful for long lists and dynamic content.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m1l08-q",
    title: "DOM and Events check",
    questions: [
      {
        kind: "mcq",
        id: "m1l08-q1",
        prompt: "Which method finds the first element matching a CSS selector?",
        options: ["getElementById", "querySelector", "querySelectorAll", "getElementsByClassName"],
        correctIndex: 1,
        explanation:
          "querySelector returns the first element that matches any CSS selector. querySelectorAll returns all matches. getElementById is restricted to a single id.",
      },
      {
        kind: "mcq",
        id: "m1l08-q2",
        prompt: "When you assign a string to innerHTML, what happens?",
        options: [
          "The string is set as a text node.",
          "The string is parsed as HTML and replaces the element's children.",
          "Nothing — innerHTML is read-only.",
          "It throws a TypeError.",
        ],
        correctIndex: 1,
        explanation: "innerHTML parses the string as HTML and replaces the element's children. Use it only with strings you trust.",
      },
      {
        kind: "code-output",
        id: "m1l08-q3",
        prompt: "What is the result of this code?",
        code:
`const list = document.createElement("ul");
const item = document.createElement("li");
item.textContent = "One";
list.appendChild(item);
console.log(list.children.length);`,
        language: "js",
        expected: "1",
        explanation: "After creating a list, creating an item, setting its text, and appending it, the list has one child.",
      },
      {
        kind: "truefalse",
        id: "m1l08-q4",
        prompt: "An event on a child element also fires on each of its ancestors.",
        correct: true,
        explanation: "Events bubble up from the target element to the document. The target property on the event tells you which element actually received the event.",
      },
      {
        kind: "mcq",
        id: "m1l08-q5",
        prompt: "Why prefer event delegation when handling clicks on a long list?",
        options: [
          "It is the only way to use addEventListener.",
          "It avoids attaching a listener to every list item and works for items added later.",
          "It is faster in every browser.",
          "It is required by the HTML spec.",
        ],
        correctIndex: 1,
        explanation:
          "Delegation attaches one handler to a parent and uses e.target to act on the child. New items added to the list work without re-binding.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m1l08-ex01",
    lectureId: "m1l08",
    title: "Toggle a class on click",
    brief:
      "Write JavaScript that finds a button with id 'toggle', and on click toggles a 'done' class on it and switches its text between 'Start' and 'Done'.",
    kind: "html",
    starter:
`<!-- Page scaffold. Write your script in the place indicated. -->
<button id="toggle">Start</button>
<script>
  // your code here
</script>
`,
    tests: [
      { kind: "html-contains", selector: "button#toggle", min: 1 },
      { kind: "html-contains", selector: "script", min: 1 },
    ],
    hints: [
      "Use document.getElementById or document.querySelector to find the button.",
      "The handler toggles the class and updates textContent.",
      "classList.toggle('done') adds the class if missing, removes it if present.",
    ],
    solution:
`<button id="toggle">Start</button>
<script>
  const btn = document.getElementById("toggle");
  btn.addEventListener("click", () => {
    btn.classList.toggle("done");
    btn.textContent = btn.classList.contains("done") ? "Done" : "Start";
  });
</script>`,
    solutionExplanation:
      "The handler reads the class state, then decides the text. After the first click the class is added and the text is 'Done'. After the second, the class is removed and the text is 'Start' again.",
  },
];
