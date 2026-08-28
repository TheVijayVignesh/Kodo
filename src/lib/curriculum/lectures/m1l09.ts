import type { Lecture, Quiz, Exercise } from "../types";

export const lecture: Lecture = {
  id: "m1l09",
  module: 1,
  number: 9,
  title: "AJAX",
  subtitle:
    "Asking the server for data without leaving the page. fetch, promises, async/await, and the practical shape of an HTTP request.",
  estimatedMinutes: 55,
  difficulty: "applied",
  prerequisites: ["m1l08"],
  objectives: [
    "Explain what AJAX means and why it changed the web.",
    "Make HTTP requests with fetch.",
    "Use promises and async/await to handle asynchronous work.",
    "Read a status code, parse JSON, and render the result.",
    "Handle loading, success, and error states in a UI.",
  ],
  sources: [
    { label: "Course slides — AJAX", type: "course" },
    { label: "MDN — Fetch API", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" },
    { label: "MDN — XMLHttpRequest", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest" },
    { label: "MDN — async function", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function" },
  ],
  sections: [
    {
      type: "context",
      body:
        "AJAX is the practice of asking the server for a small piece of data while the page is already open, then weaving that data into the existing document with JavaScript. The page stops being a document you navigate between, and starts being a workspace that updates in place. This lecture covers the modern shape of that practice: fetch, promises, async/await, JSON, and the loading/error states a UI has to handle.",
    },
    {
      type: "objectives",
      items: [
        "Make a request with fetch and read the response.",
        "Parse a JSON response into a JavaScript value.",
        "Use async/await to write asynchronous code that reads like synchronous code.",
        "Distinguish HTTP status codes and what they mean for the UI.",
        "Handle loading, success, and error states in a real component.",
      ],
    },
    {
      type: "concept",
      title: "What AJAX means",
      body:
        "AJAX stands for Asynchronous JavaScript and XML. The acronym is older than its practice — most modern AJAX uses JSON, not XML, and the underlying mechanism is fetch, not XMLHttpRequest. What the term captures is the shift in how pages are built: instead of navigating to a new document for every interaction, the page requests data and updates in place.",
      mentalModel:
        "Think of a restaurant. The old web is a fixed menu — you pick, the kitchen cooks, and the waiter brings a new plate. AJAX is asking the waiter to bring more water without you having to leave your seat.",
    },
    {
      type: "concept",
      title: "fetch — the modern request API",
      body:
        "fetch(url, options) returns a Promise that resolves to a Response. The response has a status code, a body, headers, and a few convenience methods. response.json() reads the body as JSON and returns the parsed value. response.text() reads it as a string. response.ok is true when the status is in the 2xx range. fetch does not throw on a 4xx or 5xx response — it resolves normally. You have to check response.ok yourself.",
      example: {
        language: "js",
        code:
`const res = await fetch("/api/tasks");
if (!res.ok) throw new Error("HTTP " + res.status);
const tasks = await res.json();
console.log(tasks);`,
        caption: "fetch returns a Response. response.ok is true for 2xx. response.json() parses the body.",
      },
    },
    {
      type: "concept",
      title: "Promises and async/await",
      body:
        "A Promise is a placeholder for a value that will arrive later. It can be pending, fulfilled, or rejected. You attach handlers with .then and .catch. async/await is syntactic sugar: a function marked async always returns a promise; await inside it pauses until the awaited promise settles. With async/await, asynchronous code reads like synchronous code, with one important difference — errors are caught with try/catch, not with .catch().",
      example: {
        language: "js",
        code:
`// Promise form
fetch("/api/tasks")
  .then(res => res.json())
  .then(tasks => console.log(tasks))
  .catch(err => console.error(err));

// async/await form
async function loadTasks() {
  try {
    const res = await fetch("/api/tasks");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const tasks = await res.json();
    console.log(tasks);
  } catch (err) {
    console.error("Failed:", err);
  }
}`,
        caption: "Same flow, two styles. async/await is almost always clearer.",
      },
    },
    {
      type: "concept",
      title: "HTTP status codes",
      body:
        "Status codes are grouped by their first digit. 1xx: information. 2xx: success (200 OK, 201 Created, 204 No Content). 3xx: redirection (301 Moved Permanently, 304 Not Modified). 4xx: client error (400 Bad Request, 401 Unauthorized, 404 Not Found, 429 Too Many Requests). 5xx: server error (500 Internal Server Error, 503 Service Unavailable). For a UI, you usually only need to know: was it 2xx (success), 4xx (the request was wrong, maybe show the user a message), or 5xx (the server is broken, maybe show a retry button).",
    },
    {
      type: "concept",
      title: "CORS — a word you will meet",
      body:
        "By default, browsers refuse to let JavaScript on one origin read the response of a request to a different origin. The Same-Origin Policy protects users. CORS (Cross-Origin Resource Sharing) is the server's way of saying \"I trust this other origin\". When you call fetch from http://localhost:3000 to https://api.example.com and the browser blocks it, the answer is almost always CORS. The fix is on the server — the response needs an Access-Control-Allow-Origin header. You will hit CORS often during development; learn to recognise it.",
    },
    {
      type: "concept",
      title: "Loading, success, and error — the three states",
      body:
        "Every asynchronous UI has at least three states: loading (the request is in flight, show a spinner or a placeholder), success (the data is here, render it), and error (something went wrong, show a message and ideally a way to retry). The simplest model is a status variable: 'loading' | 'success' | 'error'. The component renders differently for each.",
      example: {
        language: "js",
        code:
`async function loadTasks() {
  setStatus("loading");
  try {
    const res = await fetch("/api/tasks");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    setData(data);
    setStatus("success");
  } catch (err) {
    setError(err.message);
    setStatus("error");
  }
}`,
        caption: "Three states, one status variable. The UI renders based on status.",
      },
    },
    {
      type: "example",
      title: "A small client, with three states",
      code:
`async function loadTasks() {
  statusEl.textContent = "Loading…";
  listEl.innerHTML = "";

  try {
    const res = await fetch("/api/tasks");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const tasks = await res.json();
    statusEl.textContent = "";
    for (const t of tasks) {
      const li = document.createElement("li");
      li.textContent = t.title;
      listEl.appendChild(li);
    }
  } catch (err) {
    statusEl.textContent = "Could not load. " + err.message;
  }
}`,
      language: "js",
      walkthrough:
        "The status text acts as the loading indicator and the error message. The list is cleared before each request, so a retry replaces the old data. The catch is broad: it covers both the network failure and a non-2xx status, because fetch does not throw on a 4xx response and a manual throw inside the try turns that into a real error.",
    },
    {
      type: "interactive",
      componentKey: "AjaxClient",
      title: "AJAX client",
      description:
        "A small, deterministic AJAX client. The dataset is local, so the request never fails for network reasons — but you can deliberately throw an error in your code and see how the UI reports it.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with AJAX",
      items: [
        {
          mistake: "Assuming fetch throws on 4xx and 5xx responses.",
          fix:
            "fetch only throws on network errors. Always check response.ok before parsing.",
        },
        {
          mistake: "Forgetting to handle errors.",
          fix:
            "Wrap the call in try/catch. A request that hangs forever is one of the most frustrating UX problems.",
        },
        {
          mistake: "Making a request inside a render that runs on every state change.",
          fix: "Trigger requests from event handlers or from a useEffect, not from the body of a component.",
        },
        {
          mistake: "Sending a token or sensitive header to a different origin.",
          fix: "CORS will block the response if the server has not been configured for your origin. Do not bypass it by shipping tokens in URLs.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m1l09-ex01",
      title: "Parse and render a JSON response",
      description:
        "Given a JSON array of items, render each item as a list item. The checker looks for at least one <li> in the rendered list.",
    },
    {
      type: "quiz",
      quizId: "m1l09-q",
    },
    {
      type: "summary",
      body:
        "AJAX is the practice of asking the server for data and updating the page in place. The modern shape is fetch, which returns a promise, plus async/await to make it read like synchronous code. A response has a status — 2xx for success, 4xx for client error, 5xx for server error. The UI has three states: loading, success, error. Recognise CORS as the source of most cross-origin request failures — the fix is on the server.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m1l09-q",
    title: "AJAX check",
    questions: [
      {
        kind: "mcq",
        id: "m1l09-q1",
        prompt: "Does fetch throw on a 404 response?",
        options: [
          "Yes — any non-2xx is a rejection.",
          "No — fetch only rejects on network failures. The response must be inspected manually.",
          "Only on POST requests.",
          "Only when the response has a body.",
        ],
        correctIndex: 1,
        explanation:
          "fetch resolves for any HTTP response. To detect a non-success, check response.ok (true for 2xx) or response.status.",
      },
      {
        kind: "mcq",
        id: "m1l09-q2",
        prompt: "Which method reads a response body as JSON?",
        options: ["response.text()", "response.data()", "response.json()", "JSON.parse(response)"],
        correctIndex: 2,
        explanation: "response.json() returns a promise that resolves to the parsed value.",
      },
      {
        kind: "truefalse",
        id: "m1l09-q3",
        prompt: "An async function always returns a Promise.",
        correct: true,
        explanation: "Even if the body returns a plain value, async wraps it in a promise. await works inside the function.",
      },
      {
        kind: "mcq",
        id: "m1l09-q4",
        prompt: "A 5xx status code means:",
        options: [
          "The request was malformed.",
          "The user is not authenticated.",
          "The server is broken.",
          "The page is loading.",
        ],
        correctIndex: 2,
        explanation: "5xx is a server-side error. Show the user a retry option, or fall back to cached data.",
      },
      {
        kind: "mcq",
        id: "m1l09-q5",
        prompt: "What is the most common cause of a CORS error in development?",
        options: [
          "Using == instead of === in the request body.",
          "The server is not configured to allow the requesting origin.",
          "The browser is out of date.",
          "The JSON is invalid.",
        ],
        correctIndex: 1,
        explanation: "CORS errors mean the server is not sending Access-Control-Allow-Origin for your origin. The fix is on the server, not in your code.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m1l09-ex01",
    lectureId: "m1l09",
    title: "Parse and render a JSON response",
    brief:
      "The local mock dataset is already in scope. Iterate over it and render each item as an <li> inside <ul id='list'>. The checker looks for at least one <li>.",
    kind: "html",
    starter:
`<!-- The list element -->
<ul id="list"></ul>
<script>
  // The dataset is already available as items in scope.
  // Render each item as an <li> with its title.
</script>
`,
    tests: [
      { kind: "html-contains", selector: "ul#list li", min: 1 },
    ],
    hints: [
      "The dataset is an array of objects with title and minutes properties.",
      "Use a for-of loop, .forEach, or .map to render.",
      "Don't forget to set the textContent (not innerHTML with user input).",
    ],
    solution:
`<ul id="list"></ul>
<script>
  const list = document.getElementById("list");
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item.title + " (" + item.minutes + " min)";
    list.appendChild(li);
  }
</script>`,
    solutionExplanation:
      "Find the list, create an li for each item, set its text, append. The checker inspects the rendered DOM and counts li children of ul#list.",
  },
];
