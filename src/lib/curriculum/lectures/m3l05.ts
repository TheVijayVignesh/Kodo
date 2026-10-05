import type { Exercise, Lecture, Quiz } from "../types";

export const lecture: Lecture = {
  id: "m3l05",
  module: 3,
  number: 5,
  title: "npm and Relational Data with MySQL",
  subtitle:
    "Read a Node project's dependency metadata, model structured rows and tables, and write practical SQL without mixing untrusted values into query text.",
  estimatedMinutes: 50,
  difficulty: "core",
  prerequisites: ["m3l02", "m3l04"],
  objectives: [
    "Read the purpose of common `package.json` fields and distinguish runtime dependencies from development dependencies.",
    "Tell an npm-installed package such as a MySQL driver apart from a built-in Node.js module.",
    "Describe relational databases in terms of schemas, tables, rows, columns, primary keys, and foreign keys.",
    "Write and interpret MySQL `CREATE TABLE`, `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statements.",
    "Explain how a Node.js MySQL driver binds values to placeholders and why untrusted input must not be interpolated into SQL.",
    "Model a parameterized lookup in browser JavaScript without importing a driver or connecting to a database.",
  ],
  sources: [
    {
      label: "npm CLI — package.json",
      type: "npm",
      url: "https://docs.npmjs.com/cli/v11/configuring-npm/package-json",
    },
    {
      label: "npm Docs — dependencies and devDependencies",
      type: "npm",
      url: "https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file",
    },
    {
      label: "Node.js API — Built-in modules",
      type: "node",
      url: "https://nodejs.org/api/modules.html#built-in-modules",
    },
    {
      label: "MySQL 8.4 Reference Manual — CREATE TABLE",
      type: "mysql",
      url: "https://dev.mysql.com/doc/refman/8.4/en/create-table.html",
    },
    {
      label: "MySQL 8.4 Reference Manual — SELECT",
      type: "mysql",
      url: "https://dev.mysql.com/doc/refman/8.4/en/select.html",
    },
    {
      label: "MySQL 8.4 Reference Manual — INSERT",
      type: "mysql",
      url: "https://dev.mysql.com/doc/refman/8.4/en/insert.html",
    },
    {
      label: "MySQL 8.4 Reference Manual — UPDATE",
      type: "mysql",
      url: "https://dev.mysql.com/doc/refman/8.4/en/update.html",
    },
    {
      label: "MySQL 8.4 Reference Manual — DELETE",
      type: "mysql",
      url: "https://dev.mysql.com/doc/refman/8.4/en/delete.html",
    },
    {
      label: "MySQL2 — Prepared Statements",
      type: "mysql",
      url: "https://sidorares.github.io/node-mysql2/docs/documentation/prepared-statements",
    },
  ],
  sections: [
    {
      type: "context",
      body:
        "A Node.js server often depends on packages that npm installs, then uses a database driver to exchange SQL with a database server. These are separate pieces: npm describes and installs packages, the driver handles the client connection and query results, and MySQL stores relational data. Database and Node.js snippets in this lesson are illustrative server-side examples, not code that the browser lesson runs. The exercise builds a query description from local strings only; it never imports a package or connects to SQL.",
    },
    {
      type: "objectives",
      items: [
        "Read the purpose of common `package.json` fields and distinguish runtime dependencies from development dependencies.",
        "Tell an npm-installed package such as a MySQL driver apart from a built-in Node.js module.",
        "Describe relational databases in terms of schemas, tables, rows, columns, primary keys, and foreign keys.",
        "Write and interpret MySQL `CREATE TABLE`, `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statements.",
        "Explain how a Node.js MySQL driver binds values to placeholders and why untrusted input must not be interpolated into SQL.",
        "Model a parameterized lookup in browser JavaScript without importing a driver or connecting to a database.",
      ],
    },
    {
      type: "prose",
      title: "A Node project records what it needs",
      paragraphs: [
        "`package.json` is a project's npm manifest. Its `name` and `version` identify the package; `scripts` names commands such as `npm run start`; `dependencies` lists packages the application needs at runtime; and `devDependencies` lists tools used to develop, test, or build it. For example, a server might install Express and a MySQL driver as runtime dependencies, while a watcher or test runner belongs in development dependencies.",
        "The version range in `package.json` expresses which releases may satisfy a dependency. A lockfile records the particular dependency resolution used by an install, and `node_modules` contains the installed package files. These are related but not interchangeable: editing a range is not the same as identifying the exact copy currently on disk.",
        "An installed package is different from a Node.js built-in. `mysql2` is a third-party package that a project installs with npm. `node:fs` is part of Node.js itself and does not need an npm package entry. The `node:` prefix makes that built-in-module intent explicit. A MySQL driver is also not the MySQL database server; it is the Node process's client library for communicating with that server.",
      ],
    },
    {
      type: "concept",
      title: "Package metadata and the driver role",
      body:
        "A small API's manifest might put `express` and `mysql2` under `dependencies` because its running server imports them. A local formatter or test tool belongs under `devDependencies`. Running `npm install mysql2` in that project's directory installs the package and records it as a dependency by default. npm does not turn the package into a built-in module, and a driver does not create or host the MySQL server.",
      mentalModel:
        "Think of `package.json` as the project's request for packages and version ranges, the lockfile as the resolved installation plan, `node_modules` as installed files, and the driver as the adapter between Node code and the MySQL server.",
      example: {
        language: "text",
        code: `{
  "name": "campus-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^5.0.0",
    "mysql2": "^3.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}`,
        caption:
          "Illustrative Node project metadata. This JSON describes package roles; it is not browser code or a database connection.",
      },
      walkthrough:
        "The manifest names two runtime packages and one development tool. The caret ranges are version ranges, not exact installed versions; the lockfile records the actual resolution for repeatable installs. `node:fs` would not appear in either dependency list because it ships with the Node.js runtime. This example includes no database credentials; credentials belong in protected server configuration, not source code or a published manifest.",
      pitfall:
        "Do not confuse a dependency name with a built-in module or assume that installing a driver installs MySQL itself. A package such as `mysql2` is installed into the Node project; `node:fs` comes with Node; the database server is a separate service.",
    },
    {
      type: "concept",
      title: "Relational data has a schema",
      body:
        "A relational database organizes named tables according to a schema. A table has columns, each with a declared type and optional constraints; a row contains one record's values for those columns. In the `students` table below, `id`, `name`, and `email` are columns, while one student's values make up a row. The schema states which shapes are valid before individual rows are stored.",
      mentalModel:
        "A table is a grid with rules: the schema defines the columns and constraints, each row is one record, and keys provide reliable ways to identify or relate records.",
      example: {
        language: "text",
        code: `CREATE TABLE students (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE enrollments (
  student_id INT NOT NULL,
  course_code VARCHAR(20) NOT NULL,
  PRIMARY KEY (student_id, course_code),
  FOREIGN KEY (student_id) REFERENCES students(id)
);`,
        caption:
          "Illustrative MySQL DDL, not run by the browser. The schema defines column types, constraints, and a relationship between tables.",
      },
      walkthrough:
        "`id` is the primary key: it uniquely identifies each student row, and `AUTO_INCREMENT` lets MySQL assign a new integer when an insert omits it. `NOT NULL` requires a value, and `UNIQUE` prevents duplicate email values. In `enrollments`, the composite primary key prevents the same student-course pair from being stored twice. Its foreign key requires `student_id` to refer to an existing student. A query result is typically a collection of rows with named column values; a Node driver returns that data to the application rather than rendering it as a web page.",
      pitfall:
        "A row number or a person's name is not automatically a stable identifier. Use declared keys for identity and relationships; do not assume an email is unique unless the schema enforces that rule.",
    },
    {
      type: "concept",
      title: "Create a table, then read and change rows",
      body:
        "SQL statements describe operations on the schema and its rows. `CREATE TABLE` defines a table; `SELECT` reads columns and matching rows; `INSERT` adds rows; `UPDATE` changes values in matching rows; and `DELETE` removes matching rows. A `WHERE` condition narrows the target set. Without it, an update or delete applies to every row in that table.",
      example: {
        language: "text",
        code: `-- Illustrative MySQL statements; the browser lesson does not execute SQL.
SELECT id, name, email
FROM students
WHERE id = 7;

INSERT INTO students (name, email)
VALUES ('Asha Rao', 'asha@example.test');

UPDATE students
SET email = 'asha.rao@example.test'
WHERE id = 7;

DELETE FROM students
WHERE id = 7;`,
        caption:
          "Illustrative MySQL DML. These fixed teaching literals are not built from user input; dynamic values must be bound separately.",
      },
      walkthrough:
        "The `SELECT` asks for only three columns and a row whose key is 7. A successful lookup may return zero rows or one row, so code must account for a missing match. `INSERT` names the columns receiving values and adds a row. `UPDATE` changes only the matching row because it has a key condition. `DELETE` removes only the row matching that condition. In production, operations are executed by a driver and return rows or mutation metadata such as an affected-row count; the SQL statements themselves do not run in this lesson.",
      pitfall:
        "An `UPDATE` or `DELETE` without a `WHERE` clause can change or remove every row. Check the intended predicate before running a mutation, and use a key or another carefully defined condition to select its target rows.",
    },
    {
      type: "concept",
      title: "Bind values instead of composing SQL with input",
      body:
        "A parameterized statement keeps the SQL structure separate from the values supplied at runtime. With MySQL2's `execute`, each `?` is a value placeholder and the values array supplies the corresponding values in order. The driver sends those values as data rather than parsing them as part of the SQL text. If a student enters text that looks like SQL, it stays a value for the `name` comparison instead of becoming new SQL syntax.",
      mentalModel:
        "The SQL string is the fixed question; the values array supplies answers to its marked slots. The database receives the statement structure and data separately.",
      example: {
        language: "js",
        code: `// Illustrative Node.js + mysql2/promise only — not runnable in a browser.
// Assume pool was configured by server-side application code; no credentials are shown.
const [rows] = await pool.execute(
  "SELECT id, name, email FROM students WHERE name = ?",
  [studentName],
);

const [change] = await pool.execute(
  "UPDATE students SET email = ? WHERE id = ?",
  [newEmail, studentId],
);

console.log(rows); // e.g. [{ id: 7, name: "Asha Rao", email: "asha@example.test" }]
console.log(change.affectedRows);`,
        caption:
          "Illustrative server-side driver calls. `execute` binds values to `?` placeholders; the browser neither imports mysql2 nor contacts a database.",
      },
      walkthrough:
        "The first array value fills the `name = ?` slot. In the update, `newEmail` fills the first placeholder and `studentId` fills the second, in that order. A `SELECT` returns matching rows; an update result reports whether any row matched, for example through `affectedRows`. Bound parameters protect values from changing the SQL structure, but they do not replace input validation, authorization, or correct `WHERE` conditions.",
      pitfall:
        "Never construct a statement by concatenating or interpolating untrusted input, even if the input appears harmless. A placeholder binds a value, not a table name or column name; if a query must choose among identifiers, select from a fixed allowlist and insert only that trusted identifier into the SQL structure.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with npm and SQL",
      items: [
        {
          mistake: "Putting a Node built-in such as `node:fs` in `dependencies`.",
          fix:
            "Built-ins are supplied by Node.js. Install third-party packages such as a driver with npm and record them in the appropriate dependency section.",
        },
        {
          mistake: "Treating the MySQL driver as the database server.",
          fix:
            "The driver runs inside the Node application and communicates with a separately managed MySQL server. Installing the package does not create a database or table.",
        },
        {
          mistake: "Building SQL by inserting a form value into a string.",
          fix:
            "Keep the SQL text fixed and pass the value in the driver's placeholder array. Never interpolate untrusted input; validate the value and enforce authorization separately.",
        },
        {
          mistake: "Assuming a placeholder can stand for a column or table name.",
          fix:
            "Bind data values with placeholders. For a dynamic identifier, choose from a fixed allowlist and construct only that trusted SQL structure.",
        },
        {
          mistake: "Running an update or delete without checking its row condition.",
          fix:
            "Use a deliberate `WHERE` predicate, commonly a primary key, and inspect the affected-row result where appropriate.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m3l05-ex01",
      title: "Build a bound student lookup",
      description:
        "Return a fixed SQL statement and a separate values array for a student-name lookup. The browser exercise models query construction only; it does not import mysql2, run SQL, connect to a database, or send a network request.",
    },
    {
      type: "quiz",
      quizId: "m3l05-q",
    },
    {
      type: "summary",
      body:
        "`package.json` records npm package metadata, scripts, and dependency ranges; a lockfile records a resolved install, and `node_modules` contains installed package files. Third-party packages such as `mysql2` are distinct from Node built-ins such as `node:fs`, and the driver is distinct from the MySQL server. A relational schema defines tables, typed columns, and constraints; rows hold records, primary keys identify them, and foreign keys relate them. SQL uses `CREATE TABLE`, `SELECT`, `INSERT`, `UPDATE`, and `DELETE` to define and work with data. Driver placeholders bind untrusted values separately from SQL text; never interpolate those values into a statement. The exercise models that separation in browser memory only.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m3l05-q",
    title: "npm and MySQL check",
    questions: [
      {
        kind: "mcq",
        id: "m3l05-q1",
        prompt:
          "Which statement correctly distinguishes a MySQL driver package from a Node.js built-in module?",
        options: [
          "Both are installed from npm and recorded in `dependencies`.",
          "`mysql2` is an npm package; `node:fs` is supplied by Node.js.",
          "`node:fs` is the MySQL server and `mysql2` is its schema format.",
          "A package listed in `devDependencies` becomes a Node.js built-in.",
        ],
        correctIndex: 1,
        explanation:
          "`mysql2` is a third-party driver installed with npm. `node:fs` is bundled with Node.js and does not need a package entry. The driver communicates with a separate MySQL server.",
      },
      {
        kind: "truefalse",
        id: "m3l05-q2",
        prompt:
          "An `UPDATE students SET email = 'new@example.test'` statement without a `WHERE` clause can change every row in the table.",
        correct: true,
        explanation:
          "Without a `WHERE` predicate, the statement applies to all rows. A key condition is commonly used to target one intended record.",
      },
      {
        kind: "code-output",
        id: "m3l05-q3",
        prompt:
          "In this browser-safe query model, what value remains in the bound parameter slot?",
        code:
          'const query = { sql: "SELECT id FROM students WHERE name = ?", values: ["\' OR 1=1 --"] };\nquery.values[0]',
        language: "js",
        expected: "' OR 1=1 --",
        explanation:
          "The SQL text keeps its single value placeholder, while the input stays in the separate `values` array. A real driver binds the value as data; this local object model does not execute a query.",
      },
      {
        kind: "identify-bug",
        id: "m3l05-q4",
        prompt:
          "What is the security problem in this server-side query construction?",
        code:
          'const sql = "SELECT id FROM students WHERE name = \'" + studentName + "\'";',
        language: "js",
        options: [
          "It selects a column instead of a table.",
          "It interpolates untrusted input into SQL text instead of binding a value.",
          "It uses a primary key more than once.",
          "It requires an npm development dependency.",
        ],
        correctIndex: 1,
        explanation:
          "String concatenation places the input in the SQL grammar. Use a fixed statement with a placeholder and pass `studentName` separately as a bound value. Merely surrounding the value with quotes does not make interpolation safe.",
      },
      {
        kind: "mcq",
        id: "m3l05-q5",
        prompt:
          "What does a primary key provide for a table?",
        options: [
          "A unique way to identify each row",
          "A list of npm package versions",
          "A guarantee that every query returns a row",
          "A connection from the browser to MySQL",
        ],
        correctIndex: 0,
        explanation:
          "A primary key uniquely identifies a row. It does not guarantee a lookup will match, and it is part of the database schema rather than npm or browser networking.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m3l05-ex01",
    lectureId: "m3l05",
    title: "Build a bound student lookup",
    brief:
      "Implement `window.buildStudentLookup(studentName)` so it returns `{ sql, values }`. Keep the SQL fixed as `SELECT id, name, email FROM students WHERE name = ?` and put the original `studentName` in the one-element `values` array. This browser-only model must not import a driver, interpolate the name, run SQL, connect to a database, or use the network.",
    kind: "js",
    starter: `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only model. Do not import a driver or contact a database.
      window.buildStudentLookup = function buildStudentLookup(studentName) {
        // TODO: return a fixed SQL string and a separate values array.
        return { sql: "", values: [] };
      };
    </script>
  </body>
</html>`,
    tests: [
      {
        kind: "js-result",
        expression: 'window.buildStudentLookup("Asha").sql',
        expected: "SELECT id, name, email FROM students WHERE name = ?",
        description: "Keeps the lookup SQL fixed with one value placeholder",
      },
      {
        kind: "js-result",
        expression: 'window.buildStudentLookup("Asha").values[0]',
        expected: "Asha",
        description: "Supplies the name separately as the bound value",
      },
      {
        kind: "js-result",
        expression: 'window.buildStudentLookup("\' OR 1=1 --").values[0]',
        expected: "' OR 1=1 --",
        description: "Leaves SQL-looking input in the values array",
      },
      {
        kind: "js-result",
        expression: 'window.buildStudentLookup("Asha").values.length',
        expected: 1,
        description: "Returns one value for the one placeholder",
      },
    ],
    hints: [
      "Write the SQL string literally; do not concatenate `studentName` into it.",
      "Return the input in `values: [studentName]` so its position matches the `?` placeholder.",
      "A browser object models the query shape only. The MySQL driver is not imported or called here.",
    ],
    solution: `<!doctype html>
<html lang="en">
  <body>
    <script>
      // Browser-only model. Do not import a driver or contact a database.
      window.buildStudentLookup = function buildStudentLookup(studentName) {
        return {
          sql: "SELECT id, name, email FROM students WHERE name = ?",
          values: [studentName],
        };
      };
    </script>
  </body>
</html>`,
    solutionExplanation:
      "The statement shape is constant and the supplied name stays in a separate one-element array. A server-side driver such as MySQL2 can bind that value to the placeholder, so SQL-looking input is data rather than statement syntax. This exercise only creates a local object in the browser; it does not import mysql2, run SQL, connect to MySQL, or make a network request.",
  },
];
