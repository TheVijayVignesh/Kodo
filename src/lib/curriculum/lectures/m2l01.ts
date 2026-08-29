import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l01",
  module: 2,
  number: 1,
  title: "React",
  subtitle:
    "A library for building user interfaces out of components. Why declarative UI exists, what React does, and how the component model changes the way you think.",
  estimatedMinutes: 45,
  difficulty: "foundational",
  prerequisites: ["m1l07", "m1l08"],
  objectives: [
    "Explain what React is and the problem it solves.",
    "Describe the component model and how components compose.",
    "Write a small functional component that returns JSX.",
    "Render a component with ReactDOM and see the result in a browser.",
    "Read the official React documentation and find what you need.",
  ],
  sources: [
    { label: "MDN — React", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started" },
    { label: "React — Quick Start", type: "react", url: "https://react.dev/learn" },
    { label: "React — Thinking in React", type: "react", url: "https://react.dev/learn/thinking-in-react" },
  ],
  sections: [
    {
      type: "context",
      body:
        "React is the library most modern front-end code is built on. This lecture is its first chapter: what the library actually does, why the component model exists, and what the code looks like when you run it. We will not write a full application here — that is the work of the rest of the module. The goal is to leave this lecture knowing how to read a React file and what questions to ask.",
    },
    {
      type: "objectives",
      items: [
        "Explain what React is and the problem it solves.",
        "Describe the component model and how components compose.",
        "Write a small functional component that returns JSX.",
        "Render a component with ReactDOM and see the result in a browser.",
        "Read the official React documentation and find what you need.",
      ],
    },
    {
      type: "prose",
      title: "Why React exists",
      paragraphs: [
        "Before React, the dominant pattern was to reach into the DOM by hand. You had a list of tasks, the user added one, and your code called `parent.appendChild(newItem)`. Then the user edited a field, and your code called `input.value = newValue`. Then the user deleted one, and your code called `list.removeChild(target)`. The work was mechanical and repetitive, and bugs were easy to introduce — forget to update one place and the UI was inconsistent with the data.",
        "React's answer is to change the mental model. You no longer describe how to update the DOM. You describe what the DOM should look like, given the current data. The library works out the minimum set of changes and applies them. This is the declarative UI idea: you say what should be on screen, the library makes it so.",
        "This idea is older than React — it shows up in Elm, in SwiftUI, in Jetpack Compose. React was the first library to make this style of programming mainstream on the web, and it remains the most popular.",
      ],
    },
    {
      type: "concept",
      title: "Components — the unit of UI",
      body:
        "A component is a function that returns what should be on screen. The function takes a single argument — an object of inputs called props — and returns a description of the UI. The library takes that description and turns it into real DOM nodes.",
      mentalModel:
        "Think of a component as a recipe. The props are the ingredients, the returned JSX is the dish. The same recipe with different ingredients produces a different dish. The recipe itself does not change.",
      example: {
        language: "tsx",
        code:
`function Greeting({ name }) {
  return <p>Hello, {name}.</p>;
}

<Greeting name="Sora" />`,
        caption: "A function component and how it is used. The function takes props and returns JSX.",
      },
      walkthrough:
        "The function Greeting takes one prop, name. It returns a paragraph containing the name. The second line is JSX that uses the component: <Greeting name=\"Sora\" />. JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. The <Greeting /> tag is a component, not a real HTML element — React calls the function, gets back JSX, and renders the result.",
    },
    {
      type: "diagram",
      kind: "react-render",
      caption: "React: state change → re-render → diff → patch DOM.",
    },
    {
      type: "concept",
      title: "JSX — the syntax you write",
      body:
        "JSX looks like HTML but is actually JavaScript. The < and > characters delimit either a real HTML element or a component. A lowercase name like <div> means a real element; a capitalised name like <Greeting> means a component. Expressions in JSX are written inside curly braces. A component must return a single root element, or a fragment (<>...</>), or an array.",
      example: {
        language: "tsx",
        code:
`function Card({ title, body }) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  );
}`,
        caption: "A component that returns a tree of elements. Expressions go in curly braces; attributes use camelCase like className.",
      },
      walkthrough:
        "className is the JSX way of writing the HTML class attribute (because class is a reserved word in JavaScript). The {title} and {body} are expressions — anything inside the braces is evaluated as JavaScript. A string, a number, a function call, a ternary — all valid. The component returns one root element (the <article>), which contains two children.",
    },
    {
      type: "concept",
      title: "ReactDOM — putting it on the page",
      body:
        "React is the library that defines components. ReactDOM is the package that knows how to render them in a browser. The two-line setup at the bottom of a React app: find an existing DOM element to take over (usually a <div id=\"root\">), and tell ReactDOM to render your top-level component into it.",
      example: {
        language: "tsx",
        code:
`import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);`,
        caption: "The minimum needed to put a React app on a page.",
      },
      walkthrough:
        "createRoot takes the existing DOM element and turns it into a React root. The .render call tells React which component to mount there. From this point on, React owns the children of that element and re-renders it when the component's state changes. The exclamation mark (after 'root') is a TypeScript non-null assertion: document.getElementById returns Element | null, and the developer is asserting that the element exists.",
    },
    {
      type: "example",
      title: "A minimal App",
      code:
`import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1>The count is {count}.</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </main>
  );
}`,
      language: "tsx",
      walkthrough:
        "useState is a hook. The line const [count, setCount] = useState(0) asks React to remember a number, starting at 0. count is the current value; setCount is the function to call when the value should change. The button's onClick calls setCount(count + 1). React re-renders the component with the new value, and the heading updates. Hooks are explained properly in Lecture 7.",
    },
    {
      type: "interactive",
      componentKey: "ReactSandbox",
      title: "Your first component",
      description:
        "Edit the JSX on the left. The preview on the right updates as you type. Try changing the name, the heading, or the styling. Save your favourite as a starting point for later exercises.",
    },
    {
      type: "mistakes",
      title: "Common mistakes at the start",
      items: [
        {
          mistake: "Trying to return multiple root elements from a component.",
          fix: "Components must return a single root. Wrap multiple elements in a parent, or use a fragment: <>...</>.",
        },
        {
          mistake: "Writing class instead of className in JSX.",
          fix: "className is the JSX way of writing the HTML class attribute. The same applies to htmlFor (instead of for), tabIndex (instead of tabindex), and other attribute renames that avoid clashes with JavaScript reserved words.",
        },
        {
          mistake: "Mutating state directly instead of using the setter.",
          fix: "React only re-renders when the state setter is called. Writing to the variable does nothing. const [count, setCount] = useState(0); count = 1 has no effect; setCount(1) does.",
        },
        {
          mistake: "Importing React from \"react\" in every file.",
          fix: "The modern JSX transform does not require an explicit React import. import { useState } from 'react' is enough.",
        },
      ],
    },
    {
      type: "react-exercise",
      exerciseId: "m2l01-ex01",
      title: "A personal greeting",
      description: "Render a function component that shows a heading with a name of your choice.",
    },
    {
      type: "quiz",
      quizId: "m2l01-q",
    },
    {
      type: "summary",
      body: "React is a library for building user interfaces out of components. A component is a function that takes props and returns JSX. JSX is a syntax extension that looks like HTML but is JavaScript. ReactDOM is the package that mounts your component tree into an existing DOM element. The mental model is declarative: you describe what the UI should look like, the library works out how to make it so. The rest of the module is a tour through props, state, components, hooks, routing, and Bootstrap — each one a piece of the same idea.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l01-q",
    title: "React check",
    questions: [
      {
        kind: "mcq",
        id: "m2l01-q1",
        prompt: "What is a React component?",
        options: [
          "A class that extends React.Component",
          "A function that returns a description of the UI",
          "A JSON object passed to React.render",
          "A CSS class with React-specific extensions",
        ],
        correctIndex: 1,
        explanation: "In modern React, a component is a function that takes props and returns JSX (a description of the UI). React turns the description into real DOM nodes.",
      },
      {
        kind: "truefalse",
        id: "m2l01-q2",
        prompt: "JSX is a separate language from JavaScript that gets interpreted by the browser.",
        correct: false,
        explanation: "JSX is a syntax extension that is transpiled to JavaScript before the browser sees it. The browser only ever runs JavaScript.",
      },
      {
        kind: "mcq",
        id: "m2l01-q3",
        prompt: "Which is the correct way to write a class attribute in JSX?",
        options: ["class", "className", "class-name", "class_name"],
        correctIndex: 1,
        explanation: "className is the JSX form of the HTML class attribute. class is a reserved word in JavaScript.",
      },
      {
        kind: "mcq",
        id: "m2l01-q4",
        prompt: "What is the purpose of ReactDOM?",
        options: [
          "To define the component model",
          "To render a React component tree into an existing DOM element",
          "To style React components with CSS",
          "To fetch data from APIs",
        ],
        correctIndex: 1,
        explanation: "React is the library that defines components. ReactDOM is the package that knows how to render them in a browser by taking over a DOM element.",
      },
      {
        kind: "code-output",
        id: "m2l01-q5",
        prompt: "What does this component render when called as <Greeting name=\"Sora\" />?",
        code: "function Greeting({ name }) {\n  return <p>Hello, {name}.</p>;\n}",
        language: "tsx",
        expected: "<p>Hello, Sora.</p>",
        explanation: "The component takes the name prop and interpolates it into a paragraph. The rendered JSX is a paragraph element with the text 'Hello, Sora.' inside it.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [
  {
    id: "m2l01-ex01",
    lectureId: "m2l01",
    title: "A personal greeting",
    brief: "Write a function component called Greeting that returns a heading with the text 'Hello, your-name'.",
    starterCode: `// Edit this component. The preview on the right updates as you type.
function Greeting() {
  return (
    <h1>Hello, world</h1>
  );
}`,
    tests: [
      {
        kind: "renders-element",
        selector: "h1",
        min: 1,
        description: "The component renders an <h1> element",
      },
      {
        kind: "contains-text",
        selector: "h1",
        text: "Hello",
        description: "The heading contains the word 'Hello'",
      },
    ],
    hints: [
      "The function should return a single root element.",
      "JSX uses className instead of class for the HTML class attribute.",
      "To put a JavaScript value inside JSX, use curly braces: {name}.",
    ],
    solution: `function Greeting({ name }) {
  return (
    <h1>Hello, {name}</h1>
  );
}`,
    solutionExplanation:
      "The function takes a name prop, returns an h1 with the text 'Hello, ' followed by the interpolated name. When the component is rendered with <Greeting name=\"Sora\" />, the result is a heading that reads 'Hello, Sora'.",
  },
];
