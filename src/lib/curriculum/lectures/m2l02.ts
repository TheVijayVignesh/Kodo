import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l02",
  module: 2,
  number: 2,
  title: "MVC and ES6",
  subtitle:
    "Why the old patterns still matter, and the modern JavaScript syntax React relies on: modules, arrow functions, destructuring, classes, and the module pattern that ties it together.",
  estimatedMinutes: 55,
  difficulty: "core",
  prerequisites: ["m2l01"],
  objectives: [
    "Describe the Model-View-Controller pattern and how it shaped modern frameworks.",
    "Use ES6 module syntax: import and export, named and default.",
    "Write arrow functions, including the difference between arrow and method syntax for `this`.",
    "Use destructuring, the spread operator, and template literals.",
    "Recognise when a class is needed in modern React and when a function will do.",
  ],
  sources: [
    { label: "MDN — JavaScript Modules", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" },
    { label: "MDN — Destructuring assignment", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" },
    { label: "MDN — Arrow functions", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions" },
  ],
  sections: [
    {
      type: "context",
      body:
        "Before React, most web frameworks were organised around Model-View-Controller. The pattern is older than the web, but it shaped the design of every framework that came after. This lecture revisits MVC in modern terms, then turns to the ES6+ syntax that React assumes you know: modules, arrow functions, destructuring, spread, template literals, and a short tour of classes.",
    },
    {
      type: "objectives",
      items: [
        "Describe the Model-View-Controller pattern and how it shaped modern frameworks.",
        "Use ES6 module syntax: import and export, named and default.",
        "Write arrow functions, including the difference between arrow and method syntax for `this`.",
        "Use destructuring, the spread operator, and template literals.",
        "Recognise when a class is needed in modern React and when a function will do.",
      ],
    },
    {
      type: "prose",
      title: "MVC — the pattern that shaped everything after",
      paragraphs: [
        "The Model-View-Controller pattern comes from Smalltalk in the late 1970s. It says an application has three kinds of code: the Model (the data and the business rules), the View (the rendered output), and the Controller (the part that takes user input and updates the Model). The View reads from the Model; the Controller writes to it. Neither the View nor the Controller knows about the other except through the Model.",
        "Most server-side frameworks (Ruby on Rails, Django, Spring) follow MVC strictly. Most client-side frameworks before React (Backbone, AngularJS) follow it loosely. React does not follow it at all — it has components, not three buckets — but its unidirectional data flow comes from the same idea: data flows down, events flow up.",
      ],
    },
    {
      type: "concept",
      title: "ES6 modules — the file is the unit",
      body:
        "Every non-trivial JavaScript file is a module. A module has its own scope — variables declared at the top of the file are not global. To share values with other modules, use export. To use them, use import. The bundler (or the browser, in modern setups) wires the imports to the exports.",
      example: {
        language: "js",
        code:
`// math.js
export const pi = 3.14159;
export function add(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; }

// app.js
import multiply, { add, pi } from "./math";`,
        caption: "Named exports are imported with braces. A default export is imported without.",
      },
      walkthrough:
        "math.js exports three things: two named (pi and add) and one default (multiply). app.js imports them in a single line: the default first, then a brace-delimited list of named imports. This is the only legal order. A module can have any number of named exports but at most one default export.",
    },
    {
      type: "concept",
      title: "Arrow functions — the new default",
      body:
        "Arrow functions are a shorter way to write function expressions. The body can be a single expression (no return needed) or a block. Arrow functions do not bind their own `this`; they inherit it from the surrounding scope. This is one of the reasons they are common in callbacks and methods.",
      example: {
        language: "js",
        code:
`const add = (a, b) => a + b;
const square = x => x * x;
const double = n => ({ value: n * 2 });   // parens needed to return an object

items.map(item => item.title);
items.filter(item => item.done);
setTimeout(() => console.log("done"), 1000);`,
        caption: "Arrow functions everywhere. The implicit return with parens is the easy way to return an object literal.",
      },
      walkthrough:
        "An arrow with a single expression returns that expression. An arrow with a block needs an explicit return. Single-parameter arrows can drop the parens. These shortcuts make callbacks read more like the data they take, which is most of what JS does.",
    },
    {
      type: "concept",
      title: "Destructuring — pulling values out of objects and arrays",
      body:
        "Destructuring is a syntax for pulling values out of objects (or arrays) and binding them to local variables. The variable names on the left of the equals sign match the keys of the object on the right. Destructuring is everywhere in React: function parameters, hook return values, props, state.",
      example: {
        language: "js",
        code:
`const { name, year } = user;
const [first, second, ...rest] = items;

function Greeting({ name }) {
  return <p>Hello, {name}.</p>;
}

const [count, setCount] = useState(0);`,
        caption: "Destructuring is the pattern that makes React's API feel natural.",
      },
      walkthrough:
        "The first line pulls `name` and `year` out of the `user` object. The second line pulls the first two items out of the array, with the rest in a new array called `rest`. The third line is the component pattern: the function takes one prop, and we pull it out by name in the parameter list. The fourth is the hook pattern: useState returns a pair, and we destructure the pair into the value and the setter.",
    },
    {
      type: "concept",
      title: "Template literals and the spread operator",
      body:
        "Template literals are strings with backticks. They allow ${expression} interpolation and multi-line strings. The spread operator (...) expands an array or object into another array, or a list of arguments. In React, the spread operator is how you pass props down without naming them one by one.",
      example: {
        language: "js",
        code:
`const name = "Sora";
const greeting = \`Hello, \${name}.\`;

const base = { id: 1, name: "Task" };
const extended = { ...base, done: false };

<Card {...base} onClick={handleClick} />`,
        caption: "Template literals for readable strings; spread for forwarding props.",
      },
      walkthrough:
        "Template literals are readable and avoid the plus-sign concatenation that made older JavaScript hard to scan. Spread on objects is shallow — the new object has the same properties as the original, plus the new ones. In React, the common pattern is to spread an object of props onto a component: the component receives every key as a separate prop.",
    },
    {
      type: "concept",
      title: "Classes — when you still need them",
      body:
        "React 16 and earlier used class components heavily. React 19 deprecates them: the recommendation is to write function components for new code. There are still a few reasons to use a class: error boundaries (there is no hook equivalent yet), and some legacy codebases. The syntax is worth knowing because you will read it in older tutorials.",
      example: {
        language: "ts",
        code:
`class Counter extends React.Component {
  state = { count: 0 };
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        {this.state.count}
      </button>
    );
  }
}`,
        caption: "A class component. Modern React prefers the function component equivalent; this form is for legacy code.",
      },
      walkthrough:
        "A class component extends React.Component. The state field holds the component's state. The render method returns the JSX. setState schedules a re-render with the new state. Modern React has hooks (useState, useEffect) that do the same job with much less ceremony.",
    },
    {
      type: "example",
      title: "A small ES6 module in full",
      code:
`// users.js
const users = [
  { id: 1, name: "Sora", active: true },
  { id: 2, name: "Alex", active: false },
  { id: 3, name: "Mei", active: true },
];

export const activeUsers = users.filter(u => u.active);
export function findById(id) {
  return users.find(u => u.id === id) ?? null;
}

// app.js
import { activeUsers, findById } from "./users";

console.log(\`\${activeUsers.length} active users.\`);
console.log(findById(2));`,
      language: "js",
      walkthrough:
        "users.js declares an array at module scope and exports two functions that operate on it. app.js imports those functions. The `?? null` is the nullish coalescing operator: if find returns undefined, the result is null. This kind of small, focused module is the unit React apps are built from.",
    },
    {
      type: "interactive",
      componentKey: "JsPlayground",
      title: "ES6 playground",
      description: "Try the patterns above in the JavaScript console. Arrow functions, destructuring, template literals, spread — all live here.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with ES6 in React code",
      items: [
        {
          mistake: "Using an arrow function as an event handler that needs `this`.",
          fix: "Event handlers in classes are usually bound in the constructor or written as arrow properties. Function components don't have this problem — they receive props and that's it.",
        },
        {
          mistake: "Trying to destructure something that is null or undefined.",
          fix: "const { name } = user ?? {}; uses nullish coalescing to give a default. const { name } = user || {} is similar but also matches falsy values like 0 and empty string, which you usually don't want.",
        },
        {
          mistake: "Importing a default export with curly braces, or a named export without.",
          fix: "import multiply from \"./math\" (default, no braces). import { add, pi } from \"./math\" (named, with braces). The order of imports in a line is: default first, then named.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m2l02-ex01",
      title: "Build a small ES6 module",
      description: "Build a module that exports a list and a filter, then import it from a second file. Use the standard HTML/JS sandbox.",
    },
    {
      type: "quiz",
      quizId: "m2l02-q",
    },
    {
      type: "summary",
      body: "MVC shaped how we think about web apps for decades. React took the unidirectional data flow part of MVC and dropped the rest. ES6 modules, arrow functions, destructuring, spread, and template literals are the syntax that React assumes you know. Classes are still in older code; the rest of this course uses function components for new code.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l02-q",
    title: "MVC and ES6 check",
    questions: [
      {
        kind: "mcq",
        id: "m2l02-q1",
        prompt: "What does MVC stand for?",
        options: [
          "Model-View-Controller",
          "Module-View-Component",
          "Markup-Visual-Code",
          "Method-Variable-Class",
        ],
        correctIndex: 0,
        explanation: "Model-View-Controller. The pattern is from Smalltalk in the late 1970s.",
      },
      {
        kind: "code-output",
        id: "m2l02-q2",
        prompt: "What does this evaluate to?",
        code: "const { name, year } = { name: 'Sora', year: 3, active: true };\nname + ' (' + year + ')'",
        language: "js",
        expected: "Sora (3)",
        explanation: "Destructuring pulls name and year out of the object. The expression concatenates the two values with ' (' and ')'.",
      },
      {
        kind: "mcq",
        id: "m2l02-q3",
        prompt: "How do you import a default export?",
        options: [
          "import { default } from \"./module\";",
          "import default from \"./module\";",
          "import name from \"./module\";",
          "import * as name from \"./module\";",
        ],
        correctIndex: 2,
        explanation: "A default export is imported with a name and without braces. import multiply from \"./math\" works whether the export was default function multiply or default export { multiply }.",
      },
      {
        kind: "truefalse",
        id: "m2l02-q4",
        prompt: "Arrow functions do not bind their own `this`.",
        correct: true,
        explanation: "Arrow functions inherit `this` from the surrounding scope. This is one of the reasons they are the default in modern code: you don't accidentally get a new `this` inside a callback.",
      },
      {
        kind: "mcq",
        id: "m2l02-q5",
        prompt: "Which is the correct way to spread props onto a component?",
        options: [
          "<Card props={...} />",
          "<Card {...props} />",
          "<Card spread(props) />",
          "<Card [spread]={props} />",
        ],
        correctIndex: 1,
        explanation: "The spread operator is {...props}. React unpacks every key of the props object into a separate prop on the component.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [
  {
    id: "m2l02-ex01",
    lectureId: "m2l02",
    title: "ES6 module pattern",
    brief: "Write a small module that exports an array and a filter function. (Use the HTML/JS sandbox below for the conventional sandbox.)",
    starterCode: `// Use the regular JavaScript playground tab to solve this exercise.
function activeUsers(users) {
  return users.filter(function (u) { return u.active; });
}
const users = [
  { id: 1, name: "Sora", active: true },
  { id: 2, name: "Alex", active: false },
];
console.log(activeUsers(users).length);`,
    tests: [
      { kind: "no-error", description: "Code runs without throwing" },
    ],
    hints: [
      "Replace the function expression with an arrow function.",
      "The arrow form is the modern default.",
    ],
    solution: `const activeUsers = (users) => users.filter((u) => u.active);

const users = [
  { id: 1, name: "Sora", active: true },
  { id: 2, name: "Alex", active: false },
];

console.log(activeUsers(users).length);`,
    solutionExplanation:
      "The function expression is replaced with an arrow function. The inner callback is also an arrow. The output is 1.",
  },
];
