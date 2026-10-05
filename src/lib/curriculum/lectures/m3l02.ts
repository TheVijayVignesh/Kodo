import type { Exercise, Lecture, Quiz } from "../types";

export const lecture: Lecture = {
  id: "m3l02",
  module: 3,
  number: 2,
  title: "Node.js Modules and HTTP",
  subtitle:
    "Organize Node programs with CommonJS or ES modules, then follow an HTTP request into a server and back to a client.",
  estimatedMinutes: 55,
  difficulty: "core",
  prerequisites: ["m3l01"],
  objectives: [
    "Recognize CommonJS and ECMAScript module syntax and know how Node determines a file's module format.",
    "Distinguish built-in, local, and third-party modules and choose clear import specifiers.",
    "Describe the HTTP request/response message and the roles of a Node HTTP server and client.",
    "Use methods, headers, and status codes to reason about a route's behavior.",
    "Explain why Node's core HTTP module does not automatically parse every request body as JSON.",
  ],
  sources: [
    {
      label: "Node.js API — CommonJS modules",
      type: "node",
      url: "https://nodejs.org/api/modules.html",
    },
    {
      label: "Node.js API — ECMAScript modules",
      type: "node",
      url: "https://nodejs.org/api/esm.html",
    },
    {
      label: "Node.js API — Packages",
      type: "node",
      url: "https://nodejs.org/api/packages.html",
    },
    {
      label: "Node.js API — HTTP",
      type: "node",
      url: "https://nodejs.org/api/http.html",
    },
    {
      label: "MDN — HTTP request methods",
      type: "mdn",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods",
    },
    {
      label: "MDN — HTTP response status codes",
      type: "mdn",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status",
    },
    {
      label: "MDN — HTTP headers",
      type: "mdn",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers",
    },
  ],
  sections: [
    {
      type: "context",
      body:
        "A useful server program is more than one file. Modules make boundaries explicit: one file can own an HTTP route, another a validation rule, and a package can provide a reusable library. HTTP supplies the messages that pass between clients and servers. This lecture begins with Node's two module systems, then reads a request and response as structured messages. Node imports and server/client examples are illustrative only; the course browser does not run a Node HTTP process. The exercise models route decisions with pure JavaScript.",
    },
    {
      type: "objectives",
      items: [
        "Recognize CommonJS and ECMAScript module syntax and know how Node determines a file's module format.",
        "Distinguish built-in, local, and third-party modules and choose clear import specifiers.",
        "Describe the HTTP request/response message and the roles of a Node HTTP server and client.",
        "Use methods, headers, and status codes to reason about a route's behavior.",
        "Explain why Node's core HTTP module does not automatically parse every request body as JSON.",
      ],
    },
    {
      type: "prose",
      title: "Modules give files clear responsibilities",
      paragraphs: [
        "A module has its own scope and exposes only the values it chooses to export. This helps keep implementation details local and makes it possible for another file to depend on a small, named interface instead of reaching into globals. Node supports both CommonJS (CJS) and ECMAScript modules (ESM); the two systems have different syntax and loader rules, so a project should make its module format clear.",
        "For Node's built-in modules, prefer an explicit `node:` specifier such as `node:http` or `node:fs/promises`. A relative path such as `./format-date.js` refers to a local file. A package name such as `express` refers to a third-party package resolved from the project's installed dependencies. Built-in modules ship with Node; local modules are your own project files; third-party packages are installed and versioned as dependencies.",
      ],
    },
    {
      type: "concept",
      title: "CommonJS and ECMAScript modules are different systems",
      body:
        "CommonJS uses `require()` to load a module and `module.exports` or `exports` to publish values. Files with `.cjs` are CommonJS; `.mjs` files are ECMAScript modules (ESM). For `.js` files, the nearest `package.json` `type` field selects the format: `module` means ESM and `commonjs` means CommonJS. When that field is absent, modern Node can detect ESM-only syntax in an otherwise ambiguous `.js` file, but package authors should declare the format explicitly so tools and runtimes agree. ESM relative imports should include the file extension, for example `./format-date.js`.",
      example: {
        language: "js",
        code:
          `// Illustrative Node.js module forms — not runnable in this browser.
// CommonJS (for example, service.cjs or a commonjs package):
const { createServer } = require("node:http");
const { formatDate } = require("./format-date.cjs");
const express = require("express");
module.exports = { createServer, formatDate, express };

// ECMAScript module (for example, service.mjs or type: module):
import { createServer } from "node:http";
import { formatDate } from "./format-date.js";
import express from "express";
export { createServer, formatDate, express };`,
        caption:
          "Illustrative Node.js imports only: built-in `node:http`, local files, and a third-party package. This is not browser-runnable code.",
      },
      walkthrough:
        "Both examples depend on three different module categories. `node:http` is part of Node; `./format-date.cjs` or `./format-date.js` is a project-local file; and `express` must be provided as a package dependency before it can be imported. The first block is CommonJS and exports with `module.exports`; the second uses ESM imports and exports. They are alternatives, not one file to paste together. The local ESM path includes `.js`, as Node's ESM resolver expects an explicit extension for relative file imports.",
      pitfall:
        "Do not replace `node:http` with `http` in an explanation of preferred modern imports, and do not assume that adding `import` syntax alone changes how Node interprets a `.js` file. Use `.mjs` or the package's `type: module` setting for ESM; use `.cjs` where CommonJS must be explicit.",
    },
    {
      type: "concept",
      title: "An HTTP request and response are structured messages",
      body:
        "An HTTP/1.1 request has a request line such as `GET /health HTTP/1.1`, followed by headers and sometimes a body. HTTP/2 and HTTP/3 represent the same request information in fields rather than that text line. A response conveys a status code, headers, and sometimes a body; in HTTP/1.1 text form it starts with a status line such as `HTTP/1.1 200 OK`, while HTTP/2 and HTTP/3 omit the reason phrase. Headers carry metadata: `Content-Type` describes the representation being sent, while `Accept` tells the server which response formats the client can accept. Header field names are case-insensitive. HTTP framing identifies where headers end and a message body begins; application code should use the HTTP API rather than manually splitting raw network text.",
      mentalModel:
        "The method and target say what the client is asking about; headers describe the message; the optional body carries representation data. The response status summarizes the outcome, and its headers and body explain or carry the result.",
      example: {
        language: "text",
        code:
          "Illustrative HTTP messages — explanatory text, not a live request:\n\nGET /health HTTP/1.1\nHost: localhost:3000\nAccept: application/json\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"status\":\"ok\"}",
        caption:
          "A request line, headers, a blank line, then an optional body; the response has a status line and its own headers/body.",
      },
      walkthrough:
        "The request asks for `/health` with `GET` and says JSON is acceptable. The response reports `200 OK`, identifies its representation with `Content-Type`, and sends a JSON body. A header describes the message; it does not transform a body or guarantee the server's application behavior by itself.",
      pitfall:
        "`Accept` and `Content-Type` are not interchangeable. `Accept` is about representations the client can receive; `Content-Type` describes the representation in the message that carries it.",
    },
    {
      type: "concept",
      title: "HTTP methods communicate intent; status codes report the result",
      body:
        "Common methods include GET to retrieve a representation, POST to submit data for processing (often creating a resource), PUT to create or replace the target resource's state, PATCH to apply a partial change, and DELETE to remove a resource. These names communicate standardized intent; an application still defines its routes and must implement the behavior safely. Status codes group outcomes: 2xx means success (200 OK, 201 Created, 204 No Content); 3xx indicates redirection; 4xx reports a request or client-side problem (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed); and 5xx reports a server-side failure (500 Internal Server Error). A 201 response often identifies the created resource, while a 204 response has no response content.",
      mentalModel:
        "A method describes the kind of operation requested; a status code describes how the server handled it. They answer different questions.",
      pitfall:
        "A 404 is not the same as a 500: one says the requested target was not found; the other indicates the server failed while handling a request. Do not return 200 for every outcome and hide errors only in the response body.",
    },
    {
      type: "example",
      title: "A minimal Node HTTP server route",
      code:
        `// Illustrative Node.js server — not runnable in the browser playground.
import { createServer } from "node:http";

const server = createServer((request, response) => {
  const path = new URL(request.url ?? "/", "http://localhost").pathname;

  if (request.method === "GET" && path === "/health") {
    response.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
    });
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }

  response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.listen(3000);`,
      language: "js",
      runnable: false,
      walkthrough:
        "This is illustrative Node.js code, not runnable in the browser. `createServer` registers a handler that Node calls for each incoming request. The code reads the method and derives a URL pathname, sets a status and content type, then calls `response.end()` to finish the response. An unmatched route gets a 404. `server.listen(3000)` binds a port only when run by an actual Node process; this lesson page does not start one.",
    },
    {
      type: "concept",
      title: "The Node HTTP client also works with streams",
      body:
        "Node's `node:http` module can create servers and make HTTP requests. A client receives response metadata such as `statusCode` and `headers`, then consumes the response body as data arrives. For a request with a custom method or body, `request()` returns a request object; write any body, then call `end()` to send the request. The `get()` helper sends a GET request and ends it for you. Client examples in this section describe Node networking and are not executed by this browser lesson.",
      example: {
        language: "js",
        code:
          `// Illustrative Node.js HTTP client — not runnable in this browser.
import { get } from "node:http";

get("http://127.0.0.1:3000/health", (response) => {
  let body = "";
  response.setEncoding("utf8");
  response.on("data", (chunk) => { body += chunk; });
  response.on("end", () => {
    console.log(response.statusCode, response.headers, body);
  });
}).on("error", (error) => {
  console.error(error.message);
});`,
        caption:
          "Node.js client code reads status/headers and collects a streamed response body; it does not run in this browser.",
      },
      walkthrough:
        "The response callback can inspect status and headers as soon as response metadata is available. The body may arrive in multiple `data` chunks, so this small example appends them and waits for `end` before using the complete string. Production programs should also consider response size and streaming rather than collecting an unbounded body in memory.",
      pitfall:
        "Do not assume a request body is automatically parsed as JSON by Node's core HTTP server. The incoming message body is a stream; server code must consume and validate it or use a higher-level framework/parser. Likewise, a client should handle the `error` event and inspect the status code rather than treating every response as success.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with Node modules and HTTP",
      items: [
        {
          mistake: "Treating CommonJS `require()` and ESM `import` as interchangeable in any file.",
          fix:
            "Know the file's module format. Use `.cjs`/`.mjs` or a deliberate package `type`; Node can detect ESM-only syntax in ambiguous `.js` files, but an explicit format avoids relying on detection. Keep imports, exports, and extensions consistent.",
        },
        {
          mistake: "Installing a built-in module with npm or omitting `node:` in a Node example.",
          fix:
            "Built-ins ship with Node. Prefer a clear specifier such as `node:http`; install only packages that are not provided by the runtime.",
        },
        {
          mistake: "Assuming core `node:http` parses a JSON request body automatically.",
          fix:
            "The incoming body is a stream. Read it deliberately, enforce sensible size limits, parse the intended format, and validate the result—or use a documented framework parser.",
        },
        {
          mistake: "Setting response headers after sending the body or forgetting to end the response.",
          fix:
            "Choose status and headers before writing the body, and finish the response with `response.end()` when no more data will be sent.",
        },
        {
          mistake: "Confusing `Accept` with `Content-Type`, or treating status codes as body text.",
          fix:
            "Use `Accept` for acceptable response formats, `Content-Type` to label a message body, and a status code to communicate the outcome.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m3l02-ex01",
      title: "Choose a modeled HTTP reply",
      description:
        "Complete a browser-safe pure function that maps a simplified request description to a status, headers, and body label. This models route decision logic only: it does not import `node:http`, open a socket, send a request, or create a server.",
    },
    {
      type: "quiz",
      quizId: "m3l02-q",
    },
    {
      type: "summary",
      body:
        "Node modules can use CommonJS or ESM; choose and declare the format intentionally. Built-in modules such as `node:http`, local relative files, and third-party package names have different sources and resolution rules. HTTP requests carry a method, target, headers, and optional body; responses carry a status, headers, and optional body. Methods communicate intent, status codes report outcomes, and headers describe message metadata. A Node HTTP server is an actual process that listens for requests; a Node HTTP client consumes responses as streams. Core `node:http` does not automatically parse request bodies as JSON. The exercise modeled a route decision in browser-safe JavaScript, not a running server.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m3l02-q",
    title: "Node modules and HTTP check",
    questions: [
      {
        kind: "mcq",
        id: "m3l02-q1",
        prompt: "Which import specifier names Node's built-in HTTP module explicitly?",
        options: ["`./http`", "`express`", "`node:http`", "`/http`"],
        correctIndex: 2,
        explanation:
          "`node:http` identifies a Node built-in module. A relative specifier names a local file, while `express` names a third-party package dependency.",
      },
      {
        kind: "truefalse",
        id: "m3l02-q2",
        prompt:
          "A server created with Node's core `node:http` module automatically parses every JSON request body into a JavaScript object.",
        correct: false,
        explanation:
          "The core HTTP request body is a stream. Application code must consume and parse it, or use a higher-level framework/parser that is configured to do so.",
      },
      {
        kind: "code-output",
        id: "m3l02-q3",
        prompt: "Which status number is printed by this browser-safe JavaScript?",
        code:
          'const status = { ok: 200, created: 201, missing: 404 };\nconsole.log(status.created);',
        language: "js",
        expected: "201",
        explanation:
          "The `created` property contains 201, a successful status commonly used when a request creates a resource.",
      },
      {
        kind: "identify-bug",
        id: "m3l02-q4",
        prompt:
          "Illustrative Node.js ESM (not runnable in the browser): what is the module-resolution problem?",
        code:
          'import { formatDate } from "./format-date";\nconsole.log(formatDate(new Date()));',
        language: "js",
        options: [
          "A relative ESM import should include its file extension, such as `./format-date.js`",
          "ESM cannot import a local file",
          "The import must use `require()` instead",
          "`console.log` is unavailable in Node.js",
        ],
        correctIndex: 0,
        explanation:
          "For a Node ESM relative file import, include the extension, for example `./format-date.js`. The example is illustrative Node code and is not run in the browser.",
      },
      {
        kind: "mcq",
        id: "m3l02-q5",
        prompt: "What does the `Content-Type` response header describe?",
        options: [
          "Which response formats the client is willing to accept",
          "The representation format of the response body",
          "The HTTP method used for the request",
          "Whether the status code is in the 2xx range",
        ],
        correctIndex: 1,
        explanation:
          "`Content-Type` labels the representation carried by a message body. `Accept` is the request header used to state which response formats the client can accept.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m3l02-ex01",
    lectureId: "m3l02",
    title: "Choose a modeled HTTP reply",
    brief:
      "Implement `planReply(request)` for a simplified `/tasks` route. Return a 200 response for GET, a 201 response for POST, a 404 response for another path, and a 405 response for another method on `/tasks`. Return `{ statusCode, headers, body }`; use JSON-encoded strings with `application/json` for success bodies, `text/plain` for error bodies, and include an `allow` header set to GET, POST on the 405 response. This pure function models route decision logic in the browser; it does not execute HTTP or Node.js.",
    kind: "js",
    starter:
      `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-safe route model only — no Node.js APIs or network requests.
      window.planReply = function planReply(request) {
        // TODO: choose statusCode, headers, and body from the brief.
        return null;
      };
    </script>
  </body>
</html>`,
    tests: [
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "GET", path: "/tasks" }).statusCode',
        expected: 200,
        description: "Maps GET /tasks to a successful status",
      },
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "GET", path: "/tasks" }).headers["content-type"]',
        expected: "application/json",
        description: "Labels the successful response as JSON",
      },
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "GET", path: "/tasks" }).body',
        expected: '{"tasks":[]}',
        description: "Returns a JSON-encoded task-list body",
      },
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "POST", path: "/tasks" }).statusCode',
        expected: 201,
        description: "Maps POST /tasks to a created status",
      },
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "POST", path: "/tasks" }).body',
        expected: '{"message":"task created"}',
        description: "Returns a JSON-encoded creation body",
      },
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "GET", path: "/missing" }).statusCode',
        expected: 404,
        description: "Returns not found for a different route",
      },
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "GET", path: "/missing" }).headers["content-type"]',
        expected: "text/plain",
        description: "Labels the not-found body as plain text",
      },
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "DELETE", path: "/tasks" }).statusCode',
        expected: 405,
        description: "Maps an unsupported method to method not allowed",
      },
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "DELETE", path: "/tasks" }).headers["content-type"]',
        expected: "text/plain",
        description: "Labels the method-not-allowed body as plain text",
      },
      {
        kind: "js-result",
        expression:
          'window.planReply({ method: "DELETE", path: "/tasks" }).headers.allow',
        expected: "GET, POST",
        description: "Returns method not allowed with an Allow header",
      },
    ],
    hints: [
      "Check the path first so an unsupported method at an unknown path returns 404.",
      "For `/tasks`, handle `GET` and `POST` before the final 405 fallback.",
      "Keep status, lowercase header names, and body label together in the returned object.",
    ],
    solution:
      `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-safe route model only — no Node.js APIs or network requests.
      window.planReply = function planReply(request) {
        if (request.path !== "/tasks") {
          return {
            statusCode: 404,
            headers: { "content-type": "text/plain" },
            body: "not found",
          };
        }

        if (request.method === "GET") {
          return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: '{"tasks":[]}',
          };
        }

        if (request.method === "POST") {
          return {
            statusCode: 201,
            headers: { "content-type": "application/json" },
            body: '{"message":"task created"}',
          };
        }

        return {
          statusCode: 405,
          headers: { "content-type": "text/plain", allow: "GET, POST" },
          body: "method not allowed",
        };
      };
    </script>
  </body>
</html>`,
    solutionExplanation:
      "The function is a tiny route-decision table expressed as ordinary JavaScript. Its success bodies are JSON-encoded strings to match their `Content-Type`; a real server would read a request, perform application work, and send the HTTP response. This browser exercise only returns a plain object representing that plan. It imports no Node API and makes no network connection.",
  },
];
