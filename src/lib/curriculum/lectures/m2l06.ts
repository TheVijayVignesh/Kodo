import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l06",
  module: 2,
  number: 6,
  title: "Rendering of React Components and Introduction to State",
  subtitle:
    "How React re-renders a component, what state is, and the useState hook — the lever that turns a static component into an interactive one.",
  estimatedMinutes: 60,
  difficulty: "applied",
  prerequisites: ["m2l05"],
  objectives: [
    "Explain when a component re-renders and what triggers it.",
    "Use the useState hook to add local state to a component.",
    "Read and update state with the setter, understanding immutability.",
    "Recognise the event → setState → render → DOM cycle.",
    "Build a counter, a toggle, and a small form with state.",
  ],
  sources: [
    { label: "React — State: A Component's Memory", type: "react", url: "https://react.dev/learn/state-a-components-memory" },
    { label: "React — Responding to Events", type: "react", url: "https://react.dev/learn/responding-to-events" },
    { label: "React — Render and Commit", type: "react", url: "https://react.dev/learn/render-and-commit" },
  ],
  sections: [
    {
      type: "context",
      body:
        "Props are how a parent talks to a child. State is how a component remembers something between renders. Together, they cover almost everything a React component does. This lecture introduces the useState hook, walks through the render cycle, and builds three small interactive components: a counter, a toggle, and a form. The patterns are simple but they are the foundation that every larger React app is built on.",
    },
    {
      type: "objectives",
      items: [
        "Explain when a component re-renders and what triggers it.",
        "Use the useState hook to add local state to a component.",
        "Read and update state with the setter, understanding immutability.",
        "Recognise the event → setState → render → DOM cycle.",
        "Build a counter, a toggle, and a small form with state.",
      ],
    },
    {
      type: "concept",
      title: "What state is",
      body:
        "State is data a component owns. It is private to the component (or the components that receive it via props). When state changes, the component re-renders. State is the lever that turns a pure function of props into an interactive component — the component can remember what the user did, and reflect that in the next render.",
      mentalModel:
        "Props are inputs. State is memory. The component's job is to render based on what it knows: its inputs (props) and its memory (state). When the memory changes, the component re-renders.",
    },
    {
      type: "concept",
      title: "The useState hook",
      body:
        "useState is a function that takes an initial value and returns a pair: the current value and a setter. The setter is the only way to change the value — writing to the variable does nothing. Each render of the component gets a fresh pair. The setter schedules a re-render.",
      example: {
        language: "tsx",
        code:
`function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
        caption: "A counter. count is the current value, setCount is the only way to change it.",
      },
      walkthrough:
        "const [count, setCount] = useState(0) destructures the pair. count is the current value, initialised to 0. setCount is the function to call when the value should change. The onClick calls setCount(count + 1). React schedules a re-render. The component runs again with the new count, and the button text updates. The button keeps its position in the DOM; only the text inside changes.",
    },
    {
      type: "diagram",
      kind: "react-render",
      caption: "The render cycle: state change → re-render → diff → patch DOM.",
    },
    {
      type: "concept",
      title: "Immutability — change the reference, not the value",
      body:
        "React's state is immutable from the component's perspective. You never write to a state variable directly. You always call the setter, and you always pass a new value. For primitives (numbers, strings) this is automatic. For objects and arrays, you have to construct a new object or array — never mutate the old one.",
      example: {
        language: "tsx",
        code:
`function TaskList({ initial }) {
  const [tasks, setTasks] = useState(initial);

  function addTask(title) {
    // right: build a new array
    setTasks([...tasks, { id: Date.now(), title, done: false }]);

    // wrong: mutate the existing array
    // tasks.push({ id: Date.now(), title, done: false });
    // setTasks(tasks);
  }
}`,
        caption: "Right: a new array with the old elements plus the new one. Wrong: pushing to the existing array.",
      },
      walkthrough:
        "Mutating an existing array or object breaks React's detection of changes. The setter compares references: if the new value is the same object, React skips the re-render. The new array has a new reference, so React knows the value has changed. This is also why Redux and similar state libraries are built around the idea of immutable updates.",
    },
    {
      type: "concept",
      title: "The render cycle",
      body:
        "When a user interacts with the page (clicks a button, types in a field), the event handler runs. The handler calls the state setter. React schedules a re-render of the component that owns the state. React re-renders the component, computes the new JSX, diffs it against the previous JSX, and patches the DOM with the minimum set of changes. This all happens automatically; the developer writes the event handler and the setter, and React does the rest.",
      example: {
        language: "tsx",
        code:
`function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(!on)}>
      {on ? 'ON' : 'OFF'}
    </button>
  );
}`,
        caption: "A toggle. Click flips the state, React re-renders, the button text updates.",
      },
      walkthrough:
        "Each click calls setOn(!on) with the new boolean. React schedules a re-render. The component runs again with the new value of on. The button text is the new ternary result. The state itself lives outside the component function — React keeps a slot for each useState call in each component instance.",
    },
    {
      type: "example",
      title: "A small form with two inputs",
      code:
`function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); console.log(name, email); }}>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}`,
      language: "tsx",
      walkthrough:
        "Each input has its own piece of state. The input's value is bound to the state, and onChange writes the new value back. The submit handler reads both values when the form is submitted. The pattern is repetitive but the parts are simple. Lecture 7 covers how to clean this up with a single state object.",
    },
    {
      type: "interactive",
      componentKey: "ReactSandbox",
      title: "Build a counter and a toggle",
      description: "Two small interactive components side by side. The counter increments; the toggle flips. Build them in the React sandbox.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with state",
      items: [
        {
          mistake: "Writing to a state variable directly (count = 1).",
          fix: "The setter is the only way to change the value. count = 1 has no effect; setCount(1) does.",
        },
        {
          mistake: "Mutating an array or object in state.",
          fix: "Construct a new array or object. setTasks([...tasks, newTask]) for arrays, setUser({...user, name: newName}) for objects. Never .push, .splice, or assign to a property in place.",
        },
        {
          mistake: "Reading state immediately after calling the setter.",
          fix: "setState is asynchronous. The new value is available on the next render. If you need the new value immediately, use the functional form: setCount(c => c + 1).",
        },
        {
          mistake: "Initialising state from a function call on every render.",
          fix: "useState(initial) calls initial on every render, even though React only uses the first call's result. If the initial value is expensive to compute, use the lazy form: useState(() => computeExpensive()).",
        },
      ],
    },
    {
      type: "react-exercise",
      exerciseId: "m2l06-ex01",
      title: "A counter that can be reset",
      description: "Build a counter with a button to increment and a button to reset to 0.",
    },
    {
      type: "quiz",
      quizId: "m2l06-q",
    },
    {
      type: "summary",
      body: "State is a component's memory. useState returns the current value and a setter. The setter is the only way to change the value. State changes trigger a re-render. The render cycle is: event → setState → re-render → diff → patch DOM. State is immutable from the component's perspective: build new objects and arrays rather than mutating the old ones. These are the patterns that make React components interactive.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l06-q",
    title: "State check",
    questions: [
      {
        kind: "mcq",
        id: "m2l06-q1",
        prompt: "What does useState return?",
        options: [
          "The current state value",
          "A setter function that updates the state",
          "A pair: the current value and a setter",
          "A reference to the DOM node that holds the value",
        ],
        correctIndex: 2,
        explanation: "useState returns a pair: the current value and a setter. Destructuring (const [value, setValue] = useState(initial)) is the idiomatic form.",
      },
      {
        kind: "truefalse",
        id: "m2l06-q2",
        prompt: "You can update a state variable by writing to it directly (count = 1).",
        correct: false,
        explanation: "The variable is reassigned but the state is not. React does not re-render. The only way to change the value is to call the setter.",
      },
      {
        kind: "code-output",
        id: "m2l06-q3",
        prompt: "What does this log when the button is clicked twice, starting from 0?",
        code: "function Counter() {\n  const [count, setCount] = useState(0);\n  function inc() { setCount(count + 1); console.log(count); }\n  return <button onClick={inc}>+</button>;\n}",
        language: "tsx",
        expected: "0\n1",
        explanation: "The console.log is inside the handler, so it logs the value of count at the time the handler runs. count is 0 the first time, 1 the second. The setCount schedules a re-render that happens after the handler returns.",
      },
      {
        kind: "mcq",
        id: "m2l06-q4",
        prompt: "What is the right way to add an item to an array in state?",
        options: [
          "items.push(newItem); setItems(items);",
          "setItems([...items, newItem]);",
          "setItems(items.concat(newItem));",
          "Both B and C",
        ],
        correctIndex: 3,
        explanation: "Both build a new array. .push mutates the existing one, which React cannot detect. The spread form is the modern style; .concat is the older functional form. Both work.",
      },
      {
        kind: "mcq",
        id: "m2l06-q5",
        prompt: "What triggers a React re-render?",
        options: [
          "A user event in the same component",
          "A call to a state setter",
          "A change in props from a parent",
          "All of the above",
        ],
        correctIndex: 3,
        explanation: "React re-renders a component when its state changes, when its parent re-renders, or when a context it consumes changes. A user event triggers a re-render only because the handler calls a setter.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [
  {
    id: "m2l06-ex01",
    lectureId: "m2l06",
    title: "A counter that can be reset",
    brief: "Build a counter with an Increment button and a Reset button. Reset returns the count to 0.",
    starterCode: `function Counter() {
  // add useState for the count
  return (
    <div>
      <p>Count: 0</p>
      {/* add an increment button */}
      {/* add a reset button */}
    </div>
  );
}`,
    tests: [
      { kind: "renders-element", selector: "button", min: 2, description: "Two buttons" },
      { kind: "contains-text", selector: "p", text: "Count", description: "The counter paragraph" },
    ],
    hints: [
      "useState(0) gives you a count and a setCount.",
      "onClick calls setCount(count + 1) or setCount(0) for reset.",
    ],
    solution: `function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
    solutionExplanation:
      "The counter holds the count in state. The Increment button calls setCount(count + 1). The Reset button calls setCount(0). Both calls schedule a re-render, and the <p> updates with the new value.",
  },
];
