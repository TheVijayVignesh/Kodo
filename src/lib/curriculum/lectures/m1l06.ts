import type { Lecture, Quiz, Exercise } from "../types";

export const lecture: Lecture = {
  id: "m1l06",
  module: 1,
  number: 6,
  title: "JS Data Types",
  subtitle:
    "Primitives, objects, the difference between null and undefined, and the surprising rules of equality and coercion that you will trip over without warning.",
  estimatedMinutes: 50,
  difficulty: "core",
  prerequisites: ["m1l05"],
  objectives: [
    "List the primitive types in JavaScript and recognise when each is the right choice.",
    "Distinguish null, undefined, and undeclared.",
    "Apply the rules of equality (== vs ===) and predict the outcome of unusual comparisons.",
    "Convert between types deliberately, not by accident.",
    "Use the type inspector to test your intuition.",
  ],
  sources: [
    { label: "Course slides — JS Data Types", type: "course" },
    { label: "MDN — JavaScript data types", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures" },
    { label: "MDN — Equality comparisons and sameness", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness" },
  ],
  sections: [
    {
      type: "context",
      body:
        "JavaScript has a small set of primitive types and one big category — objects — that holds everything else. The behaviour of the primitives, and the way the language decides whether two values are equal, governs a lot of the everyday friction in the language. Most bugs at this level come from implicit type coercion, and most of those are fixed by switching to === and explicitly converting when you mean to.",
    },
    {
      type: "objectives",
      items: [
        "Name the primitive types in JavaScript.",
        "Tell the difference between null, undefined, and undeclared variables.",
        "Predict the result of a == b and a === b for a range of inputs.",
        "Convert types deliberately using Number(), String(), and Boolean().",
        "Recognise the truthy/falsy list and avoid surprises.",
      ],
    },
    {
      type: "concept",
      title: "The primitive types",
      body:
        "JavaScript has seven primitive types: string, number, bigint, boolean, undefined, null, and symbol. Primitives are immutable: a string cannot be modified in place, only replaced with a new one. Anything that is not a primitive is an object — and that includes arrays, functions, dates, regexes, and the wrappers like Number and String.",
      example: {
        language: "js",
        code:
`const s = "tea";
typeof s;        // "string"

const n = 42;
typeof n;        // "number"

const big = 9007199254740993n;
typeof big;      // "bigint"

const on = true;
typeof on;       // "boolean"

const nothing = undefined;
typeof nothing;  // "undefined"

const empty = null;
typeof empty;    // "object"  — historical quirk

const sym = Symbol("id");
typeof sym;      // "symbol"`,
      },
    },
    {
      type: "concept",
      title: "null, undefined, and undeclared",
      body:
        "undefined is the value of a variable that has been declared but not assigned, the value of a function that returns nothing, and the value of a missing object property. null is a deliberate \"no value\". A variable that has never been declared at all is undeclared — accessing it throws a ReferenceError. typeof on an undeclared name is the special string 'undefined', which is why the loose check x == null catches both null and undefined.",
      example: {
        language: "js",
        code:
`let a;             // undefined (declared, not assigned)
let b = null;      // null
console.log(a);    // undefined
console.log(b);    // null

const obj = {};
obj.missing;       // undefined

try { neverDeclared } catch (e) { e.name }  // "ReferenceError"
typeof neverDeclared;                          // "undefined" — safe to query`,
      },
    },
    {
      type: "concept",
      title: "Equality — the most common source of bugs",
      body:
        "The == operator does type coercion. The === operator does not. The rule is simple: always use === unless you specifically want to test both null and undefined at the same time, in which case x == null is a deliberate idiom.",
      example: {
        language: "js",
        code:
`0 == ""        // true   — both coerce to 0
0 === ""       // false  — different types

null == undefined   // true
null === undefined  // false

"0" == false   // true   — string "0" → 0 → false
"0" === false  // false  — different types

NaN == NaN     // false  — NaN is not equal to anything, including itself
Number.isNaN(NaN)  // true  — the right way to check`,
        caption: "The cases where == and === disagree are the cases where the coercion hides a real difference.",
      },
    },
    {
      type: "concept",
      title: "Truthy and falsy",
      body:
        "When JavaScript needs a boolean — in an if, a while, a logical operator — it converts. The falsy values are: false, 0, -0, 0n, \"\" (empty string), null, undefined, and NaN. Everything else is truthy. The empty array and the empty object are both truthy. This is the most common gotcha for new JavaScript programmers.",
      example: {
        language: "js",
        code:
`Boolean(0)         // false
Boolean("")        // false
Boolean(null)      // false
Boolean([])        // true   — the empty array is truthy
Boolean({})        // true
Boolean("0")       // true   — the string "0" is truthy

if ([]) console.log("yes");  // logs "yes"`,
        caption: "The falsy list is short. Memorise it. Everything else is truthy, including empty arrays and objects.",
      },
    },
    {
      type: "concept",
      title: "Explicit conversion",
      body:
        "When you want to convert, do it explicitly. Number(x) converts a value to a number, returning NaN for anything that doesn't look like one. String(x) returns the string form. Boolean(x) returns the truthy/falsy equivalent. parseInt and parseFloat are for parsing strings that start with a number. +x is shorthand for Number(x).",
      example: {
        language: "js",
        code:
`Number("42")        // 42
Number("42.5px")    // NaN — does not parse
parseFloat("42.5px") // 42.5 — parses the leading number

String(42)          // "42"
String(true)        // "true"
String(null)        // "null"

Boolean("hello")    // true
Boolean("")         // false

+"42"               // 42  — unary plus
+true               // 1`,
      },
    },
    {
      type: "example",
      title: "Defensive comparison",
      code:
`function count(items) {
  // Defensive: items might be null, undefined, a number, or an array.
  if (items == null) return 0;          // catches both null and undefined
  if (typeof items === "number") return items;
  if (Array.isArray(items)) return items.length;
  return 0;
}

count(null);          // 0
count(undefined);     // 0
count(7);             // 7
count([1, 2, 3]);     // 3`,
      language: "js",
      walkthrough:
        "The == null check is the one place where the loose equality is the right tool — it covers both null and undefined in one expression. After that, the rest of the function uses === and Array.isArray, which never lie.",
    },
    {
      type: "interactive",
      componentKey: "TypeInspector",
      title: "Type inspector",
      description:
        "Type a JavaScript expression. The inspector evaluates it in a sandbox and shows the value, its typeof, and a few common comparisons.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with types",
      items: [
        {
          mistake: "Checking for an empty array with `arr == false`.",
          fix:
            "An empty array is truthy. Use arr.length === 0 to check whether an array is empty.",
        },
        {
          mistake: "Using == to compare to a number when the other side might be a string.",
          fix:
            "Use ===, or convert the input first: if (Number(input) === 0).",
        },
        {
          mistake: "Treating NaN as equal to itself.",
          fix: "NaN is the only value that is not equal to itself. Use Number.isNaN(x) to check.",
        },
        {
          mistake: "Using typeof on an undeclared identifier without realising it does not throw.",
          fix:
            "typeof on a name that has never been declared returns 'undefined' — useful, but a sign you have a typo somewhere.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m1l06-ex01",
      title: "Strictly compare two values",
      description:
        "Write a function that returns true only if the two inputs are strictly equal, both of the same type, and both not NaN.",
    },
    {
      type: "quiz",
      quizId: "m1l06-q",
    },
    {
      type: "summary",
      body:
        "JavaScript has seven primitive types. null is a deliberate absence; undefined is an accidental one. The == operator coerces; the === operator does not — use === except when checking for null and undefined together. The falsy list is short and worth memorising: false, 0, -0, 0n, \"\", null, undefined, NaN. The rest of the type behaviour of the language follows from those rules.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m1l06-q",
    title: "JS Data Types check",
    questions: [
      {
        kind: "mcq",
        id: "m1l06-q1",
        prompt: "What is `typeof null`?",
        options: ["\"null\"", "\"object\"", "\"undefined\"", "It throws a TypeError."],
        correctIndex: 1,
        explanation:
          "It returns \"object\" — a historical bug that has been preserved for compatibility. The check for null is therefore x === null.",
      },
      {
        kind: "code-output",
        id: "m1l06-q2",
        prompt: "What does this print?",
        code: "console.log(NaN === NaN);",
        language: "js",
        expected: "false",
        explanation:
          "NaN is the only value that is not equal to itself, even with ===. Use Number.isNaN(x) instead.",
      },
      {
        kind: "mcq",
        id: "m1l06-q3",
        prompt: "Which of these is the right way to check whether an array is empty?",
        options: [
          "arr == false",
          "arr === []",
          "arr.length === 0",
          "!arr",
        ],
        correctIndex: 2,
        explanation:
          "An empty array is truthy. arr === [] is always false (a new array is a new reference). arr.length === 0 is the correct check.",
      },
      {
        kind: "truefalse",
        id: "m1l06-q4",
        prompt: "The expression `0 == \"\"` is true.",
        correct: true,
        explanation:
          "With ==, both 0 and \"\" coerce to 0, so the comparison is true. With === the comparison is false because the types differ.",
      },
      {
        kind: "mcq",
        id: "m1l06-q5",
        prompt: "Which value is NOT falsy?",
        options: ["0", "\"\"", "null", "[]"],
        correctIndex: 3,
        explanation: "The empty array is truthy. The empty object is truthy. The only falsy values are false, 0, -0, 0n, \"\", null, undefined, and NaN.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m1l06-ex01",
    lectureId: "m1l06",
    title: "Strict equality that handles NaN",
    brief:
      "Write a function same(a, b) that returns true if a and b are strictly equal AND neither is NaN.",
    kind: "js",
    starter:
`function same(a, b) {
  // return true only if a and b are strictly equal, excluding NaN
}
`,
    tests: [
      { kind: "js-result", expression: "same(1, 1)", expected: true, description: "same(1, 1) is true" },
      { kind: "js-result", expression: "same('a', 'a')", expected: true, description: "same('a', 'a') is true" },
      { kind: "js-result", expression: "same(NaN, NaN)", expected: false, description: "same(NaN, NaN) is false" },
      { kind: "js-result", expression: "same(1, '1')", expected: false, description: "same(1, '1') is false" },
    ],
    hints: [
      "Strict equality excludes NaN, but === is also false for NaN. Combine a === b with a NaN check.",
      "Number.isNaN works on a single argument without coercion.",
    ],
    solution:
`function same(a, b) {
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  return a === b;
}`,
    solutionExplanation:
      "Number.isNaN handles each side independently. If either is NaN, the answer is false. Otherwise strict equality gives the right answer for every other case.",
  },
];
