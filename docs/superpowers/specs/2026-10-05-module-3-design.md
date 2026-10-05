# Module 3: Server-Side Web Technology — Design

## Goal

Expand Kōdo with a complete, navigable Module 3 based on the eight supplied Web Technology lecture decks. The material introduces server-side programming and Node.js, then develops practical HTTP, file, URL, package, database, and Express concepts. Content should retain the course outcomes while teaching current, accurate APIs.

## Module structure

Create eight sequential lectures, one corresponding to each supplied deck, arranged for prerequisite flow:

1. **Server-side programming and Node.js** — backend responsibilities; static vs dynamic servers; Node runtime, V8, event loop, non-blocking I/O, callbacks, Promises, async/await.
2. **Node.js modules and HTTP** — CommonJS and ES modules; built-in/local/third-party modules; HTTP server, requests and responses, status codes, and headers.
3. **Working with the file system** — `node:fs`, callback vs synchronous vs promise APIs, reading/writing files, directories, and a contained file-management exercise.
4. **URLs and query strings** — URL anatomy, WHATWG `URL`, `URLSearchParams`, URL resolution, and query handling.
5. **npm and relational databases** — package metadata and dependencies; structured data; SQL basics and Node-to-MySQL concepts using parameterized queries.
6. **Express.js** — request/response cycle, routes and parameters, query parameters, middleware ordering/types, and error handling.
7. **MongoDB concepts** — documents and collections, JSON/BSON, flexible schema, ObjectId, CRUD, and careful framing of ACID, CAP, and BASE.
8. **MongoDB with Node.js** — driver installation and connection, selecting a database/collection, inserting and finding documents, and modern async usage.

Each lecture follows the existing `Lecture` data model and Kōdo content style: context, objectives, well-explained concepts and examples, common mistakes, a concise recap, quiz, and an appropriate practice exercise or interactive. Examples use small, coherent snippets and clearly identify where a local service or credentials would be required.

## API and accuracy policy

- Teach modern Node.js conventions: `node:` built-in specifiers, Promise-based `fs`, WHATWG URL APIs, and async/await.
- Teach the current MongoDB Node.js driver API rather than the removed callback patterns shown in the slides. Briefly identify legacy snippets where that helps students interpret the supplied notes.
- Teach SQL through placeholders/parameterized queries and distinguish relational SQL concepts from MongoDB documents.
- Correct misleading simplifications in the slides, especially the CAP theorem; do not state that distributed databases simply “choose any two” in all conditions.
- Use the standard local MongoDB URI/port (`mongodb://localhost:27017`) in examples, and use placeholders for credentials rather than literals.
- Present ACID, CAP, and BASE as database/distributed-systems concepts with clear boundaries; avoid equating every relational database with ACID or every NoSQL database with BASE.

## Kōdo integration

Add Module 3 to the curriculum without disturbing existing Module 1 or Module 2 content or saved learner progress. Integration includes:

- extending the lecture ID and module unions and curriculum registry;
- adding the module metadata and eight lecture records, quizzes, and exercises;
- exposing a `/modules/3` page and Module 3 lecture routes;
- extending progress initialization and module/lecture progress calculations;
- including Module 3 in home-page module links, course totals, recommendations, learning paths, navigation/search, and source listings;
- using the existing generic section renderers where possible; add only narrowly scoped presentation or interaction support required by the new material.

Module 3 examples run in the existing browser-based learning environment where feasible. Since the browser cannot execute Node.js or connect to a student's local database, server-side examples should be accompanied by explanatory output/flow and exercise validation that does not imply a real Node server or database was run in-browser. Any interactive should model the concept explicitly rather than claiming to provide a Node runtime.

## Verification

- Run TypeScript/lint/build checks provided by the app scripts.
- Verify all eight lecture IDs resolve in the unified registry, their module/sequence metadata is correct, and their quizzes/exercises are associated with the right lecture.
- Run the existing Playwright end-to-end suite and add or adapt coverage for Module 3 listing, navigation, lecture rendering, quiz/exercise flow, and progress persistence.
- Manually inspect the new module and sample lessons at desktop and narrow viewport sizes.

## Out of scope

- Installing or configuring a local Node.js, MySQL, or MongoDB service for learners.
- Running arbitrary server-side code or database credentials in the browser.
- Adding a production backend to Kōdo.
