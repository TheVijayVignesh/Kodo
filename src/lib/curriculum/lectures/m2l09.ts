import type { Lecture, Quiz, ReactExercise } from "../types";

export const lecture: Lecture = {
  id: "m2l09",
  module: 2,
  number: 9,
  title: "React Bootstrap",
  subtitle:
    "Building a polished UI on top of a design system. React Bootstrap, layout, responsive design, and the small set of components most apps need.",
  estimatedMinutes: 55,
  difficulty: "core",
  prerequisites: ["m2l08"],
  objectives: [
    "Explain what a component library is and the trade-offs of using one.",
    "Use React Bootstrap's Button, Card, Navbar, and Container.",
    "Lay out a page with the Grid system.",
    "Apply a consistent visual language without writing every style by hand.",
    "Recognise when a component library is the right answer and when it is not.",
  ],
  sources: [
    { label: "React Bootstrap — Getting Started", type: "react", url: "https://react-bootstrap.netlify.app/docs/getting-started/introduction" },
    { label: "Bootstrap 5 — Layout", type: "mdn", url: "https://getbootstrap.com/docs/5.3/layout/breakpoints/" },
  ],
  sections: [
    {
      type: "context",
      body:
        "A design system is a set of small decisions — colours, type scale, spacing — that you make once and apply everywhere. A component library is the same idea turned into code: a Button that already knows the right hover state, a Card that already knows the right padding, a Navbar that already knows how to collapse on mobile. React Bootstrap is one of the most popular component libraries for React. This lecture covers the small set of components most apps need, and the small set of conventions that make a polished UI.",
    },
    {
      type: "objectives",
      items: [
        "Explain what a component library is and the trade-offs of using one.",
        "Use React Bootstrap's Button, Card, Navbar, and Container.",
        "Lay out a page with the Grid system.",
        "Apply a consistent visual language without writing every style by hand.",
        "Recognise when a component library is the right answer and when it is not.",
      ],
    },
    {
      type: "prose",
      title: "What a component library gives you",
      paragraphs: [
        "Without a component library, every Button is a fresh decision: what colour, what padding, what hover state, what focus state, what disabled state. Multiply that by ten component types, and you have a hundred small decisions before you have written any actual application logic. A component library makes those decisions once, in code, and gives you the result as components. The trade-off is that your app looks like every other app on the same library — until you customise the theme.",
        "React Bootstrap is a port of the popular Bootstrap CSS framework. It is mature, widely used, and unopinionated about the rest of your stack. The alternative libraries (Material UI, Chakra, Mantine, Ant Design) all offer similar shapes with different visual languages. The right choice is the one that matches the look you want and the team you are working with.",
      ],
    },
    {
      type: "concept",
      title: "Layout — Container, Row, Col",
      body:
        "React Bootstrap's layout is the same as Bootstrap's CSS layout. Container is a centered, max-width wrapper. Row is a horizontal flex container. Col is a column inside a row. The columns share the row's width and can be sized with a number (1-12) or with breakpoints (xs, sm, md, lg, xl).",
      example: {
        language: "tsx",
        code:
`import { Container, Row, Col } from "react-bootstrap";

function Page() {
  return (
    <Container>
      <Row>
        <Col md={8}><h1>Main</h1></Col>
        <Col md={4}><aside>Sidebar</aside></Col>
      </Row>
    </Container>
  );
}`,
        caption: "A two-column layout. The main column takes 8/12 on medium screens and up; the sidebar takes 4/12.",
      },
      walkthrough:
        "Container is the page-width wrapper. Row is the flex row. Col md={8} takes 8 of 12 columns on medium screens and up; on smaller screens it takes the full width. The grid sums to 12 — the column count is the budget you spend.",
    },
    {
      type: "concept",
      title: "Components — Button, Card, Navbar",
      body:
        "React Bootstrap exposes the same components Bootstrap is known for. Button comes in variants (primary, secondary, success, danger, warning, info, light, dark) and sizes (sm, lg). Card is a flexible content container with optional Header, Body, and Footer. Navbar is a responsive navigation bar that collapses on small screens.",
      example: {
        language: "tsx",
        code:
`import { Button, Card, Navbar, Container, Nav } from "react-bootstrap";

function App() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>Kōdo</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#about">About</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}`,
        caption: "A dark navbar with brand and two links. React Bootstrap uses Bootstrap's variant props.",
      },
      walkthrough:
        "Navbar.Brand is a sub-component, accessed through the dot syntax. data-bs-theme is a Bootstrap 5 attribute that flips the colour palette for descendants. Nav.Link is the navigation bar link; me-auto is a Bootstrap utility class that pushes the next item to the right.",
    },
    {
      type: "example",
      title: "A profile page with Card",
      code:
`import { Card, Button, Container } from "react-bootstrap";

function Profile({ user }) {
  return (
    <Container className="my-4">
      <Card style={{ maxWidth: 480 }}>
        <Card.Img variant="top" src={user.avatar} />
        <Card.Body>
          <Card.Title>{user.name}</Card.Title>
          <Card.Text>{user.bio}</Card.Text>
          <Button variant="primary">Follow</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}`,
      language: "tsx",
      walkthrough:
        "Card is a small composable surface: Img at the top, then Body with Title and Text, then any buttons. The variant prop on Button picks the colour from the theme. The style prop on Card sets a max-width — a small inline adjustment on top of the library's defaults.",
    },
    {
      type: "interactive",
      componentKey: "ReactSandbox",
      title: "Compose a small page with React Bootstrap",
      description: "Use Container, Row, Col, Card, and Button to compose a small page. The preview is plain HTML — Bootstrap styles do not load here, but the JSX is the same as in a real app.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with a component library",
      items: [
        {
          mistake: "Trying to install React Bootstrap and Tailwind at the same time and getting unexpected style conflicts.",
          fix: "Pick one styling system per project. React Bootstrap owns the visual language; you do not need Tailwind alongside it. If you want both, learn the integration carefully before shipping.",
        },
        {
          mistake: "Forgetting to import the Bootstrap CSS in the layout.",
          fix: "React Bootstrap's components are unstyled until Bootstrap's CSS is loaded. The standard way: import 'bootstrap/dist/css/bootstrap.min.css' in the root layout.",
        },
        {
          mistake: "Trying to restyle every component with inline style instead of using the library's variants.",
          fix: "Use the variant prop on Button. Use bg=\"dark\" on Navbar. The library is the source of truth for the visual language; inline styles are for small adjustments on top.",
        },
      ],
    },
    {
      type: "react-exercise",
      exerciseId: "m2l09-ex01",
      title: "A small profile page",
      description: "Compose a Card with a title, a body, and a Button. The preview is plain HTML, so the structure is what matters here.",
    },
    {
      type: "quiz",
      quizId: "m2l09-q",
    },
    {
      type: "summary",
      body: "A component library makes the small visual decisions once, in code. React Bootstrap exposes the same components Bootstrap is known for, with the same variant props. Layout is Container / Row / Col; the grid is 12 columns. Button comes in variants and sizes. Card is a flexible content surface. Navbar is a responsive navigation. The right library is the one that matches the look you want and the team you work with — the patterns are similar across the popular choices.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m2l09-q",
    title: "React Bootstrap check",
    questions: [
      {
        kind: "mcq",
        id: "m2l09-q1",
        prompt: "What is the grid in React Bootstrap?",
        options: [
          "12 columns, summed across a Row",
          "16 columns, summed across a Row",
          "A flex container with arbitrary columns",
          "A CSS grid with named lines",
        ],
        correctIndex: 0,
        explanation: "Bootstrap's grid is 12 columns. The Col components inside a Row must sum to 12, or wrap to the next row.",
      },
      {
        kind: "truefalse",
        id: "m2l09-q2",
        prompt: "React Bootstrap's components are unstyled by default until you import Bootstrap's CSS.",
        correct: true,
        explanation: "React Bootstrap exposes the components but the visual styles come from Bootstrap's CSS. import 'bootstrap/dist/css/bootstrap.min.css' once in the root layout.",
      },
      {
        kind: "mcq",
        id: "m2l09-q3",
        prompt: "Which is the right way to size a column on medium and up, and full width on smaller screens?",
        options: [
          "<Col xs={12} md={4}>",
          "<Col md={4}>",
          "<Col sm={12} md={4}>",
          "<Col md={4} sm={12}>",
        ],
        correctIndex: 1,
        explanation: "<Col md={4}> takes 4/12 columns on medium and up. On smaller screens, Bootstrap's default is full width. No xs or sm prop needed.",
      },
      {
        kind: "mcq",
        id: "m2l09-q4",
        prompt: "Which is NOT a Button variant?",
        options: ["primary", "danger", "warning", "transparent"],
        correctIndex: 3,
        explanation: "transparent is not a built-in variant. The built-in variants are primary, secondary, success, danger, warning, info, light, dark, and link.",
      },
      {
        kind: "code-output",
        id: "m2l09-q5",
        prompt: "What is the rendered structure of this JSX?",
        code: "<Container><Row><Col><h1>Hi</h1></Col></Row></Container>",
        language: "tsx",
        expected: "<div class='container'><div class='row'><div class='col'><h1>Hi</h1></div></div></div>",
        explanation: "Container becomes a div with the .container class. Row becomes a div with .row. Col becomes a div with .col. The h1 is a child of the column.",
      },
    ],
  },
];

export const reactExercises: ReactExercise[] = [
  {
    id: "m2l09-ex01",
    lectureId: "m2l09",
    title: "A small profile page",
    brief: "Compose a Card with a title, a body, and a Button. The preview is plain HTML, so the structure is what matters here.",
    starterCode: "function App() {\n  // Compose a Card with Card.Title, Card.Text, and a Button\n  return <p>Replace this with a Card.</p>;\n}",
    tests: [
      { kind: "renders-element", selector: "button", min: 1, description: "Renders a button" },
    ],
    hints: [
      "Card is a container; Card.Body holds the content; Card.Title is a heading inside the body.",
      "Button is from react-bootstrap, but the preview does not load the library styles — focus on the JSX structure.",
    ],
    solution: "function App() {\n  return (\n    <div className='card'>\n      <div className='card-body'>\n        <h5 className='card-title'>Hello</h5>\n        <p className='card-text'>A short bio.</p>\n        <button className='btn btn-primary'>Follow</button>\n      </div>\n    </div>\n  );\n}",
    solutionExplanation:
      "The Card is a div with the .card class. Body, Title, and Text are sub-elements with their own Bootstrap classes. The Button is a .btn with the .btn-primary variant. In a real app, these would be the React Bootstrap components, but the underlying DOM is the same.",
  },
];
