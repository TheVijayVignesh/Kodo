import type { Exercise, Lecture, Quiz } from "../types";

export const lecture: Lecture = {
  id: "m3l08",
  module: 3,
  number: 8,
  title: "Connect a Node.js App to MongoDB",
  subtitle:
    "Separate the database service, administration tools, and Node driver, then follow a safe async connection and basic insert/read workflow.",
  estimatedMinutes: 50,
  difficulty: "applied",
  prerequisites: ["m3l02", "m3l04", "m3l05", "m3l07"],
  objectives: [
    "Distinguish MongoDB Community Server from the hosted MongoDB Atlas service.",
    "Tell the `mongod` server apart from Compass, `mongosh`, and the Node.js driver.",
    "Explain that the Node.js driver is an npm dependency installed with `npm install mongodb` and does not install or start a database server.",
    "Use the current `MongoClient` API with async/await, `try/finally`, and `close()` for resource cleanup.",
    "Select a database and collection, and describe implicit database/collection creation on a first write.",
    "Explain `insertOne`, `insertMany`, `find`, `findOne`, cursor `toArray`, and the shapes of their results.",
    "Keep the connection string and credentials in safe configuration, using `mongodb://localhost:27017` for a local no-auth example.",
    "Model document insertion and querying in browser memory without starting or contacting a database service.",
  ],
  sources: [
    {
      label: "MongoDB Node.js Driver — Connect to MongoDB",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/drivers/node/current/connect/",
    },
    {
      label: "MongoDB Node.js Driver — Insert Documents",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/drivers/node/current/crud/insert/",
    },
    {
      label: "MongoDB Node.js Driver — Find Documents",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/drivers/node/current/crud/query/retrieve/",
    },
    {
      label: "MongoDB Node.js Driver — Access Data From a Cursor",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/drivers/node/current/crud/query/cursor/",
    },
    {
      label: "MongoDB Community Server — Install",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/manual/administration/install-community/",
    },
    {
      label: "MongoDB Atlas Documentation",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/atlas/",
    },
    {
      label: "MongoDB Shell (`mongosh`) Documentation",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/mongodb-shell/",
    },
    {
      label: "MongoDB Compass Documentation",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/compass/",
    },
  ],
  sections: [
    {
      type: "context",
      body:
        "A MongoDB database server, an administration interface, and an application driver are separate tools. MongoDB Community Server can run on infrastructure you manage; MongoDB Atlas is a managed cloud database service. A Node.js application uses the official `mongodb` driver to communicate with a reachable MongoDB deployment. Compass is a graphical client and `mongosh` is an interactive shell; neither is the Node driver nor a replacement for the database server. The Node, driver, and database examples are illustrative only and are not run by Kōdo. The exercise uses only local in-memory objects and arrays, so no MongoDB installation is assumed.",
    },
    {
      type: "objectives",
      items: [
        "Distinguish MongoDB Community Server from the hosted MongoDB Atlas service.",
        "Tell the `mongod` server apart from Compass, `mongosh`, and the Node.js driver.",
        "Explain that the Node.js driver is an npm dependency installed with `npm install mongodb` and does not install or start a database server.",
        "Use the current `MongoClient` API with async/await, `try/finally`, and `close()` for resource cleanup.",
        "Select a database and collection, and describe implicit database/collection creation on a first write.",
        "Explain `insertOne`, `insertMany`, `find`, `findOne`, cursor `toArray`, and the shapes of their results.",
        "Keep the connection string and credentials in safe configuration, using `mongodb://localhost:27017` for a local no-auth example.",
        "Model document insertion and querying in browser memory without starting or contacting a database service.",
      ],
    },
    {
      type: "prose",
      title: "Know which MongoDB component does each job",
      paragraphs: [
        "MongoDB Community Server is a self-managed server distribution: an operator installs and runs it on an appropriate machine. Atlas is MongoDB's managed database service; MongoDB operates the database infrastructure while the application team configures and uses a deployment. These are different ways to provide a MongoDB deployment, not two names for the Node driver. Local Community Server is not assumed to be installed for this lesson or its exercise.",
        "The `mongod` process is the database server that accepts database connections and stores data. Compass is a graphical user interface for exploring and managing a deployment. `mongosh` is an interactive command-line shell for administration and queries. The `mongodb` Node.js driver is a library that application code imports to connect to the deployment and issue operations. Installing that npm package does not install, launch, or configure `mongod`.",
        "For a local development instance without authentication, a connection URI can be `mongodb://localhost:27017`. A hosted deployment supplies its own connection string; place credentials in protected environment configuration rather than source code. A connection URI identifies how the client reaches a server, while the `MongoClient` manages driver-side connections and operations.",
      ],
    },
    {
      type: "concept",
      title: "Install the application driver; choose the deployment separately",
      body:
        "In the Node project directory, add the official driver with `npm install mongodb`. This makes the library available to server-side application code and records it as a project dependency. It does not install Community Server or create an Atlas cluster. Before trying a live connection, the application still needs a reachable deployment, a valid URI, network access, and suitable credentials if authentication is enabled. An Atlas URI may include credentials, so provide it through an environment variable rather than committing it.",
      mentalModel:
        "The server stores and answers; the driver is application code that speaks MongoDB's protocol; Compass and `mongosh` are separate human-facing clients.",
      example: {
        language: "text",
        code: `# In a Node.js application directory:
npm install mongodb

# A local no-auth server's default URI:
mongodb://localhost:27017

# For a hosted deployment, read its URI from protected configuration instead.
# Do not paste real usernames, passwords, or tokens into source code.`,
        caption:
          "Illustrative setup commands and URI. Running the npm command installs a client library only; it does not provision a server.",
      },
      walkthrough:
        "Install the dependency in the application project so its package manifest and lockfile record the driver version. If a local Community Server is already running on the default port, the URI shown can address it. Otherwise use an available deployment URI supplied by your environment. Compass can help inspect data and `mongosh` can issue commands interactively, but application logic should use the Node driver. Keep secrets out of source control and public browser code.",
      pitfall:
        "Do not claim that `npm install mongodb` installs the database server, and do not assume a local `mongod` process exists. A hosted connection URI may contain credentials; never commit those credentials or expose them to browser-side code.",
    },
    {
      type: "concept",
      title: "Connect once with `MongoClient` and always clean up",
      body:
        "The current Node.js driver exposes `MongoClient` from the `mongodb` package. Construct a client from the connection URI, await `client.connect()`, and use `client.db(name)` and `db.collection(name)` to select data. Put work inside `try` and close the client in `finally`, so success and thrown operation errors both pass through cleanup. An outer `.catch()` can report the failure and set a non-zero process exit code. In a long-running application, create and reuse an appropriately managed client rather than opening and closing one for every request; this short example demonstrates a standalone task lifecycle.",
      mentalModel:
        "`MongoClient` is the Node program's managed doorway to a deployment: connect, perform awaited work through it, then close it when this short-lived program is done.",
      example: {
        language: "js",
        code: `// Illustrative Node.js server code — this browser lesson does not run it.
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db("campus");
    const books = db.collection("books");
    console.log("Ready to use the selected collection");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("MongoDB task failed", error);
  process.exitCode = 1;
});`,
        caption:
          "Illustrative ESM Node.js driver lifecycle. It uses a local default without credentials and an environment variable when another URI is configured.",
      },
      walkthrough:
        "`MongoClient` is constructed with the URI; `connect()` is awaited before operations so connection failures are handled in the same async flow. `client.db(\"campus\")` selects a database handle, and `db.collection(\"books\")` selects a collection handle. The `finally` block attempts cleanup whether the body succeeds or throws. The rejection from `main()` reaches the final catch, where the error is logged and `process.exitCode` marks the process unsuccessful without abruptly terminating it. In a deployed server, reuse the client for the server lifetime and close it during orderly shutdown instead of per request.",
      pitfall:
        "Do not omit `await` from asynchronous work or put `client.close()` only on the success path. Also avoid constructing a new client for every incoming web request; connection pooling is managed through a reusable client in a long-running application.",
    },
    {
      type: "concept",
      title: "Choose a database and collection; first writes can create them",
      body:
        "`client.db(\"campus\")` returns a handle for the named database, and `db.collection(\"books\")` returns a handle for the named collection. The handles let the application issue operations; merely asking for a handle is not the same as writing records or guaranteeing a durable database has already been created. When a database or collection does not exist, MongoDB can create it implicitly when the first write occurs. An explicit creation step is available when configuration such as collection options or indexes must be established before use.",
      mentalModel:
        "Selecting `client.db(name).collection(name)` addresses a namespace; a successful first insert is commonly what makes a new database and collection appear in stored data.",
      example: {
        language: "js",
        code: `// Illustrative handles; the write below is what may create the namespace.
const db = client.db("campus");
const books = db.collection("books");

const insertReceipt = await books.insertOne({
  title: "Dune",
  available: true,
});

console.log(insertReceipt.insertedId);`,
        caption:
          "The chosen database and collection are used for an insert. If they are new, MongoDB can create them on the first write.",
      },
      walkthrough:
        "The database handle is scoped to `campus`, and the collection handle is scoped to `books` in that database. The insert writes one document and the result exposes its `insertedId`; a driver normally supplies an ObjectId when `_id` was omitted. If these namespaces did not exist, the write can create them implicitly. For production setup requiring validators, indexes, or other collection configuration, manage that setup deliberately rather than relying only on implicit creation.",
      pitfall:
        "Do not conclude that calling `db()` or `collection()` alone proves data has been created. Those calls select handles; a write creates a missing namespace implicitly, and explicit setup may still be needed for indexes or validation.",
    },
    {
      type: "concept",
      title: "Insert documents and interpret write results",
      body:
        "Use `insertOne(document)` to add one document and `insertMany(documents)` to add an array of documents. Both are asynchronous driver operations, so await them before reading their result. A successful single insert returns an `insertedId`; a successful many-insert returns an `insertedCount` and an `insertedIds` mapping. The driver can generate unique ObjectIds for omitted `_id` fields. A duplicate key or other write error rejects the promise; `insertMany` may have already inserted some documents before a later error, depending on the failure and ordered setting, so do not treat its result as an all-or-nothing multi-document transaction.",
      mentalModel:
        "A write result reports what the server accepted; it is not the inserted document itself. Preserve or inspect the generated ID when later operations need to address that record.",
      example: {
        language: "js",
        code: `// Illustrative Node.js driver writes — not executed in the browser lesson.
const singleInsert = await books.insertOne({ title: "Dune", year: 1965 });
console.log(singleInsert.insertedId);

const batchInsert = await books.insertMany([
  { title: "Kindred", year: 1979 },
  { title: "Ancillary Justice", year: 2013 },
]);
console.log(batchInsert.insertedCount);
console.log(batchInsert.insertedIds);`,
        caption:
          "The inserted ID identifies a single record; the many-insert result reports its count and generated or supplied IDs.",
      },
      walkthrough:
        "The first call inserts one document and the result's `insertedId` identifies it. The second call receives an array, inserts those documents, then reports how many succeeded and which IDs were assigned. A failed request is handled as a rejected promise, which is why both operations belong inside appropriate error handling. Do not infer that a batch of inserts is automatically a transaction spanning every document; use a supported transaction only when its all-or-nothing semantics are required and configured.",
      pitfall:
        "Do not forget to await writes or assume `insertMany` returns an array of documents. It returns operation metadata, can reject on errors, and is not automatically equivalent to a multi-document transaction.",
    },
    {
      type: "concept",
      title: "Read with `findOne` or a cursor from `find`",
      body:
        "`findOne(filter)` resolves to one matching document or `null` when nothing matches. `find(filter)` returns a cursor rather than an array of results. For a small bounded result set, `await cursor.toArray()` collects the matching documents into an array; for large results, iterating the cursor avoids materializing everything at once. Filters use document field/value criteria, and an empty filter matches all documents in the collection. Apply appropriate filters and limits for the intended workload.",
      mentalModel:
        "`findOne` is one awaited document-or-null result; `find` creates a cursor that you consume, for example by awaiting `toArray()` for a suitably small result set.",
      example: {
        language: "js",
        code: `// Illustrative Node.js driver reads — not run here.
const firstMatch = await books.findOne({ title: "Dune" });
console.log(firstMatch); // document or null

const availableCursor = books.find({ available: true });
const availableBooks = await availableCursor.toArray();
console.log(availableBooks); // array of matching documents`,
        caption:
          "A single-document lookup yields a document or `null`; a multi-document query yields a cursor that can be collected as an array.",
      },
      walkthrough:
        "`findOne` takes a filter and resolves one matching document; a missing match is represented by `null`, not an exception solely because no record was found. `find` returns a cursor, so call `toArray()` and await it to collect the result. In this example the array may contain zero, one, or many documents. `toArray()` uses memory proportional to the result size, so use a limit or cursor iteration when results may be large. Returned data is still server data and should be checked before the application relies on optional fields.",
      pitfall:
        "Do not treat `find()` as a Promise for an array: it creates a cursor. Do not call `toArray()` on an unbounded collection for a potentially large result set, and handle `findOne()` returning `null`.",
    },
    {
      type: "mistakes",
      title: "Common first-connection mistakes",
      items: [
        {
          mistake: "Confusing Community Server or Atlas with the Node.js driver.",
          fix:
            "A deployment stores the data; the driver is a library used by Node application code to connect to it.",
        },
        {
          mistake: "Assuming Compass or `mongosh` is the database server or an npm dependency.",
          fix:
            "Compass is a GUI client and `mongosh` is an interactive shell. Both connect to a deployment; the app uses the Node driver.",
        },
        {
          mistake: "Assuming the local service is installed or running because the driver package was installed.",
          fix:
            "Arrange an accessible Community Server or Atlas deployment separately; the package only adds the driver to the project.",
        },
        {
          mistake: "Hard-coding a hosted username, password, or token in application code.",
          fix:
            "Read the complete URI from protected server-side configuration such as an environment variable and keep it out of version control.",
        },
        {
          mistake: "Closing the client only after successful operations or opening one client for every request.",
          fix:
            "Use `try/finally` for a short task. In a long-running server, reuse a client and close it during orderly shutdown.",
        },
        {
          mistake: "Treating a `find()` cursor as an array or assuming `findOne()` always returns a document.",
          fix:
            "Await `findOne()` and handle `null`; consume `find()` with a cursor operation such as `toArray()` for bounded results.",
        },
        {
          mistake: "Expecting database examples in the lesson to run in the browser exercise.",
          fix:
            "Keep Node and database snippets illustrative; practice the document logic with local arrays and objects only.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m3l08-ex01",
      title: "Model a book collection locally",
      description:
        "Implement insert and query behavior over an in-memory array of document-shaped objects. The browser exercise needs no database installation, imported package, or network connection.",
    },
    {
      type: "quiz",
      quizId: "m3l08-q",
    },
    {
      type: "summary",
      body:
        "MongoDB Community Server is self-managed, while Atlas is a managed database service. `mongod` is the server; Compass is a GUI; `mongosh` is an interactive shell; and the Node `mongodb` driver is an application library installed with npm. Use `MongoClient` with async/await and close a short-lived client in `finally`; long-running servers should reuse a client and close it during shutdown. Select a database and collection through the client, then use `insertOne`/`insertMany` and their write metadata. `findOne` resolves a document or `null`; `find` returns a cursor that can be collected with `toArray()` for bounded results. A local no-auth URI is `mongodb://localhost:27017`; store hosted credentials in protected configuration. The snippets are illustrative Node code, and the exercise practices only in-memory document logic.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m3l08-q",
    title: "Node.js and MongoDB practice check",
    questions: [
      {
        kind: "mcq",
        id: "m3l08-q1",
        prompt:
          "Which statement correctly distinguishes these MongoDB components?",
        options: [
          "`mongod` is the GUI, Compass is the server, and the driver is the shell.",
          "`mongod` is the database server, Compass is a GUI, `mongosh` is a shell, and the Node driver is an application library.",
          "Atlas is the Node.js npm package, and Community Server is an interactive shell.",
          "Installing Compass also installs and starts every MongoDB server.",
        ],
        correctIndex: 1,
        explanation:
          "The server stores and serves data; Compass and `mongosh` are human-facing clients; the Node driver is the library application code imports. Atlas is a managed deployment service.",
      },
      {
        kind: "truefalse",
        id: "m3l08-q2",
        prompt:
          "Running `npm install mongodb` installs the Node driver package but does not itself install or start a MongoDB database server.",
        correct: true,
        explanation:
          "The npm package is the application-side driver. A Community Server or Atlas deployment must be provided separately and be reachable.",
      },
      {
        kind: "code-output",
        id: "m3l08-q3",
        prompt:
          "What does `findOne` produce when no document matches its filter?",
        code:
          'const documents = [{ title: "Dune" }];\nconst matchedBook = documents.find((document) => document.title === "Solaris") ?? null;\nmatchedBook',
        language: "js",
        expected: "null",
        explanation:
          "The plain array model has no matching title, so it converts the missing result to `null`, matching the driver method's document-or-null result shape.",
      },
      {
        kind: "identify-bug",
        id: "m3l08-q4",
        prompt:
          "What is wrong with using this cursor result as though it were already an array?",
        code:
          "const books = collection.find({ available: true });\nconsole.log(books.length);",
        language: "js",
        options: [
          "`find()` returns a cursor, not an array with a result `length`; consume it, for example with `await books.toArray()` for a bounded result.",
          "`find()` only creates a collection and never reads data.",
          "The result is always `null`, even when matching documents exist.",
          "A cursor can only be used from Compass.",
        ],
        correctIndex: 0,
        explanation:
          "The Node driver `find()` returns a cursor. For a small result set, await `toArray()` to materialize an array; for larger result sets, iterate the cursor.",
      },
      {
        kind: "mcq",
        id: "m3l08-q5",
        prompt:
          "Why put `await client.close()` in a `finally` block in a short-lived database task?",
        options: [
          "It creates the database even when no write succeeds.",
          "It ensures cleanup is attempted after success or a thrown operation error.",
          "It retries all failed writes automatically.",
          "It converts all documents to JSON before returning.",
        ],
        correctIndex: 1,
        explanation:
          "`finally` runs as control leaves the `try` block, whether its body completes normally or throws, so resource cleanup is not limited to the success path.",
      },
      {
        kind: "truefalse",
        id: "m3l08-q6",
        prompt:
          "A local Community Server must be installed for a browser exercise that stores sample documents in a JavaScript array.",
        correct: false,
        explanation:
          "A plain in-memory array exists in the browser process and does not require a database installation, driver, or connection.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m3l08-ex01",
    lectureId: "m3l08",
    title: "Model a book collection locally",
    brief:
      "Implement `window.makeBookCollection()` using only a local array. The returned object must support `insertOne(document)`, `insertMany(documents)`, `find(filter)`, and `findOne(filter)`. Assign incrementing numeric `_id` values to inserted documents; return `{ insertedId }` for one insert and `{ insertedCount }` for many. Filters match all supplied top-level fields by strict equality. `find` returns an array of copies, and `findOne` returns a copy of the first match or `null`. This browser-only exercise models results in memory; do not import a package, start a server, or make a network request.",
    kind: "js",
    starter: `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only model. Keep documents in this page's local array.
      window.makeBookCollection = function makeBookCollection() {
        const documents = [];
        let nextId = 1;

        return {
          insertOne(document) {
            // TODO: store a copy with a numeric _id and return insertedId.
          },
          insertMany(newDocuments) {
            // TODO: insert each document and return insertedCount.
          },
          find(filter) {
            // TODO: return copies of all documents matching the filter.
          },
          findOne(filter) {
            // TODO: return a matching copy or null.
          },
        };
      };
    </script>
  </body>
</html>`,
    tests: [
      {
        kind: "js-result",
        expression:
          '(() => { const books = window.makeBookCollection(); return books.insertOne({ title: "Dune" }).insertedId; })()',
        expected: 1,
        description: "Returns an assigned ID after inserting one document",
      },
      {
        kind: "js-result",
        expression:
          '(() => { const books = window.makeBookCollection(); return books.insertMany([{ title: "Dune" }, { title: "Kindred" }]).insertedCount; })()',
        expected: 2,
        description: "Reports the number of inserted documents",
      },
      {
        kind: "js-result",
        expression:
          '(() => { const books = window.makeBookCollection(); books.insertOne({ title: "Dune", available: true }); books.insertOne({ title: "Kindred", available: false }); return books.find({ available: true }).length; })()',
        expected: 1,
        description: "Returns only documents matching all filter fields",
      },
      {
        kind: "js-result",
        expression:
          '(() => { const books = window.makeBookCollection(); books.insertOne({ title: "Dune" }); return books.findOne({ title: "Solaris" }); })()',
        expected: null,
        description: "Uses null when no single document matches",
      },
      {
        kind: "js-result",
        expression:
          '(() => { const books = window.makeBookCollection(); books.insertMany([{ title: "Dune" }, { title: "Kindred" }]); return books.find({}).length; })()',
        expected: 2,
        description: "Collects all local documents for an empty filter",
      },
    ],
    hints: [
      "Use `Object.entries(filter).every(...)` to require all supplied fields to match.",
      "Make one small helper inside the collection factory to assign an ID, store a copy, and return the ID.",
      "Build `insertMany` by applying the same local insertion logic to each document; count the inserted documents.",
      "Use `find` for an array and `findOne` for one match. Copy returned objects so callers do not receive the stored object reference.",
    ],
    solution: `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only model. Keep documents in this page's local array.
      window.makeBookCollection = function makeBookCollection() {
        const documents = [];
        let nextId = 1;

        function matches(document, filter) {
          return Object.entries(filter).every(
            ([key, value]) => document[key] === value,
          );
        }

        function insertOne(document) {
            const storedDocument = { ...document, _id: nextId };
            nextId += 1;
            documents.push(storedDocument);
            return { insertedId: storedDocument._id };
        }

        return {
          insertOne,
          insertMany(newDocuments) {
            for (const document of newDocuments) insertOne(document);
            return { insertedCount: newDocuments.length };
          },
          find(filter = {}) {
            return documents
              .filter((document) => matches(document, filter))
              .map((document) => ({ ...document }));
          },
          findOne(filter = {}) {
            const match = documents.find((candidate) =>
              matches(candidate, filter),
            );
            return match ? { ...match } : null;
          },
        };
      };
    </script>
  </body>
</html>`,
    solutionExplanation:
      "Each factory call creates a fresh private array and numeric ID sequence. `insertOne` stores a shallow copy and returns result metadata; `insertMany` reuses it for each input and counts successful local inserts. `find` returns matching copies in an array, while `findOne` returns one matching copy or `null`. The object models the shape and behavior of basic collection calls only; it neither persists information beyond the page nor provides MongoDB's server-side guarantees.",
  },
];
