import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l07",
  module: 2,
  number: 7,
  title: "Hook",
  subtitle:
    "The rules of hooks, useState, useEffect, and the lifecycle — how a component reaches beyond its render to do work in the real world.",
  estimatedMinutes: 70,
  difficulty: "applied",
  prerequisites: ["m2l06"],
  objectives: [
    "Explain the two rules of hooks and why they exist.",
    "Use useEffect to run side effects after render.",
    "Read and write the dependency array correctly.",
    "Build a small timer with cleanup.",
    "Recognise when a custom hook is the right answer.",
  ],
  sources: [
    { label: "React — useState", type: "react", url: "https://react.dev/reference/react/useState" },
    { label: "React — useEffect", type: "react", url: "https://react.dev/reference/react/useEffect" },
    { label: "React — Rules of Hooks", type: "react", url: "https://react.dev/reference/rules/rules-of-hooks" },
  ],
  sections: [
    {
      type: "context",
      body:
        "useState gives a component memory. useEffect gives a component a way to reach outside its render — to read from the network, set up a timer, attach an event listener, or update the document title. The hook system is the discipline that makes these effects predictable: there are two rules, and following them is the difference between code that works and code that works by accident.",
    },
    {
      type: "objectives",
      items: [
        "Explain the two rules of hooks and why they exist.",
        "Use useEffect to run side effects after render.",
        "Read and write the dependency array correctly.",
        "Build a small timer with cleanup.",
        "Recognise when a custom hook is the right answer.",
      ],
    },
    {
      type: "prose",
      title: "Why hooks exist",
      paragraphs: [
        "Before hooks, a function component had no way to do anything but render. State lived in classes, with this.state and this.setState and a long list of lifecycle methods (componentDidMount, componentDidUpdate, componentWillUnmount). Function components were useful only as children of class components that held the state. Hooks changed that: useState, useEffect, and the rest of the hook family give function components everything classes had, and more.",
        "The price is discipline. Hooks rely on call order — the first useState in a component is always the first hook, the second useState is always the second, and so on. A conditional hook would break that. The two rules of hooks exist to protect this.",
      ],
    },
    {
      type: "concept",
      title: "The two rules of hooks",
      body:
        "Rule one: only call hooks at the top level of a function component or a custom hook. Do not call hooks inside loops, conditions, or nested functions. Rule two: only call hooks from function components or custom hooks, not from regular JavaScript functions. These two rules mean React can rely on the order of hook calls to associate state with the right hook.",
      example: {
        language: "tsx",
        code:
`// right
function Counter() {
  const [count, setCount] = useState(0);
  if (count > 10) return <p>Too many</p>;
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// wrong — hook called conditionally
function Counter({ limit }) {
  const [count, setCount] = useState(0);
  if (limit > 10) {
    const [other, setOther] = useState('');  // React loses track of which hook is which
  }
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
        caption: "Top-level only. The second example looks innocent — the condition is on a prop — but it changes the hook order between renders and React gets confused.",
      },
      walkthrough:
        "The linter (eslint-plugin-react-hooks) flags this automatically. Trust the linter. The runtime error when hooks are called in the wrong order is a cryptic 'Rendered fewer hooks than expected' — a sign to look at where hooks are being called.",
    },
    {
      type: "concept",
      title: "useEffect — side effects after render",
      body:
        "useEffect runs a function after the component renders. The function can return a cleanup function that runs before the next effect, and when the component unmounts. The second argument — the dependency array — tells React which values, when changed, should re-run the effect.",
      example: {
        language: "tsx",
        code:
`function DocumentTitle({ title }) {
  useEffect(() => {
    document.title = title;
    return () => { document.title = 'Kōdo'; };
  }, [title]);

  return <p>Look at the browser tab.</p>;
}`,
        caption: "An effect that updates the document title. The cleanup restores the default title when the component unmounts.",
      },
      walkthrough:
        "The effect runs after every render where `title` has changed. The cleanup runs before the next effect, and when the component unmounts. The dependency array [title] is the contract: \"only re-run when title changes.\" If you forget the array, the effect runs on every render — usually wrong. If you leave it empty [], the effect runs once on mount and the cleanup runs once on unmount.",
    },
    {
      type: "diagram",
      kind: "useeffect-lifecycle",
      caption: "useEffect runs after render, then cleans up before the next run.",
    },
    {
      type: "concept",
      title: "The dependency array",
      body:
        "The dependency array is the contract between the effect and the data it uses. Every value the effect reads (other than setters and module-level constants) should be in the array. If the effect uses `count`, count goes in the array. If it uses `user.id`, user.id goes in the array. If you forget, the effect closes over a stale value — it runs but with the old data.",
      example: {
        language: "tsx",
        code:
`function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);  // empty — the effect runs once on mount

  return <p>{seconds} seconds have passed.</p>;
}`,
        caption: "A timer. The empty dependency array means the effect runs once and the cleanup runs once. The setter is used in the functional form so no stale-state bug.",
      },
      walkthrough:
        "setInterval is started when the component mounts. The cleanup clears the interval when the component unmounts. The setter is called in the functional form (s => s + 1), so it does not need to be in the dependency array — the functional form reads the latest value. If we had written setSeconds(seconds + 1), seconds would have to be in the array, and the effect would re-run every second, which would defeat the purpose.",
    },
    {
      type: "concept",
      title: "Custom hooks — extracting stateful logic",
      body:
        "A custom hook is a function whose name starts with `use` and that calls other hooks. The convention is what makes the linter and React's own rules work. The purpose is reuse: when two components need the same stateful logic, the logic goes in a custom hook and both components call it.",
      example: {
        language: "tsx",
        code:
`function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial;
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}`,
        caption: "A custom hook that syncs state with localStorage. Any component that needs persisted state can use it.",
      },
      walkthrough:
        "The lazy form of useState (() => ...) runs the initialiser only on the first render, so the localStorage read is not repeated. The effect writes to localStorage whenever the value changes. Two components in different parts of the app can now call useLocalStorage('user', null) and share the same piece of state — persisted across reloads.",
    },
    {
      type: "example",
      title: "A document title effect",
      code:
`function Page({ title, items }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(\`still here: \${items.length} items\`);
    }, 5000);
    return () => clearInterval(id);
  }, [items.length]);

  return <main><h1>{title}</h1>...</main>;
}`,
      language: "tsx",
      walkthrough:
        "Two effects, each with its own purpose. The first updates the document title when the page's title changes. The second logs a heartbeat every 5 seconds and cleans up when the component unmounts. The dependency arrays are minimal: title for the first, items.length for the second. Each effect is responsible for one thing.",
    },
    {
      type: "interactive",
      componentKey: "ReactSandbox",
      title: "Build a counter with a document title",
      description: "Combine useState and useEffect. The document title should reflect the count.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with hooks",
      items: [
        {
          mistake: "Calling a hook inside a condition or loop.",
          fix: "Always call hooks at the top level. If you need conditional behaviour, compute the condition outside the hook call. The linter enforces this — trust it.",
        },
        {
          mistake: "Forgetting the dependency array, or leaving it empty when the effect uses a value.",
          fix: "Every value the effect reads goes in the array. If you want to run the effect only on mount, use the functional form for setters and leave the array empty — but be sure you actually want that.",
        },
        {
          mistake: "Reading a state value immediately after calling the setter and expecting the new value.",
          fix: "The setter is asynchronous. If you need the new value immediately, use the functional form: setCount(c => c + 1).",
        },
        {
          mistake: "Returning a non-function from the effect.",
          fix: "The cleanup is the function returned from the effect. Returning anything else is a no-op. If you have no cleanup, return undefined or omit the return.",
        },
      ],
    },
    {
      type: "react-exercise",
      exerciseId: "m2l07-ex01",
      title: "A timer that updates the document title",
      description: "Build a component that counts seconds and reflects the count in document.title.",
    },
    {
      type: "quiz",
      quizId: "m2l07-q",
    },
    {
      type: "summary",
      body: "Hooks are the way function components own state and side effects. useState gives memory. useEffect runs after render with a cleanup function. The dependency array is the contract between the effect and the values it reads. Custom hooks are the way to share stateful logic between components. The two rules of hooks (top level, function component or custom hook) are what make the whole system work. The linter enforces them; trust it.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l07-q",
    title: "Hooks check",
    questions: [
      {
        kind: "mcq",
        id: "m2l07-q1",
        prompt: "When is the function passed to useEffect called?",
        options: [
          "During the render",
          "After the render, before the browser paints",
          "After the browser paints",
          "Only when a state setter is called",
        ],
        correctIndex: 2,
        explanation: "useEffect runs after the render has been committed. In React 18+, it runs after the browser paints, which keeps the UI responsive. useLayoutEffect is the variant that runs synchronously before the paint.",
      },
      {
        kind: "truefalse",
        id: "m2l07-q2",
        prompt: "You can call hooks inside an if statement as long as the condition is the same on every render.",
        correct: false,
        explanation: "The rule is structural: hooks must always be called in the same order. An if statement is fine as long as the hook call is above the condition. A hook call inside the if is a bug.",
      },
      {
        kind: "code-output",
        id: "m2l07-q3",
        prompt: "What does this log?",
        code: "function App() {\n  const [n, setN] = useState(0);\n  useEffect(() => {\n    console.log(\'effect\', n);\n    return () => console.log(\'cleanup\', n);\n  }, [n]);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}",
        language: "tsx",
        expected: "effect 0\ncleanup 0\neffect 1\ncleanup 1\n...",
        explanation: "On the first render, the effect runs and logs 'effect 0'. On the next render (after setN), the cleanup runs first ('cleanup 0') then the effect runs again ('effect 1'). Each click adds another pair of \"effect N\" + \"cleanup N\" lines.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [
  {
    id: "m2l07-ex01",
    lectureId: "m2l07",
    title: "A timer that updates the document title",
    brief: "Build a component that increments a counter every second and reflects the count in document.title.",
    starterCode: "function Timer() {\n  // add useState for the count\n  // add useEffect to start a setInterval that increments count every second\n  return <p>0 seconds have passed.</p>;\n}",
    tests: [
      { kind: "renders-element", selector: "p", min: 1, description: "Renders a paragraph" },
    ],
    hints: [
      "useEffect with an empty dependency array runs once on mount — perfect for starting an interval.",
      "Return a cleanup function that calls clearInterval.",
      "Use the functional form of the setter: setCount(c => c + 1).",
    ],
    solution: "function Timer() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => setCount(c => c + 1), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return <p>{count} seconds have passed.</p>;\n}",
    solutionExplanation: "The component holds the count in state. The effect starts a setInterval on mount and clears it on unmount. The functional form of the setter avoids a stale-state bug. The empty dependency array means the effect runs once.",
  },
];
