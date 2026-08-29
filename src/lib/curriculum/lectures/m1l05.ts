import type { Lecture, Quiz, Exercise } from "../types";

export const lecture: Lecture = {
  id: "m1l05",
  module: 1,
  number: 5,
  title: "JavaScript",
  subtitle:
    "The language that gives a document behaviour. Variables, control flow, functions, and the first programs that respond to the page.",
  estimatedMinutes: 60,
  difficulty: "core",
  prerequisites: ["m1l04"],
  objectives: [
    "Read and write JavaScript that uses variables, control flow, and functions.",
    "Choose between let, const, and var appropriately.",
    "Manipulate the DOM with vanilla JavaScript through a script tag.",
    "Use the console to inspect and debug.",
    "Decide between inline, internal, and external JavaScript.",
  ],
  sources: [
    { label: "Course slides — JavaScript", type: "course" },
    { label: "MDN — JavaScript", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { label: "MDN — JavaScript Guide", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
  ],
  sections: [
    {
      type: "context",
      body:
        "JavaScript is the language the browser runs after it has parsed the HTML and the CSS. It is the layer at which the page becomes interactive. This lecture covers the language itself — variables, expressions, control flow, functions, the console — and finishes with the three ways to attach JavaScript to a page.",
    },
    {
      type: "objectives",
      items: [
        "Declare variables with let, const, and (when reading older code) var.",
        "Use if, else, switch, for, while, and for-of to control flow.",
        "Write a function with parameters and a return value.",
        "Inspect a value in the console.",
        "Embed JavaScript inline, internally, and externally, and know the trade-offs.",
      ],
    },
    {
      type: "concept",
      title: "Variables — let, const, and the legacy of var",
      body:
        "Variables are named bindings. const declares a binding that cannot be reassigned. let declares a binding that can be. var is the legacy form: it has function scope (not block scope), allows redeclaration, and is hoisted. In modern code, prefer const by default, use let when you need to reassign, and avoid var entirely unless you are reading an old codebase.",
      example: {
        language: "js",
        code:
`const pi = 3.14159;          // cannot be reassigned
let counter = 0;              // can be reassigned
counter += 1;

if (true) {
  let scoped = "inside";      // block scope
  var alsoHere = "leaks out"; // function scope
}
console.log(scoped);  // ReferenceError
console.log(alsoHere); // "leaks out"`,
        caption: "let is block-scoped; var is function-scoped. In modern code, use let or const.",
      },
      walkthrough:
        "Inside the if block, `let scoped` lives only inside the braces. `var alsoHere` is hoisted to the top of the function and leaks out. This is the surprise that makes var dangerous — a variable declared deep inside a loop can be visible everywhere in the function.",
      pitfall:
        "const only protects the binding, not the value. const user = { name: 'A' }; user.name = 'B' is still legal. const means \"the variable will keep pointing to this object\" — not \"this object is frozen.\"",
    },
    {
      type: "concept",
      title: "Types and operators",
      body:
        "JavaScript has a small set of primitive types: string, number, bigint, boolean, undefined, null, and symbol. Anything that is not one of these is an object — including arrays and functions. The + operator is overloaded: with two numbers it adds, with a string it concatenates. The == operator does type coercion; === does not. Always prefer ===.",
      example: {
        language: "js",
        code:
`typeof "hi"      // "string"
typeof 42        // "number"
typeof null      // "object"   — historical quirk
typeof undefined // "undefined"
typeof []        // "object"

1 + 2      // 3
"1" + 2    // "12"
"1" - 2    // -1 (coerced to number)

null == undefined  // true
null === undefined // false`,
      },
      walkthrough:
        "The typeof null quirk has been preserved for compatibility with code written in 1995. The strict equality operator === avoids the surprises of == but loses the one useful case: x == null is the idiomatic way to check for either null or undefined in a single expression.",
    },
    {
      type: "concept",
      title: "Control flow",
      body:
        "if, else, and switch make decisions. for, while, and do-while repeat. for-of iterates over iterable values like arrays and strings. break exits a loop early; continue skips to the next iteration. Use Array.prototype methods like forEach, map, and filter when you can — they read more clearly than a manual for loop.",
      example: {
        language: "js",
        code:
`const items = ["tea", "rice", "matcha"];

for (const item of items) {
  console.log(item.toUpperCase());
}

const upper = items.map(item => item.toUpperCase());
// ["TEA", "RICE", "MATCHA"]

const short = items.filter(item => item.length <= 4);
// ["tea", "rice"]`,
      },
      walkthrough:
        "map returns a new array of the same length with each item transformed. filter returns a new array of items that pass the test. Both are pure — they do not mutate the original. Chaining them is the idiomatic way to express data transformations.",
    },
    {
      type: "concept",
      title: "Functions",
      body:
        "A function is a reusable block of behaviour. You declare it once and call it many times. Functions can take parameters and return values. If a function does not return anything, it returns undefined. Functions are values — they can be passed to other functions, returned from functions, and stored in variables. An arrow function is a shorter form: const add = (a, b) => a + b.",
      example: {
        language: "js",
        code:
`function greet(name) {
  return "Hello, " + name + ".";
}

const greet2 = (name) => \`Hello, \${name}.\`;

greet("Sora");      // "Hello, Sora."
greet2("Sora");     // "Hello, Sora."`,
        caption: "Two equivalent ways to write the same function. The arrow form is shorter and is the default in modern code.",
      },
      walkthrough:
        "Both functions do the same thing. The arrow form has no `this` binding — it inherits `this` from the surrounding scope. This is one of the reasons arrow functions are common in callbacks and methods: they don't introduce a new `this` that would break the call site.",
    },
    {
      type: "concept",
      title: "The console — your inspection tool",
      body:
        "The browser console is the developer's view into a running program. console.log prints a value. console.warn and console.error print with a coloured icon. console.dir prints an object's properties. console.table prints an array of objects as a table. To inspect, open the developer tools (F12 or Cmd-Opt-I) and look at the Console tab.",
      pitfall:
        "If console.log is silent, check that the script is actually loaded. A common mistake is a 404 on the script file, or a syntax error in the file that prevents it from running at all. The Console tab will tell you about both.",
    },
    {
      type: "concept",
      title: "Three ways to attach JavaScript to a page",
      body:
        "Inline JavaScript goes inside an HTML attribute (e.g., onclick=\"...\" on a button). Internal JavaScript goes inside a <script> tag in the page. External JavaScript is loaded from a separate file with <script src=\"...\">. Inline scripts mix behaviour with markup and are hard to maintain. Internal scripts are fine for a one-page demo. External scripts are the default for production code — they can be cached, versioned, and loaded in parallel.",
      example: {
        language: "html",
        code:
`<!-- Inline -->
<button onclick="alert('Hi')">Click me</button>

<!-- Internal -->
<script>
  document.querySelector('button').addEventListener('click', () => {
    alert('Hi');
  });
</script>

<!-- External -->
<script src="app.js" defer></script>`,
        caption: "Three styles of attaching JavaScript. defer is the safe default for an external script in the <head>.",
      },
      walkthrough:
        "defer is the right attribute for an external script in <head>: the script downloads in parallel with the HTML and runs after the document is parsed, but before DOMContentLoaded. The async attribute runs the script as soon as it is ready, which is fine for self-contained scripts but breaks any code that touches the DOM.",
    },
    {
      type: "example",
      title: "Hello, page",
      code:
`// A script that runs after the document is parsed.
console.log("Script started at", new Date().toLocaleTimeString());

const heading = document.querySelector("h1");
const button = document.querySelector("button");

if (heading) {
  console.log("Heading text:", heading.textContent);
}

button.addEventListener("click", () => {
  const next = button.textContent === "Click me"
    ? "Clicked!"
    : "Click me";
  button.textContent = next;
});`,
      language: "js",
      walkthrough:
        "The script reads from the document tree (querySelector) and attaches a click handler to a button. The handler toggles the button's text. Run this in the playground below to see the live output.",
    },
    {
      type: "interactive",
      componentKey: "JsPlayground",
      title: "JavaScript playground",
      description:
        "A sandbox where you can type JavaScript and see the console output. Try expressions, conditionals, and small functions.",
    },
    {
      type: "mistakes",
      title: "Common mistakes in JavaScript",
      items: [
        {
          mistake: "Using == instead of ===.",
          fix: "Use === to compare without implicit type coercion. The only time you should reach for == is to compare with null or undefined together: x == null.",
        },
        {
          mistake: "Putting a <script> in <head> without defer or async.",
          fix: "Either move the script to the end of <body>, or add the defer attribute. defer waits for the HTML to be parsed before running.",
        },
        {
          mistake: "Trying to read an element that does not exist yet.",
          fix: "Wrap the code in DOMContentLoaded, place the script at the end of <body>, or use defer on the <script> tag.",
        },
        {
          mistake: "Treating arrays and objects as deep-copied by assignment.",
          fix: "Assignment copies the reference, not the data. const a = b; a.x = 1 also changes b.x. Use spread ({...b}) or structuredClone to copy.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m1l05-ex01",
      title: "FizzBuzz, in the console",
      description:
        "Write a function fizzbuzz(n) that, for each number from 1 to n, logs the number — except replace multiples of 3 with \"Fizz\", multiples of 5 with \"Buzz\", and multiples of both with \"FizzBuzz\". Call it with n=15 and check the console output.",
    },
    {
      type: "quiz",
      quizId: "m1l05-q",
    },
    {
      type: "summary",
      body:
        "JavaScript is the language of behaviour. Variables hold values; const and let are the modern declarations, var is the legacy form. The language has a small set of primitive types and a large ocean of objects. Functions are values. The console is your inspection tool. Scripts can be inline, internal, or external — external is the production default. The rest of the module builds on this foundation.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m1l05-q",
    title: "JavaScript check",
    questions: [
      {
        kind: "mcq",
        id: "m1l05-q1",
        prompt: "Which declaration cannot be reassigned?",
        options: ["var", "let", "const", "static"],
        correctIndex: 2,
        explanation: "const binds the name to a value. The binding cannot be reassigned, although the value (if it's an object) can still be mutated.",
      },
      {
        kind: "code-output",
        id: "m1l05-q2",
        prompt: "What does the following print?",
        code: "console.log(typeof null);",
        language: "js",
        expected: "object",
        explanation:
          "typeof null returns \"object\" — a famous historical quirk in the language. The check for null is therefore `value === null`.",
      },
      {
        kind: "truefalse",
        id: "m1l05-q3",
        prompt: "Functions in JavaScript can be passed to other functions as arguments.",
        correct: true,
        explanation: "Functions are first-class values in JavaScript. They can be stored, passed, and returned.",
      },
      {
        kind: "mcq",
        id: "m1l05-q4",
        prompt: "Which is the safer comparison for most cases?",
        options: ["==", "===", "=", "<>"],
        correctIndex: 1,
        explanation:
          "=== compares without type coercion, which is almost always what you want. == coerces and produces surprising results.",
      },
      {
        kind: "mcq",
        id: "m1l05-q5",
        prompt: "What does `defer` do on a <script> tag?",
        options: [
          "Skips the script on slow networks.",
          "Downloads the script in parallel and runs it after the HTML has been parsed.",
          "Loads the script before the HTML.",
          "It is not a real attribute.",
        ],
        correctIndex: 1,
        explanation:
          "defer downloads the script in parallel with the HTML and executes it after the DOM is parsed. async downloads and runs as soon as it's ready, which is fine for self-contained scripts but not for code that touches the DOM.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m1l05-ex01",
    lectureId: "m1l05",
    title: "FizzBuzz, in the console",
    brief:
      "Write a function fizzbuzz(n) that, for each number from 1 to n, logs the number — except replace multiples of 3 with \"Fizz\", multiples of 5 with \"Buzz\", and multiples of both with \"FizzBuzz\". Call it with n=15 and check the console output.",
    kind: "js",
    starter:
`// Write the function here.
function fizzbuzz(n) {
  // your code
}

fizzbuzz(15);
`,
    tests: [
      { kind: "js-no-error", description: "Code runs without throwing" },
    ],
    hints: [
      "Loop from 1 to n inclusive.",
      "Check the most specific case first: divisible by both 3 and 5.",
      "console.log each value.",
    ],
    solution:
`function fizzbuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3 === 0) console.log("Fizz");
    else if (i % 5 === 0) console.log("Buzz");
    else console.log(i);
  }
}

fizzbuzz(15);`,
    solutionExplanation:
      "The check order matters. % 15 catches multiples of both before the individual checks, so 'FizzBuzz' wins over 'Fizz' or 'Buzz'. The output should be: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz.",
  },
];
