import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l03",
  module: 2,
  number: 3,
  title: "JSX and React Components, Props",
  subtitle:
    "The shape of a component, the rules of JSX, and how data flows from parent to child through props.",
  estimatedMinutes: 55,
  difficulty: "core",
  prerequisites: ["m2l02"],
  objectives: [
    "Write a function component that returns JSX.",
    "Use props to pass data from a parent component to a child.",
    "Distinguish children from props.",
    "Use conditional rendering and lists in JSX.",
    "Use the key prop correctly when rendering lists.",
  ],
  sources: [
    { label: "React — Your First Component", type: "react", url: "https://react.dev/learn/your-first-component" },
    { label: "React — Passing Props to a Component", type: "react", url: "https://react.dev/learn/passing-props-to-a-component" },
    { label: "React — Conditional Rendering", type: "react", url: "https://react.dev/learn/conditional-rendering" },
    { label: "React — Rendering Lists", type: "react", url: "https://react.dev/learn/rendering-lists" },
  ],
  sections: [
    {
      type: "context",
      body:
        "JSX is the syntax you write. Components are the unit. Props are the data that flows from parent to child. This lecture walks through the rules: how a component is shaped, how to pass data, how to render conditionally, and how to render lists without breaking React's reconciliation. We will keep the example small and the code complete so you can read every line.",
    },
    {
      type: "objectives",
      items: [
        "Write a function component that returns JSX.",
        "Use props to pass data from a parent component to a child.",
        "Distinguish children from props.",
        "Use conditional rendering and lists in JSX.",
        "Use the key prop correctly when rendering lists.",
      ],
    },
    {
      type: "concept",
      title: "The shape of a function component",
      body:
        "A function component is a function that takes props and returns JSX. The function name is capitalised — this is how JSX tells a real element from a component. The body is a single expression that describes the UI. The component must return a single root element, a fragment, or an array (rare).",
      example: {
        language: "tsx",
        code:
`function Article({ title, author }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>By {author}</p>
    </article>
  );
}`,
        caption: "A component that returns a single root (the <article>). The function takes one argument: an object of props.",
      },
      walkthrough:
        "The function destructures `title` and `author` out of the props object. The returned JSX has a single root (the <article>) with two children (h2 and p). Expressions in JSX use curly braces. The component is called with <Article title=\"...\" author=\"...\" /> — the JSX attribute syntax maps to the props object.",
    },
    {
      type: "concept",
      title: "Children — the special prop",
      body:
        "Anything between the opening and closing tags of a component is passed as the `children` prop. The receiving component decides where in its layout to place the children. This is what makes components nestable: a Card can wrap any kind of content, because it just renders {children} inside its own template.",
      example: {
        language: "tsx",
        code:
`function Card({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </section>
  );
}

<Card title="Profile">
  <p>This is the body of the card.</p>
  <button>Edit</button>
</Card>`,
        caption: "Card receives its title as a prop, and its body as children. The body can be anything.",
      },
      walkthrough:
        "When you write <Card title=\"Profile\"><p>...</p></Card>, the JSX compiles to a call like Card({ title: \"Profile\", children: <p>...</p> }). The component decides where to render the children. The same Card component can wrap any kind of content — a list, a form, a paragraph — without changing its template.",
    },
    {
      type: "concept",
      title: "Conditional rendering",
      body:
        "JSX is JavaScript. You can use any expression inside curly braces, including a ternary, a logical AND, or a function call. The three common patterns for conditional rendering: ternary (cond ? <A /> : <B />), logical AND (cond && <A /> — renders A only if cond is truthy), and early return (if (!cond) return null;).",
      example: {
        language: "tsx",
        code:
`function Greeting({ user }) {
  if (!user) return <p>Please sign in.</p>;
  return (
    <main>
      <h1>Hello, {user.name}.</h1>
      {user.isAdmin && <span className="badge">Admin</span>}
    </main>
  );
}`,
        caption: "Three patterns: early return for the missing case, ternary for two branches, logical AND for an optional add-on.",
      },
      walkthrough:
        "The first if is the early return: when the user is missing, the component renders a prompt and stops. The second pattern (the Admin badge) uses &&: the badge only renders if the user is admin. The && pattern is concise but be careful with falsy values — if isAdmin is 0 or \"\", the right side is skipped, which is usually fine for booleans but can surprise you with numbers.",
    },
    {
      type: "concept",
      title: "Rendering lists and the key prop",
      body:
        "Lists are rendered with .map. Each item in the list must have a unique `key` prop — a string or number that lets React identify which item is which across renders. The key must be stable (the same item always has the same key) and unique among siblings. Do not use the array index as the key when the list can reorder.",
      example: {
        language: "tsx",
        code:
`function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}`,
        caption: "Map over the array, give each item a stable key, render the item. React reconciles the list by key.",
      },
      walkthrough:
        "The key is task.id, not the array index. If the list reorders (a task is removed, a new one is added at the top), React uses the key to figure out which existing <li> corresponds to which task. With index keys, React would mistake the reordered items for the same items and update the wrong DOM nodes — a subtle bug.",
    },
    {
      type: "example",
      title: "A Card with a list of items",
      code:
`function TaskCard({ task }) {
  return (
    <article className="task">
      <h3>{task.title}</h3>
      <p>{task.notes ?? "No notes yet."}</p>
      <ul>
        {task.tags.map(tag => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}

function TaskList({ tasks }) {
  return (
    <div className="list">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}`,
      language: "tsx",
      walkthrough:
        "TaskCard receives a single task and renders its title, notes (with a fallback), and tags. TaskList receives the array of tasks and maps over them, passing each task to TaskCard. Each TaskCard is keyed by task.id, and each tag inside is keyed by the tag string. Two levels of keys, two levels of reconciliation.",
    },
    {
      type: "interactive",
      componentKey: "ReactSandbox",
      title: "Build a TaskList",
      description: "Try the example above in the sandbox. Add a task, change the rendering, give each card a different style.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with JSX and props",
      items: [
        {
          mistake: "Returning two elements at the top of a component without a fragment.",
          fix: "Components must return a single root. Use a fragment (<>...</>) to wrap multiple elements, or wrap them in a parent like a <div> or a <section>.",
        },
        {
          mistake: "Using the array index as the key when the list can reorder.",
          fix: "Use a stable identifier from the data — task.id, user.email, anything that is unique and stable. Index keys are fine for static lists and break for dynamic ones.",
        },
        {
          mistake: "Mutating a prop inside the child component.",
          fix: "Props are read-only. The parent owns the data; the child receives a snapshot. If the child needs to change something, the parent passes a setter as a prop, and the child calls it.",
        },
        {
          mistake: "Forgetting the return statement inside the JSX block.",
          fix: "An arrow with a single expression returns it implicitly. An arrow with a block needs an explicit return. Watch for the missing return when you add curly braces around a multi-line JSX body.",
        },
      ],
    },
    {
      type: "react-exercise",
      exerciseId: "m2l03-ex01",
      title: "Render a list of items",
      description: "Render a list of three items with their title and a done indicator.",
    },
    {
      type: "quiz",
      quizId: "m2l03-q",
    },
    {
      type: "summary",
      body: "A function component takes props and returns JSX. JSX is JavaScript with a markup-like syntax. Props flow from parent to child and are read-only. Children is the special prop that contains whatever is between the opening and closing tags. Conditional rendering uses a ternary, &&, or an early return. Lists are rendered with .map, and each item needs a stable, unique key. The rules are simple and strict — and they are the foundation that every other React pattern builds on.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l03-q",
    title: "JSX and Components check",
    questions: [
      {
        kind: "mcq",
        id: "m2l03-q1",
        prompt: "What does a React component return?",
        options: [
          "A string of HTML",
          "JSX — a description of the UI",
          "A real DOM element",
          "Nothing — ReactDOM renders it",
        ],
        correctIndex: 1,
        explanation: "A component returns JSX, which is a description of the UI. React turns the description into real DOM nodes. The component itself is just a function.",
      },
      {
        kind: "mcq",
        id: "m2l03-q2",
        prompt: "How do you access a child element passed between a component's opening and closing tags?",
        options: [
          "As the second argument of the function",
          "Through the `children` prop",
          "Through a special ref named `inner`",
          "Children cannot be passed between component tags",
        ],
        correctIndex: 1,
        explanation: "Children is the special prop. The receiving component decides where in its template to place the children.",
      },
      {
        kind: "truefalse",
        id: "m2l03-q3",
        prompt: "Using the array index as a key is always fine.",
        correct: false,
        explanation: "Index keys are only safe for static lists. When a list can reorder, add, or remove items, the index changes and React misidentifies which DOM nodes correspond to which items.",
      },
      {
        kind: "code-output",
        id: "m2l03-q4",
        prompt: "What does this component render when called as <Greeting name=\"Sora\" loggedIn={true} />?",
        code: "function Greeting({ name, loggedIn }) {\n  return <p>{loggedIn ? 'Hi, ' + name : 'Please sign in'}</p>;\n}",
        language: "tsx",
        expected: "<p>Hi, Sora</p>",
        explanation: "loggedIn is true, so the ternary takes the 'Hi, ' + name branch. The result is the string 'Hi, Sora' inside a <p> element.",
      },
      {
        kind: "mcq",
        id: "m2l03-q5",
        prompt: "What is the right key for an item in a rendered list?",
        options: [
          "A unique, stable identifier from the data",
          "The array index, always",
          "Math.random()",
          "Any value, as long as it is truthy",
        ],
        correctIndex: 0,
        explanation: "The key must be stable (the same item always has the same key) and unique among siblings. task.id is a good key. Math.random() changes every render. The array index changes when the list reorders.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [
  {
    id: "m2l03-ex01",
    lectureId: "m2l03",
    title: "Render a list of items",
    brief: "Render a list of three items with their title. Each item should be inside a <li> tag with a stable key.",
    starterCode: `// Render three items in a <ul>. Each item should be in an <li>.
const items = [
  { id: 1, title: "Read the lecture" },
  { id: 2, title: "Build the example" },
  { id: 3, title: "Mark complete" },
];

function App() {
  return (
    <ul>
      {/* replace this with .map over items */}
      <li>placeholder</li>
    </ul>
  );
}`,
    tests: [
      { kind: "renders-element", selector: "ul li", min: 3, description: "At least three <li> elements" },
      { kind: "contains-text", selector: "li", text: "Read the lecture", description: "First item text appears" },
    ],
    hints: [
      "items.map((item) => <li key={item.id}>{item.title}</li>)",
      "The key prop goes on the element returned from the map, not on the parent.",
    ],
    solution: `const items = [
  { id: 1, title: "Read the lecture" },
  { id: 2, title: "Build the example" },
  { id: 3, title: "Mark complete" },
];

function App() {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}`,
    solutionExplanation:
      "The map turns the array into a new array of JSX elements. Each element is a <li> with a stable key (item.id) and the interpolated title. React reconciles the list using the keys.",
  },
];
