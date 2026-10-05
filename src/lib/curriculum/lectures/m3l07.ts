import type { Exercise, Lecture, Quiz } from "../types";

export const lecture: Lecture = {
  id: "m3l07",
  module: 3,
  number: 7,
  title: "MongoDB Documents and Database Trade-offs",
  subtitle:
    "Model data as BSON documents, compare document and relational structures, and reason carefully about atomicity, CAP, and consistency choices.",
  estimatedMinutes: 50,
  difficulty: "core",
  prerequisites: ["m3l02", "m3l04", "m3l05"],
  objectives: [
    "Describe the database → collection → document hierarchy and compare it with relational tables, rows, columns, and fields.",
    "Distinguish JSON from BSON and identify values BSON can represent beyond JSON.",
    "Explain the purpose of `_id`, the default ObjectId, and flexible document schemas.",
    "Recognize create, read, update, and delete operations and their effects on documents.",
    "Explain single-document atomicity, MongoDB transactions, and ACID without assuming every write needs a multi-document transaction.",
    "Describe CAP as a consistency-versus-availability trade-off during a network partition, and use BASE as design vocabulary rather than a database category.",
    "Explain why a Node server uses a database server for durable, shared data, and identify database trade-offs when choosing a data model.",
    "Model document CRUD behavior in local browser memory without a database connection.",
  ],
  sources: [
    {
      label: "MongoDB Manual — Documents",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/manual/core/document/",
    },
    {
      label: "MongoDB Manual — BSON Types",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/manual/reference/bson-types/",
    },
    {
      label: "MongoDB Manual — Data Modeling",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/manual/data-modeling/",
    },
    {
      label: "MongoDB Manual — CRUD Operations",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/manual/crud/",
    },
    {
      label: "MongoDB Manual — Transactions",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/manual/core/transactions/",
    },
    {
      label: "MongoDB Manual — Replica Set Elections",
      type: "mongodb",
      url: "https://www.mongodb.com/docs/manual/core/replica-set-elections/",
    },
  ],
  sections: [
    {
      type: "context",
      body:
        "A web application commonly handles requests in a Node.js server and stores durable, shared records in a separate database server. The application owns request handling, validation, authorization, and business rules; the database server persists records and provides querying, indexes, constraints, and transaction behavior. Choosing a database is a trade-off involving data shape, query patterns, consistency needs, operations, and scale. MongoDB and SQL databases both support useful guarantees, but organize data differently. Node, driver, and database snippets are illustrative only and are not run by Kōdo; the exercise models documents with browser-local objects and arrays.",
    },
    {
      type: "objectives",
      items: [
        "Describe the database → collection → document hierarchy and compare it with relational tables, rows, columns, and fields.",
        "Distinguish JSON from BSON and identify values BSON can represent beyond JSON.",
        "Explain the purpose of `_id`, the default ObjectId, and flexible document schemas.",
        "Recognize create, read, update, and delete operations and their effects on documents.",
        "Explain single-document atomicity, MongoDB transactions, and ACID without assuming every write needs a multi-document transaction.",
        "Describe CAP as a consistency-versus-availability trade-off during a network partition, and use BASE as design vocabulary rather than a database category.",
        "Explain why a Node server uses a database server for durable, shared data, and identify database trade-offs when choosing a data model.",
        "Model document CRUD behavior in local browser memory without a database connection.",
      ],
    },
    {
      type: "prose",
      title: "From a Node request to durable data",
      paragraphs: [
        "A browser sends an HTTP request to an application server. Server-side code validates the request and applies the relevant business rules, then a database server can store or retrieve records so that they survive a process restart and can be shared by multiple requests or application instances. The Node application is a client of the database; it does not turn its own in-memory objects into durable, coordinated storage merely by running on a server.",
        "A database choice has trade-offs. A relational model offers declared table structures, joins, and mature constraints; a document model can keep related fields and arrays together and evolve record shapes more directly. Neither choice removes the need to design for access patterns, indexes, validation, concurrency, backups, security, and operational cost. A flexible document shape is useful when variation is real, but a database is not a substitute for thoughtful application and data modeling.",
      ],
    },
    {
      type: "concept",
      title: "Database, collection, document",
      body:
        "MongoDB groups data in databases. A database contains collections, and a collection contains documents. A document is a set of field-and-value pairs; values may include nested documents and arrays, so a related object can often be kept together. In the relational comparison, a database can contain tables, a table contains rows, a row contains values under columns, and each named value is a field. The mapping is useful but not exact: a MongoDB collection does not require every document to have identical fields, while a relational table is normally defined by a schema of columns and constraints.",
      mentalModel:
        "Database → collection → document is like a filing cabinet → folder → record, except a record can contain nested structures rather than only one flat row of columns.",
      example: {
        language: "js",
        code: `// Illustrative MongoDB document — data example only, not executed here.
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  title: "The Left Hand of Darkness",
  author: { name: "Ursula K. Le Guin", country: "US" },
  tags: ["science fiction", "classic"],
  available: true
}`,
        caption:
          "One document may combine scalar fields, a nested author document, and an array. The example uses MongoDB's shell-style ObjectId notation for illustration.",
      },
      walkthrough:
        "The database could be named `library`, the collection `books`, and this object one document inside it. `title` is a field whose value is a string; `author` is a nested document; `tags` is an array. In a relational design, the same facts might be split across a `books` table and an `authors` table, with columns in rows and a key relating the records. A MongoDB design should embed or reference related data according to how the application reads and updates it, not merely to imitate a relational schema.",
      pitfall:
        "Do not equate a collection with a fixed SQL table schema or assume that flexible shape means unstructured data. Documents still need consistent naming, validation, indexes, and a model that suits the queries the application actually makes.",
    },
    {
      type: "concept",
      title: "JSON describes values; BSON stores richer types",
      body:
        "JSON is a text data-interchange format with objects, arrays, strings, numbers, booleans, and null. MongoDB stores records as BSON: a binary representation of JSON-like documents with additional typed values. BSON supports values such as ObjectId, dates, binary data, 64-bit integers, and decimal values. A JavaScript object can look JSON-like in source while its BSON encoding preserves types that plain JSON does not directly represent. Converting to ordinary JSON may turn a date into text or otherwise lose type information or numeric precision; use an appropriate BSON or Extended JSON representation when those distinctions matter.",
      mentalModel:
        "JSON is a familiar notation for exchanging common values; BSON is the typed binary document format MongoDB uses for stored records and driver communication.",
      example: {
        language: "js",
        code: `// Illustrative JavaScript values; the driver encodes supported values as BSON.
const document = {
  title: "Field Notes",
  publishedAt: new Date("2026-03-12T00:00:00Z"),
  // MongoDB's BSON layer can also represent ObjectId, binary, and wider numeric types.
};`,
        caption:
          "A JavaScript Date is not the same stored type as a JSON string containing a date. MongoDB's BSON model includes types beyond JSON's native set.",
      },
      walkthrough:
        "The JavaScript source syntax is object-literal notation, not a promise that the stored representation is JSON text. With a MongoDB driver, supported values are encoded into BSON. A date can remain a BSON Date instead of being stored as an arbitrary string, and ObjectId is a distinct BSON type. If an application serializes a result to ordinary JSON for an HTTP response, it should decide how to represent special types for that API.",
      pitfall:
        "BSON is not simply another name for JSON and is not just a JSON text file. Do not compare dates as though they were all strings or assume every numeric type survives a JSON round trip unchanged.",
    },
    {
      type: "concept",
      title: "`_id`, ObjectId, and flexible schemas",
      body:
        "Each document in a standard MongoDB collection has a unique `_id` primary-key field. If an inserted document omits `_id`, the MongoDB driver ordinarily generates an ObjectId; the server can also generate one when needed. An ObjectId is a BSON value commonly used for document identity, not a secret or authorization token. Documents in one collection may have different fields, but applications can still enforce a chosen shape with server-side validation, TypeScript types, and input checks. Schema flexibility lets a model evolve; it does not remove the responsibility to manage compatibility between old and new records.",
      mentalModel:
        "`_id` answers which document this is. Schema flexibility answers which fields a document may contain—not whether those fields are valid for the application.",
      example: {
        language: "js",
        code: `// Two documents in the same collection can evolve independently.
{ _id: "book-1", title: "Dune", tags: ["science fiction"] }
{ _id: "book-2", title: "Kindred", tags: ["speculative fiction"], language: "en" }`,
        caption:
          "Human-readable IDs are used here only to make the example plain JSON-like data; MongoDB also commonly generates BSON ObjectIds.",
      },
      walkthrough:
        "Both examples have a title and tags, while only one has a `language` field. This is allowed by a flexible document model, but code that reads `language` must handle records where it is absent. In typical inserts, omit `_id` and let the driver generate a unique ObjectId unless the application has a well-designed unique key of its own. A primary key identifies data; it does not establish that a user is allowed to access that data.",
      pitfall:
        "Do not treat ObjectId as an access-control mechanism, and do not assume flexibility means every document in a collection should be arbitrary. Validate incoming values and plan schema changes so all application versions can handle stored records safely.",
    },
    {
      type: "concept",
      title: "CRUD names the basic document operations",
      body:
        "CRUD stands for create, read, update, and delete. In MongoDB, inserts such as `insertOne` and `insertMany` create documents; queries such as `find` and `findOne` read matching documents; update methods change matching documents; and delete methods remove matches. A filter chooses the target documents. An update can use operators such as `$set` to change selected fields rather than replacing the whole record. A read may find no match, so application code must allow for an absent result.",
      mentalModel:
        "Each CRUD action combines an operation with a target: create a document, read documents selected by a filter, update selected fields, or delete documents selected by a filter.",
      example: {
        language: "js",
        code: `// Illustrative Node.js driver operations; they are not run in this lesson.
await books.insertOne({ title: "Dune", available: true });
const book = await books.findOne({ title: "Dune" });
await books.updateOne(
  { title: "Dune" },
  { $set: { available: false } },
);
await books.deleteOne({ title: "Dune" });`,
        caption:
          "Illustrative CRUD operations for a server-side driver. `books` is assumed to be a selected MongoDB collection.",
      },
      walkthrough:
        "The insert adds a new document and ordinarily returns an inserted ID. `findOne` resolves to the first matching document or `null` when no document matches. `updateOne` applies `$set` to one match; `deleteOne` removes one match. Use a specific filter, especially for destructive changes, and check operation results when the application needs to know whether anything matched. The browser exercise uses the same ideas with an array, not these driver calls.",
      pitfall:
        "A filter is not a guarantee that one record exists. A broad or empty filter can match many records in multi-document operations, so choose and review mutation filters deliberately; do not assume an update or delete affected exactly one record unless its operation and filter ensure that.",
    },
    {
      type: "concept",
      title: "ACID, atomicity, and transaction scope",
      body:
        "ACID describes atomicity, consistency, isolation, and durability. MongoDB makes writes to a single document atomic, including changes to fields in that document. This is why related values that should change together are often modeled within one document when that shape also fits the application's reads. MongoDB also supports ACID transactions across multiple documents, collections, databases, and shards when an operation genuinely needs a larger all-or-nothing boundary. Transaction guarantees depend on configured concerns and deployment support; transactions are not a reason to skip good data modeling or error handling.",
      mentalModel:
        "A single-document write is already an atomic unit. Reach for a multi-document transaction when several records must commit or abort together as one business operation.",
      example: {
        language: "text",
        code: `// Conceptual example, not executable code:
One order document:
  { status: "paid", lines: [...], total: 42.50 }

If an operation must update both an order and a separate ledger record,
a transaction can group those document writes into one all-or-nothing unit.`,
        caption:
          "A document boundary can provide atomicity for fields stored together; a transaction is available for coordinated multi-document work.",
      },
      walkthrough:
        "If status and total live on one order document, a single-document operation can atomically change that record. If the business invariant requires an order update and a separate ledger update to succeed or fail together, a transaction can coordinate the operations. Atomicity means partial application is not exposed as a completed unit; durability and visibility also depend on the deployment and read/write concern settings. The application still needs to handle errors and define the right invariant.",
      pitfall:
        "Do not claim MongoDB lacks ACID transactions or that every operation needs a multi-document transaction. Single-document atomicity is built in; multi-document ACID transactions are supported when the use case calls for them.",
    },
    {
      type: "concept",
      title: "CAP and BASE describe distributed-system choices",
      body:
        "CAP discusses a distributed system when a network partition prevents some nodes from communicating. During that partition, a system cannot promise both a single consistent view for every operation (often described as linearizable consistency) and a successful response from every available side; it must make a trade-off for affected requests. CAP is not an unrestricted rule that every database simply chooses any two of consistency, availability, and partition tolerance under normal conditions. A distributed database must handle partitions as a possibility; its policies determine which requests it serves, delays, or rejects while communication is impaired. BASE—Basically Available, Soft state, Eventual consistency—is vocabulary often used for designs that favor availability and later convergence. It is not a label that categorically applies to every NoSQL product or every operation in MongoDB.",
      mentalModel:
        "CAP asks what a distributed service promises for requests affected by a partition—not which two features a database can keep forever in every circumstance.",
      example: {
        language: "text",
        code: `Network partition between two replica-set members:

Policy A: reject or wait on some writes until a primary/quorum is available
         → favor a consistent accepted-write history over serving every side.

Policy B: accept writes on separated sides
         → risk conflicting versions that must later be reconciled.

The exact behavior depends on topology, election, read/write concern, and client policy.`,
        caption:
          "A conceptual partition scenario. MongoDB replica-set elections and read/write settings affect actual operation behavior.",
      },
      walkthrough:
        "When nodes cannot communicate, one side may be unable to establish an authoritative primary or a sufficiently acknowledged write. Refusing some operations preserves stronger consistency expectations but reduces availability for those requests. Accepting work independently on both sides increases availability but requires a policy to resolve divergence and may expose less current reads. Outside a partition, this CAP trade-off framing does not say that systems cannot offer both consistency and availability. BASE provides a vocabulary for some availability-oriented strategies, not a universal classification of NoSQL databases.",
      pitfall:
        "Avoid the slogan “pick any two” without its partition condition. CAP's trade-off matters when communication is partitioned, and MongoDB's behavior depends on replica-set elections and the configured read/write concerns; BASE does not mean that all NoSQL systems are always eventually consistent.",
    },
    {
      type: "mistakes",
      title: "Common MongoDB modeling mistakes",
      items: [
        {
          mistake: "Calling a document a row and assuming its collection has a fixed set of columns.",
          fix:
            "Use the table/row/column comparison as a starting analogy, then account for nested values and flexible document shapes.",
        },
        {
          mistake: "Saying BSON and JSON are identical formats.",
          fix:
            "Remember BSON is MongoDB's binary document representation with additional typed values such as ObjectId and Date.",
        },
        {
          mistake: "Assuming schema flexibility makes input validation unnecessary.",
          fix:
            "Validate at the application boundary and use deliberate schema rules so multiple records and app versions remain compatible.",
        },
        {
          mistake: "Treating `_id` or ObjectId as proof of permission.",
          fix:
            "Use `_id` for identity; separately authenticate the requester and authorize access to the selected record.",
        },
        {
          mistake: "Claiming MongoDB is non-ACID or that all NoSQL systems are BASE/eventually consistent.",
          fix:
            "Distinguish single-document atomicity, supported multi-document ACID transactions, and workload-specific consistency choices.",
        },
        {
          mistake: "Explaining CAP as a database always choosing two of three properties.",
          fix:
            "State that the consistency/availability trade-off is exposed when a network partition occurs, and discuss the affected requests.",
        },
        {
          mistake: "Storing all application state only in a Node process and expecting it to be durable or shared.",
          fix:
            "Use an appropriate database service for persistence and shared access; the server application remains responsible for validating and authorizing requests.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m3l07-ex01",
      title: "Practice document CRUD in memory",
      description:
        "Implement a small local document collection using plain browser JavaScript arrays and objects. Practice filtering, inserting, updating, and deleting without contacting a database service.",
    },
    {
      type: "quiz",
      quizId: "m3l07-q",
    },
    {
      type: "summary",
      body:
        "MongoDB organizes a database into collections of field-and-value documents; relational tables, rows, and columns provide a useful but incomplete comparison. Documents are encoded as BSON, which supports types beyond JSON. A unique `_id` identifies each standard document, often using an automatically generated ObjectId, and flexible schemas still need validation. CRUD covers inserts, reads, updates, and deletes. MongoDB writes to one document atomically and also supports ACID transactions spanning multiple documents when needed. CAP describes the consistency-versus-availability trade-off for requests during a network partition, not an unrestricted database law; BASE is vocabulary for some eventual-consistency designs, not a universal NoSQL label. A Node application relies on a database server for durable shared data while handling its own request validation and business rules. The exercise models CRUD using only local browser objects and arrays.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m3l07-q",
    title: "MongoDB documents and trade-offs check",
    questions: [
      {
        kind: "mcq",
        id: "m3l07-q1",
        prompt:
          "Which comparison best describes the usual relational and MongoDB data units?",
        options: [
          "Table : document :: row : collection",
          "Table : collection :: row : document :: column : field",
          "Table : database :: row : index :: column : ObjectId",
          "A collection is a table whose documents must all share identical fields.",
        ],
        correctIndex: 1,
        explanation:
          "A table and collection group records; a row and document represent one record; columns and fields name values. The analogy is not exact because MongoDB documents can have nested values and flexible shapes.",
      },
      {
        kind: "truefalse",
        id: "m3l07-q2",
        prompt:
          "BSON is a binary document representation that supports values beyond JSON, including ObjectId and Date.",
        correct: true,
        explanation:
          "MongoDB stores records as BSON documents. BSON includes typed values that plain JSON does not directly represent.",
      },
      {
        kind: "code-output",
        id: "m3l07-q3",
        prompt:
          "In this plain local data model, how many documents match the filter?",
        code:
          'const books = [{ title: "Dune", available: true }, { title: "Kindred", available: false }];\nbooks.filter((book) => book.available).length',
        language: "js",
        expected: "1",
        explanation:
          "Only the Dune document has `available: true`. This plain JavaScript array models a query without contacting MongoDB.",
      },
      {
        kind: "identify-bug",
        id: "m3l07-q4",
        prompt:
          "What is the conceptual error in this statement about CAP?",
        code:
          '"Every database always picks any two of consistency, availability, and partition tolerance, even when the network is healthy."',
        language: "js",
        options: [
          "CAP's consistency/availability trade-off is about behavior when a network partition occurs.",
          "CAP only describes relational table design.",
          "Availability means a database may not respond under any conditions.",
          "Partition tolerance is the same thing as an SQL transaction.",
        ],
        correctIndex: 0,
        explanation:
          "CAP's familiar trade-off concerns requests affected by a network partition. It is misleading to present it as an unrestricted rule about any two properties in every normal operating condition.",
      },
      {
        kind: "mcq",
        id: "m3l07-q5",
        prompt:
          "Which statement about MongoDB write guarantees is accurate?",
        options: [
          "MongoDB has no atomic writes and cannot run ACID transactions.",
          "Only an entire database can be written atomically.",
          "Single-document writes are atomic, and multi-document ACID transactions are supported when needed.",
          "Every insert automatically starts a multi-document transaction.",
        ],
        correctIndex: 2,
        explanation:
          "MongoDB provides atomic writes for a single document and supports multi-document transactions for operations that require a larger all-or-nothing unit.",
      },
      {
        kind: "truefalse",
        id: "m3l07-q6",
        prompt:
          "The BASE label categorically applies to every NoSQL database and every operation it performs.",
        correct: false,
        explanation:
          "BASE is design vocabulary for some availability-oriented, eventually consistent approaches. It is not a universal label for every NoSQL product or operation.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m3l07-ex01",
    lectureId: "m3l07",
    title: "Practice document CRUD in memory",
    brief:
      "Implement `window.makeBookShelf()` as a plain in-memory collection. Return an object with `insertOne(document)`, `find(filter)`, `updateOne(filter, changes)`, and `deleteOne(filter)`. Each inserted document should receive an incrementing numeric `_id`; `find` returns copies of all documents whose top-level fields strictly match every field in the filter; `updateOne` changes only the first match and returns `{ modifiedCount }`; `deleteOne` removes only the first match and returns `{ deletedCount }`. This is a browser-only model using local arrays and objects; do not import a package, start a server, or make a network request.",
    kind: "js",
    starter: `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only document model. Work with local objects and an array.
      window.makeBookShelf = function makeBookShelf() {
        const documents = [];
        let nextId = 1;

        return {
          insertOne(document) {
            // TODO: copy the document, assign _id, store it, and return its ID.
          },
          find(filter) {
            // TODO: return copies matching every filter field.
          },
          updateOne(filter, changes) {
            // TODO: update only the first match and report modifiedCount.
          },
          deleteOne(filter) {
            // TODO: remove only the first match and report deletedCount.
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
          '(() => { const shelf = window.makeBookShelf(); return shelf.insertOne({ title: "Dune" }).insertedId; })()',
        expected: 1,
        description: "Assigns a local numeric identifier to a new document",
      },
      {
        kind: "js-result",
        expression:
          '(() => { const shelf = window.makeBookShelf(); shelf.insertOne({ title: "Dune", available: true }); return shelf.find({ available: true }).length; })()',
        expected: 1,
        description: "Reads documents matching every supplied field",
      },
      {
        kind: "js-result",
        expression:
          '(() => { const shelf = window.makeBookShelf(); shelf.insertOne({ title: "Dune", available: true }); return shelf.find({ available: false }).length; })()',
        expected: 0,
        description: "Returns an empty array when no document matches",
      },
      {
        kind: "js-result",
        expression:
          '(() => { const shelf = window.makeBookShelf(); shelf.insertOne({ title: "Dune", available: true }); return shelf.updateOne({ title: "Dune" }, { available: false }).modifiedCount; })()',
        expected: 1,
        description: "Updates one matching document",
      },
      {
        kind: "js-result",
        expression:
          '(() => { const shelf = window.makeBookShelf(); shelf.insertOne({ title: "Dune" }); shelf.deleteOne({ title: "Dune" }); return shelf.find({}).length; })()',
        expected: 0,
        description: "Removes the matching document from the local collection",
      },
    ],
    hints: [
      "Keep a private array and an incrementing number inside `makeBookShelf`; they model collection state for this page only.",
      "A filter matches when every `[key, value]` entry equals the corresponding top-level document field.",
      "Use `findIndex` to locate the first matching document for update and delete. Return a count of zero when it finds none.",
      "Use object spread to avoid storing the caller's original object reference or returning the stored reference directly.",
    ],
    solution: `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only document model. Work with local objects and an array.
      window.makeBookShelf = function makeBookShelf() {
        const documents = [];
        let nextId = 1;

        function matches(document, filter) {
          return Object.entries(filter).every(
            ([key, value]) => document[key] === value,
          );
        }

        return {
          insertOne(document) {
            const storedDocument = { ...document, _id: nextId };
            nextId += 1;
            documents.push(storedDocument);
            return { insertedId: storedDocument._id };
          },
          find(filter = {}) {
            return documents
              .filter((document) => matches(document, filter))
              .map((document) => ({ ...document }));
          },
          updateOne(filter, changes) {
            const index = documents.findIndex((document) =>
              matches(document, filter),
            );
            if (index === -1) return { modifiedCount: 0 };
            documents[index] = { ...documents[index], ...changes };
            return { modifiedCount: 1 };
          },
          deleteOne(filter) {
            const index = documents.findIndex((document) =>
              matches(document, filter),
            );
            if (index === -1) return { deletedCount: 0 };
            documents.splice(index, 1);
            return { deletedCount: 1 };
          },
        };
      };
    </script>
  </body>
</html>`,
    solutionExplanation:
      "The closure keeps the array and next numeric ID local to each shelf instance. `insertOne` copies and stores a document, `find` compares all supplied top-level filter fields and returns copies, and update/delete locate and affect only the first match. This intentionally small browser model illustrates CRUD ideas; it does not persist data after the page ends and does not implement MongoDB's full query, validation, concurrency, or storage behavior.",
  },
];
