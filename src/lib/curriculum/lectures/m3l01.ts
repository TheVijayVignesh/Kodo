import type { Exercise, Lecture, Quiz } from "../types";

export const lecture: Lecture = {
  id: "m3l01",
  module: 3,
  number: 1,
  title: "Server-side Programming and Node.js",
  subtitle:
    "What backends do, how static and dynamic servers differ, and how Node.js runs JavaScript outside a browser.",
  estimatedMinutes: 50,
  difficulty: "foundational",
  prerequisites: ["m2l10"],
  objectives: [
    "Describe common backend responsibilities and distinguish static from dynamic responses.",
    "Explain how Node.js uses V8 and its own runtime APIs, and contrast that environment with a browser.",
    "Describe the event loop and non-blocking I/O without treating them as a single FIFO request queue.",
    "Compare callback, Promise, and async/await styles for asynchronous work.",
    "Identify why synchronous I/O and CPU-heavy JavaScript can delay other callbacks.",
  ],
  sources: [
    {
      label: "Node.js — Introduction to Node.js",
      type: "node",
      url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
    },
    {
      label: "Node.js — The Node.js Event Loop, Timers, and `process.nextTick()`",
      type: "node",
      url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
    },
    {
      label: "Node.js — Don't Block the Event Loop (or the Worker Pool)",
      type: "node",
      url: "https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop",
    },
    {
      label: "Node.js API — File system",
      type: "node",
      url: "https://nodejs.org/api/fs.html",
    },
    {
      label: "Node.js API — DNS",
      type: "node",
      url: "https://nodejs.org/api/dns.html",
    },
    {
      label: "MDN — Introduction to the server side",
      type: "mdn",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction",
    },
  ],
  sections: [
    {
      type: "context",
      body:
        "So far, JavaScript has mostly appeared as code running in a browser. A web application also needs a place to validate requests, apply business rules, protect private data, and coordinate storage. This lecture crosses that boundary: first we separate the server's responsibilities from the browser's, then we look at Node.js as one JavaScript runtime for server programs. Node examples below are explicitly illustrative; this course page does not run a Node process. The exercise uses ordinary browser-safe JavaScript to model one piece of backend work.",
    },
    {
      type: "objectives",
      items: [
        "Describe common backend responsibilities and distinguish static from dynamic responses.",
        "Explain how Node.js uses V8 and its own runtime APIs, and contrast that environment with a browser.",
        "Describe the event loop and non-blocking I/O without treating them as a single FIFO request queue.",
        "Compare callback, Promise, and async/await styles for asynchronous work.",
        "Identify why synchronous I/O and CPU-heavy JavaScript can delay other callbacks.",
      ],
    },
    {
      type: "prose",
      title: "The backend is the part that makes policy and data available",
      paragraphs: [
        "A browser sends a request; a server-side program decides what that request means and prepares a response. Common backend responsibilities include checking input, authenticating a user, enforcing authorization, applying business rules, reading or updating stored data, and returning a representation such as HTML or JSON. These tasks are not a fixed checklist for every site: a small static site may need no application backend at all, while a commerce system may distribute them across several services.",
        "The server is a trust boundary. A browser can improve the experience by checking a form early, but a client-side check is not a security rule: a caller can change or bypass browser code. The server must validate and authorize any operation that matters. It should also return only data the caller is allowed to see.",
        "A server can be a program on one machine or a service spread across several machines. 'Backend' describes a responsibility and boundary, not necessarily one computer, one language, or one process.",
      ],
    },
    {
      type: "concept",
      title: "Static and dynamic describe how a response is produced",
      body:
        "A static server returns stored resources, such as an HTML, CSS, image, or JavaScript file. For a given resource, the bytes generally do not depend on the current user's application data. A dynamic server runs application logic to construct a response using information such as the requested route, submitted data, identity, or stored records. A dynamic response can still be cached, and a page with interactive browser JavaScript can still be served as a static file.",
      mentalModel:
        "A static response is like handing out a printed timetable. A dynamic response is like looking up a passenger's trip and printing a ticket for that request. The distinction is about generating the response, not whether the page later changes in the browser.",
      pitfall:
        "Do not equate 'static server' with 'no JavaScript' or 'dynamic server' with 'every response is unique.' A static HTML file can run rich client-side code, and a server-generated page may be identical for many requests or served from a cache.",
    },
    {
      type: "concept",
      title: "Node.js is a runtime, not a browser",
      body:
        "Node.js embeds Google's V8 JavaScript engine, the engine that parses and executes JavaScript. Node adds a runtime around V8: APIs for processes, files, networking, streams, timers, and other work, supported by native code and the libuv library. V8 alone is not a web server and does not provide a DOM. A browser also uses a JavaScript engine, but supplies browser APIs such as `window`, `document`, and the page DOM. Node programs normally use APIs such as `process` and `node:fs` instead; they do not acquire browser globals merely because both environments run JavaScript.",
      mentalModel:
        "JavaScript is the language; V8 is an engine that executes it; Node.js is a runtime that pairs an engine with server-oriented APIs. The browser is a different runtime with a different host environment.",
      example: {
        language: "text",
        code:
          "Illustrative only — this is not browser code:\n\nNode.js: import { readFile } from \"node:fs/promises\";\nBrowser: document.querySelector(\"main\")",
        caption:
          "Node's built-in APIs and the browser DOM belong to different runtimes; this comparison is not executable code.",
      },
      walkthrough:
        "The first line names a built-in Node module using the modern `node:` prefix. It is available to a Node process, not to a browser page. The second line refers to the browser's DOM. Knowing which runtime owns an API helps explain why a Node import cannot simply be pasted into a browser exercise.",
      pitfall:
        "Node.js is not a way to make browser globals work on a server. If server code needs to exchange data with a page, it sends a response; the browser handles that response in its own environment.",
    },
    {
      type: "concept",
      title: "The event loop coordinates completions; it is not a request line",
      body:
        "In a typical Node.js isolate, JavaScript runs on that isolate's event-loop thread, one JavaScript callback at a time. When code starts an asynchronous operation, Node can arrange for the operation to progress without keeping that JavaScript callback busy. Network socket I/O is generally coordinated through operating-system polling or completion mechanisms, not by running each socket operation in the libuv worker pool. Many asynchronous file-system operations, `dns.lookup()`, and selected crypto and zlib operations do use that shared pool. On completion, the runtime makes a callback or Promise continuation eligible to run on the JavaScript thread.",
      mentalModel:
        "Think of several kinds of work reporting completion to a coordinator, not requests standing in one universal first-in, first-out line. The event loop advances through phases and handles callbacks associated with those phases; Promise jobs and other scheduling mechanisms also affect when JavaScript continues.",
      example: {
        language: "text",
        code:
          "Illustrative Node.js flow — not runnable in this browser:\n\nJavaScript starts file I/O → JavaScript can continue\nI/O completes → Node schedules its callback/Promise continuation\nJavaScript later handles that completion on the event-loop thread",
        caption:
          "An I/O completion can be asynchronous; the operation is not the same thing as its JavaScript callback.",
      },
      walkthrough:
        "The phrase 'non-blocking I/O' means the JavaScript thread need not wait synchronously for that I/O result. It does not mean every operation runs on one magical background thread. Network readiness/completion, the libuv worker pool, and JavaScript callbacks are different parts of the path; for example, `dns.lookup()` uses the worker pool while `dns.resolve*()` performs asynchronous DNS queries over the network. A worker-pool task may finish away from the event-loop thread, while its JavaScript completion callback runs on the relevant isolate's event loop. `worker_threads` can run JavaScript in additional isolates when an application explicitly uses them.",
      pitfall:
        "Avoid saying that every Node task runs on the main thread, or that the event loop is a FIFO request queue. Synchronous file APIs and long CPU-bound JavaScript do occupy the JavaScript thread and can delay callbacks; asynchronous I/O does not automatically move arbitrary JavaScript computation off that thread.",
    },
    {
      type: "concept",
      title: "Callbacks, Promises, and async/await express the same wait in different styles",
      body:
        "A callback API asks you to provide a function that Node calls when work completes. In the older Node callback convention, the first argument is an error and the next argument carries the result. Promise APIs represent a future result as a Promise that can fulfill or reject. `async`/`await` is syntax built around Promises: an `async` function returns a Promise, and `await` suspends that function until the awaited Promise settles. It does not freeze the event loop while the I/O is pending.",
      example: {
        language: "js",
        code:
          `// Illustrative Node.js code — not runnable in the browser playground.
import { readFile } from "node:fs";

readFile("notes.txt", "utf8", (error, text) => {
  if (error) {
    console.error("Could not read notes:", error.message);
    return;
  }
  console.log(text);
});`,
        caption:
          "Node.js callback API: check the error-first argument before using the result.",
      },
      walkthrough:
        "`readFile` starts an asynchronous file operation. The current JavaScript can continue; later Node calls the callback with either an error or the text. The early `return` prevents the success path from running after an error. This is a Node-only illustration: a browser does not expose Node's `node:fs` module.",
      pitfall:
        "Do not ignore the callback's error argument and immediately read the result. On failure the result may be absent, and an uncaught callback error is not handled by a surrounding `try` around the earlier call.",
    },
    {
      type: "example",
      title: "The Promise and async/await version",
      code:
        `// Illustrative Node.js code — not runnable in the browser playground.
import { readFile } from "node:fs/promises";

async function displayNotes() {
  try {
    const text = await readFile("notes.txt", "utf8");
    console.log(text);
  } catch (error) {
    console.error("Could not read notes:", error.message);
  }
}

void displayNotes();`,
      language: "js",
      runnable: false,
      walkthrough:
        "This is an illustrative Node.js example, not runnable in the browser. `readFile` from `node:fs/promises` returns a Promise. `await` makes the next line wait within `displayNotes`, but other event-loop work can continue while the file operation is pending. `try`/`catch` handles a rejected Promise, and the `async` function itself returns a Promise as well. The `void` makes it explicit that this call site is intentionally not using that returned Promise.",
    },
    {
      type: "prose",
      title: "A small output trace",
      paragraphs: [
        "In this browser-safe JavaScript trace, the synchronous statements finish before the Promise continuation runs. `Promise.resolve()` is already fulfilled, but its `.then()` handler is still scheduled as a Promise job rather than being called in the middle of the current stack. The same broad idea helps read Node asynchronous code, but a complete Node ordering also depends on event-loop phases and the APIs involved; do not generalize this example into a total ordering of every timer, I/O callback, and Promise.",
        "For example, `console.log(" +
          '"start"); Promise.resolve().then(() => console.log("promise")); console.log("end");' +
          "` prints `start`, then `end`, then `promise`.",
      ],
    },
    {
      type: "mistakes",
      title: "Common mistakes about server-side JavaScript",
      items: [
        {
          mistake: "Assuming the browser and Node.js have the same globals and APIs.",
          fix:
            "Identify the runtime first. Browser DOM APIs such as `document` are not supplied by Node, while `node:fs` is not a browser module.",
        },
        {
          mistake: "Calling Node.js single-threaded and concluding all work runs on one thread.",
          fix:
            "Distinguish JavaScript callbacks on an isolate's event loop from native I/O, libuv worker-pool operations, and optional `worker_threads` isolates.",
        },
        {
          mistake: "Thinking the event loop processes all requests in a single FIFO queue.",
          fix:
            "The loop moves through phases and handles callbacks made ready by different event sources; Promise jobs and API-specific scheduling also matter.",
        },
        {
          mistake: "Assuming `await` blocks the whole Node process until I/O finishes.",
          fix:
            "`await` suspends the current async function. Other JavaScript callbacks can run while an asynchronous operation is pending, unless synchronous or CPU-heavy work blocks the event loop.",
        },
        {
          mistake: "Trusting browser-only validation as the backend's security check.",
          fix:
            "Repeat validation and authorization on the server. Client-side checks are useful feedback, not a trust boundary.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m3l01-ex01",
      title: "Shape a public account summary",
      description:
        "Complete a browser-safe pure function that models backend business logic: select and normalize the fields that could be included in a response. This exercise does not start a server, perform I/O, or run Node.js.",
    },
    {
      type: "quiz",
      quizId: "m3l01-q",
    },
    {
      type: "summary",
      body:
        "A backend validates and authorizes requests, applies application rules, coordinates data, and prepares responses. Static and dynamic describe how a response is produced, not whether the page has browser JavaScript. Node.js runs JavaScript using V8 plus server-oriented runtime APIs; it is not a browser. The event loop coordinates callbacks and completions across phases and sources, while some native operations use the operating system or libuv's worker pool. Callback, Promise, and async/await styles express asynchronous completion; `await` suspends one async function, while synchronous I/O or long JavaScript can block the event loop. The exercise modeled response-shaping logic only, not a real Node server.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m3l01-q",
    title: "Server-side and Node.js check",
    questions: [
      {
        kind: "mcq",
        id: "m3l01-q1",
        prompt: "Which task belongs at the server trust boundary for a protected account update?",
        options: [
          "Only changing the button label in the browser",
          "Authorizing the caller and validating the update before applying it",
          "Assuming the browser sent the original form unchanged",
          "Adding CSS to hide fields the caller should not see",
        ],
        correctIndex: 1,
        explanation:
          "The server must enforce authorization and validate operations that matter. Browser checks improve feedback but can be bypassed by a caller.",
      },
      {
        kind: "truefalse",
        id: "m3l01-q2",
        prompt:
          "Because Node.js and a browser can both execute JavaScript, Node.js programs automatically have `window` and `document` globals.",
        correct: false,
        explanation:
          "JavaScript is the language, but the runtime supplies host APIs. Browsers provide the page DOM; Node.js provides server-oriented APIs such as `process` and built-in modules.",
      },
      {
        kind: "code-output",
        id: "m3l01-q3",
        prompt: "What is logged, in order, by this JavaScript snippet?",
        code:
          'console.log("start");\nPromise.resolve().then(() => console.log("promise"));\nconsole.log("end");',
        language: "js",
        expected: "start\nend\npromise",
        explanation:
          "The current JavaScript stack runs to completion first, so `start` and `end` print before the fulfilled Promise's `.then()` continuation runs.",
      },
      {
        kind: "identify-bug",
        id: "m3l01-q4",
        prompt:
          "Illustrative Node.js callback (not runnable in the browser): what important case is missing?",
        code:
          'readFile("notes.txt", "utf8", (error, text) => {\n  console.log(text.length);\n});',
        language: "js",
        options: [
          "The callback must be an arrow function",
          "The callback should check `error` before using `text`",
          "The file must be read as JSON",
          "Every callback must be declared `async`",
        ],
        correctIndex: 1,
        explanation:
          "Node's callback-style file API uses an error-first callback. If the operation fails, `text` may be undefined; handle and return from the error path before using it.",
      },
      {
        kind: "mcq",
        id: "m3l01-q5",
        prompt: "What does `await` do while a Promise is pending inside an async function?",
        options: [
          "Blocks every thread in the Node process",
          "Suspends that async function so it can continue when the Promise settles",
          "Moves the rest of the function into the libuv worker pool",
          "Turns the Promise into a synchronous file operation",
        ],
        correctIndex: 1,
        explanation:
          "`await` suspends the current async function and resumes it when the Promise settles. It does not offload arbitrary JavaScript or block the entire event loop by itself.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m3l01-ex01",
    lectureId: "m3l01",
    title: "Shape a public account summary",
    brief:
      "Complete `toPublicSummary(account)` so it trims a string name, counts an array of tasks (or uses 0 when tasks is not an array), and includes `isActive` only when the input value is exactly true. This pure function models how backend code can select and normalize response data. It runs as ordinary JavaScript in the browser sandbox; it does not use Node.js, start a server, or read a file.",
    kind: "js",
    starter:
      `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-safe model only — this is not a Node.js server.
      window.toPublicSummary = function toPublicSummary(account) {
        // TODO: return { name, taskCount, isActive } using the brief's rules.
        return null;
      };
    </script>
  </body>
</html>`,
    tests: [
      {
        kind: "js-result",
        expression:
          'window.toPublicSummary({ name: "  Ada Lovelace  ", tasks: ["draft", "review"], isActive: true }).name',
        expected: "Ada Lovelace",
        description: "Trims a public name",
      },
      {
        kind: "js-result",
        expression:
          'window.toPublicSummary({ name: "  Ada Lovelace  ", tasks: ["draft", "review"], isActive: true }).taskCount',
        expected: 2,
        description: "Counts the supplied tasks",
      },
      {
        kind: "js-result",
        expression:
          'window.toPublicSummary({ name: "Lin", tasks: [], isActive: false }).isActive',
        expected: false,
        description: "Preserves a false active flag",
      },
      {
        kind: "js-result",
        expression:
          'window.toPublicSummary({ name: "Grace", tasks: null, isActive: "yes" }).taskCount',
        expected: 0,
        description: "Uses zero when tasks is not an array",
      },
      {
        kind: "js-result",
        expression:
          'window.toPublicSummary({ name: "Grace", tasks: null, isActive: "yes" }).isActive',
        expected: false,
        description: "Requires an actual true boolean for the active flag",
      },
    ],
    hints: [
      "Use `typeof account.name === \"string\"` before calling `.trim()`.",
      "Use `Array.isArray(account.tasks)` before reading `.length`.",
      "Compare `account.isActive` with `=== true`; the response should contain a boolean.",
    ],
    solution:
      `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-safe model only — this is not a Node.js server.
      window.toPublicSummary = function toPublicSummary(account) {
        const name = typeof account.name === "string" ? account.name.trim() : "";
        const taskCount = Array.isArray(account.tasks) ? account.tasks.length : 0;
        const isActive = account.isActive === true;
        return { name, taskCount, isActive };
      };
    </script>
  </body>
</html>`,
    solutionExplanation:
      "The function creates a new, small summary instead of returning the entire input object. Type checks make the projection predictable for the supplied cases. This illustrates a backend data-shaping step only; the sandbox executes this function in a browser and does not run Node.js or send an HTTP response.",
  },
];
