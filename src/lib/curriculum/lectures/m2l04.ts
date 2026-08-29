import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l04",
  module: 2,
  number: 4,
  title: "Quiz",
  subtitle:
    "A focused assessment of the last three lectures: React, MVC and ES6, JSX and components. Take it before moving on.",
  estimatedMinutes: 25,
  difficulty: "core",
  prerequisites: ["m2l03"],
  objectives: [
    "Recall the shape of a React component and the rules of JSX.",
    "Apply ES6 patterns — modules, destructuring, arrow functions, spread.",
    "Identify the correct way to pass props and render lists.",
    "Recognise common mistakes before they happen.",
  ],
  sources: [
    { label: "React — Quick Start", type: "react", url: "https://react.dev/learn" },
    { label: "MDN — JavaScript Modules", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" },
  ],
  sections: [
    {
      type: "context",
      body:
        "This lecture is a focused assessment of everything you have learned in the first three lectures of Module 2. There is no new material here — only a longer quiz, and a few reflective prompts. Take your time. The answers to the questions in the quiz are the same patterns you have already seen in the lecture content.",
    },
    {
      type: "objectives",
      items: [
        "Recall the shape of a React component and the rules of JSX.",
        "Apply ES6 patterns — modules, destructuring, arrow functions, spread.",
        "Identify the correct way to pass props and render lists.",
        "Recognise common mistakes before they happen.",
      ],
    },
    {
      type: "prose",
      title: "How to approach this quiz",
      paragraphs: [
        "The quiz has ten questions. Six test the code, four test the conceptual model. You can submit as many times as you like. Each submission is graded; the questions you got wrong come with an explanation.",
        "After the quiz, there is one short writing exercise. You will not be graded on the writing — the goal is to make you put the patterns in your own words.",
      ],
    },
    {
      type: "diagram",
      kind: "react-render",
      caption: "The shape of a render: state change → re-render → diff → patch DOM. This diagram will recur throughout the rest of the module.",
    },
    {
      type: "prose",
      title: "Reflect: what still feels unclear?",
      paragraphs: [
        "Take a moment to write down the things in the last three lectures that did not click the first time you read them. Then check the next lecture — Lecture 5 is the deep dive into the second half of JSX, components, and props. The patterns that feel uncertain now are the ones that lecture will pick up.",
        "If you are comfortable with everything, skip to Lecture 5. If something is still uncertain, the worked examples and the new interactive section will help.",
      ],
    },
    {
      type: "interactive",
      componentKey: "ReactSandbox",
      title: "Warm-up sandbox",
      description: "Open the React sandbox and build the smallest thing that feels hard: a component that takes a list and renders it. The next lecture builds on this.",
    },
    {
      type: "quiz",
      quizId: "m2l04-q",
    },
    {
      type: "prose",
      title: "A note on reviewing your answers",
      paragraphs: [
        "When you finish the quiz, do not just look at the score. Click the explanation on every question you got wrong, and the ones you got right by guessing. The explanation is the lesson — it is the same content the lecture had, but compressed to the part the question was actually testing.",
      ],
    },
    {
      type: "summary",
      body: "Use this quiz as a checkpoint, not a gate. The point is to surface the things you do not yet have a grip on, and to point you back at the lectures that cover them. Lecture 5 is the deep dive into the second half of JSX and components. Lecture 6 is the deep dive into state. After that, the rest of the module is about how the same patterns show up in larger applications.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l04-q",
    title: "Module 2 mid-check",
    questions: [
      {
        kind: "mcq",
        id: "m2l04-q1",
        prompt: "Which is the right name for a function component?",
        options: ["myComponent", "MyComponent", "my_component", "MY_COMPONENT"],
        correctIndex: 1,
        explanation: "React distinguishes components from elements by the leading capital letter. <MyComponent /> is a component; <myComponent /> would be a real HTML element (and would not work as a tag).",
      },
      {
        kind: "code-output",
        id: "m2l04-q2",
        prompt: "What does this print?",
        code: "const { a, b, ...rest } = { a: 1, b: 2, c: 3, d: 4 };\nJSON.stringify(rest);",
        language: "js",
        expected: "{\"c\":3,\"d\":4}",
        explanation: "Object destructuring with rest collects the remaining properties into a new object. a and b are pulled out, c and d are collected into rest.",
      },
      {
        kind: "mcq",
        id: "m2l04-q3",
        prompt: "Where do children passed between a component's tags go?",
        options: [
          "They are ignored",
          "They are passed as the `children` prop",
          "They are appended to the parent element automatically",
          "They must be referenced with refs",
        ],
        correctIndex: 1,
        explanation: "Children is the special prop. The receiving component decides where in its template to place it.",
      },
      {
        kind: "truefalse",
        id: "m2l04-q4",
        prompt: "Class components are the recommended way to write new React code.",
        correct: false,
        explanation: "React's official recommendation is function components with hooks for new code. Classes are still in older code, but new code should not start with them.",
      },
      {
        kind: "mcq",
        id: "m2l04-q5",
        prompt: "Which is the right key for a list item?",
        options: ["Math.random()", "The array index", "A stable identifier from the data", "Always 0 for the first item"],
        correctIndex: 2,
        explanation: "The key must be stable and unique among siblings. A stable id from the data is the right choice.",
      },
      {
        kind: "mcq",
        id: "m2l04-q6",
        prompt: "How do you import a default export?",
        options: [
          "import { default } from \"./module\"",
          "import name from \"./module\"",
          "import * as default from \"./module\"",
          "import \"./module\" as default",
        ],
        correctIndex: 1,
        explanation: "Default exports are imported with a name, no braces. import multiply from \"./math\" works whether the export was `export default function multiply` or `export default { multiply }`.",
      },
      {
        kind: "code-output",
        id: "m2l04-q7",
        prompt: "What does this component render?",
        code: "function Greeting({ name = 'friend' }) {\n  return <p>Hi, {name}</p>;\n}\n\n<Greeting />",
        language: "tsx",
        expected: "<p>Hi, friend</p>",
        explanation: "The component destructures name with a default value of 'friend'. When the component is called with no props, the default is used.",
      },
      {
        kind: "mcq",
        id: "m2l04-q8",
        prompt: "Which is the correct way to render a list of items?",
        options: [
          "items.forEach(item => <li>{item}</li>)",
          "items.map(item => <li key={item.id}>{item.title}</li>)",
          "for (let i = 0; i < items.length; i++) <li>{items[i]}</li>",
          "<for><li>{items}</li></for>",
        ],
        correctIndex: 1,
        explanation: "Arrays are rendered with .map. The returned array of JSX is fine because each element has a stable key. forEach returns undefined. A for loop with inline JSX inside curly braces is awkward and lacks the key. There is no <for> element.",
      },
      {
        kind: "truefalse",
        id: "m2l04-q9",
        prompt: "JSX expressions can include any JavaScript value, including objects and arrays.",
        correct: true,
        explanation: "Anything inside curly braces is evaluated as JavaScript. React renders arrays of elements, strings, numbers, and other primitives directly. Objects are not valid React children.",
      },
      {
        kind: "mcq",
        id: "m2l04-q10",
        prompt: "What is the role of ReactDOM?",
        options: [
          "To define components",
          "To render components into an existing DOM element",
          "To replace native DOM APIs",
          "To run the dev server",
        ],
        correctIndex: 1,
        explanation: "React is the library that defines components and the rendering model. ReactDOM is the package that knows how to mount a component tree into a browser DOM element. On native platforms (iOS, Android), the equivalent package is react-native.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [];
