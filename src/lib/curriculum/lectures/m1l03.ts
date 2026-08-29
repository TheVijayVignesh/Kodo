import type { Lecture, Quiz, Exercise } from "../types";

export const lecture: Lecture = {
  id: "m1l03",
  module: 1,
  number: 3,
  title: "HTML Elements",
  subtitle:
    "A closer reading of the elements you will use most often — text, links, images, lists, tables, and the form controls that collect input from real people.",
  estimatedMinutes: 50,
  difficulty: "core",
  prerequisites: ["m1l02"],
  objectives: [
    "Use element-level HTML correctly: headings, paragraphs, emphasis, and strong text.",
    "Build ordered, unordered, and description lists correctly.",
    "Build a table that exposes its structure to screen readers.",
    "Construct a form with labels, fieldsets, and the right input types.",
    "Identify the structural and accessibility issues in a malformed snippet.",
  ],
  sources: [
    { label: "Course slides — HTML Elements", type: "course" },
    { label: "MDN — HTML element reference", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element" },
    { label: "MDN — Forms", type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms" },
  ],
  sections: [
    {
      type: "context",
      body:
        "Last lecture established the shape of a document. This lecture zooms in on the elements that carry most of the meaning in a typical page: text formatting, lists, tables, images, and form controls. The pattern is the same — pick the element that says what the content is, then add only the attributes the element needs.",
    },
    {
      type: "objectives",
      items: [
        "Choose the right element for headings, paragraphs, and inline emphasis.",
        "Build ordered, unordered, and description lists correctly.",
        "Build a table that exposes its structure to screen readers.",
        "Construct a form with labels, fieldsets, and the correct input types.",
        "Identify the structural and accessibility issues in a malformed snippet.",
      ],
    },
    {
      type: "concept",
      title: "Headings, paragraphs, and inline emphasis",
      body:
        "There are six heading levels, h1 to h6. The h1 is the page's main heading. h2s are the major sections. h3s are subsections inside them. Don't skip levels. Don't use a heading because you like the size — change the size with CSS instead. Paragraphs live in <p>. The default styling is a block of text with margins above and below.",
      example: {
        language: "html",
        code:
`<h1>Field guide to the urban fox</h1>
<p>The red fox has colonised cities on five continents.</p>
<p>Within this guide, <em>Vulpes vulpes</em> refers specifically to
   the red fox — not the <strong>arctic</strong> or fennec species.</p>`,
        caption: "Use <em> for emphasis and <strong> for stronger importance. Both are inline.",
      },
      walkthrough:
        "<em> tells the browser (and assistive technology) that the text should be stressed in speech. <strong> tells the browser the text is more important than its surroundings. Both are inline, so they can sit inside a <p>. The visible style (italics, bold) is just the default — you can change it with CSS without changing the meaning.",
      pitfall:
        "Use <strong> when the text is genuinely important (a warning, a key term), not just because you want it bold. Use <em> when you want a different stress, not just italics. CSS can do either visually without the tag.",
    },
    {
      type: "concept",
      title: "Lists — three flavours",
      body:
        "An unordered list (<ul>) is a set of items where order does not matter — your shopping list, a navigation. An ordered list (<ol>) is a set of items where order matters — the steps in a recipe, the ranking of search results. A description list (<dl>) is a set of term/definition pairs — an FAQ, an API endpoint summary. The list element wraps list items (<li>); for <dl>, each pair is a <dt> (term) and a <dd> (definition).",
      example: {
        language: "html",
        code:
`<ul>
  <li>Read the lecture</li>
  <li>Build the example</li>
  <li>Mark the lecture complete</li>
</ul>

<dl>
  <dt>GET /api/tasks</dt>
  <dd>Returns the list of tasks for the current user.</dd>
  <dt>POST /api/tasks</dt>
  <dd>Creates a new task. Expects a JSON body.</dd>
</dl>`,
        caption: "Three kinds of list. The structure of the document should reflect the relationship between items.",
      },
      walkthrough:
        "Notice the wrapping element changes the meaning: <ul> says \"the order does not matter\", <ol> says \"the order matters\", <dl> says \"each item is a name and a value\". The visible style is the default; the meaning is what assistive technology and search engines see.",
    },
    {
      type: "concept",
      title: "Tables — for tabular data, not for layout",
      body:
        "Tables are for data that genuinely has rows and columns — a price list, a class timetable, a comparison. They are not for page layout. A layout table breaks the reading order and confuses assistive technology. A good table uses <thead> for the header row, <tbody> for the data, <tfoot> for totals, and <th> for header cells. The scope attribute on <th> tells screen readers whether the header applies to a column or a row.",
      example: {
        language: "html",
        code:
`<table>
  <caption>Comparing two ways to fetch data</caption>
  <thead>
    <tr>
      <th scope="col">Method</th>
      <th scope="col">Returns</th>
      <th scope="col">Best for</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">fetch()</th>
      <td>A Promise</td>
      <td>Most modern code</td>
    </tr>
    <tr>
      <th scope="row">XMLHttpRequest</th>
      <td>An event-driven object</td>
      <td>Legacy code and progress events</td>
    </tr>
  </tbody>
</table>`,
        caption: "A table with <caption>, <thead>, <tbody>, and scoped <th> cells.",
      },
      walkthrough:
        "<caption> is the table's title. It is associated with the table and is read aloud by screen readers as \"Table: comparing two ways to fetch data\". The scope attribute on each <th> tells the screen reader whether the header applies to a column (scope=\"col\") or a row (scope=\"row\"). Without it, the reader has to guess which cell the header is paired with.",
    },
    {
      type: "concept",
      title: "Links — the original HTML feature",
      body:
        "An anchor <a href=\"...\"> wraps a piece of text (or an image) and turns it into a link. The href is the destination. It can be an absolute URL (https://...), a relative path (/about), a fragment (#section), a mailto: or tel: address, or a JavaScript: URL (avoid). Without href, the <a> is not a link — it is just an inline element. Set target=\"_blank\" to open in a new tab, but always pair it with rel=\"noopener\" for security.",
      pitfall:
        "Avoid using <a> for actions that are not navigation — opening a menu, submitting a form. Use a <button> for actions. The browser knows the difference, and assistive technology does too.",
    },
    {
      type: "concept",
      title: "Images and figures",
      body:
        "The <img> tag pulls in an image. The src is the URL. The alt is a textual replacement for the image — required for accessibility. If the image is decorative, use alt=\"\". <figure> wraps an image with a caption (<figcaption>), which is helpful for charts, photos with explanatory text, and code snippets you want to discuss.",
      example: {
        language: "html",
        code:
`<figure>
  <img src="fox.jpg" alt="A red fox in a city park at dusk">
  <figcaption>A red fox in a city park at dusk.</figcaption>
</figure>`,
      },
    },
    {
      type: "concept",
      title: "Forms — collecting input",
      body:
        "A <form> is a region that collects input. The <label> element describes each input. The most reliable association is wrapping the input in the label, or using the for attribute on the label to point to the input's id. The <input> tag covers most text and button needs; its type attribute decides what kind: text, email, password, number, date, checkbox, radio, submit. <select> is a drop-down. <textarea> is a multi-line text box. <button type=\"submit\"> is the typical submit control.",
      example: {
        language: "html",
        code:
`<form action="/subscribe" method="post">
  <fieldset>
    <legend>Subscribe to the digest</legend>

    <label>Email
      <input type="email" name="email" required autocomplete="email">
    </label>

    <label>How often?
      <select name="frequency">
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </label>

    <label>
      <input type="checkbox" name="consent" required>
      I agree to receive the digest.
    </label>

    <button type="submit">Subscribe</button>
  </fieldset>
</form>`,
        caption: "A small, accessible form. Each input has a label. The required attribute drives native validation.",
      },
      pitfall:
        "A <label> that does not wrap or point to a form control is just a piece of text. Clicking it does nothing. A submit button inside a form defaults to type=\"submit\" — outside, it does nothing. Add type=\"button\" explicitly when you need a non-submit button.",
    },
    {
      type: "example",
      title: "A small form, with native validation",
      code:
`<form novalidate id="signup">
  <label>Full name
    <input name="name" required minlength="2">
  </label>
  <label>Email
    <input type="email" name="email" required>
  </label>
  <label>Year of study
    <select name="year" required>
      <option value="">Choose…</option>
      <option>1</option><option>2</option><option>3</option><option>4</option>
    </select>
  </label>
  <button type="submit">Sign up</button>
</form>
<script>
  document.getElementById('signup').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log('Submitted:', data);
  });
</script>`,
      language: "html",
      walkthrough:
        "Three labelled inputs and a submit button. The novalidate attribute on the form turns off the browser's native error UI so we can wire our own. The required and type=\"email\" attributes still drive validity, but the page controls how errors are shown. FormData turns the form into a plain object, which is the easiest way to read form values into JavaScript.",
    },
    {
      type: "interactive",
      componentKey: "HtmlLab",
      title: "HTML elements lab",
      description:
        "Build a profile card: a heading, an image with alt text, a short list of interests, and a small contact form. The structural validator will tell you when something is missing or invalid.",
    },
    {
      type: "mistakes",
      title: "Common mistakes with HTML elements",
      items: [
        {
          mistake: "Wrapping a checkbox or radio with a <label> that does not contain the input.",
          fix:
            "Either wrap the input or use for and id. Without the association, clicking the label does not toggle the control. Screen readers also rely on the association to announce the label with the input.",
        },
        {
          mistake: "Using <table> for layout.",
          fix:
            "Use CSS grid or flexbox. Tables imply a tabular relationship between rows and columns, and screen readers will announce them as such. Layout tables break the reading order and confuse assistive technology.",
        },
        {
          mistake: "Forgetting the alt attribute on <img>.",
          fix:
            "Always set alt. Use alt=\"\" for decorative images, and a meaningful description for informative ones. Browsers also use alt as a tooltip on hover, so the attribute is useful even for sighted users.",
        },
        {
          mistake: "Using a <button> without a type attribute inside a form.",
          fix:
            "It defaults to type=\"submit\" and may submit the form when you intended a regular button click. Set type=\"button\" explicitly.",
        },
      ],
    },
    {
      type: "exercise",
      exerciseId: "m1l03-ex01",
      title: "Profile card with a form",
      description:
        "Build an HTML fragment with an image, a heading, a list, and a form that has at least two labelled inputs and a submit button.",
    },
    {
      type: "quiz",
      quizId: "m1l03-q",
    },
    {
      type: "summary",
      body:
        "Headings, paragraphs, and inline elements form the text layer. Lists come in three flavours — unordered, ordered, and description — and the right choice depends on the relationship between items. Tables describe tabular data, with <thead>, <tbody>, and scoped <th> headers. Forms collect input; <label> with a proper association is the single most important rule for accessible forms. With these elements, most pages can be written without ever reaching for <div>.",
    },
  ],
};

export const quizzes: Quiz[] = [
  {
    id: "m1l03-q",
    title: "HTML Elements check",
    questions: [
      {
        kind: "mcq",
        id: "m1l03-q1",
        prompt: "Which list element is appropriate for an FAQ's term/definition pairs?",
        options: ["<ul>", "<ol>", "<dl>", "<table>"],
        correctIndex: 2,
        explanation:
          "<dl> (description list) groups <dt> terms with <dd> definitions. Perfect for FAQ entries, API parameters, and glossaries.",
      },
      {
        kind: "mcq",
        id: "m1l03-q2",
        prompt: "Which is the most reliable way to associate a <label> with an <input>?",
        options: [
          "Place the input next to the label visually.",
          "Wrap the input in the label, or use for and matching id.",
          "Use the name attribute on both elements.",
          "There is no reliable way.",
        ],
        correctIndex: 1,
        explanation:
          "Wrapping the input in the label, or using for on the label with id on the input, creates a programmatic association that screen readers and click-to-focus rely on.",
      },
      {
        kind: "truefalse",
        id: "m1l03-q3",
        prompt: "It is acceptable to use a <table> to lay out a multi-column page layout.",
        correct: false,
        explanation:
          "Tables should be reserved for tabular data. For layout, use CSS grid or flexbox. Layout tables confuse screen readers and break reflow.",
      },
      {
        kind: "mcq",
        id: "m1l03-q4",
        prompt: "Which input type is the right choice for an email field?",
        options: [
          "<input type=\"text\">",
          "<input type=\"email\">",
          "<input type=\"mail\">",
          "<input type=\"url\">",
        ],
        correctIndex: 1,
        explanation:
          "type=\"email\" gives the user the right keyboard on mobile and drives the browser's built-in format validation. The browser will refuse to submit if the value does not look like an email address.",
      },
      {
        kind: "mcq",
        id: "m1l03-q5",
        prompt: "What does the <th scope=\"row\"> attribute do?",
        options: [
          "Styles the cell as a heading row.",
          "Tells assistive technology that this cell is a header for the row it begins.",
          "Adds a tooltip when the user hovers the cell.",
          "Forces the cell to span the entire row.",
        ],
        correctIndex: 1,
        explanation:
          "scope tells screen readers whether the header cell applies to its column (scope=\"col\") or its row (scope=\"row\"). It is essential for non-trivial tables.",
      },
    ],
  },
];

export const exercises: Exercise[] = [
  {
    id: "m1l03-ex01",
    lectureId: "m1l03",
    title: "Profile card with a form",
    brief:
      "Compose a small profile card. Include an image with alt text, a heading, an unordered list of three items, and a form with at least two labelled inputs and a submit button.",
    kind: "html",
    starter:
`<!-- Build a profile card here. -->
`,
    tests: [
      { kind: "html-contains", selector: "img[alt]", min: 1 },
      { kind: "html-contains", selector: "h2, h1", min: 1 },
      { kind: "html-contains", selector: "ul li", min: 3 },
      { kind: "html-contains", selector: "form", min: 1 },
      { kind: "html-contains", selector: "label", min: 2 },
      { kind: "html-contains", selector: "input", min: 2 },
      { kind: "html-contains", selector: "button", min: 1 },
    ],
    hints: [
      "Each <input> needs a <label> — wrap the input inside the label, or use for and id.",
      "Make the submit button explicit: <button type=\"submit\">Submit</button>.",
      "Alt text on the image is required, even if short: alt=\"A photo of…\"",
    ],
    solution:
`<article class="card">
  <img src="avatar.jpg" alt="A photograph of the profile owner" width="120" height="120">
  <h2>Sora Tanaka</h2>
  <ul>
    <li>Reading: <em>The Tale of Genji</em></li>
    <li>Studying: Web Technologies</li>
    <li>Tea: hojicha</li>
  </ul>
  <form>
    <label>Email
      <input type="email" name="email" required>
    </label>
    <label>Message
      <input type="text" name="message" required>
    </label>
    <button type="submit">Send</button>
  </form>
</article>`,
    solutionExplanation:
      "Every input is wrapped in a <label> for click-to-focus. The image has alt text. The list contains three items. The form has an explicit type=\"submit\" button.",
  },
];
