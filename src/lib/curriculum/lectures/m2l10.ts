import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l10",
  module: 2,
  number: 10,
  title: "Hands-on Exercise",
  subtitle:
    "Build a small task-tracker from scratch. A capstone that combines everything from Module 2: components, props, state, effects, routing, and a design system.",
  estimatedMinutes: 90,
  difficulty: "advanced",
  prerequisites: ["m2l09"],
  objectives: [
    "Plan a small React application from a one-paragraph brief.",
    "Build the component tree incrementally.",
    "Wire up state, effects, and routing in a small but complete app.",
    "Apply a consistent visual language.",
    "Reflect on what was hard and what was easy.",
  ],
  sources: [
    { label: "React — Thinking in React", type: "react", url: "https://react.dev/learn/thinking-in-react" },
    { label: "React Bootstrap — Getting Started", type: "react", url: "https://react-bootstrap.netlify.app/docs/getting-started/introduction" },
  ],
  sections: [
    {
      type: "context",
      body:
        "Everything in Module 2 has been building to this. You have seen components, props, state, effects, routing, and a component library. The hands-on exercise is to put it all together in a small task-tracker that runs in the React sandbox. The brief is one paragraph; the rest of the design is yours. We will go through the planning, the build, and the reflection. By the end you will have a working app, the patterns will be familiar, and the next project you start will feel more like assembling pieces than learning a new thing.",
    },
    {
      type: "objectives",
      items: [
        "Plan a small React application from a one-paragraph brief.",
        "Build the component tree incrementally.",
        "Wire up state, effects, and routing in a small but complete app.",
        "Apply a consistent visual language.",
        "Reflect on what was hard and what was easy.",
      ],
    },
    {
      type: "prose",
      title: "The brief",
      paragraphs: [
        "Build a tiny task-tracker. The user sees a list of tasks. Each task has a title, a notes field, a done flag, and a delete button. The user can add a new task, mark a task as done, edit a task's title, and delete a task. There are two routes: / for the list view, and /about for a one-paragraph description of the app. State is local to the App component and not persisted across reloads.",
        "That's the brief. The rest is implementation. You decide the visual language, the data structure, and the code organisation. The patterns from the previous nine lectures are the tools; you arrange them.",
      ],
    },
    {
      type: "concept",
      title: "Step 1 — Plan the components",
      body:
        "A task tracker needs: an App that owns the list, a TaskList that renders the array, a Task that renders one row, a NewTaskForm that handles input, and a NotFound page. The App also holds the routing. That is six components, each with one job.",
      example: {
        language: "tsx",
        code:
`// component tree
<App>
  <Navbar />             // shared chrome
  <Routes>
    <Route path="/" element={<TaskListPage />}>
      <NewTaskForm />
      <TaskList>
        <Task />          // for each item
      </TaskList>
    </Route>
    <Route path="/about" element={<About />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</App>`,
        caption: "A planning sketch. The actual layout may differ, but this is the shape.",
      },
      walkthrough:
        "App is the parent. It owns the state (the array of tasks), the routing, and the shared layout. The pages wrap the routes with the same chrome. The form and the list live inside the home page. The Task component is rendered once per item, with the task as a prop.",
    },
    {
      type: "concept",
      title: "Step 2 — Plan the state",
      body:
        "State lives in App and is passed down as props. The list of tasks is an array. A new task is a draft string for the input. Each Task has its own state for the edit form (so editing does not change the list until the user saves). There is no need for a global state library at this size.",
      example: {
        language: "tsx",
        code:
`function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Read the brief', done: false },
    { id: 2, title: 'Build the list', done: false },
  ]);
  return <TaskListPage tasks={tasks} setTasks={setTasks} />;
}`,
        caption: "App owns the array. The list page receives the array and the setter, and threads them down to the children.",
      },
      walkthrough:
        "useState returns the array and a setter. The setter is passed down alongside the array so children can update the list. The same setter is reused for add, edit, delete, and toggle. Each operation produces a new array (immutability) so React detects the change.",
    },
    {
      type: "concept",
      title: "Step 3 — Implement the operations",
      body:
        "Four operations on the list: add (append), toggle (flip the done flag), edit (replace the title), delete (filter out). Each one constructs a new array. The children call the setter that came from above; they do not own the list themselves.",
      example: {
        language: "tsx",
        code:
`function addTask(tasks, task) {
  return [...tasks, { ...task, id: Date.now() }];
}
function toggleTask(tasks, id) {
  return tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
}
function deleteTask(tasks, id) {
  return tasks.filter(t => t.id !== id);
}`,
        caption: "Three of the four operations. Edit is left as an exercise: return a new array with the matching task's title updated.",
      },
      walkthrough:
        "Each operation returns a new array — never mutates. addTask uses the spread to copy the array and append. toggleTask uses map to create a new array with the matching task replaced. deleteTask uses filter. Edit follows the same pattern: tasks.map(t => t.id === id ? { ...t, title: newTitle } : t).",
    },
    {
      type: "concept",
      title: "Step 4 — Wire the routing",
      body:
        "Wrap the app in BrowserRouter. List the routes. Pass the same state and setter to whichever component needs them. The navigation is two NavLinks in a Navbar at the top. The 404 catches any URL that did not match.",
      example: {
        language: "tsx",
        code:
`function App() {
  const [tasks, setTasks] = useState([...]);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<TaskListPage tasks={tasks} setTasks={setTasks} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
        caption: "The wiring. The list page receives the state from App.",
      },
      walkthrough:
        "BrowserRouter wraps everything. The Navbar is a sibling of Routes so it renders on every page. The list page receives the tasks and the setter. Any other page that needs the tasks would receive them in the same way. As the app grows, this is the moment a state library or context becomes useful — but for one page of state, props are fine.",
    },
    {
      type: "concept",
      title: "Step 5 — Style it",
      body:
        "Apply a design system. Use Container / Row / Col for layout. Use Card for the task surface. Use Button for the action. Use Form for the input. The visual language comes from the library, not from custom CSS. The customisation, if any, is at the theme level — not at the component level.",
      example: {
        language: "tsx",
        code:
`import { Container, Card, Button, Form } from "react-bootstrap";

return (
  <Container className="my-4">
    <Card>
      <Card.Body>
        <Form onSubmit={add}>
          <Form.Control value={draft} onChange={e => setDraft(e.target.value)} placeholder="New task" />
          <Button type="submit">Add</Button>
        </Form>
      </Card.Body>
    </Card>
    <TaskList tasks={tasks} setTasks={setTasks} />
  </Container>
);`,
        caption: "A page that composes Container, Card, Form, and Button. The visual language comes from the library.",
      },
      walkthrough:
        "Form.Control is the Bootstrap input with the right styling. Button submits the form. Container centres the page and gives it a max-width. Card wraps the form and (separately) each task. The component tree is small and the visual result is consistent across the whole page.",
    },
    {
      type: "interactive",
      componentKey: "ReactSandbox",
      title: "Build the task tracker",
      description: "Build the components incrementally. Start with TaskList and Task. Add the form. Wire the state. Add the routing. The preview is plain HTML — the structure is what matters here.",
    },
    {
      type: "prose",
      title: "Reflection",
      paragraphs: [
        "Once the app is working, the last step is to read the code as if you did not write it. Find the part that is the longest, the part you hesitated on, the part that surprised you. Those are the patterns you have not yet internalised. The patterns you did not hesitate on are the ones you have.",
        "Most of what you built is the same React you have been writing since Lecture 1. The only new pieces are the routing and the design system. State and effects have been there since the middle of the module. The capstone is not a new language — it is the same language, applied to a larger surface.",
      ],
    },
    {
      type: "quiz",
      quizId: "m2l10-q",
    },
    {
      type: "summary",
      body: "The capstone is the same React you have been writing all module. The patterns are: App owns the state, components are small and focused, the list and the form are siblings, the routing is a Routes with two pages and a 404, the design comes from the library. There is no new syntax. The difference between this exercise and the earlier ones is the size — the same patterns, applied to a slightly larger surface. That is the shape of every React app: small components composed into a tree, with state at the top and props flowing down.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l10-q",
    title: "Capstone check",
    questions: [
      {
        kind: "mcq",
        id: "m2l10-q1",
        prompt: "Where should the tasks array live in this app?",
        options: [
          "In the Task component",
          "In the App component",
          "In a global state library",
          "In localStorage",
        ],
        correctIndex: 1,
        explanation: "App is the parent that needs the array and the setter. The list page receives them as props and threads them down to the children.",
      },
      {
        kind: "truefalse",
        id: "m2l10-q2",
        prompt: "You should mutate the tasks array directly to add or remove items.",
        correct: false,
        explanation: "Mutating an existing array breaks React's change detection. Always build a new array — [...tasks, newTask] for add, tasks.filter for delete, tasks.map for toggle or edit.",
      },
      {
        kind: "mcq",
        id: "m2l10-q3",
        prompt: "Which is the right way to mark a task as done?",
        options: [
          "task.done = true;",
          "tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);",
          "setTasks(tasks.push(toggled))",
          "setTasks([...tasks, toggled])",
        ],
        correctIndex: 1,
        explanation: "map produces a new array. The matching task is replaced with a new object that has the done flag flipped. The non-matching tasks pass through unchanged.",
      },
      {
        kind: "code-output",
        id: "m2l10-q4",
        prompt: "What does this return for the input [1, 2, 3]?",
        code: "function addOne(arr) { return [...arr, arr.length + 1]; }",
        language: "js",
        expected: "[1, 2, 3, 4]",
        explanation: "Spread copies the array; the second element is arr.length + 1 = 3 + 1 = 4. The new array is [1, 2, 3, 4].",
      },
      {
        kind: "mcq",
        id: "m2l10-q5",
        prompt: "Where should the 404 route go?",
        options: [
          "First, so it catches everything by default",
          "Last, so other routes match first",
          "In a separate file",
          "There is no 404 in a SPA",
        ],
        correctIndex: 1,
        explanation: "Routes matches the first route that fits. The * matches everything. If it comes first, no other route ever matches.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [
  {
    id: "m2l10-ex01",
    lectureId: "m2l10",
    title: "Build the task tracker",
    brief: "Build a small task-tracker with a list, an add form, and the four operations. Structure is the goal; the preview is plain HTML.",
    starterCode: "function App() {\n  return <p>Build the task tracker here.</p>;\n}",
    tests: [
      { kind: "renders-element", selector: "button", min: 1, description: "Renders at least one button" },
    ],
    hints: [
      "Start with useState for the array of tasks. Build the operations as pure functions: addTask, toggleTask, deleteTask.",
      "The App component owns the state. The list page receives the array and the setter and threads them to the children.",
    ],
    solution: "function App() {\n  const [tasks, setTasks] = useState([\n    { id: 1, title: 'Read the brief', done: false },\n  ]);\n  const [draft, setDraft] = useState('');\n\n  function add() {\n    if (!draft.trim()) return;\n    setTasks([...tasks, { id: Date.now(), title: draft, done: false }]);\n    setDraft('');\n  }\n  function toggle(id) {\n    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));\n  }\n  function remove(id) {\n    setTasks(tasks.filter(t => t.id !== id));\n  }\n\n  return (\n    <div>\n      <input value={draft} onChange={e => setDraft(e.target.value)} placeholder='New task' />\n      <button onClick={add}>Add</button>\n      <ul>\n        {tasks.map(t => (\n          <li key={t.id}>\n            <input type='checkbox' checked={t.done} onChange={() => toggle(t.id)} />\n            <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>\n            <button onClick={() => remove(t.id)}>Delete</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}",
    solutionExplanation:
      "The app holds the tasks array and a draft for the input. add appends a new task; toggle flips the done flag; remove filters out the task. The list renders one <li> per task with a checkbox, a span, and a delete button. All state changes are immutable.",
  },
];
