import type { Lecture, Quiz, Exercise } from "../types";

export const lecture: Lecture = {
  id: "m1l07",
  module: 1,
  number: 7,
  title: "JS Objects",
  subtitle:
    "The data structure that carries most of the language. Literals, properties, methods, references, the difference between copy and alias, and the bridge between JavaScript objects and JSON.",
  estimatedMinutes: 45,
  difficulty: "core",
  prerequisites: ["m1l06"],
  objectives: [
    "Construct and read object literals.",
    "Access and update properties with both dot and bracket notation.",
    "Use methods, this, and the prototype chain at a working depth.",
    "Distinguish a reference from a copy, and use the spread syntax and structuredClone to copy deliberately.",
    "Convert between objects and JSON.",
  ],
  sources: [
    { label: "MDN — Working with objects", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects" },
    { label: "MDN — Object", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object" },
    { label: "MDN — JSON", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON" },
  ],
  sections: [
    {
      type: "context",
      body:
        "Most of the data you will work with in a JavaScript program is, in the end, an object. A user is an object. A task is an object. The response from a server is an object. A React component receives an object of props. This lecture covers how objects are written, how their properties are read and changed, how methods work, and the difference between copying and sharing a reference.",
    },
    {
      type: "objectives",
      items: [
        "Construct an object literal with a few properties and a method.",
        "Read and update properties with dot and bracket notation.",
        "Explain how a method receives `this`.",
        "Use spread syntax to shallow-copy an object.",
        "Convert an object to JSON and back, knowing what is lost.",
      ],
    },
    {
      type: "concept",
      title: "Object literals",
      body:
        "An object literal is a pair of braces containing zero or more property–value pairs separated by commas. The property is a name (or a string) and the value can be anything: a primitive, an array, another object, or a function. Property names that are not valid identifiers need to be quoted.",
      example: {
        language: "js",
        code:
`const task = {
  id: 1,
  title: "Read the lecture",
  done: false,
  tags: ["web", "module-1"],
  author: { name: "Sora", year: 3 },
  toggle() { this.done = !this.done; },   // a method
};`,
        caption: "A simple object. The method is shorthand for `toggle: function() {...}`.",
      },
      walkthrough:
        "Every property has a key and a value. Methods are properties whose value is a function. Inside a method, `this` refers to the object the method is called on. The shorthand `toggle() {...}` is the same as writing `toggle: function() {...}`, which is the same as writing `toggle: () => {...}` except that the arrow form does not bind its own `this`.",
    },
    {
      type: "concept",
      title: "Reading and writing properties",
      body:
        "Two notations. Dot notation is shorter: task.title. Bracket notation uses a string: task[\"title\"]. Use bracket notation when the property name is dynamic (comes from a variable) or is not a valid identifier. Updating a property is just assignment: task.done = true. Adding a new property is the same syntax: task.due = \"tomorrow\". Deleting a property: delete task.due.",
      example: {
        language: "js",
        code:
`task.title;            // "Read the lecture"
task["title"];         // "Read the lecture"

const key = "done";
task[key];             // false
task[key] = true;
task.due = "tomorrow"; // add a property
delete task.due;       // remove it`,
      },
      walkthrough:
        "When the property name comes from a variable, bracket notation is the only option. Use the same syntax for adding, updating, and deleting. There is no difference between 'a property that did not exist' and 'a property whose value is undefined' — the in operator can tell them apart: 'due' in task is true if the key exists, regardless of value.",
    },
    {
      type: "concept",
      title: "Methods and `this`",
      body:
        "A method is a function stored as a property. When you call a method as object.method(), the keyword `this` inside the method refers to the object the call was made on. If you take the method off the object and call it on its own — `const f = obj.method; f();` — `this` is undefined (in strict mode) or the global object. The bind, call, and apply methods exist to set `this` explicitly.",
      example: {
        language: "js",
        code:
`const counter = {
  n: 0,
  inc() { this.n += 1; return this.n; },
};

counter.inc();      // 1 — this is counter
counter.inc();      // 2

const f = counter.inc;
f();                // TypeError — this is undefined

const bound = counter.inc.bind(counter);
bound();            // 3 — this is explicitly counter`,
      },
      pitfall:
        "Arrow functions do not have their own `this`. They inherit it from the surrounding scope. Use a regular method when you want `this` to point to the object; use an arrow function when you do not.",
    },
    {
      type: "concept",
      title: "References, not copies",
      body:
        "Objects in JavaScript are reference values. Assignment copies the reference, not the data. const a = b; a.x = 1 also changes b.x, because a and b are two names for the same object. To copy, use the spread operator ({...b}) for a shallow copy, or structuredClone for a deep copy.",
      example: {
        language: "js",
        code:
`const a = { x: 1, nested: { y: 2 } };
const b = a;            // b is a reference, not a copy
b.x = 10;
console.log(a.x);       // 10 — same object

const c = { ...a };     // shallow copy
c.x = 100;
c.nested.y = 200;
console.log(a.nested.y);  // 200 — the nested object is shared

const d = structuredClone(a);  // deep copy
d.nested.y = 999;
console.log(a.nested.y);  // 200 — the nested object is independent`,
      },
      walkthrough:
        "The spread copy shares the nested object. The deep copy does not. Use structuredClone when you have a tree of data and you need a real snapshot. structuredClone is built into the runtime — no library needed.",
    },
    {
      type: "concept",
      title: "Object.keys, values, and entries",
      body:
        "Three small methods that return iterables: Object.keys(o) gives the property names, Object.values(o) gives the values, Object.entries(o) gives [name, value] pairs. Useful for converting an object to an array, or for iterating with for-of or .map().",
      example: {
        language: "js",
        code:
`const task = { id: 1, title: "Read", done: false };

Object.keys(task);     // ["id", "title", "done"]
Object.values(task);   // [1, "Read", false]
Object.entries(task);  // [["id", 1], ["title", "Read"], ["done", false]]`,
      },
      walkthrough:
        "Object.entries is the most useful of the three — it pairs the key with the value, which is what you usually want when you iterate. Object.fromEntries is the inverse: it takes an array of [key, value] pairs and rebuilds an object.",
    },
    {
      type: "concept",
      title: "JSON — the language-agnostic wire format",
      body:
        "JSON (JavaScript Object Notation) is the format most APIs use to send and receive data. It is a subset of JavaScript object literal syntax, with two important restrictions: property names must be double-quoted, and values are restricted to primitives, arrays, and objects. JSON.stringify converts an object to a string; JSON.parse converts a string back. The conversion loses methods, undefined values, symbols, and circular references.",
      example: {
        language: "js",
        code:
`const task = { id: 1, title: "Read", done: false };

const text = JSON.stringify(task);
// '{"id":1,"title":"Read","done":false}'

const parsed = JSON.parse(text);
// { id: 1, title: "Read", done: false }`,
        caption: "JSON is plain text. It travels in HTTP bodies, in localStorage, in clipboard events. JavaScript objects do not.",
      },
      walkthrough:
        "The round trip is lossy: methods disappear, undefined values disappear, dates become strings, and circular references throw. This is why frameworks have their own serialisation formats (Next.js has its own server-component serialiser, for example) for richer data.",
    },
    {
      type: "example",
      title: "A small task manager",
      code:
`function createTask(title) {
  return {
    id: Math.random().toString(36).slice(2),
    title,
    done: false,
    toggle() { this.done = !this.done; },
  };
}

const tasks = [
  createTask("Read lecture"),
  createTask("Build lab"),
  createTask("Submit"),
];

const done = tasks.filter(t => t.done);
const remaining = tasks.filter(t => !t.done);
console.log(\`\${done.length} done, \${remaining.length} remaining\`);

const snapshot = JSON.parse(JSON.stringify(tasks));
// a safe copy of the data, with no methods`,
      language: "js",
      walkthrough:
        "createTask returns a fresh object each time. The toggle method lets the task mark itself done. The filter calls produce two new arrays. The JSON round-trip gives you a snapshot of the data without methods — useful for sending to a server or for restoring from localStorage.",
    },
    {
      type: "interactive",
      componentKey: "ObjectLab",
      title: "Object workbench",
      description:
        "Add and remove properties, then run the workbench to see the live object, its JSON form, and the output of Object.keys/values/entries.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with objects",
      items: [
        {
          mistake: "Assuming assignment copies the data.",
          fix: "Assignment copies the reference. Use { ...o } for a shallow copy, or structuredClone(o) for a deep copy.",
        },
        {
          mistake: "Forgetting that the JSON form loses methods.",
          fix: "Round-tripping through JSON gives you the data, not the behaviour. You will need to attach methods again when you re-hydrate the object.",
        },
        {
          mistake: "Using an arrow function as a method that needs `this`.",
          fix: "Arrow functions do not bind their own `this`. Use a regular method for object methods, an arrow function for callbacks inside them.",
        },
        {
          mistake: "Comparing two objects with ===.",
          fix: "=== on objects compares references, not contents. Two objects with the same properties are not ===. Use a deep comparison or a library for that.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m1l07-ex01",
      title: "Count completed tasks",
      description:
        "Write a function that takes an array of task objects (each with a `done` property) and returns the number that are done.",
    },
    {
      type: "quiz",
      quizId: "m1l07-q",
    },
    {
      type: "summary",
      body:
        "Object literals are the workhorse of the language. Properties are read with dot or bracket notation, written with assignment, removed with delete. Methods are functions stored as properties; `this` refers to the object the method is called on, except for arrow functions, which inherit it. Objects are references, so assignment aliases rather than copies. JSON is the way you send an object to a server, but the round trip loses methods and other non-data parts.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m1l07-q",
    title: "JS Objects check",
    questions: [
      {
        kind: "mcq",
        id: "m1l07-q1",
        prompt: "Which expression creates a shallow copy of an object?",
        options: ["const b = a;", "const b = { ...a };", "const b = a.copy();", "const b = clone(a);"],
        correctIndex: 1,
        explanation: "Spread syntax produces a shallow copy: top-level properties are duplicated, but nested objects are still shared.",
      },
      {
        kind: "code-output",
        id: "m1l07-q2",
        prompt: "What does this print?",
        code:
`const a = { x: 1 };
const b = a;
b.x = 10;
console.log(a.x);`,
        language: "js",
        expected: "10",
        explanation: "a and b point to the same object. Mutating b.x also changes a.x.",
      },
      {
        kind: "truefalse",
        id: "m1l07-q3",
        prompt: "JSON.stringify({a: undefined, b: () => 1}) preserves the function and the undefined value.",
        correct: false,
        explanation: "Functions and undefined values are dropped during JSON serialisation. Only data survives the trip.",
      },
      {
        kind: "mcq",
        id: "m1l07-q4",
        prompt: "Which of these is a method?",
        options: [
          "A property whose value is a primitive",
          "A property whose value is a function",
          "The object itself",
          "A property whose value is an object",
        ],
        correctIndex: 1,
        explanation: "A method is a function stored as a property of an object.",
      },
      {
        kind: "mcq",
        id: "m1l07-q5",
        prompt: "Why does this throw? `const obj = { greet: () => console.log(this.name) }; obj.greet();`",
        options: [
          "Arrow functions cannot be methods.",
          "The arrow function inherits `this` from the surrounding scope, which is not the object.",
          "obj.greet is not a function.",
          "this.name is a reserved word.",
        ],
        correctIndex: 1,
        explanation:
          "Arrow functions do not bind their own `this`. They inherit it from where they were defined, which here is the module scope, where this is undefined.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m1l07-ex01",
    lectureId: "m1l07",
    title: "Count completed tasks",
    brief:
      "Write a function countDone(tasks) that takes an array of task objects (each with a `done` boolean) and returns the number that are done.",
    kind: "js",
    starter:
`function countDone(tasks) {
  // return the number of tasks with done === true
}
`,
    tests: [
      { kind: "js-result", expression: "countDone([{done: true}, {done: false}, {done: true}])", expected: 2, description: "two done out of three" },
      { kind: "js-result", expression: "countDone([])", expected: 0, description: "empty array gives 0" },
      { kind: "js-result", expression: "countDone([{done: false}, {done: false}])", expected: 0, description: "none done gives 0" },
    ],
    hints: [
      "Use Array.prototype.filter, then take the length.",
      "Or use a for-loop with a counter.",
    ],
    solution:
`function countDone(tasks) {
  return tasks.filter(t => t.done).length;
}`,
    solutionExplanation:
      "filter returns a new array of tasks whose done is true. The length of that array is the count. This is the idiomatic functional form. A for-loop with a counter would also pass.",
  },
];
