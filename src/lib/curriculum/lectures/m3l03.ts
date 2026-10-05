import type { Exercise, Lecture, Quiz } from "../types";

export const lecture: Lecture = {
  id: "m3l03",
  module: 3,
  number: 3,
  title: "Working with Files in Node.js",
  subtitle:
    "Read, write, organize, and protect files with Node's file-system APIs—and model file management safely in the browser.",
  estimatedMinutes: 50,
  difficulty: "core",
  prerequisites: ["m3l02"],
  objectives: [
    "Choose between synchronous, callback-based, and Promise-based `node:fs` APIs.",
    "Explain how reading, replacing, and appending file contents differ.",
    "Recognize common directory and file-management operations in Node.js.",
    "Describe why user-controlled paths need validation and sandboxing before file access.",
    "Model create, read, update, rename, copy, and delete operations using browser-only memory.",
  ],
  sources: [
    {
      label: "Node.js API — File system",
      type: "node",
      url: "https://nodejs.org/api/fs.html",
    },
    {
      label: "Node.js API — File system promises",
      type: "node",
      url: "https://nodejs.org/api/fs.html#promises-api",
    },
    {
      label: "Node.js API — Path",
      type: "node",
      url: "https://nodejs.org/api/path.html",
    },
    {
      label: "Node.js API — Permissions",
      type: "node",
      url: "https://nodejs.org/api/permissions.html",
    },
  ],
  sections: [
    {
      type: "context",
      body:
        "A server often needs to read configuration, save generated output, or manage uploaded content. Node.js provides these capabilities through built-in modules such as `node:fs`; a browser page does not get those unrestricted file-system APIs. Every Node snippet here is an illustration, not code run by this course page. The exercise models a tiny virtual file area with an in-memory `Map` and never opens, changes, or deletes a real file.",
    },
    {
      type: "objectives",
      items: [
        "Choose between synchronous, callback-based, and Promise-based `node:fs` APIs.",
        "Explain how reading, replacing, and appending file contents differ.",
        "Recognize common directory and file-management operations in Node.js.",
        "Describe why user-controlled paths need validation and sandboxing before file access.",
        "Model create, read, update, rename, copy, and delete operations using browser-only memory.",
      ],
    },
    {
      type: "prose",
      title: "File access belongs to the Node runtime",
      paragraphs: [
        "The `node:fs` built-in exposes APIs for working with files and directories on the machine where a Node process runs. Importing it does not make sense in an ordinary browser page: a browser does not let a page silently inspect arbitrary paths on the user's disk. Browser file access is deliberately mediated by user selection and browser-specific APIs, which are outside this lecture's Node examples.",
        "Node provides synchronous methods, callback-style asynchronous methods, and Promise-based methods. The same broad task—reading a file—can be expressed in each style. Pick an asynchronous form for typical server work so one file operation does not hold up the JavaScript event loop while it waits. A synchronous method can still be useful in a short startup script or controlled command-line tool, but it blocks the JavaScript thread until it finishes.",
      ],
    },
    {
      type: "concept",
      title: "Three styles for the same file operation",
      body:
        "The sync API commonly ends in `Sync` and returns its result directly (or throws). The callback API starts work and later calls an error-first callback: its first argument is an error or `null`, and the next carries the result. The `node:fs/promises` API returns a Promise; `await` makes the continuation easier to read while the pending I/O does not block the whole event loop.",
      mentalModel:
        "Synchronous means wait here; callback means give Node a continuation; Promise means receive a future result that can be awaited or chained. They are different interfaces to file operations, not guarantees that the underlying storage will succeed.",
      example: {
        language: "js",
        code:
          `// Illustrative Node.js only — not runnable in the browser.
import { readFile as readFileCallback, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

const startupText = readFileSync("settings.txt", "utf8");

readFileCallback("notes.txt", "utf8", (error, text) => {
  if (error) {
    console.error(error.message);
    return;
  }
  console.log(text);
});

async function showNotes() {
  try {
    const text = await readFile("notes.txt", "utf8");
    console.log(text);
  } catch (error) {
    console.error(error.message);
  }
}`,
        caption:
          "Illustrative Node.js APIs only: sync, callback, and Promise styles. This code is not run by the browser lesson.",
      },
      walkthrough:
        "`readFileSync` returns before the next statement and blocks the JavaScript thread during the read. The callback version handles a possible error before using `text`. `readFile` from `node:fs/promises` fulfills with the contents or rejects; an application should handle that rejection with `try`/`catch` or a caller that handles the returned Promise. `await` pauses only the current async function while that Promise is pending.",
      pitfall:
        "A `try`/`catch` around the call that starts a callback-style operation does not catch an error passed to its callback later. Check the callback's `error`; for a Promise, handle rejection. Avoid synchronous file calls in request handlers because they hold up other JavaScript work on that thread.",
    },
    {
      type: "concept",
      title: "Read, replace, append, and organize",
      body:
        '`readFile(path, "utf8")` reads the file and returns text; without a text encoding, Node returns a `Buffer`. `writeFile` writes data and replaces the existing file contents by default, while `appendFile` adds data to the end and creates the file if it does not exist. Directory and file-management APIs include `mkdir` (create a directory, optionally with `{ recursive: true }`), `readdir` (list entries), `copyFile`, `rename`, and `rm`. They report failures such as missing paths or insufficient permission, so real applications still need deliberate error handling.',
      example: {
        language: "js",
        code:
          `// Illustrative Node.js program — not runnable in the browser playground.
import {
  appendFile,
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";

async function manageNotes() {
  const folder = new URL("./lesson-notes/", import.meta.url);
  await mkdir(folder, { recursive: true });

  const draft = new URL("draft.txt", folder);
  const backup = new URL("backup.txt", folder);
  const archive = new URL("archive.txt", folder);

  await writeFile(draft, "First line\\n", "utf8");
  const text = await readFile(draft, "utf8");
  await appendFile(draft, "Another line\\n", "utf8");
  await copyFile(draft, backup);
  await rename(backup, archive);
  const entries = await readdir(folder);
  await rm(archive);
  return { text, entries };
}`,
        caption:
          "Illustrative Node.js filesystem code only. It shows API shapes; the browser lesson never executes it.",
      },
      walkthrough:
        "The example creates a directory if needed, writes a draft, reads it as UTF-8 text, appends another line, copies it, renames the copy, lists directory entries, and removes the archive. All paths are built relative to this example module's file URL. The operations are asynchronous and each is awaited in order; real applications should also decide how to report or recover from any rejected operation.",
      pitfall:
        "Do not confuse replacing with appending: `writeFile` can discard old content, while `appendFile` adds to it. Directory creation and cleanup are separate operations; deleting a file is not the same as recursively deleting a directory tree.",
    },
    {
      type: "concept",
      title: "Treat a path as untrusted input",
      body:
        "Never join a user-supplied filename to a storage directory and assume the result stays inside that directory. A value containing `..`, an absolute path, or platform-specific separators can escape a naive string prefix check. A server should define an allowed root, normalize and resolve the candidate, then verify that it remains beneath the root using path-aware comparisons (for example, `relative(root, candidate)` and checks for `..` or an absolute relative result). Reject invalid input rather than trying to make an attacker-controlled path safe by string replacement.",
      mentalModel:
        "A path is a request for authority over a location. The sandbox is the boundary; validate the resolved location against that boundary before any I/O, and separately enforce who may perform the operation.",
      example: {
        language: "js",
        code:
          `// Illustrative Node.js path check — conceptual only, not runnable here.
import { isAbsolute, relative, resolve, sep } from "node:path";

const root = resolve("/srv/app/uploads");
const candidate = resolve(root, userSuppliedPath);
const fromRoot = relative(root, candidate);
const escapesRoot =
  fromRoot === ".." ||
  fromRoot.startsWith(".." + sep) ||
  isAbsolute(fromRoot);

if (escapesRoot) {
  throw new Error("Path is outside the allowed area");
}`,
        caption:
          "Illustrative path validation only—not a complete filesystem sandbox and not executed by the browser.",
      },
      walkthrough:
        "`resolve` normalizes a candidate path, and `relative` gives the path from the approved root to that candidate. A result of `..`, a relative path beginning with `..` plus the platform separator, or an absolute result indicates an escape in this lexical check. This is a conceptual starting point, not a universal security recipe: symlinks can point outside the root, and checking a path and later opening it can create a race. Real designs must account for symlinks, permissions, concurrent changes, and the platform's filesystem semantics; use a constrained storage design and the least privilege needed.",
      pitfall:
        "A plain `candidate.startsWith(root)` check is unsafe: `/srv/app/uploads-old/file.txt` also starts with `/srv/app/uploads`. Even a path-aware lexical check alone does not contain symlinks or remove time-of-check/time-of-use races. Do not accept a path check as authorization to access arbitrary files.",
    },
    {
      type: "example",
      title: "A browser-safe virtual file manager",
      code:
        `// Ordinary browser JavaScript: stores virtual names and text in memory only.
const files = new Map();
files.set("notes/draft.txt", "first version");
files.set("notes/final.txt", "approved version");

const names = [...files.keys()].sort();
const draftText = files.get("notes/draft.txt");
console.log(names, draftText);`,
      language: "js",
      runnable: true,
      walkthrough:
        "This small map is a model, not a connection to `node:fs`: its keys are virtual names and its values are strings in browser memory. Real file APIs can read and mutate the operating system's filesystem; this example can only inspect the entries explicitly put in the `Map`.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with file-system work",
      items: [
        {
          mistake: "Using a synchronous file API in a request handler for convenience.",
          fix:
            "Use callback or Promise-based APIs for normal server I/O so the JavaScript thread is not blocked while the operation waits. Keep sync calls for situations where blocking is intentional.",
        },
        {
          mistake: "Assuming `writeFile` adds to the end of an existing file.",
          fix:
            "Use `appendFile` when the intent is to append. `writeFile` replaces existing contents by default; choose the API that matches the desired update.",
        },
        {
          mistake: "Ignoring a callback error or an unhandled rejected Promise.",
          fix:
            "Handle the error-first callback argument or catch a Promise rejection before relying on the result.",
        },
        {
          mistake: "Checking only whether a path string starts with the storage-root string.",
          fix:
            "Resolve and compare paths using path-aware logic, reject escapes, and account for symlinks, authorization, and races before real I/O.",
        },
        {
          mistake: "Treating a browser exercise's in-memory model as permission to access disk.",
          fix:
            "Keep the practice exercise to virtual names and data in a `Map`; it must not import Node APIs or operate on real files.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m3l03-ex01",
      title: "Manage a virtual workspace",
      description:
        "Implement create, read, update, rename, copy, and delete actions against an in-memory `Map`. This browser-only model rejects traversal-like names and never reads or writes real files.",
    },
    {
      type: "quiz",
      quizId: "m3l03-q",
    },
    {
      type: "summary",
      body:
        "Node's `node:fs` APIs read and manage files and directories. Synchronous calls return immediately but block the JavaScript thread; callback and Promise APIs allow the program to continue while I/O is pending, with errors handled through the callback or Promise. `writeFile` replaces contents by default, `appendFile` adds to them, and APIs such as `mkdir`, `readdir`, `copyFile`, `rename`, and `rm` manage entries. User-controlled paths require a real sandbox boundary: resolve and compare paths, reject escapes, account for symlinks and races, and enforce authorization. The exercise used only a browser-memory `Map`, not filesystem access.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m3l03-q",
    title: "Node.js file-system check",
    questions: [
      {
        kind: "mcq",
        id: "m3l03-q1",
        prompt:
          "Which `node:fs` style blocks the JavaScript thread until the file operation finishes?",
        options: [
          "A synchronous method such as `readFileSync`",
          "A callback-based method such as `readFile`",
          "A Promise returned by `node:fs/promises`",
          "An `await` inside an async function",
        ],
        correctIndex: 0,
        explanation:
          "A synchronous file API waits for its result before returning, so JavaScript on that thread cannot do other work in the meantime. Callback and Promise APIs complete asynchronously.",
      },
      {
        kind: "truefalse",
        id: "m3l03-q2",
        prompt:
          "By default, `writeFile` appends new text after the existing contents of a file.",
        correct: false,
        explanation:
          "`writeFile` replaces existing contents by default. Use `appendFile` when the goal is to add data to the end.",
      },
      {
        kind: "code-output",
        id: "m3l03-q3",
        prompt:
          "What does this browser-safe in-memory map print after the update?",
        code:
          'const files = new Map([["draft.txt", "one"]]);\nfiles.set("draft.txt", "two");\nconsole.log(files.get("draft.txt"));',
        language: "js",
        expected: "two",
        explanation:
          "Setting an existing key in a `Map` replaces that entry's value. This question models memory only; it does not access a real file.",
      },
      {
        kind: "identify-bug",
        id: "m3l03-q4",
        prompt:
          "Illustrative Node.js callback (not runnable in the browser): what is the key bug?",
        code:
          'readFile("notes.txt", "utf8", (error, text) => {\n  console.log(text.length);\n});',
        language: "js",
        options: [
          "It uses a callback instead of a Promise",
          "It uses a relative filename",
          "It should check the error before using `text`",
          "It must call `appendFile` before reading",
        ],
        correctIndex: 2,
        explanation:
          "The callback follows Node's error-first convention. On failure, it must handle `error` and return before using the result, which may be absent.",
      },
      {
        kind: "mcq",
        id: "m3l03-q5",
        prompt:
          "Why is a lexical path-containment check not always a complete filesystem sandbox?",
        options: [
          "Because path separators never have platform-specific forms",
          "Because a symlink inside the allowed directory can point outside it",
          "Because Node cannot represent absolute paths",
          "Because a path check automatically grants file permissions",
        ],
        correctIndex: 1,
        explanation:
          "A normalized lexical path can still traverse a symlink whose target is outside the intended root. Real designs also consider permissions and races between checking and opening.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m3l03-ex01",
    lectureId: "m3l03",
    title: "Manage a virtual workspace",
    brief:
      "Implement `window.runFilePlan(actions)` using a new in-memory `Map` for each call. Support `create` (store `content`), `read`, `update` (change existing content), `rename` (`from` to `to`), `copy` (`from` to `to`), and `delete`. Return `{ results, paths }`, where `results` contains `created`, the read text, `updated`, `renamed`, `copied`, `deleted`, `not found`, `already exists`, or `invalid path` for each action, and `paths` is the sorted list of remaining virtual names. Accept relative names such as `notes/draft.txt`; reject empty names, absolute names (including drive-letter-prefixed names such as `C:/...`), backslashes, empty path segments, `.` segments, and `..` segments. This is browser-only in-memory modeling: do not import Node APIs or access real files, network, or a database.",
    kind: "js",
    starter:
      `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only model. Do not use Node APIs or real file paths.
      window.runFilePlan = function runFilePlan(actions) {
        // TODO: use a Map, validate each virtual name, and apply each action.
        return { results: [], paths: [] };
      };
    </script>
  </body>
</html>`,
    tests: [
      {
        kind: "js-result",
        expression:
          'window.runFilePlan([{ type: "create", path: "notes/draft.txt", content: "first" }, { type: "read", path: "notes/draft.txt" }, { type: "update", path: "notes/draft.txt", content: "revised" }, { type: "copy", from: "notes/draft.txt", to: "notes/backup.txt" }, { type: "rename", from: "notes/draft.txt", to: "notes/final.txt" }, { type: "delete", path: "notes/backup.txt" }, { type: "read", path: "notes/final.txt" }]).results.join("|")',
        expected: "created|first|updated|copied|renamed|deleted|revised",
        description:
          "Creates, reads, updates, copies, renames, deletes, and reads virtual content",
      },
      {
        kind: "js-result",
        expression:
          'window.runFilePlan([{ type: "create", path: "notes/draft.txt", content: "first" }, { type: "copy", from: "notes/draft.txt", to: "notes/backup.txt" }, { type: "rename", from: "notes/draft.txt", to: "notes/final.txt" }, { type: "delete", path: "notes/backup.txt" }]).paths.join("|")',
        expected: "notes/final.txt",
        description: "Returns the sorted names that remain in the virtual map",
      },
      {
        kind: "js-result",
        expression:
          'window.runFilePlan([{ type: "create", path: "../private.txt", content: "secret" }]).results.join("|")',
        expected: "invalid path",
        description: "Rejects a traversal-like virtual name",
      },
      {
        kind: "js-result",
        expression:
          'window.runFilePlan([{ type: "create", path: "C:/private.txt", content: "secret" }]).results.join("|")',
        expected: "invalid path",
        description: "Rejects a drive-rooted virtual name",
      },
      {
        kind: "js-result",
        expression:
          'window.runFilePlan([{ type: "create", path: "notes/draft.txt", content: "first" }, { type: "create", path: "notes/draft.txt", content: "second" }, { type: "read", path: "missing.txt" }]).results.join("|")',
        expected: "created|already exists|not found",
        description: "Reports an existing virtual name and a missing read",
      },
    ],
    hints: [
      "Create a fresh `Map` inside the function so each plan starts with empty memory.",
      "Use one path-checking helper for every source and destination name; reject `..` rather than joining it to a real root.",
      "For rename, save the source value before deleting its key. For copy, keep the original entry.",
      "This is a data model only. Do not import `node:fs`, call browser file pickers, or make a network request.",
    ],
    solution:
      `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only model. Do not use Node APIs or real file paths.
      window.runFilePlan = function runFilePlan(actions) {
        const files = new Map();
        const validPath = (path) => {
          if (
            typeof path !== "string" ||
            path.length === 0 ||
            path.startsWith("/") ||
            /^[A-Za-z]:/.test(path) ||
            path.includes("\\\\")
          ) {
            return null;
          }

          const segments = path.split("/");
          if (
            segments.some(
              (segment) => segment === "" || segment === "." || segment === "..",
            )
          ) {
            return null;
          }

          return segments.join("/");
        };

        const results = [];
        for (const action of actions) {
          if (action.type === "rename" || action.type === "copy") {
            const from = validPath(action.from);
            const to = validPath(action.to);
            if (!from || !to) {
              results.push("invalid path");
            } else if (!files.has(from)) {
              results.push("not found");
            } else if (files.has(to)) {
              results.push("already exists");
            } else {
              const content = files.get(from);
              files.set(to, content);
              if (action.type === "rename") files.delete(from);
              results.push(action.type === "rename" ? "renamed" : "copied");
            }
            continue;
          }

          const path = validPath(action.path);
          if (!path) {
            results.push("invalid path");
          } else if (action.type === "create") {
            if (files.has(path)) {
              results.push("already exists");
            } else {
              files.set(path, action.content);
              results.push("created");
            }
          } else if (action.type === "read") {
            results.push(files.has(path) ? files.get(path) : "not found");
          } else if (action.type === "update") {
            if (!files.has(path)) {
              results.push("not found");
            } else {
              files.set(path, action.content);
              results.push("updated");
            }
          } else if (action.type === "delete") {
            if (files.delete(path)) results.push("deleted");
            else results.push("not found");
          } else {
            results.push("not found");
          }
        }

        return { results, paths: [...files.keys()].sort() };
      };
    </script>
  </body>
</html>`,
    solutionExplanation:
      "The function gives each call a fresh `Map`, validates virtual path segments, and records simple operation outcomes. Rename moves a value to a new key; copy leaves the original in place; delete removes one virtual entry. This deliberately models content in browser memory only. A `Map` is not a filesystem sandbox: no Node API is imported and no real path, disk, network, or database is accessed.",
  },
];
