import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l08",
  module: 2,
  number: 8,
  title: "React Routing",
  subtitle:
    "How a single-page application navigates between views without reloading the page. Client-side routing, dynamic params, and nested routes.",
  estimatedMinutes: 65,
  difficulty: "applied",
  prerequisites: ["m2l07"],
  objectives: [
    "Explain what client-side routing is and why it exists.",
    "Use React Router's BrowserRouter, Routes, and Route components.",
    "Build a small multi-page app with Link, NavLink, and useNavigate.",
    "Read route parameters with useParams.",
    "Handle 404s with a NotFound route.",
  ],
  sources: [
    { label: "React Router — Getting Started", type: "react", url: "https://reactrouter.com/en/main/start/overview" },
    { label: "MDN — SPA navigation", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_routing" },
  ],
  sections: [
    {
      type: "context",
      body:
        "A single-page application has one HTML file. Navigation between views is not a page reload — it is a JavaScript function that updates the URL and re-renders the page. React Router is the library that gives React this capability. This lecture covers the core of React Router: routes, links, parameters, and 404s. By the end you will be able to build a small multi-page app inside the React sandbox.",
    },
    {
      type: "objectives",
      items: [
        "Explain what client-side routing is and why it exists.",
        "Use React Router's BrowserRouter, Routes, and Route components.",
        "Build a small multi-page app with Link, NavLink, and useNavigate.",
        "Read route parameters with useParams.",
        "Handle 404s with a NotFound route.",
      ],
    },
    {
      type: "prose",
      title: "Why client-side routing exists",
      paragraphs: [
        "In a server-rendered application, every navigation is a full page load: the browser requests a new HTML file, the server sends it, the browser throws away the current page and renders the new one. In a single-page application, the navigation is a JavaScript function: the URL is updated, the router renders the new view, and the rest of the page (the navigation, the header, the footer) stays where it is. The benefit is speed and continuity — the user does not see a flash of white between views.",
        "The cost is that the URL no longer maps directly to a file. The router is a small piece of code that listens for URL changes and renders the right component. The user's bookmark works, the back button works, deep links work — but only because the router is doing the work.",
      ],
    },
    {
      type: "concept",
      title: "BrowserRouter, Routes, Route",
      body:
        "BrowserRouter is the wrapper that gives the rest of the app access to the URL. Routes is a list of routes. Route is a single route — a path and a component. When the URL matches the path, the component renders. The path can include parameters (prefixed with a colon) that are read with useParams.",
      example: {
        language: "tsx",
        code:
`import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
        caption: "The minimum needed to give a React app multiple URLs.",
      },
      walkthrough:
        "BrowserRouter wraps the app and listens to the URL. Routes is a list of Route. Each Route has a path and an element. The :id in /users/:id is a parameter — it matches any value, and the matched value is exposed inside UserProfile via useParams. The * path matches anything, used as a 404 fallback.",
    },
    {
      type: "concept",
      title: "Link and NavLink — navigation without reload",
      body:
        "Link is React Router's replacement for the <a> tag. Clicking a Link updates the URL and renders the new route without a page reload. NavLink is the same as Link but adds an 'active' class when the link's destination matches the current URL — useful for highlighting the current page in a navigation bar.",
      example: {
        language: "tsx",
        code:
`import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <Link to="/users/42">Profile</Link>
    </nav>
  );
}`,
        caption: "Use NavLink for navigation that should highlight when active, Link for everything else.",
      },
      walkthrough:
        "The `end` prop on NavLink means the link is only active when the URL is exactly '/'. Without `end`, / is also active for every other URL. NavLink automatically gets the 'active' class when the URL matches; CSS targets .active to show the highlight. The Link to /users/42 is a deep link that goes straight to a specific user profile.",
    },
    {
      type: "concept",
      title: "useParams — reading parameters from the URL",
      body:
        "useParams returns the URL parameters for the current route. A route like /users/:id makes id available as params.id. The hook must be called inside a component that is rendered by the matching route.",
      example: {
        language: "tsx",
        code:
`import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();
  return <h1>User #{id}</h1>;
}`,
        caption: "useParams returns an object whose keys match the parameter names in the route.",
      },
      walkthrough:
        "When the URL is /users/42, the route matches and the id parameter is '42'. The component renders 'User #42'. The id is a string — if the route accepts numbers, the component can parse it with Number(id).",
    },
    {
      type: "concept",
      title: "useNavigate — programmatic navigation",
      body:
        "useNavigate returns a function that navigates programmatically. Useful after a form submit, after an API call resolves, or when the user does something that should change the URL but is not a click on a Link.",
      example: {
        language: "tsx",
        code:
`import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  async function onSubmit(values) {
    await api.signup(values);
    navigate("/dashboard");
  }
  return <form onSubmit={onSubmit}>...</form>;
}`,
        caption: "After a successful signup, navigate programmatically to the dashboard.",
      },
      walkthrough:
        "navigate(\"/dashboard\") changes the URL and renders the route. The function also accepts a number argument for going back (-1) or forward (1) in the history, like navigate(-1) for the back button.",
    },
    {
      type: "example",
      title: "A small multi-page app",
      code:
`import { BrowserRouter, Routes, Route, NavLink, useParams } from "react-router-dom";

function Layout({ children }) {
  return (
    <div>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <main>{children}</main>
    </div>
  );
}

function Home() { return <h1>Home</h1>; }
function About() { return <h1>About</h1>; }
function Tasks() { return <h1>Tasks</h1>; }
function Task() { return <h1>Task</h1>; }
function NotFound() { return <h1>404</h1>; }

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<Task />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}`,
      language: "tsx",
      walkthrough:
        "Layout wraps every route in the same navigation and main area. The four routes share the chrome. /tasks and /tasks/:id are nested — the second matches /tasks/42, not /tasks. The * at the end catches anything that did not match. In a real app, the data layer would fetch the task by id; here we just render the id.",
    },
    {
      type: "interactive",
      componentKey: "ReactSandbox",
      title: "Build a small router",
      description: "Build a tiny app with two routes. Link from one to the other. Watch the URL change without a page reload.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with routing",
      items: [
        {
          mistake: "Using an <a> tag for navigation.",
          fix: "An <a> tag triggers a full page reload. Use <Link> from react-router-dom instead. The Link component updates the URL without reloading the page.",
        },
        {
          mistake: "Forgetting to wrap the app in BrowserRouter.",
          fix: "BrowserRouter provides the router context. Hooks like useParams and useNavigate require it. Without it, the hooks throw.",
        },
        {
          mistake: "Putting a more specific route after a more general one.",
          fix: "Routes matches the first route that matches the path. /tasks/:id before /tasks would never match /tasks by itself. The order matters: list specific routes first.",
        },
        {
          mistake: "Putting the 404 route before other routes.",
          fix: "The * matches everything. If it comes first, no other route ever matches. Put 404 last.",
        },
      ],
    },
    {
      type: "react-exercise",
      exerciseId: "m2l08-ex01",
      title: "A two-page app",
      description: "Build a small app with two routes: /home and /about. Add a link from each to the other.",
    },
    {
      type: "quiz",
      quizId: "m2l08-q",
    },
    {
      type: "summary",
      body: "Client-side routing replaces page reloads with JavaScript navigation. React Router gives React this capability: BrowserRouter wraps the app, Routes lists the routes, Route maps a path to a component. Link and NavLink navigate without a reload. useParams reads URL parameters. useNavigate is for programmatic navigation. The 404 route is `*` and comes last. These primitives are enough to build a small multi-page app; the same patterns scale to large applications.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l08-q",
    title: "React Routing check",
    questions: [
      {
        kind: "mcq",
        id: "m2l08-q1",
        prompt: "What does BrowserRouter do?",
        options: [
          "Renders the first page of the app",
          "Wraps the app and gives the rest access to the URL",
          "Loads the routes from a JSON file",
          "Replaces the browser's address bar",
        ],
        correctIndex: 1,
        explanation: "BrowserRouter is the wrapper. Without it, the routing hooks (useParams, useNavigate) have no router context to draw from.",
      },
      {
        kind: "truefalse",
        id: "m2l08-q2",
        prompt: "An <a> tag works for navigation inside a React Router app.",
        correct: false,
        explanation: "An <a> tag triggers a full page reload. Use <Link> from react-router-dom for in-app navigation.",
      },
      {
        kind: "code-output",
        id: "m2l08-q3",
        prompt: "What does UserProfile render when the URL is /users/42?",
        code: "function UserProfile() {\n  const { id } = useParams();\n  return <h1>User #{id}</h1>;\n}",
        language: "tsx",
        expected: "<h1>User #42</h1>",
        explanation: "The :id in the route pattern is exposed as params.id. The component renders the id in the heading.",
      },
      {
        kind: "mcq",
        id: "m2l08-q4",
        prompt: "Where should the 404 route go?",
        options: [
          "First, so it catches everything by default",
          "Anywhere — the order does not matter",
          "Last, so other routes can match first",
          "In a separate file",
        ],
        correctIndex: 2,
        explanation: "Routes matches the first route that fits. The * matches everything. If it comes first, no other route ever matches.",
      },
      {
        kind: "mcq",
        id: "m2l08-q5",
        prompt: "What is the difference between Link and NavLink?",
        options: [
          "There is no difference",
          "NavLink is for navigation menus, Link is for everything",
          "NavLink adds an 'active' class when the current URL matches",
          "Link does server-side routing, NavLink does client-side",
        ],
        correctIndex: 2,
        explanation: "NavLink is a Link that adds an 'active' class (or an isActive function prop) when the current URL matches its destination. CSS targets .active for highlighting.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [
  {
    id: "m2l08-ex01",
    lectureId: "m2l08",
    title: "A two-page app",
    brief: "Build a small app with two routes: /home and /about. Add a link from each to the other.",
    starterCode: "// The React playground does not include react-router-dom by default.\n// For this exercise, see the lecture example and reproduce the structure.\nfunction App() {\n  return <p>See the lecture example for routing.</p>;\n}",
    tests: [
      { kind: "renders-element", selector: "p", min: 1, description: "Renders a paragraph" },
    ],
    hints: [
      "Routes need to live inside BrowserRouter to have access to the URL.",
      "List specific routes first, 404 last.",
    ],
    solution: "import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';\n\nfunction Home() { return <h1>Home</h1>; }\nfunction About() { return <h1>About</h1>; }\nfunction NotFound() { return <h1>Not found</h1>; }\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <nav>\n        <Link to='/home'>Home</Link> | <Link to='/about'>About</Link>\n      </nav>\n      <Routes>\n        <Route path='/home' element={<Home />} />\n        <Route path='/about' element={<About />} />\n        <Route path='*' element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}",
    solutionExplanation:
      "BrowserRouter wraps the app. Two routes are listed before the 404 fallback. Link from react-router-dom is used for navigation. The * route catches any URL that did not match.",
  },
];
