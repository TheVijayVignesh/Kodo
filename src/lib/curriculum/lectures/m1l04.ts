import type { Lecture, Quiz, Exercise } from "../types";

export const lecture: Lecture = {
  id: "m1l04",
  module: 1,
  number: 4,
  title: "CSS",
  subtitle:
    "Selectors, the cascade, the box model, layout primitives, and the things you will reach for first when a page looks wrong.",
  estimatedMinutes: 70,
  difficulty: "core",
  prerequisites: ["m1l03"],
  objectives: [
    "Write CSS that selects elements with simple, combinator, attribute, and pseudo-class selectors.",
    "Explain how the cascade, specificity, and inheritance resolve a style when two rules conflict.",
    "Describe the box model and how padding, border, and margin combine with width and height.",
    "Lay out a page with flexbox and grid.",
    "Diagnose why a CSS rule is or is not being applied.",
  ],
  sources: [
    { label: "Course slides — CSS", type: "course" },
    { label: "MDN — CSS", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { label: "MDN — The box model", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model" },
    { label: "MDN — Flexbox", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox" },
    { label: "MDN — CSS Grid", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout" },
  ],
  sections: [
    {
      type: "context",
      body:
        "CSS is the layer that decides what the document looks like. This lecture covers the rules of selection, the cascade that decides which rule wins, the box model that decides how big each element is, and the layout primitives that put things in their place. By the end of it you will be able to read a CSS file and predict the shape of the page it produces.",
    },
    {
      type: "objectives",
      items: [
        "Read a selector and predict which elements it matches.",
        "Apply the cascade and specificity to decide which of two conflicting rules wins.",
        "Compute an element's total width and height with the box model.",
        "Centre, distribute, and align children with flexbox.",
        "Build a simple grid with named columns and rows.",
        "Use the CSS lab to edit styles and see results immediately.",
      ],
    },
    {
      type: "concept",
      title: "Selectors — what each rule applies to",
      body:
        "A selector is the part before the brace. It picks which elements the rule applies to. Element selectors match by tag name (.card matches by class, #main matches by id). Combinators express relationships (div > p matches p that are direct children of div; a + b matches a b that immediately follows another a). Attribute selectors match by attribute value. Pseudo-classes match by state (:hover, :focus, :first-child). Pseudo-elements match a specific part of an element (::before, ::first-letter).",
      example: {
        language: "css",
        code:
`/* Type selector */
h1 { font-family: Georgia, serif; }

/* Class selector */
.note { color: #5a4d2f; }

/* ID selector */
#submit { background: #c14a3a; }

/* Descendant combinator */
article p { line-height: 1.6; }

/* Direct child */
ul > li { list-style: none; }

/* Attribute selector */
input[type="email"] { border-color: #c14a3a; }

/* Pseudo-class */
a:hover { text-decoration: underline; }`,
        caption: "The selectors you will use every day. The pattern is selector { property: value; }.",
      },
    },
    {
      type: "concept",
      title: "The cascade, specificity, and inheritance",
      body:
        "When two rules target the same element, the cascade decides which wins. The rules: 1) later rules override earlier rules at the same specificity; 2) a more specific selector wins; 3) !important breaks the order; 4) inline styles win unless overridden. Specificity is a four-part score (a, b, c, d) where a is the number of #id selectors, b is the number of .class/[attr]/:pseudo-class selectors, c is the number of type/::pseudo-element selectors, d is irrelevant. Inheritance handles the rest: properties like color and font-family are inherited from the parent; properties like margin and padding are not.",
      example: {
        language: "css",
        code:
`/* Specificity: 0,0,0,1 */
p { color: #1f1a0e; }

/* Specificity: 0,0,1,0 */
.note { color: #5a4d2f; }

/* Specificity: 0,1,0,0 — wins, because b > c */
article .note { color: #a23a2c; }`,
        caption: "The class selector with the parent combinator beats the single class rule because it has a higher specificity score.",
      },
      pitfall:
        "Using !important to force a style is a code smell. It means you've lost an argument with the cascade. The right fix is to make the selector more specific, or to remove a competing rule.",
    },
    {
      type: "concept",
      title: "The box model — every element is a box",
      body:
        "Every element is a rectangle. From the inside out: content (the actual text or image), padding (space between the content and the border), border (a line around the padding), margin (space outside the border, separating the element from its neighbours). The total width of the element is content + padding-left + padding-right + border-left + border-right. If you set box-sizing: border-box, width includes padding and border, which is almost always what you want.",
      example: {
        language: "css",
        code:
`* { box-sizing: border-box; }

.card {
  width: 320px;          /* the visible width */
  padding: 24px;         /* inside the border */
  border: 1px solid #d4c7a4;
  margin: 16px;          /* outside the border */
  background: #fff;
}`,
        caption: "With box-sizing: border-box, width includes padding and border. The card is exactly 320px wide.",
      },
    },
    {
      type: "concept",
      title: "Display — block, inline, flex, grid",
      body:
        "The display property decides how an element participates in layout. block starts on a new line and stretches to fill the container. inline runs inside a line. inline-block is an inline element that can have a width and height. flex turns the element into a flex container whose children become flex items, and gives you a row of controls for aligning and distributing them. grid does the same but in two dimensions — rows and columns.",
    },
    {
      type: "concept",
      title: "Flexbox — a one-dimensional layout",
      body:
        "A flex container lays its children along a main axis (the default is row). The flex-direction property chooses the axis. justify-content distributes the children along the main axis (start, center, space-between, space-around, space-evenly). align-items aligns them along the cross axis (stretch, center, start, end). gap sets the spacing between children without using margin. The flex property on a child controls how it grows, shrinks, and what its base size is — flex: 1 makes it fill the remaining space; flex: 0 1 auto keeps it at its content size.",
      example: {
        language: "css",
        code:
`.row {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}
.row > .item {
  flex: 1;                /* each item takes equal width */
  padding: 1rem;
  background: #f1ead7;
}`,
        caption: "Three items in a row, equal width, even spacing.",
      },
    },
    {
      type: "concept",
      title: "Grid — a two-dimensional layout",
      body:
        "Grid lets you define both rows and columns. grid-template-columns accepts a list of sizes (200px 1fr 200px) or a pattern (repeat(3, 1fr)). grid-template-rows does the same for rows. gap sets both. Place children with grid-column and grid-row, or place them automatically with grid-auto-flow. Areas let you name regions and assign children to them by name.",
      example: {
        language: "css",
        code:
`.page {
  display: grid;
  grid-template-columns: 220px 1fr 220px;
  grid-template-rows: auto 1fr auto;
  gap: 1.5rem;
  min-height: 100vh;
}
.page > header { grid-column: 1 / -1; }
.page > main   { grid-column: 2; }
.page > aside.left  { grid-column: 1; }
.page > aside.right { grid-column: 3; }
.page > footer { grid-column: 1 / -1; }`,
        caption: "A page with two sidebars, a centred main column, and a header and footer that span the full width.",
      },
    },
    {
      type: "example",
      title: "Centring a box in its parent",
      code:
`.parent {
  display: grid;
  place-items: center;   /* shorthand for place-items: center center */
  min-height: 100vh;
}
.child {
  width: min(90vw, 480px);
  padding: 2rem;
  background: #faf6ec;
  border: 1px solid #d4c7a4;
  border-radius: 14px;
}`,
      language: "css",
      walkthrough:
        "place-items: center on a grid container centres children in both axes. The min() function makes the child's width responsive — it grows up to 480px on wide viewports and stops at 90vw on narrow ones. This is the modern way to centre something and have it stay centred.",
    },
    {
      type: "interactive",
      componentKey: "CssLab",
      title: "CSS lab",
      description:
        "Edit CSS on the left; the page on the right updates. Click an element to inspect the declarations that apply to it.",
    },
    {
      type: "mistakes",
      title: "Common mistakes in CSS",
      items: [
        {
          mistake: "Setting width and expecting padding not to add to it.",
          fix:
            "Set box-sizing: border-box globally (a common pattern is `* { box-sizing: border-box; }`). Then width includes padding and border.",
        },
        {
          mistake: "Using !important to win a specificity argument.",
          fix:
            "Increase the specificity of the rule you want to win. Or remove the conflicting rule. !important should be rare.",
        },
        {
          mistake: "Confusing margin and padding.",
          fix:
            "Padding is inside the border; margin is outside. Use padding for space between the content and the box, margin for space between boxes.",
        },
        {
          mistake: "Floating elements for layout.",
          fix:
            "Use flex or grid. Floats are for wrapping text around images and other inline content, not for laying out a page.",
        },
        {
          mistake: "Setting a height on every element.",
          fix:
            "Heights are rigid. Let content decide the height unless you have a specific reason to fix it.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m1l04-ex01",
      title: "Centre a card, give it padding, and a border",
      description:
        "Write the CSS that centres a .card in its parent, gives it 24px padding, a 1px solid border, and rounded corners.",
    },
    {
      type: "quiz",
      quizId: "m1l04-q",
    },
    {
      type: "summary",
      body:
        "CSS rules are selector { property: value; }. Selectors pick which elements a rule applies to. The cascade, specificity, and inheritance decide which rule wins when several apply. Every element is a box, with content, padding, border, and margin. Flexbox lays children out along a single axis; grid does the same in two. The patterns covered here are the foundation of every layout you will ever build.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m1l04-q",
    title: "CSS check",
    questions: [
      {
        kind: "mcq",
        id: "m1l04-q1",
        prompt:
          "Two rules apply: `p { color: red }` and `article p { color: blue }`. Which wins?",
        options: [
          "The first one, because it comes first.",
          "The second one, because it is more specific.",
          "Neither — CSS will average them.",
          "The first one, because p is a type selector.",
        ],
        correctIndex: 1,
        explanation:
          "`article p` has specificity (0,0,1,1) and `p` has (0,0,0,1). The more specific rule wins regardless of order.",
      },
      {
        kind: "mcq",
        id: "m1l04-q2",
        prompt:
          "You set `width: 200px; padding: 20px; border: 5px;` on a box. With box-sizing: border-box, what is the visible width?",
        options: ["200px", "250px", "220px", "240px"],
        correctIndex: 0,
        explanation:
          "With box-sizing: border-box, width includes content + padding + border. The visible width is exactly 200px.",
      },
      {
        kind: "mcq",
        id: "m1l04-q3",
        prompt: "Which property distributes flex items along the main axis?",
        options: ["align-items", "justify-content", "place-items", "flex-direction"],
        correctIndex: 1,
        explanation:
          "justify-content distributes along the main axis. align-items aligns along the cross axis. flex-direction chooses which axis is the main one.",
      },
      {
        kind: "truefalse",
        id: "m1l04-q4",
        prompt: "Floats are a good tool for laying out a modern page.",
        correct: false,
        explanation:
          "Float was designed for wrapping text around images. Use flex or grid for layout.",
      },
      {
        kind: "mcq",
        id: "m1l04-q5",
        prompt: "What does `* { box-sizing: border-box }` do?",
        options: [
          "It is invalid CSS.",
          "It makes every element's width include its padding and border.",
          "It centres every element on the page.",
          "It hides elements with zero width.",
        ],
        correctIndex: 1,
        explanation:
          "The universal selector applies box-sizing: border-box to every element, which makes width behave intuitively.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m1l04-ex01",
    lectureId: "m1l04",
    title: "Centre a card",
    brief:
      "Write the CSS that centres a .card inside its parent, gives it 24px padding, a 1px solid border in #d4c7a4, and 14px border-radius. The card should be 320px wide.",
    kind: "html",
    starter:
`<!-- HTML scaffold -->
<div class="parent">
  <div class="card">A small card.</div>
</div>
<style>
  .parent { min-height: 100vh; }
  /* Write the .card rules below. */
</style>
`,
    tests: [
      { kind: "css-property", selector: ".card", property: "width", expected: "320px" },
      { kind: "css-property", selector: ".card", property: "paddingTop", expected: "24px" },
      { kind: "css-property", selector: ".card", property: "borderTopWidth", expected: "1px" },
    ],
    hints: [
      "Use a grid container and place-items: center to centre the card.",
      "border-top-width: 1px comes from `border: 1px solid #d4c7a4` (any colour).",
      "The width is what the user sees; padding adds to the inside.",
    ],
    solution:
`<div class="parent">
  <div class="card">A small card.</div>
</div>
<style>
  * { box-sizing: border-box; }
  .parent { min-height: 100vh; display: grid; place-items: center; }
  .card {
    width: 320px;
    padding: 24px;
    border: 1px solid #d4c7a4;
    border-radius: 14px;
    background: #fff;
  }
</style>`,
    solutionExplanation:
      "The .parent becomes a grid with place-items: center, which centres the card in both axes. The .card is exactly 320px wide, with 24px padding inside the border. box-sizing: border-box makes the width behave intuitively even if padding changes.",
  },
];
