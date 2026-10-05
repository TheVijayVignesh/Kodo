import type { Exercise, Lecture, Quiz } from "../types";

export const lecture: Lecture = {
  id: "m3l06",
  module: 3,
  number: 6,
  title: "Express Routing and Middleware",
  subtitle:
    "Follow an HTTP request through an Express application, match routes by method and path, and order middleware for parsing, responses, 404s, and errors.",
  estimatedMinutes: 50,
  difficulty: "core",
  prerequisites: ["m3l02", "m3l04", "m3l05"],
  objectives: [
    "Describe the request-response cycle in an Express application and the role of the Node server.",
    "Set up an Express application and match routes by HTTP method and path.",
    "Distinguish route parameters in `req.params` from query-string values in `req.query`.",
    "Explain the `(req, res, next)` middleware shape, `next()` behavior, and registration order.",
    "Identify application, router, built-in, third-party, and error-handling middleware.",
    "Place a not-found response after routes and centralized four-argument error middleware after normal handlers.",
    "Explain that `express.json()` parses JSON request bodies, not URL query parameters.",
  ],
  sources: [
    {
      label: "Express 5.x — Installing",
      type: "express",
      url: "https://expressjs.com/en/5x/starter/installing",
    },
    {
      label: "Express 5.x — Basic routing",
      type: "express",
      url: "https://expressjs.com/en/5x/starter/basic-routing",
    },
    {
      label: "Express 5.x — Routing guide",
      type: "express",
      url: "https://expressjs.com/en/5x/guide/routing",
    },
    {
      label: "Express 5.x — Writing middleware",
      type: "express",
      url: "https://expressjs.com/en/5x/guide/writing-middleware",
    },
    {
      label: "Express 5.x API — Request properties",
      type: "express",
      url: "https://expressjs.com/en/5x/api/request",
    },
    {
      label: "Express 5.x — Using middleware",
      type: "express",
      url: "https://expressjs.com/en/5x/guide/using-middleware",
    },
    {
      label: "Express 5.x — Error handling",
      type: "express",
      url: "https://expressjs.com/en/5x/guide/error-handling",
    },
  ],
  sections: [
    {
      type: "context",
      body:
        "Express runs in Node.js and organizes server request handling around routes and middleware. A client sends an HTTP request; Express passes it through registered functions, chooses a handler matching the method and path, and sends a response or forwards an error. The Express examples in this lesson are illustrative server snippets, not runnable in the browser lesson. Its practice task uses browser URL and object APIs only: it models a route decision without importing Express or sending a request.",
    },
    {
      type: "objectives",
      items: [
        "Describe the request-response cycle in an Express application and the role of the Node server.",
        "Set up an Express application and match routes by HTTP method and path.",
        "Distinguish route parameters in `req.params` from query-string values in `req.query`.",
        "Explain the `(req, res, next)` middleware shape, `next()` behavior, and registration order.",
        "Identify application, router, built-in, third-party, and error-handling middleware.",
        "Place a not-found response after routes and centralized four-argument error middleware after normal handlers.",
        "Explain that `express.json()` parses JSON request bodies, not URL query parameters.",
      ],
    },
    {
      type: "prose",
      title: "From a request to a response",
      paragraphs: [
        "Install Express as a dependency in a Node.js project, create an application with `express()`, register middleware and routes, and start a listener. When a request arrives, the application examines the method and path as it moves through the middleware stack. A matching route can read request data, choose a status and headers, and end the response with text or JSON. If a handler calls `next()`, handling continues to the next applicable layer; if it calls `next(error)`, Express skips normal handlers and looks for error middleware.",
        "Route matching includes both the HTTP method and path. `app.get('/books', ...)` handles a GET to that path, while `app.post('/books', ...)` handles a POST. A route path can contain named segments such as `/books/:bookId`; for `/books/42`, Express makes the captured segment available as `req.params.bookId`. Query parameters follow `?` in the URL, such as `?sort=title`, and are exposed separately as `req.query.sort`.",
        "The request body is another place to carry data. The built-in `express.json()` middleware parses JSON request bodies with an appropriate content type and exposes the parsed result as `req.body`. It does not parse query parameters: `req.query` comes from the URL's query string and is handled separately. Both parsed bodies and query values are input, so applications should validate their shape and values before using them.",
      ],
    },
    {
      type: "concept",
      title: "Set up an Express application",
      body:
        "In a Node project, run `npm install express`, import the package, create an application, register middleware and routes, then call `listen` to accept requests. The ESM import below assumes an ESM-configured project, such as one with `\"type\": \"module\"` in `package.json`. `express.json()` is built into Express and handles JSON request bodies; a separate third-party body-parser installation is not the modern default shown here. The browser lesson never runs this server code.",
      mentalModel:
        "The app is the server-side dispatcher. Its registered stack is the path a request can travel before one layer responds, passes control onward, or forwards an error.",
      example: {
        language: "js",
        code: `// Illustrative Express 5 server — Node.js only, not runnable in the browser.
import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000);`,
        caption:
          "Illustrative Express 5 application setup. It runs in a Node server after Express is installed; this browser lesson does not execute it.",
      },
      walkthrough:
        "The import loads the npm package into a Node process. `express()` creates the app. `app.use(express.json())` registers a built-in middleware function before the route, so later handlers can read JSON bodies through `req.body`. The GET route sends a JSON response. `listen` starts accepting HTTP traffic; without it, the configured application is not listening for external requests.",
      pitfall:
        "Express is a Node.js server framework, not a browser library. A browser exercise must not import `express`, listen on a port, or send a network request; use a local model when practicing route decisions.",
    },
    {
      type: "concept",
      title: "Match a method and path",
      body:
        "An Express route combines a method such as GET, POST, PUT, PATCH, or DELETE with a path pattern. Use the method that describes the operation: GET reads, POST commonly creates, PUT or PATCH changes, and DELETE removes. Named route segments begin with `:` and are matched from the path; query parameters are not part of that path pattern and remain in `req.query`.",
      example: {
        language: "js",
        code: `// Illustrative Express routes — server-side only, not runnable in the browser.
app.get("/books/:bookId", (req, res) => {
  res.json({
    bookId: req.params.bookId,
    sort: req.query.sort,
  });
});

app.post("/books", (req, res) => {
  res.status(201).json({ title: req.body.title });
});`,
        caption:
          "Illustrative route handlers. In `/books/42?sort=title`, the path segment is a route parameter and `sort` is a query parameter.",
      },
      walkthrough:
        "For `GET /books/42?sort=title`, the route path `/books/:bookId` matches and Express places the string `42` in `req.params.bookId`; the query value `title` is available at `req.query.sort`. A POST to `/books` matches a different handler by method and path. Its `req.body` is populated only if suitable body-parsing middleware ran earlier, such as `express.json()` for JSON. Treat params, query values, and body values as untrusted inputs and validate before using them.",
      pitfall:
        "Do not read `/books/42` from `req.query` or expect `express.json()` to populate it. Route path captures belong in `req.params`, query-string pairs belong in `req.query`, and a parsed JSON request body belongs in `req.body`.",
    },
    {
      type: "concept",
      title: "Middleware is an ordered chain",
      body:
        "A regular middleware function receives `(req, res, next)`. It can inspect or add request/response information, send a response, or call `next()` to pass control onward. Middleware runs in registration order when its mount path and other conditions match. Once a response is sent, the handler should not also continue with `next()` as if the response had not ended. If a handler neither responds nor calls `next`, that request waits without reaching a later layer.",
      mentalModel:
        "Middleware is a sequence of gates and transformations: each matching layer either ends the trip with a response, hands the request to the next layer, or sends it down the error path.",
      example: {
        language: "js",
        code: `// Illustrative middleware order — Express server code, not browser-runnable.
function requestLog(req, res, next) {
  console.log(req.method, req.originalUrl);
  next();
}

const bookRouter = express.Router();
bookRouter.get("/:bookId", (req, res) => {
  res.json({ bookId: req.params.bookId });
});

app.use(requestLog);
app.use(express.json());
app.use("/books", bookRouter);`,
        caption:
          "Illustrative application-level, built-in, and router-level middleware, registered in order. No server code runs in the browser lesson.",
      },
      walkthrough:
        "The request logger runs before JSON parsing and the router because it was registered first. The parser can populate `req.body` before a later matching route needs it. `bookRouter` is router-level middleware mounted at `/books`, so its `/:bookId` path handles paths such as `/books/42`. Application-level middleware can be attached to `app`; router-level middleware is attached to an `express.Router()`; built-ins include `express.json()`, `express.urlencoded()`, and `express.static()`; third-party middleware such as `morgan` or `cors` is installed separately. All of them follow the same ordering rules.",
      pitfall:
        "Registration order is observable. A parser registered after a route cannot prepare that route's body, and a response-ending handler prevents later normal middleware from running. Call `next()` exactly when control should continue; do not forget to send a response or continue the chain.",
    },
    {
      type: "concept",
      title: "Separate not-found responses from error handling",
      body:
        "A 404 means the request reached the end of the normal route stack without a route sending a response; it is not automatically an application error. Add a not-found layer after the routes to send an explicit 404. Error-handling middleware has four parameters—`(err, req, res, next)`—and belongs after normal middleware and routes. `next(error)` transfers control past regular handlers to the error path. In Express 5, a rejected Promise returned by an async handler is forwarded automatically; callback-based errors still need to be passed to `next(error)`.",
      example: {
        language: "js",
        code: `// Illustrative Express 5 terminal handlers — not runnable in the browser.
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal server error" });
});`,
        caption:
          "Illustrative ordering: normal routes first, 404 response next, centralized four-argument error middleware last. This is Express server code only.",
      },
      walkthrough:
        "If no earlier route has responded, the 404 middleware sends a normal not-found response. An error passed with `next(err)` bypasses ordinary route handlers and reaches the later four-argument error handler instead. The error handler uses a fixed public message rather than exposing internal details, and delegates to Express's default handler if the response headers have already been sent. Keep the four-argument signature even when a parameter is not otherwise used; Express distinguishes error middleware by that shape.",
      pitfall:
        "Putting a 404 response before the routes makes it answer before those routes can run. Putting an error handler before the route stack means it cannot catch later errors. Register routes first, the normal 404 response afterward, and error handlers at the end.",
    },
    {
      type: "mistakes",
      title: "Common Express routing and middleware mistakes",
      items: [
        {
          mistake: "Confusing route parameters with query parameters.",
          fix:
            "Read named path segments such as `/books/:bookId` from `req.params`; read `?sort=title` from `req.query`.",
        },
        {
          mistake: "Expecting `express.json()` to parse the URL query string.",
          fix:
            "Use `express.json()` for JSON request bodies and read URL query values from `req.query`; they are separate inputs.",
        },
        {
          mistake: "Registering middleware after a route that needs its work.",
          fix:
            "Register logging, body parsing, and other prerequisites before the route handlers that depend on them.",
        },
        {
          mistake: "Calling neither `next()` nor a response-ending method.",
          fix:
            "Each matching regular middleware must end the response or pass control onward. Otherwise the request hangs at that layer.",
        },
        {
          mistake: "Writing an error handler with only three parameters or placing it before routes.",
          fix:
            "Use the four-argument `(err, req, res, next)` signature and register error middleware after the routes and normal middleware.",
        },
        {
          mistake: "Treating a route miss as an exception.",
          fix:
            "Add a normal 404 response after the routes. Reserve the centralized error handler for errors forwarded with `next(err)` or rejected Express 5 handlers.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m3l06-ex01",
      title: "Classify a book request",
      description:
        "Model which local book route matches a method and URL, keeping a path ID in `params` and `sort` in `query`. This browser-only exercise does not import Express, start a server, or make a network request.",
    },
    {
      type: "quiz",
      quizId: "m3l06-q",
    },
    {
      type: "summary",
      body:
        "An Express application receives HTTP requests and sends responses through an ordered stack of middleware and route handlers. Routes match both method and path. Named path segments such as `/books/:bookId` populate `req.params`; query-string values such as `?sort=title` populate `req.query`; JSON body parsing by `express.json()` is separate and populates `req.body`. Regular middleware receives `(req, res, next)` and must respond or call `next()`. Application, router, built-in, and third-party middleware all follow registration order. A normal 404 response goes after routes; centralized error middleware uses `(err, req, res, next)` and goes last. Express 5 forwards rejected returned Promises to error handling. The exercise models route selection with local browser APIs only.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m3l06-q",
    title: "Express routing and middleware check",
    questions: [
      {
        kind: "mcq",
        id: "m3l06-q1",
        prompt:
          "For `GET /books/42?sort=title` matched by `/books/:bookId`, where do the two values appear?",
        options: [
          "`req.query.bookId` and `req.params.sort`",
          "`req.params.bookId` and `req.query.sort`",
          "Both values are in `req.body` after `express.json()`.",
          "Both values are in `req.headers`.",
        ],
        correctIndex: 1,
        explanation:
          "The named path segment `42` is a route parameter at `req.params.bookId`; `sort=title` follows `?` and is a query parameter at `req.query.sort`.",
      },
      {
        kind: "truefalse",
        id: "m3l06-q2",
        prompt:
          "`express.json()` parses JSON request bodies; it does not populate `req.query` from the URL.",
        correct: true,
        explanation:
          "`express.json()` is built-in body-parsing middleware. Query-string values are a separate request component and are exposed through `req.query`.",
      },
      {
        kind: "code-output",
        id: "m3l06-q3",
        prompt:
          "What does this local object model print?",
        code:
          'const req = { params: { bookId: "42" }, query: { sort: "title" } };\nreq.params.bookId + "|" + req.query.sort',
        language: "js",
        expected: "42|title",
        explanation:
          "The route parameter is stored in `params.bookId` and the query value in `query.sort`. This plain JavaScript object is a browser-safe model, not an Express request or network call.",
      },
      {
        kind: "identify-bug",
        id: "m3l06-q4",
        prompt:
          "Why might this centralized Express error middleware fail to be recognized?",
        code:
          'app.use((err, req, res) => {\n  res.status(500).send("failed");\n});',
        language: "js",
        options: [
          "It has three parameters instead of the four-argument error-handler shape.",
          "It uses `app.use` instead of `app.get`.",
          "It sends a response instead of calling `next()` first.",
          "Error middleware must be registered before every route.",
        ],
        correctIndex: 0,
        explanation:
          "Express identifies error-handling middleware by its four-argument signature `(err, req, res, next)`. It is normally registered after routes and other normal middleware.",
      },
      {
        kind: "mcq",
        id: "m3l06-q5",
        prompt:
          "Where should an application place its normal 404 response layer?",
        options: [
          "Before the body parser and every route",
          "After the routes, before the final error-handling middleware",
          "Inside every route before its handler runs",
          "Only inside the four-argument error handler",
        ],
        correctIndex: 1,
        explanation:
          "A 404 is a normal response for a request that reached the end without a matching response. Place that layer after routes; keep centralized error middleware after the normal stack.",
      },
      {
        kind: "truefalse",
        id: "m3l06-q6",
        prompt:
          "Calling `next(error)` passes control to later ordinary middleware in the same way as `next()`.",
        correct: false,
        explanation:
          "`next()` continues through normal middleware and routes. `next(error)` skips the remaining normal handlers and enters the error-handling path.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m3l06-ex01",
    lectureId: "m3l06",
    title: "Classify a book request",
    brief:
      "Implement `window.matchBookRequest(method, input)` using `new URL(input, \"https://learn.example\")`. Return `{ route, params, query }` for three route decisions: GET `/books` is `listBooks`, GET `/books/:bookId` is `showBook`, and POST `/books` is `createBook`; every other method/path pair is `notFound`. Put a matched ID in `params.bookId`; put the URL's `sort` value (or `null`) in `query.sort`. This browser-only model must not import Express, start a server, or make a network request.",
    kind: "js",
    starter: `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only route model. Do not import Express or send a request.
      window.matchBookRequest = function matchBookRequest(method, input) {
        // TODO: parse the URL and classify the method/path pair.
        return { route: "notFound", params: {}, query: { sort: null } };
      };
    </script>
  </body>
</html>`,
    tests: [
      {
        kind: "js-result",
        expression:
          'window.matchBookRequest("GET", "/books?sort=title").route',
        expected: "listBooks",
        description: "Matches the GET collection route",
      },
      {
        kind: "js-result",
        expression:
          'window.matchBookRequest("GET", "/books/42?sort=title").params.bookId',
        expected: "42",
        description: "Keeps the path segment in the route-parameter result",
      },
      {
        kind: "js-result",
        expression:
          'window.matchBookRequest("GET", "/books/42?sort=title").query.sort',
        expected: "title",
        description: "Keeps the query-string value separate from the path ID",
      },
      {
        kind: "js-result",
        expression:
          'window.matchBookRequest("POST", "/books").route',
        expected: "createBook",
        description: "Selects a route by method as well as path",
      },
      {
        kind: "js-result",
        expression:
          'window.matchBookRequest("DELETE", "/books/42").route',
        expected: "notFound",
        description: "Reports a method/path pair with no modeled route",
      },
    ],
    hints: [
      'Use `new URL(input, "https://learn.example")` and inspect `.pathname` and `.searchParams` separately.',
      "Test the collection path and the single-book path together with the method; a matching path alone is not enough.",
      'Return the path ID in `params.bookId` and read `sort` from `searchParams.get("sort")`.',
      "This models decisions locally. Do not import Express, start an HTTP listener, or call `fetch`.",
    ],
    solution: `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only route model. Do not import Express or send a request.
      window.matchBookRequest = function matchBookRequest(method, input) {
        const url = new URL(input, "https://learn.example");
        const pathname = url.pathname;
        let route = "notFound";
        const params = {};

        if (method === "GET" && pathname === "/books") {
          route = "listBooks";
        } else if (
          method === "GET" &&
          pathname.startsWith("/books/") &&
          pathname.slice("/books/".length).length > 0 &&
          !pathname.slice("/books/".length).includes("/")
        ) {
          route = "showBook";
          params.bookId = pathname.slice("/books/".length);
        } else if (method === "POST" && pathname === "/books") {
          route = "createBook";
        }

        return {
          route,
          params,
          query: { sort: url.searchParams.get("sort") },
        };
      };
    </script>
  </body>
</html>`,
    solutionExplanation:
      "The browser's `URL` API parses a local string into a pathname and search parameters without contacting the example origin. The function checks both method and path, returns an ID only for the single-book route, and reads `sort` from the query separately. This is a route-decision model rather than an Express application; it imports no server package, starts no listener, and makes no network request.",
  },
];
