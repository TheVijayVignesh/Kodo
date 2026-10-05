import type { Exercise, Lecture, Quiz } from "../types";

export const lecture: Lecture = {
  id: "m3l04",
  module: 3,
  number: 4,
  title: "URLs and Query Parameters",
  subtitle:
    "Read URL components, resolve relative addresses with the WHATWG API, and handle repeated query parameters without losing information.",
  estimatedMinutes: 45,
  difficulty: "core",
  prerequisites: ["m3l02", "m3l03"],
  objectives: [
    "Identify the scheme, host, path, query, and fragment of a URL.",
    "Parse and build absolute URLs with the WHATWG `URL` constructor.",
    "Resolve relative URLs against an explicit base URL.",
    "Read and update query parameters with `URLSearchParams`, including repeated keys.",
    "Explain why modern code generally prefers `URL` over legacy `url.parse` and when `querystring` may still appear.",
  ],
  sources: [
    {
      label: "Node.js API — URL",
      type: "node",
      url: "https://nodejs.org/api/url.html",
    },
    {
      label: "Node.js API — Query strings",
      type: "node",
      url: "https://nodejs.org/api/querystring.html",
    },
    {
      label: "MDN — URL",
      type: "mdn",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/URL",
    },
    {
      label: "MDN — URLSearchParams",
      type: "mdn",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams",
    },
  ],
  sections: [
    {
      type: "context",
      body:
        "A URL is structured data, not just a string to split on punctuation. Browsers and Node.js both implement the WHATWG `URL` and `URLSearchParams` APIs, so the same basic parsing and query-handling ideas apply on either side. This lecture uses browser-safe examples: it parses and edits values locally and never sends a request. Understanding component boundaries also helps a server validate the intended route and query rather than trusting string fragments.",
    },
    {
      type: "objectives",
      items: [
        "Identify the scheme, host, path, query, and fragment of a URL.",
        "Parse and build absolute URLs with the WHATWG `URL` constructor.",
        "Resolve relative URLs against an explicit base URL.",
        "Read and update query parameters with `URLSearchParams`, including repeated keys.",
        "Explain why modern code generally prefers `URL` over legacy `url.parse` and when `querystring` may still appear.",
      ],
    },
    {
      type: "concept",
      title: "A URL has named components",
      body:
        "Consider `https://docs.example:8443/guide/urls?tag=web&tag=node#search`. Its scheme is `https:`; its hostname is `docs.example`; its port is `8443`; its pathname is `/guide/urls`; its query is `?tag=web&tag=node`; and its fragment is `#search`. The host includes the hostname and port, while the origin is the scheme plus host. A URL may also contain user information, but credentials should not be placed in URLs because URLs can be copied into logs, history, and other surfaces. The fragment identifies a client-side location and is not sent as part of an HTTP request to the server.",
      mentalModel:
        "A URL is a parsed record with separate fields. Use those fields for routing and query logic instead of guessing by splitting at `?`, `#`, or `:`.",
      example: {
        language: "js",
        code:
          `const resource = new URL(
  "https://docs.example:8443/guide/urls?tag=web&tag=node#search",
);

console.log(resource.protocol); // "https:"
console.log(resource.hostname); // "docs.example"
console.log(resource.port); // "8443"
console.log(resource.pathname); // "/guide/urls"
console.log(resource.search); // "?tag=web&tag=node"
console.log(resource.hash); // "#search"`,
        caption:
          "The browser-safe WHATWG URL API exposes each component as a property.",
      },
      walkthrough:
        "The constructor parses the absolute URL into a `URL` object. Properties such as `protocol`, `hostname`, `port`, `pathname`, `search`, and `hash` have clear component boundaries; note that `search` and `hash` include their leading punctuation. For an invalid absolute input, the constructor throws a `TypeError` rather than returning a partially parsed record.",
      pitfall:
        "Do not treat `host` and `hostname` as synonyms: `host` includes a non-default port, while `hostname` does not. Also do not assume a fragment is part of the request sent to the server.",
    },
    {
      type: "concept",
      title: "Use `new URL` and an explicit base",
      body:
        "`new URL(input)` parses an absolute URL. To resolve a relative reference, provide a valid absolute base as the second argument: resolving `../help` against `https://docs.example/guide/` becomes `https://docs.example/help`. A reference beginning with `/` replaces the base path from the origin; a path such as `next` is resolved against the current base directory. Whether the base path ends in `/` matters: `https://docs.example/guide/` is a directory-like base, while `https://docs.example/guide` is treated as the last path segment when a relative path is resolved. Passing no base for a relative input throws.",
      example: {
        language: "js",
        code:
          `const base = new URL("https://docs.example/guide/");
const article = new URL("next?mode=short", base);
const help = new URL("../help", base);

console.log(article.href); // "https://docs.example/guide/next?mode=short"
console.log(help.href); // "https://docs.example/help"`,
        caption:
          "A URL base resolves relative references using the same rules as browser links.",
      },
      walkthrough:
        "The first relative reference is appended to the base's directory and keeps its query. The second uses `..` to move up from `/guide/` before adding `/help`. A root-relative input such as `/search` would resolve at the same origin's root. Always choose the intended base explicitly rather than assuming the current page or process directory.",
      pitfall:
        "String concatenation is not URL resolution: it can duplicate slashes, retain the wrong directory, or mishandle `..`. Use a base URL, and include the trailing slash when the base should represent a directory.",
    },
    {
      type: "concept",
      title: "`URLSearchParams` preserves query pairs",
      body:
        "The `searchParams` property gives a URL's query as an ordered list of name-value pairs. `get(name)` returns the first matching value (or `null` if absent); `getAll(name)` returns every matching value in order. Repeated names are valid: `?tag=web&tag=node` represents two `tag` pairs, not necessarily one value. Use `append` to add another pair, `set` to replace the first matching value and remove the other values with that name, and `delete` to remove all pairs with that name. `toString()` serializes the parameters without a leading `?`.",
      example: {
        language: "js",
        code:
          `const url = new URL(
  "https://shop.example/search?tag=web&tag=node&page=1",
);
const params = url.searchParams;

console.log(params.get("tag")); // "web" — the first value
console.log(params.getAll("tag")); // ["web", "node"]

params.append("tag", "security");
params.set("page", "2");
params.delete("unused");
console.log(params.toString());
// "tag=web&tag=node&page=2&tag=security"`,
        caption:
          "Repeated keys stay as separate pairs; `getAll` reads the complete value list.",
      },
      walkthrough:
        "The first call to `get` does not combine or return all `tag` values, so use `getAll` when repeated choices matter. Appending keeps existing values and adds a new pair; setting `page` changes its value. If a URL object is available, modifying its `searchParams` also updates its serialized query. Calling `toString()` directly returns only the encoded parameter text.",
      pitfall:
        "Converting repeated parameters immediately into a single-value object can discard information. Decide whether the first value, every value, or one replacement is appropriate before choosing `get`, `getAll`, or `set`.",
    },
    {
      type: "example",
      title: "Encoding and the legacy APIs",
      code:
        `const params = new URLSearchParams();
params.set("q", "cats & dogs");
console.log(params.toString()); // "q=cats+%26+dogs"

const url = new URL("https://shop.example/search?q=one&q=two");
console.log(url.searchParams.getAll("q")); // ["one", "two"]
url.searchParams.set("q", "new");
console.log(url.href); // "https://shop.example/search?q=new"`,
      language: "js",
      runnable: true,
      walkthrough:
        "`URLSearchParams` uses form-style query serialization: a space becomes `+`, while the ampersand inside the value is encoded as `%26` so it is not mistaken for a pair separator. Percent encoding is not a reason to encode a value manually before passing it to `set` or `append`; doing that can encode the percent sign again. Node.js classifies `url.parse()` as a legacy API, but it is not currently deprecated; prefer the WHATWG `URL` constructor for new code. Node's `querystring` module remains in existing code and can parse or serialize query strings, but `URLSearchParams` follows the standard web API and naturally preserves repeated pairs through `getAll`, `append`, and `set`.",
    },
    {
      type: "mistakes",
      title: "Common URL and query mistakes",
      items: [
        {
          mistake: "Parsing a URL by splitting on punctuation characters.",
          fix:
            "Use `new URL()` and read component properties. Parsing rules include default ports, escaping, and relative resolution that string splitting does not model.",
        },
        {
          mistake: "Calling `new URL` with a relative input but no base.",
          fix:
            "Pass the intended absolute base as the second argument, and choose a trailing slash when that base represents a directory.",
        },
        {
          mistake: "Using `get()` when every repeated value matters.",
          fix:
            "`get()` returns the first pair only. Use `getAll()` to retain repeated values; `append()` adds a pair, `set()` replaces all pairs of that name, and `delete()` removes them all.",
        },
        {
          mistake: "Manually percent-encoding values before calling `URLSearchParams`.",
          fix:
            "Pass the original text and let the API serialize it. Form-style query serialization uses `+` for spaces and percent-encodes reserved characters where needed.",
        },
        {
          mistake: "Starting new Node code with legacy `url.parse()` or flattening a query without considering duplicates.",
          fix:
            "Prefer the WHATWG `URL` and `URLSearchParams` APIs. When maintaining `querystring` code, account for its distinct API and repeated-key representation.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m3l04-ex01",
      title: "Update a catalog URL",
      description:
        "Parse and update a local URL with `URL` and `URLSearchParams`. The exercise reads and serializes strings in the browser only; it never makes a request.",
    },
    {
      type: "quiz",
      quizId: "m3l04-q",
    },
    {
      type: "summary",
      body:
        "A URL is structured into fields such as scheme, host, pathname, query, and fragment. Use the WHATWG `URL` constructor to parse absolute URLs and resolve relative references against an explicit base. `URLSearchParams` reads and updates ordered name-value pairs: `get` returns the first match, `getAll` returns repeated values, `append` adds one, `set` replaces all values for a name, and `delete` removes them. Serialization uses form-style percent encoding, including `+` for spaces. Node.js classifies `url.parse()` as a legacy API, but it is not currently deprecated; prefer `URL` for new Node code. Recognize `querystring` as a legacy built-in with different conventions. The exercise only transforms URL strings locally.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m3l04-q",
    title: "URLs and query parameters check",
    questions: [
      {
        kind: "mcq",
        id: "m3l04-q1",
        prompt:
          "In a parsed URL, which property includes a non-default port along with the hostname?",
        options: ["`hostname`", "`host`", "`pathname`", "`origin`"],
        correctIndex: 1,
        explanation:
          "`host` includes the hostname and port when present. `hostname` contains only the hostname; `origin` includes the scheme and host.",
      },
      {
        kind: "truefalse",
        id: "m3l04-q2",
        prompt:
          "When a query contains `tag=web&tag=node`, `URLSearchParams.getAll(\"tag\")` returns both values in order.",
        correct: true,
        explanation:
          "Repeated names remain separate pairs. `getAll` returns all matching values in their order; `get` returns only the first.",
      },
      {
        kind: "code-output",
        id: "m3l04-q3",
        prompt:
          "What path does this browser-safe code resolve?",
        code:
          'new URL("next", "https://docs.example/guide/").pathname',
        language: "js",
        expected: "/guide/next",
        explanation:
          "The base ends with `/`, so it represents the `/guide/` directory. Resolving `next` appends that segment to the directory.",
      },
      {
        kind: "identify-bug",
        id: "m3l04-q4",
        prompt:
          "What is wrong with this query handling if every selected tag must be kept?",
        code:
          'const tags = new URLSearchParams("tag=web&tag=node").get("tag");',
        language: "js",
        options: [
          "`get` returns only the first matching value; use `getAll`",
          "`URLSearchParams` cannot read a query string",
          "The query must start with `#`",
          "`get` returns a number and must be parsed as an array",
        ],
        correctIndex: 0,
        explanation:
          "`get` returns the first matching value. `getAll` returns both values, web and node, in order.",
      },
      {
        kind: "mcq",
        id: "m3l04-q5",
        prompt:
          "What does `URLSearchParams.set(\"tag\", \"web\")` do when `tag` already appears more than once?",
        options: [
          "Adds `web` after every existing `tag` value",
          "Changes the first matching value and removes the other `tag` pairs",
          "Removes every query parameter",
          "Leaves the query unchanged and returns a new URL",
        ],
        correctIndex: 1,
        explanation:
          "`set` replaces the first value for the name and removes any additional pairs with that same name. Use `append` to add another value instead.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m3l04-ex01",
    lectureId: "m3l04",
    title: "Update a catalog URL",
    brief:
      "Implement `window.updateCatalogUrl(input, action, name, value)` using `new URL(input, \"https://catalog.example/store/\")`. For `read`, leave the query as-is; for `set`, `append`, or `delete`, apply the matching `URLSearchParams` method. Return `{ pathname, values, query }`, where `values` is `searchParams.getAll(name)` and `query` is `searchParams.toString()` without a leading `?`. This browser-safe task only parses and serializes strings: do not use Node APIs, network, or a database.",
    kind: "js",
    starter:
      `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-safe URL transformation only; do not send a request.
      window.updateCatalogUrl = function updateCatalogUrl(input, action, name, value) {
        // TODO: resolve against the specified base and update searchParams.
        return { pathname: "", values: [], query: "" };
      };
    </script>
  </body>
</html>`,
    tests: [
      {
        kind: "js-result",
        expression:
          'window.updateCatalogUrl("products?tag=web&tag=node", "read", "tag", "").pathname',
        expected: "/store/products",
        description: "Resolves a relative URL against the catalog base",
      },
      {
        kind: "js-result",
        expression:
          'window.updateCatalogUrl("/search?tag=web&tag=node", "read", "tag", "").values.join("|")',
        expected: "web|node",
        description: "Reads every repeated value in order",
      },
      {
        kind: "js-result",
        expression:
          'window.updateCatalogUrl("/search?tag=web&tag=node&sort=recent", "set", "tag", "css").query',
        expected: "tag=css&sort=recent",
        description: "Replaces duplicate values for a name with one value",
      },
      {
        kind: "js-result",
        expression:
          'window.updateCatalogUrl("/search?tag=web", "append", "tag", "node").query',
        expected: "tag=web&tag=node",
        description: "Appends a repeated query pair without replacing the first",
      },
      {
        kind: "js-result",
        expression:
          'window.updateCatalogUrl("/search?tag=web&tag=node&sort=recent", "delete", "tag", "").query',
        expected: "sort=recent",
        description: "Deletes every pair with the selected name",
      },
      {
        kind: "js-result",
        expression:
          'window.updateCatalogUrl("/search?q=old", "set", "q", "cats & dogs").query',
        expected: "q=cats+%26+dogs",
        description: "Serializes a space and ampersand using form-style encoding",
      },
    ],
    hints: [
      "Construct `new URL(input, \"https://catalog.example/store/\")` so relative inputs have a defined base.",
      "Use `url.searchParams.getAll(name)` for the `values` result; `get` returns only the first value.",
      "Call exactly one of `set`, `append`, or `delete` for its matching action. A `read` action does not mutate the query.",
      "Use `url.searchParams.toString()`; it returns the serialized query without a leading question mark.",
    ],
    solution:
      `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-safe URL transformation only; do not send a request.
      window.updateCatalogUrl = function updateCatalogUrl(input, action, name, value) {
        const url = new URL(input, "https://catalog.example/store/");
        const params = url.searchParams;

        if (action === "set") {
          params.set(name, value);
        } else if (action === "append") {
          params.append(name, value);
        } else if (action === "delete") {
          params.delete(name);
        }

        return {
          pathname: url.pathname,
          values: params.getAll(name),
          query: params.toString(),
        };
      };
    </script>
  </body>
</html>`,
    solutionExplanation:
      "The `URL` constructor resolves the input against the exercise's explicit base without contacting that origin. Its `searchParams` object handles repeated values and serialization: `getAll` preserves every selected value, `set` replaces same-name pairs, `append` adds a new pair, and `delete` removes all pairs for the name. The code uses only standard browser URL APIs and local strings; it does not import Node or make a network/database call.",
  },
];
