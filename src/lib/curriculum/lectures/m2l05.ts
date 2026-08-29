import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l05",
  module: 2,
  number: 5,
  title: "JSX, React Components and Props — Part 2",
  subtitle:
    "The deeper patterns: composition, prop drilling, default values, and the small habits that keep a component tree readable as it grows.",
  estimatedMinutes: 60,
  difficulty: "applied",
  prerequisites: ["m2l04"],
  objectives: [
    "Build a small component tree that uses composition and children effectively.",
    "Pass data through several layers using props.",
    "Use default values for optional props.",
    "Recognise the prop-drilling problem and when it matters.",
    "Render a component conditionally without breaking the rules of JSX.",
  ],
  sources: [
    { label: "React — Thinking in React", type: "react", url: "https://react.dev/learn/thinking-in-react" },
    { label: "React — Passing Props to a Component", type: "react", url: "https://react.dev/learn/passing-props-to-a-component" },
    { label: "MDN — React", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_components" },
  ],
  sections: [
    {
      type: "context",
      body:
        "Part 1 covered the shape of a component and the rules of JSX. Part 2 covers the patterns that show up when you start composing components: how data flows through a tree, how to keep the parent and child decoupled, and the small habits that prevent a small component from growing into a small mess.",
    },
    {
      type: "objectives",
      items: [
        "Build a small component tree that uses composition and children effectively.",
        "Pass data through several layers using props.",
        "Use default values for optional props.",
        "Recognise the prop-drilling problem and when it matters.",
        "Render a component conditionally without breaking the rules of JSX.",
      ],
    },
    {
      type: "concept",
      title: "Composition over configuration",
      body:
        "A common React pattern is to build small, focused components and compose them. Card wraps content. Avatar shows an image. Badge shows a label. Page composes them all. The alternative — one big Page component that handles every case with props — leads to a component with 200 lines of conditional rendering. The composed version is shorter, easier to read, and easier to test.",
      example: {
        language: "tsx",
        code:
`function Page({ user, children }) {
  return (
    <main>
      <header>
        <Avatar src={user.avatar} />
        <h1>{user.name}</h1>
      </header>
      {children}
    </main>
  );
}

<Page user={user}>
  <p>Welcome back.</p>
</Page>`,
        caption: "Page does not know what its children are. It provides chrome; the parent provides content.",
      },
      walkthrough:
        "Page takes a user and renders a header with their avatar and name. The actual content of the page is whatever the parent puts between the tags — a paragraph, a form, a list. Page does not need to know. The same Page could wrap a login screen, a profile screen, or a settings screen, all with the same chrome.",
    },
    {
      type: "concept",
      title: "Default prop values",
      body:
        "A prop can be made optional by destructuring with a default value. If the parent does not pass the prop, the default is used. This is the cleanest way to give a component a sensible default for a prop that is often not needed.",
      example: {
        language: "tsx",
        code:
`function Button({ variant = 'primary', size = 'md', children, ...rest }) {
  return <button className={\`btn btn-\${variant} btn-\${size}\`} {...rest}>{children}</button>;
}

<Button>Save</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger" size="sm">Delete</Button>`,
        caption: "Button has sensible defaults but accepts overrides. The ...rest spread forwards unknown props to the underlying <button>.",
      },
      walkthrough:
        "The destructuring with = 'primary' sets the default for variant. The same pattern works for size. The ...rest collects any other props (onClick, disabled, type) and spreads them onto the actual <button> element. This is the shape of a reusable button — most props are optional, defaults are sensible, and the rest are passed through.",
    },
    {
      type: "concept",
      title: "Prop drilling — when it bites",
      body:
        "When a piece of data is needed in a component that is far down the tree from the component that owns it, the data has to be passed through every layer in between. This is prop drilling. For one or two levels, it is fine. For five levels, it becomes a maintenance burden — every intermediate component gets a new prop it does not use, just to pass it on. Solutions come later (context, state libraries, server components), but recognising the smell is the first step.",
      example: {
        language: "tsx",
        code:
`function App() {
  const user = { name: "Sora" };
  return <Page user={user} />;
}
function Page({ user }) {
  return <Sidebar user={user} />;
}
function Sidebar({ user }) {
  return <Avatar user={user} />;
}
function Avatar({ user }) {
  return <img src={user.avatar} alt={user.name} />;
}`,
        caption: "App owns user; Avatar needs it. Page and Sidebar are just passing it through.",
      },
      walkthrough:
        "App owns the user. Page needs the user for one reason (the header). Sidebar needs the user for another. Avatar actually renders the user. The user has to travel from App through Page, Sidebar, and into Avatar. Page and Sidebar are now coupled to a piece of data they do not use — they only pass it on. This is the prop-drilling smell. For three levels it is fine. For eight it is not.",
    },
    {
      type: "concept",
      title: "Conditional rendering without breaking the rules",
      body:
        "A component must return a single root, an array, or null. Conditional rendering usually uses one of three patterns: an early return (if (!cond) return null;) for the missing case, a ternary (cond ? <A /> : <B />) for two branches, or a logical AND (cond && <A />) for an optional add-on. The early return is the cleanest for the missing case because it stops the rest of the component from running.",
      example: {
        language: "tsx",
        code:
`function Profile({ user }) {
  if (!user) return <SignInPrompt />;
  return (
    <main>
      <h1>{user.name}</h1>
      {user.bio && <p>{user.bio}</p>}
    </main>
  );
}`,
        caption: "Early return for the missing case, && for the optional add-on.",
      },
      walkthrough:
        "When user is missing, the component renders a SignInPrompt and stops. When user is present, it renders the main content. The {user.bio && <p>} pattern only renders the paragraph when bio is truthy — the && is safe for booleans and non-empty strings, but be careful with 0 (the number) which is falsy: 0 && <p>...</p> renders 0, not nothing.",
    },
    {
      type: "example",
      title: "A reusable Card with a Header, Body, and Footer",
      code:
`function Card({ children, className = "" }) {
  return <article className={\`card \${className}\`}>{children}</article>;
}
function CardHeader({ children }) {
  return <header className="card-header">{children}</header>;
}
function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}
function CardFooter({ children }) {
  return <footer className="card-footer">{children}</footer>;
}

<Card>
  <CardHeader>
    <h3>Profile</h3>
  </CardHeader>
  <CardBody>
    <p>Welcome back, Sora.</p>
  </CardBody>
  <CardFooter>
    <Button>Edit</Button>
  </CardFooter>
</Card>`,
      language: "tsx",
      walkthrough:
        "Card is a thin wrapper. CardHeader, CardBody, CardFooter are thin wrappers too. None of them know about the others' content. The consumer composes them. This is the same shape as Bootstrap's Card, Material UI's Card, and most design systems — the primitive is small, the composition is the API.",
    },
    {
      type: "interactive",
      componentKey: "ReactSandbox",
      title: "Compose a Card with Header, Body, Footer",
      description: "Build a small Card primitive. Use composition, not configuration. The next lecture (State) will breathe life into it.",
    },
    {
      type: "mistakes",
      title: "Common mistakes at this stage",
      items: [
        {
          mistake: "Mutating a prop inside the child.",
          fix: "Props are read-only. The parent owns the data; the child receives a snapshot. If the child needs to change something, the parent passes a setter as a prop, and the child calls it.",
        },
        {
          mistake: "Forgetting a default value for an optional prop that is sometimes missing.",
          fix: "Destructuring with a default value handles this in one line. function Button({ variant = 'primary' }) — even when the parent does not pass variant, the destructured value is 'primary'.",
        },
        {
          mistake: "Using && with the number 0 or an empty string.",
          fix: "0 && <p>...</p> renders 0, not nothing, because 0 is a valid value to display. Convert the value to a boolean first: {!!count && <p>{count} items</p>}, or use a ternary: {count ? <p>{count} items</p> : null}.",
        },
      ],
    },
    {
      type: "react-exercise",
      exerciseId: "m2l05-ex01",
      title: "A reusable Button",
      description: "Build a small Button primitive that accepts a 'variant' prop with the default 'primary'.",
    },
    {
      type: "quiz",
      quizId: "m2l05-q",
    },
    {
      type: "summary",
      body: "Composition is the pattern that makes React trees readable. Small focused components wrap content; a parent composes them. Default prop values handle the optional case in one line. Prop drilling is fine for two levels; beyond that, the data has to be moved up the tree. Conditional rendering has three idioms: early return, ternary, and &&. State is the next piece of the puzzle — without it, every component is a pure function of its props.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l05-q",
    title: "JSX and Components Part 2 check",
    questions: [
      {
        kind: "mcq",
        id: "m2l05-q1",
        prompt: "What is composition in React?",
        options: [
          "Using class components together",
          "Combining small, focused components to build a larger UI",
          "Using a single component with many props",
          "A way to share state between components",
        ],
        correctIndex: 1,
        explanation: "Composition means building larger UIs by combining small focused components. The alternative — one big component with many props — does not scale.",
      },
      {
        kind: "code-output",
        id: "m2l05-q2",
        prompt: "What does this render when called as <Button variant=\"danger\">Delete</Button>?",
        code: "function Button({ variant = 'primary', children }) {\n  return <button className={'btn btn-' + variant}>{children}</button>;\n}",
        language: "tsx",
        expected: "<button class=\"btn btn-danger\">Delete</button>",
        explanation: "The default 'primary' is overridden by the passed 'danger'. children is the text 'Delete'. The rendered class is 'btn btn-danger'.",
      },
      {
        kind: "truefalse",
        id: "m2l05-q3",
        prompt: "Prop drilling is always a problem.",
        correct: false,
        explanation: "Prop drilling is fine for one or two levels. It becomes a maintenance burden when the data has to travel through many layers that do not use it themselves.",
      },
      {
        kind: "mcq",
        id: "m2l05-q4",
        prompt: "Which is the right way to render an optional badge next to a name?",
        options: [
          "{user.badge && <Badge>{user.badge}</Badge>}",
          "{!!user.badge && <Badge>{user.badge}</Badge>}",
          "user.badge ? <Badge /> : null",
          "All of the above",
        ],
        correctIndex: 3,
        explanation: "All three work. The first is concise. The second is safer when the value might be 0. The third is the most explicit. The choice is style, not correctness, when the value is a string or a boolean.",
      },
      {
        kind: "code-output",
        id: "m2l05-q5",
        prompt: "What does this render when count is 0?",
        code: "function Items({ count }) {\n  return <p>{count && count + ' items'}</p>;\n}",
        language: "tsx",
        expected: "<p>0</p>",
        explanation: "count is 0, which is falsy. 0 && '...' returns 0, not the right side. The badge renders 0. The fix is {!!count && count + ' items'} or {count ? count + ' items' : 'No items'}.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [
  {
    id: "m2l05-ex01",
    lectureId: "m2l05",
    title: "A reusable Button",
    brief: "Build a small Button primitive that accepts a 'variant' prop with the default 'primary'.",
    starterCode: `function Button({ children }) {
  // accept a variant prop with a default of 'primary' and a size prop with a default of 'md'
  return <button className="btn">Edit me</button>;
}

function App() {
  return <Button>Save</Button>;
}`,
    tests: [
      { kind: "renders-element", selector: "button", min: 1, description: "A button is rendered" },
      { kind: "has-class", selector: "button", className: "btn-primary", description: "The default variant produces btn-primary" },
    ],
    hints: [
      "Destructure variant with a default value: { variant = 'primary' }.",
      "Combine the variant into the className: 'btn btn-' + variant.",
    ],
    solution: `function Button({ children, variant = 'primary', size = 'md' }) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`}>
      {children}
    </button>
  );
}

function App() {
  return <Button>Save</Button>;
}`,
    solutionExplanation:
      "The destructuring with = 'primary' sets the default. The className combines 'btn' with the variant and size. When called without variant, the class becomes 'btn btn-primary btn-md'.",
  },
];
