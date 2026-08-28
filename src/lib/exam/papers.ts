/**
 * Exam paper data — original 50-mark paper (Mid Semester 2023-2024 Odd) and
 * a generated practice paper in the same format.
 */

export type ExamQuestion =
  | { kind: "short"; n: number | string; marks: number; co: string; kl: string; prompt: string; solution: string; explanation: string; examinerNotes: string }
  | { kind: "code"; n: number | string; marks: number; co: string; kl: string; prompt: string; code: string; language: "js" | "html" | "css"; solution: string; explanation: string; examinerNotes: string; runnableExample?: string }
  | { kind: "or"; n: number; marks: number; co: string; kl: string; parts: ExamQuestion[] }
  | { kind: "scenario"; n: number | string; marks: number; co: string; kl: string; prompt: string; diagram?: string; solution: string; explanation: string; examinerNotes: string };

export type ExamPaper = {
  id: string;
  label: string;
  program: string;
  course: string;
  semester: string;
  duration: string;
  totalMarks: number;
  answerAll: boolean;
  questions: ExamQuestion[];
};

const OR_EXAM_BASE = {
  program: "Common to B.Tech. AI & DS and B.Tech. CSE (IoT)",
  course: "CS3005 Web Technologies",
  semester: "V",
  regulation: "2021",
  duration: "2 hours",
  totalMarks: 50,
  answerAll: true,
} as const;

export const ORIGINAL_50_MARK: ExamPaper = {
  ...OR_EXAM_BASE,
  id: "original-50-2023-odd",
  label: "Mid Semester 2023-2024 Odd",
  questions: [
    {
      kind: "code", n: 1, marks: 2, co: "CO1", kl: "KL2",
      prompt: `Identify and describe each of the individual parts in the HTML element below.

\`\`\`html
<a href="https://snuchennai.edu.in/">SNU Chennai</a>
\`\`\``,
      code: `<a href="https://snuchennai.edu.in/">SNU Chennai</a>`,
      language: "html",
      solution: `The element is an anchor (\`<a>\`), used to create a hyperlink.

- \`<a>\` — the opening anchor tag, identifying the element type.
- \`href\` — the attribute that names the destination URL.
- \`"https://snuchennai.edu.in/"\` — the attribute value, the URL the link points to.
- \`SNU Chennai\` — the link text, the visible part the user clicks.
- \`</a>\` — the closing tag, marking the end of the element's content.`,
      explanation: `HTML attributes sit inside the opening tag and tune the element's behaviour. For an anchor, the most important attribute is \`href\` — without it the link does not actually go anywhere. The link text is what the user sees and clicks.`,
      examinerNotes: `Most marks come from naming the attribute (\`href\`) and explaining that it specifies the destination URL. Mentioning that the link text is the clickable part is worth a second mark.`,
    },
    {
      kind: "short", n: 2, marks: 2, co: "CO1", kl: "KL2",
      prompt: `What are CSS selectors? Provide examples of 2 different types of selectors.`,
      solution: `A CSS selector is the part of a CSS rule that identifies which elements the rule applies to. The browser walks the document tree and matches every element that fits the selector pattern; the rule's declarations are applied to each match.

Examples of two different types:

1. **Type selector** — matches elements by their tag name.
   \`\`\`css
   h1 { font-family: Georgia, serif; }
   \`\`\`
   Every \`<h1>\` in the document inherits this font.

2. **Class selector** — matches elements by the value of their \`class\` attribute.
   \`\`\`css
   .note { color: #5a4d2f; }
   \`\`\`
   Every element with \`class="note"\` (or with "note" in its class list) gets this colour.

Other types include the ID selector (#id), attribute selectors (\`[type="email"]\`), combinators (descendant, child, sibling), and pseudo-classes (\`:hover\`, \`:first-child\`).`,
      explanation: `Selectors are how CSS reaches into the document tree. Without them, every rule would either apply to everything or to nothing.`,
      examinerNotes: `Award 1 mark for a clear definition. Award the second mark only for two correctly-formed examples with a one-line description of what each selects.`,
    },
    {
      kind: "code", n: 3, marks: 2, co: "CO1", kl: "KL3",
      prompt: `Explain the step-by-step execution of the below code.

\`\`\`html
<script>
  const button = document.getElementById("myButton");
  button.addEventListener("click", function() {
    alert("Button clicked!");
  });
</script>
\`\`\``,
      code: `const button = document.getElementById("myButton");
button.addEventListener("click", function() {
  alert("Button clicked!");
});`,
      language: "js",
      solution: `1. The browser parses the HTML and builds the document tree.
2. The \`<script>\` tag is encountered. Because it has no \`defer\` or \`async\`, the browser pauses parsing and runs the script.
3. \`document.getElementById("myButton")\` searches the document for the element with \`id="myButton"\` and returns a reference to it, stored in \`button\`.
4. \`button.addEventListener("click", function() { ... })\` registers a callback. The callback is **not** executed immediately — it is stored.
5. Parsing of the rest of the document continues.
6. When the user clicks the button (or activates it with the keyboard), the browser fires a "click" event. The browser walks the event up the DOM tree, invoking any registered listeners.
7. The callback runs. \`alert("Button clicked!")\` opens a modal dialog with the message.`,
      explanation: `Event listeners do not run when registered. They run when the matching event fires. This separation is what makes the page interactive without freezing the rest of the document.`,
      examinerNotes: `Award 1 mark for the lookup step (\`getElementById\` returns a reference). Award the second mark for explaining that the listener fires only when the click event occurs, not when the script runs.`,
    },
    {
      kind: "short", n: 4, marks: 2, co: "CO1", kl: "KL2",
      prompt: `Define the Document Object Model (DOM) in the context of web development. How does the DOM represent a web page's structure?`,
      solution: `The Document Object Model (DOM) is a tree-shaped, in-memory representation of an HTML document that the browser hands to JavaScript. Each element, text run, comment, and attribute becomes a node in the tree, reachable and modifiable as a JavaScript object.

The DOM represents structure as a hierarchy:

- \`document\` is the root.
- The \`<html>\` element is its only child.
- \`<head>\` and \`<body>\` are children of \`<html>\`.
- Inside \`<body>\`, every element is a child of its parent, and may have its own children — text nodes, other elements, comments.
- Attributes of an element are exposed as properties of that element's node.

Because the tree is in memory and live, a script can read any node (with \`getElementById\`, \`querySelector\`, traversal), create new nodes (\`createElement\`, \`createTextNode\`), insert them (\`appendChild\`, \`prepend\`), and remove existing ones (\`remove\`, \`replaceChild\`). Changes are immediately reflected on the page.`,
      explanation: `The DOM is the bridge between the HTML (a static text file) and the live, modifiable page. Without it, JavaScript could not interact with what the user sees.`,
      examinerNotes: `Award 1 mark for the tree/structure definition. Award the second mark for mentioning that elements, text, and attributes are exposed as objects/properties that scripts can read and modify.`,
    },
    {
      kind: "short", n: 5, marks: 2, co: "CO1", kl: "KL4",
      prompt: `Explain the difference between let, const, and var when declaring variables in JavaScript.`,
      solution: `**\`const\`** declares a binding that cannot be reassigned. The name will keep pointing to the same value, although the value itself (if it is an object) can still be mutated. Use \`const\` by default.

**\`let\`** declares a binding that can be reassigned. It is block-scoped, meaning the binding exists only within the nearest pair of braces (\`{}\`). Use \`let\` when you need to reassign, such as a counter or an accumulator.

**\`var\`** is the legacy form. It has function scope (not block scope), allows redeclaration without error, and is hoisted to the top of the function. These behaviours are usually surprising. New code should avoid \`var\` entirely; old code is best migrated to \`let\` or \`const\`.

\`\`\`js
const pi = 3.14;   // cannot reassign
let count = 0;     // can reassign, block-scoped
count += 1;

var x = 1;         // function-scoped, hoisted
var x = 2;         // legal — usually a bug
\`\`\``,
      explanation: `The choice between \`const\` and \`let\` is about intent, not just capability. \`const\` says "this binding will not change" and helps the reader; \`var\` says "this is older code, tread carefully."`,
      examinerNotes: `Award 1 mark for distinguishing block-scoping (let/const) from function-scoping (var). Award the second mark for noting that const cannot be reassigned and that var is hoisted / allows redeclaration.`,
    },
    {
      kind: "short", n: 6, marks: 2, co: "CO2", kl: "KL2",
      prompt: `Describe Model-View-Controller (MVC) Architecture.`,
      solution: `Model-View-Controller is a software pattern that separates an application into three connected but independent parts:

- **Model** — the data and the business rules. Knows nothing about the view or the controller. Examples: a User object, a Task list, a database query.
- **View** — the presentation. Renders the model into something the user can see and interact with. Knows about the model's shape, but does not decide what to do with the user's input.
- **Controller** — the middleman. Receives user input (a click, a form submission), updates the model, and decides which view to show next. Knows about both the model and the view.

The benefit is separation of concerns: changes to how data is stored (the model) do not force changes to how it is shown (the view), and vice versa. In modern frontend frameworks, the same separation lives on the client: React components are views; state, stores, or server data are the model; event handlers and route actions are the controller.`,
      explanation: `MVC predates React by decades. The reason it still matters is that any non-trivial application needs to keep its data, its display, and its response to user input in different places. Without that separation, the code becomes impossible to maintain.`,
      examinerNotes: `Award 1 mark for the three-part split with a one-sentence description of each. Award the second mark for explaining the benefit (separation of concerns / independent changes).`,
    },
    {
      kind: "code", n: 7, marks: 2, co: "CO2", kl: "KL3",
      prompt: `Explain the code given below:

\`\`\`jsx
import React, { useState } from 'react';
const CounterComponent = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};
\`\`\``,
      code: `import React, { useState } from 'react';
const CounterComponent = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};`,
      language: "js",
      solution: `The code defines a React function component called \`CounterComponent\`.

- **\`import\`** brings the React library and the \`useState\` hook into scope.
- **\`useState(0)\`** returns a pair: the current value (\`count\`, initialised to 0) and a setter function (\`setCount\`) that updates it.
- **The returned JSX** describes what the component renders. \`{count}\` is an expression that places the current count value inside the \`<p>\`. The two buttons each attach an \`onClick\` handler that calls \`setCount\` with the next value.
- When \`setCount\` is called, React re-renders the component with the new \`count\` value, and the \`<p>\` updates automatically.

This is a typical demonstration of state-driven UI: the view is a pure function of state, and the only way to change what is on screen is to call the state setter.`,
      explanation: `The component is a small but complete example of the React mental model. The state value \`count\` is the source of truth; the JSX is a description of the page in terms of that value; the buttons are how the user changes the value.`,
      examinerNotes: `Award 1 mark for explaining useState (a state value and a setter). Award the second mark for explaining the render loop: setCount → re-render → new count → updated <p>.`,
    },
    {
      kind: "short", n: 8, marks: 2, co: "CO2", kl: "KL2",
      prompt: `Explain the key features of React JS and its advantages over traditional JavaScript.`,
      solution: `**Key features of React:**

- **Component-based architecture** — the UI is built from small, composable components, each owning its own markup, styling, and behaviour.
- **Declarative UI** — you describe what the page should look like for a given state, and React handles the actual DOM updates.
- **Virtual DOM** — React keeps an in-memory representation of the desired UI and reconciles it against the real DOM, applying the minimal set of changes.
- **Unidirectional data flow** — data passes from parent to child through props, making the data flow easy to reason about.
- **JSX** — a syntax extension that lets you write HTML-like markup inside JavaScript, keeping the component's structure in one place.
- **Hooks** — functions like \`useState\`, \`useEffect\`, and \`useMemo\` that give function components access to state, side effects, and other React features.

**Advantages over traditional JavaScript:**

- Manual DOM manipulation is verbose and error-prone. React removes most of that work.
- State changes are explicit: call the setter, the view updates. There is no need to find the right element and update it by hand.
- Components can be reused, tested, and reasoned about in isolation.
- The virtual DOM is faster than naïvely rewriting the real DOM, especially for large lists or frequent updates.`,
      explanation: `React's value is not that it does something you could not do — it is that it removes a whole class of bugs (forgotten DOM updates, stale references) by changing the mental model from imperative to declarative.`,
      examinerNotes: `Award 1 mark for naming at least three features. Award the second mark for the advantage (declarative UI, virtual DOM, or component reusability).`,
    },
    {
      kind: "short", n: 9, marks: 2, co: "CO2", kl: "KL2",
      prompt: `Explain two ES6 features that enhance JavaScript development.`,
      solution: `**1. Arrow functions** — a shorter way to write function expressions, with a difference that matters: they do not bind their own \`this\`, which makes them ideal for callbacks inside methods.

\`\`\`js
const add = (a, b) => a + b;
items.map(item => item.title);
\`\`\`

**2. \`let\` and \`const\`** — block-scoped variable declarations that replace most uses of \`var\`. \`const\` is the new default; \`let\` is for bindings that need to be reassigned.

\`\`\`js
const pi = 3.14;
let count = 0;
\`\`\`

Other ES6 features worth knowing: template literals (\`\`\`Hello, \${name}\`\`\`), destructuring (\`const { x, y } = point\`), the spread operator (\`{ ...other }\`, \`[...arr]\`), default parameters (\`(a, b = 1) => ...\`), and modules (\`import\` / \`export\`).`,
      explanation: `ES6 (ECMAScript 2015) was the largest update to the language in years. The features above are the ones that show up in modern code every day, including the React component code in this paper.`,
      examinerNotes: `Award 1 mark each for two correct features with a one-line description and a small example.`,
    },
    {
      kind: "short", n: 10, marks: 2, co: "CO2", kl: "KL2",
      prompt: `Define Components, States, Props, and Hooks in React.`,
      solution: `- **Component** — a reusable piece of the UI. A component receives data (props), describes what to render (JSX), and can hold local state. Components compose to form the application tree.
- **State** — local data owned by a component that can change over time. When state changes, the component re-renders. \`useState\` is the most common way to declare state in a function component.
- **Props** — inputs a component receives from its parent. Props are read-only inside the component; the parent owns them. Props are how data flows from parent to child.
- **Hooks** — special functions that let function components use React features. \`useState\` adds state, \`useEffect\` runs side effects, \`useRef\` keeps a mutable reference, and so on. Custom hooks let you reuse stateful logic between components.`,
      explanation: `These four words are the vocabulary of React. Once they are second nature, the framework is mostly conventions about how to combine them.`,
      examinerNotes: `Award 0.5 marks per definition. One sentence each is enough.`,
    },
    {
      kind: "short", n: 11, marks: 5, co: "CO1", kl: "KL4",
      prompt: `Which side of the web does form validation take place in modern web development? Detail the advantages and 1 potential drawback of validating forms using the current methodology.`,
      solution: `Modern form validation happens in **two places**, but the user-facing validation is now done on the **client side** (in the browser, with JavaScript and HTML attributes), with the server re-validating as a security measure.

**Client-side validation** uses the browser's built-in constraint validation API (driven by attributes like \`required\`, \`type\`, \`minlength\`, \`pattern\`), augmented by custom JavaScript that runs as the user types or on submit.

**Advantages of client-side validation:**

- **Immediate feedback** — the user knows about a problem before submitting, without a round-trip to the server.
- **Reduced server load** — invalid requests never reach the server, saving bandwidth and CPU.
- **Better user experience** — animated, contextual error messages and inline hints.
- **Offline-friendly** — the form can be checked before any network request is made.

**One potential drawback:**

- **It can be bypassed.** A determined user can disable JavaScript, edit the DOM, or send a forged request directly to the server endpoint. Client-side validation is for UX, not security. The server **must** re-validate everything it receives. Treat client-side validation as a courtesy and server-side validation as a requirement.`,
      explanation: `The "current methodology" question is testing whether the student understands that client-side validation is for the user and server-side validation is for safety. The two have to coexist.`,
      examinerNotes: `Award 1 mark for "client side (in the browser)". Award up to 3 marks for advantages (one mark each, up to 3). Award 1 mark for a drawback that names a real concern (security / bypass / consistency across browsers).`,
    },
    {
      kind: "code", n: 12, marks: 5, co: "CO1", kl: "KL4",
      prompt: `Provide an illustration of fetching data from a server using AJAX.

\`\`\`js
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "ajax_info.txt", true);
  xhttp.send();
}
\`\`\`

Explain what the function does. Identify and explain each of the AJAX sub-components in the above code.`,
      code: `var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
    document.getElementById("demo").innerHTML = this.responseText;
  }
};
xhttp.open("GET", "ajax_info.txt", true);
xhttp.send();`,
      language: "js",
      solution: `**What the function does:** \`loadDoc()\` makes an asynchronous HTTP GET request to the URL \`ajax_info.txt\` on the same server. When the response arrives, it places the response text into the element with id \`demo\`, replacing whatever was there. The user does not have to reload the page.

**AJAX sub-components:**

1. **\`new XMLHttpRequest()\`** — creates the object that the browser uses to make the request. \`XMLHttpRequest\` (often shortened to XHR) is the underlying API for AJAX in the browser.
2. **\`xhttp.onreadystatechange = function() { ... }\`** — registers a callback that fires every time the request's state changes. The handler checks the state to decide what to do.
3. **\`this.readyState === 4\`** — \`readyState\` is a number from 0 to 4. 4 means the request is complete and the response is ready.
4. **\`this.status === 200\`** — the HTTP status code. 200 means the server returned the resource successfully. Other codes (404, 500) mean different things.
5. **\`document.getElementById("demo").innerHTML = this.responseText\`** — once both conditions are met, the response body (\`responseText\`) is placed into the page element with id \`demo\`.
6. **\`xhttp.open("GET", "ajax_info.txt", true)\`** — configures the request. The method is GET, the URL is \`ajax_info.txt\`, and \`true\` means asynchronous (do not block the rest of the page).
7. **\`xhttp.send()\`** — actually dispatches the request. For GET, the body is empty; for POST, this is where you would pass the body.`,
      explanation: `This is the older XHR form of AJAX. Modern code uses \`fetch\` with \`async\`/\`await\`, but the underlying shape — open, send, handle state changes — is the same.`,
      examinerNotes: `Award 1 mark for the function's overall purpose. Award up to 4 marks for naming and explaining the sub-components (XMLHttpRequest, onreadystatechange, readyState, status, open, send, responseText).`,
      runnableExample: `// Modern equivalent using fetch and async/await
async function loadDoc() {
  const res = await fetch("ajax_info.txt");
  if (!res.ok) return;
  const text = await res.text();
  document.getElementById("demo").textContent = text;
}`,
    },
    {
      kind: "scenario", n: 13, marks: 5, co: "CO2", kl: "KL4",
      prompt: `In the diagram below (a login form with Username, Password, Remember username checkbox, a Log in button, a Forgotten password link, a Cookies notice, and a Log in as a guest option), identify the possible React components. If you are implementing the above components in a React app, draw the respective component hierarchy.`,
      solution: `**Possible components:**

- \`LoginPage\` — the top-level container.
- \`LoginForm\` — the form region, including the submit handler.
- \`UsernameField\` — labelled <input type="text"> for the username.
- \`PasswordField\` — labelled <input type="password"> for the password.
- \`RememberMe\` — a labelled checkbox.
- \`SubmitButton\` — the "Log in" button.
- \`ForgotPasswordLink\` — the "Forgotten your username or password?" link.
- \`CookiesNotice\` — the small text reminding the user that cookies must be enabled.
- \`GuestAccessButton\` — the "Log in as a guest" button.

**Component hierarchy:**

\`\`\`
LoginPage
└── LoginForm
    ├── UsernameField
    ├── PasswordField
    ├── RememberMe
    ├── SubmitButton
    ├── ForgotPasswordLink
    ├── CookiesNotice
    └── GuestAccessButton
\`\`\`

In a real app, the field components and the link/notice components might be split into separate files (\`components/auth/UsernameField.jsx\`, etc.) and reused in a registration form or a password-reset form. The hierarchy stays the same; only the parent changes.`,
      explanation: `Component decomposition is the design step in a React app. The right answer depends on what the components will be reused for. Splitting a form into field components pays off as soon as you need a second form with the same fields.`,
      examinerNotes: `Award up to 3 marks for identifying reasonable components. Award 2 marks for a clear hierarchy that places LoginForm as a child of LoginPage and the fields and buttons as children of LoginForm.`,
    },
    {
      kind: "short", n: 14, marks: 5, co: "CO2", kl: "KL4",
      prompt: `Give the difference between real DOM and Virtual DOM with a suitable example.`,
      solution: `**Real DOM** is the live tree of objects the browser keeps in memory and renders to the screen. Every element, attribute, and text run is a node. When something changes, the browser has to walk the tree, find the changed parts, recompute layout, and repaint.

**Virtual DOM** is an in-memory representation of the desired UI that a library (such as React) keeps alongside the real DOM. When state changes, the library builds a new virtual tree, compares it to the previous one ("diffing"), and applies the minimal set of changes to the real DOM.

**Example:**

Imagine a list of 1,000 tasks. With the real DOM, inserting a new task at the top means:

1. Find the <ul>.
2. Create a new <li>.
3. Insert it as the first child.
4. The browser recalculates layout for the entire list and repaints.

With the virtual DOM (React), the same operation:

1. The component re-renders into a new virtual tree.
2. React diffs the new tree against the old one and finds the new <li> at the top.
3. React updates the real DOM in one operation — just the new <li>, not the other 1,000.

**Other differences:**

- Real DOM updates are expensive (layout + paint). Virtual DOM batches updates and applies the minimum needed.
- Real DOM, manipulated directly, is verbose. The virtual DOM lets you write declarative code.
- Real DOM is provided by the browser. The virtual DOM is provided by your library.`,
      explanation: `The virtual DOM is not a separate structure the browser maintains; it is a tool the library uses to plan its updates. The performance benefit comes from batching and minimal updates, not from the virtual DOM being "faster" at any single operation.`,
      examinerNotes: `Award 1 mark for the real DOM definition. Award 1 mark for the virtual DOM definition. Award up to 2 marks for the example (a list of 1,000 items, an insertion, a comparison). Award 1 mark for an additional distinction (batching, declarative).`,
    },
    {
      kind: "or", n: 15, marks: 10, co: "CO1/CO2", kl: "KL4",
      parts: [
        {
          kind: "code", n: "15a", marks: 10, co: "CO1/CO2", kl: "KL4",
          prompt: `Implement a Semester Fee Submission Form and validate it using JavaScript.

The form should collect:
- Student name (required, at least 2 characters)
- Register number (required, exactly 9 digits)
- Semester (required, select from I–VIII)
- Fee amount (required, a positive number)
- Mode of payment (required, select from "Card", "UPI", "Net Banking", "Cash")

Validation should run on submit. If any field is invalid, show an error message under the field and do not submit.`,
          code: `<form id="feeForm" novalidate>
  <label>Student name <input name="name" required></label>
  <p class="err" data-for="name"></p>

  <label>Register number <input name="reg" required></label>
  <p class="err" data-for="reg"></p>

  <label>Semester
    <select name="semester" required>
      <option value="">—</option>
      <option>I</option><option>II</option><option>III</option><option>IV</option>
      <option>V</option><option>VI</option><option>VII</option><option>VIII</option>
    </select>
  </label>
  <p class="err" data-for="semester"></p>

  <label>Fee amount <input name="amount" type="number" required></label>
  <p class="err" data-for="amount"></p>

  <label>Mode of payment
    <select name="mode" required>
      <option value="">—</option>
      <option>Card</option><option>UPI</option><option>Net Banking</option><option>Cash</option>
    </select>
  </label>
  <p class="err" data-for="mode"></p>

  <button type="submit">Submit fee</button>
</form>
<script>
  const form = document.getElementById("feeForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = {};
    const data = Object.fromEntries(new FormData(form));

    if (!data.name || data.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!/^\\d{9}$/.test(data.reg || "")) errs.reg = "Register number must be exactly 9 digits.";
    if (!data.semester) errs.semester = "Choose a semester.";
    if (Number(data.amount) <= 0) errs.amount = "Fee amount must be positive.";
    if (!data.mode) errs.mode = "Choose a payment mode.";

    document.querySelectorAll(".err").forEach((el) => (el.textContent = ""));
    for (const [field, message] of Object.entries(errs)) {
      const el = document.querySelector(\`.err[data-for="\${field}"]\`);
      if (el) el.textContent = message;
    }
    if (Object.keys(errs).length === 0) {
      console.log("Submitting:", data);
    }
  });
</script>`,
          language: "html",
          solution: `The form has five fields. Each has a label and a corresponding error placeholder. JavaScript intercepts the submit event, reads the form data with FormData, and validates each field. Errors are written into the \`.err\` paragraphs. The form only "submits" (here, just logs) when validation passes.

Key points:

- The form has \`novalidate\` so we can use our own error UI while still benefiting from \`required\`.
- The error paragraphs use \`data-for="..."\` to be addressed by name.
- A single object (\`errs\`) collects all errors; the UI shows them all at once rather than one at a time.
- The number check is \`Number(data.amount) <= 0\` — this catches both \`""\` (NaN, which is \`<= 0\` is false; the right check is \`!Number.isFinite(...)\` for safer code) and negative values. A robust version would also handle non-integer amounts.`,
          explanation: `This is the kind of form a real application would have, minus the server. Notice the structure: the HTML is semantic, the JavaScript reads once with FormData, and the validation is collected in one place so the rules are easy to find.`,
          examinerNotes: `Award up to 3 marks for correct HTML structure (labels, required, appropriate input types). Award up to 4 marks for correct validation logic covering all five fields. Award up to 3 marks for displaying errors and not submitting when validation fails.`,
        },
        {
          kind: "short", n: "15b", marks: 10, co: "CO2", kl: "KL4",
          prompt: `What are the possible ways you can implement routing in React? Discuss when and where do you use each package? Identify the components and give the steps to implement the below navigation bar.

[Navigation bar: News | Sports | Play | Money | Gaming]`,
          solution: `**Routing options in React:**

- **\`react-router-dom\`** — the most common library for client-side routing in React. It provides \`<BrowserRouter>\`, \`<Routes>\`, \`<Route>\`, \`<Link>\`, and \`<NavLink>\`. Use it for any non-trivial app with multiple views.
- **Next.js file-system router** — if you are using Next.js, the routing is built in. Each file in \`app/\` is a route. Use it for full applications where you also want server rendering, file-system routing, and built-in data fetching.
- **TanStack Router** — a newer, type-safe router with strong TypeScript inference. Use it for type-heavy projects where you want the router to drive the data layer.
- **\`useState\` with conditional rendering** — for tiny apps, a \`useState\` that holds the "current view" and a switch statement is enough. Not a real router; do not use it for more than a couple of pages.

**When to use which:**

- A small one-page demo: \`useState\` + conditional rendering.
- A multi-page SPA without server rendering: \`react-router-dom\`.
- A full application with SSR, file-system routing, and data fetching: Next.js.
- A large app with strict typing: TanStack Router.

**Components for the navigation bar:**

- \`Navbar\` — the outer container, holds the list of links.
- \`NavItem\` — a single link, with the active state highlighted.
- \`NavLink\` (from react-router-dom) — a Link that knows whether it is active.

**Steps to implement:**

1. Install: \`npm install react-router-dom\`.
2. Wrap the app in \`<BrowserRouter>\`.
3. Define routes: each link maps to a path (\`/news\`, \`/sports\`, etc.).
4. Create the \`Navbar\` component with five \`NavLink\`s.
5. Style with the design system.

\`\`\`jsx
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

function Navbar() {
  const items = [
    ["News", "/news"],
    ["Sports", "/sports"],
    ["Play", "/play"],
    ["Money", "/money"],
    ["Gaming", "/gaming"],
  ];
  return (
    <nav className="navbar">
      {items.map(([label, to]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/news" element={<News />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/play" element={<Play />} />
          <Route path="/money" element={<Money />} />
          <Route path="/gaming" element={<Gaming />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
\`\`\``,
          explanation: `Most real React apps use react-router-dom. Next.js is the right choice if you are building a full app and want server rendering. The \`NavLink\` is what makes the active state work without extra wiring.`,
          examinerNotes: `Award up to 3 marks for the discussion of routing options and when to use each. Award up to 3 marks for identifying the components (Navbar, NavItem/NavLink). Award up to 4 marks for the steps and the code structure.`,
        },
      ],
    },
  ],
};

export const PRACTICE_PAPER_1: ExamPaper = {
  ...OR_EXAM_BASE,
  id: "practice-01",
  label: "Practice Paper 1",
  questions: [
    {
      kind: "code", n: 1, marks: 2, co: "CO1", kl: "KL2",
      prompt: `Identify and describe each of the individual parts in the HTML element below.

\`\`\`html
<img src="garden.jpg" alt="A walled garden in autumn" width="800" height="600">
\`\`\``,
      code: `<img src="garden.jpg" alt="A walled garden in autumn" width="800" height="600">`,
      language: "html",
      solution: `The element is an image (\`<img>\`). It is a void element — it has no closing tag.

- \`<img>\` — the opening tag, identifying the element type.
- \`src\` — the attribute that names the image file (here, relative to the current page).
- \`"garden.jpg"\` — the attribute value, the file the browser should fetch.
- \`alt\` — the alternative text, the textual replacement used by screen readers and shown when the image fails to load.
- \`"A walled garden in autumn"\` — the alt value, a description of the image.
- \`width\` and \`height\` — attributes that tell the browser the rendered size, in CSS pixels. Setting them helps prevent layout shift while the image loads.`,
      explanation: `Same structure as the anchor in Question 1: opening tag, attributes, values. The notable difference is that the image element is void and the alt attribute is required for accessibility.`,
      examinerNotes: `Award 1 mark for naming the element and the key attributes (src, alt). Award the second mark for explaining what each attribute is for.`,
    },
    {
      kind: "short", n: 2, marks: 2, co: "CO1", kl: "KL2",
      prompt: `What is the CSS box model? Describe its four parts.`,
      solution: `The CSS box model describes how every element on a page is laid out as a rectangle. From the inside out:

1. **Content** — the actual content of the element: text, an image, the children of a container.
2. **Padding** — the space between the content and the border. The background of the element extends into the padding.
3. **Border** — a line drawn around the padding. Has width, style, and colour.
4. **Margin** — the space outside the border, separating the element from its neighbours. The background does **not** extend into the margin.

\`\`\`css
.card {
  width: 320px;            /* content width */
  padding: 24px;            /* inside the border */
  border: 1px solid #d4c7a4;
  margin: 16px;             /* outside the border */
}
\`\`\`

With \`box-sizing: border-box\`, the declared \`width\` includes padding and border. The default is \`content-box\`, which means width is content-only. Most modern stylesheets set border-box globally so the math is intuitive.`,
      explanation: `Confusion between margin and padding is one of the most common CSS bugs. Padding is inside the border (and the element's background fills it). Margin is outside.`,
      examinerNotes: `Award 1 mark for naming and describing two parts. Award the second mark for naming and describing the other two, or for explaining box-sizing.`,
    },
    {
      kind: "code", n: 3, marks: 2, co: "CO1", kl: "KL3",
      prompt: `Explain the step-by-step execution of the below code.

\`\`\`html
<script>
  const items = document.querySelectorAll(".item");
  items.forEach((el) => {
    el.addEventListener("click", () => {
      el.classList.toggle("active");
    });
  });
</script>
\`\`\``,
      code: `const items = document.querySelectorAll(".item");
items.forEach((el) => {
  el.addEventListener("click", () => {
    el.classList.toggle("active");
  });
});`,
      language: "js",
      solution: `1. \`document.querySelectorAll(".item")\` returns a NodeList of every element in the document with the class "item". It is a static list — elements added later are not included.
2. \`.forEach((el) => {...})\` iterates over the list and runs the body once per element.
3. For each element, the body attaches a click listener. The listener is a closure: it captures \`el\` from the surrounding scope, so when the listener runs later, it knows which element to act on.
4. The listeners are not executed at registration. They are stored.
5. When the user clicks one of the \`.item\` elements, the matching listener fires. \`el.classList.toggle("active")\` adds the \`active\` class if it is missing, and removes it if it is present.
6. The browser re-renders the element. CSS rules that match \`.item.active\` now apply (or no longer apply).`,
      explanation: `Two patterns are at work here: a forEach over a NodeList, and a per-element listener stored in a closure. The forEach is the older way; the modern alternative is event delegation — one listener on a parent, checking e.target.`,
      examinerNotes: `Award 1 mark for querySelectorAll returning a NodeList of matching elements. Award the second mark for explaining that the listener fires only when the click event happens, and that the closure captures the element.`,
    },
    {
      kind: "short", n: 4, marks: 2, co: "CO1", kl: "KL2",
      prompt: `How does JavaScript reach elements in the DOM? Name three methods and give an example of each.`,
      solution: `JavaScript reaches elements through methods on the \`document\` and \`Element\` objects. Three of the most common:

1. **\`document.getElementById(id)\`** — returns the single element with the given id, or null.
   \`\`\`js
   const header = document.getElementById("main-header");
   \`\`\`

2. **\`document.querySelector(selector)\`** — returns the first element matching a CSS selector, or null. Accepts any CSS selector.
   \`\`\`js
   const firstItem = document.querySelector("ul li");
   \`\`\`

3. **\`document.querySelectorAll(selector)\`** — returns a static NodeList of every element matching the selector.
   \`\`\`js
   const allItems = document.querySelectorAll("ul li");
   \`\`\`

Other useful methods: \`el.getElementsByClassName\`, \`el.children\`, \`el.parentElement\`, \`el.nextElementSibling\`, \`el.closest(selector)\`.`,
      explanation: `Most DOM code uses one of these three. querySelector is the most flexible; getElementById is the fastest; querySelectorAll is the standard for "find me everything matching this".`,
      examinerNotes: `Award 1 mark each for two methods with a one-line example. Award the third mark for a clear distinction between querySelector and querySelectorAll.`,
    },
    {
      kind: "short", n: 5, marks: 2, co: "CO1", kl: "KL4",
      prompt: `Explain the difference between \`==\` and \`===\` in JavaScript. Give one example where they produce different results.`,
      solution: `**\`==\`** is the loose equality operator. It compares two values after coercing them to a common type. \`"0" == 0\` is true because the string is coerced to a number before the comparison.

**\`===\`** is the strict equality operator. It compares both value and type. \`"0" === 0\` is false because the types differ.

The rule is to use \`===\` everywhere, with one exception: \`x == null\` is a deliberate idiom that matches both \`null\` and \`undefined\` in one check.

**Example where they disagree:**

\`\`\`js
0 == ""        // true   — both coerce to 0
0 === ""       // false  — different types

null == undefined   // true
null === undefined  // false
\`\`\``,
      explanation: `The coercion rules of \`==\` produce surprising results. Memorising them is wasted effort compared to the simpler rule: always use \`===\`.`,
      examinerNotes: `Award 1 mark for the type-coercion distinction. Award the second mark for a concrete example with the right values.`,
    },
    {
      kind: "short", n: 6, marks: 2, co: "CO2", kl: "KL2",
      prompt: `Describe the responsibilities of the View in the Model-View-Controller pattern. What does the View NOT do?`,
      solution: `The View is responsible for rendering the model into a form the user can see and interact with. It reads from the model and produces output. In a web application, the View is the rendered HTML and CSS — and, in modern frameworks, the JSX that describes it.

**What the View does:**

- Reads from the model (props, state, fetched data).
- Produces a description of the UI (JSX, HTML, a template).
- Handles local presentation concerns: styling, layout, animation.
- Forwards user interactions to the controller through event handlers.

**What the View does NOT do:**

- It does not store persistent data. That is the model's job.
- It does not decide what to do in response to user input. That is the controller's job.
- It does not know how data is fetched or stored.
- It does not modify the model directly (in strict MVC). It asks the controller to do that.

The separation is what makes MVC maintainable: a designer can change the View without touching the data layer, and a backend engineer can change the model without touching the UI.`,
      explanation: `The "what the View does NOT do" part is more important than the "what it does do" part. The constraints are what keep the architecture clean.`,
      examinerNotes: `Award 1 mark for the responsibilities (rendering, presenting, forwarding events). Award 1 mark for a clear statement of what the View does not do.`,
    },
    {
      kind: "code", n: 7, marks: 2, co: "CO2", kl: "KL3",
      prompt: `Explain the code given below:

\`\`\`jsx
import React, { useState } from 'react';

function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(!on)}>
      {on ? "ON" : "OFF"}
    </button>
  );
}
\`\`\``,
      code: `import React, { useState } from 'react';
function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(!on)}>
      {on ? "ON" : "OFF"}
    </button>
  );
}`,
      language: "js",
      solution: `The code defines a React function component called \`Toggle\`.

- **\`useState(false)\`** creates a piece of state named \`on\`, initialised to \`false\`. The setter \`setOn\` updates it.
- **The button's onClick** calls \`setOn(!on)\` — flipping the current value.
- **The button's text** uses the conditional expression \`on ? "ON" : "OFF"\`, so the visible label matches the state.

When the user clicks the button:

1. The onClick callback runs, calling \`setOn(!on)\`.
2. React schedules a re-render of the \`Toggle\` component.
3. The component runs again. \`on\` is now the new value. The JSX is re-evaluated.
4. The button now shows the new label. The DOM is updated to match.

The component is a complete example of state-driven UI: the source of truth (\`on\`) determines what is rendered, and the only way to change what is on screen is to call the setter.`,
      explanation: `A toggle is the simplest possible stateful component. Once you understand it, every more complex stateful component is a composition of similar pieces.`,
      examinerNotes: `Award 1 mark for explaining useState. Award the second mark for the re-render loop.`,
    },
    {
      kind: "short", n: 8, marks: 2, co: "CO2", kl: "KL2",
      prompt: `What is the Virtual DOM? Why is it useful in React?`,
      solution: `The Virtual DOM is an in-memory, lightweight JavaScript representation of the desired UI. React keeps two trees: the current one (what is on screen) and the next one (what should be on screen). When state changes, React builds a new tree, compares it to the previous one ("diffing"), and applies the minimum set of changes to the real DOM.

**Why it is useful:**

- **Performance** — touching the real DOM is expensive (layout, paint, reflow). React's diffing reduces the number of DOM operations to the smallest set needed.
- **Declarative code** — you describe what the page should look like, not how to update it. The library does the work of figuring out the changes.
- **Predictability** — the view is always a function of state. There is no way for the UI to drift from the data.
- **Cross-browser** — React normalises the differences between browsers, so the same code produces the same result everywhere.

**Caveat:** the Virtual DOM is not magic. It is a planning step. The actual performance gains come from React's heuristics about which updates are safe to batch and which are not.`,
      explanation: `The Virtual DOM is a tool the library uses, not a structure the browser maintains. Understanding this distinction matters when reasoning about performance.`,
      examinerNotes: `Award 1 mark for the definition. Award the second mark for at least one concrete benefit (performance, declarative, predictability).`,
    },
    {
      kind: "short", n: 9, marks: 2, co: "CO2", kl: "KL2",
      prompt: `Explain two ES6 features useful when working with React. Give an example of each.`,
      solution: `**1. Destructuring** — pull values out of objects or arrays in a single line. Useful for props.

\`\`\`js
function Greeting({ name, year }) {
  return <p>Hello, {name}. You are in year {year}.</p>;
}
\`\`\`

**2. Arrow functions** — shorter syntax, and they don't bind their own \`this\`. They are the default in modern React code.

\`\`\`js
const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
\`\`\`

Other features you will see in React code: template literals for class names, the spread operator for passing props, default parameters for optional props, and modules for splitting the codebase into files.`,
      explanation: `The combination of destructuring and arrow functions is what makes modern React components so compact. Without them, a typical component would be twice as long.`,
      examinerNotes: `Award 1 mark each for two features with a React-specific example.`,
    },
    {
      kind: "short", n: 10, marks: 2, co: "CO2", kl: "KL2",
      prompt: `Define State and Props in React. How do they differ?`,
      solution: `**State** is data that a component owns. The component can change it during its lifetime. When state changes, the component re-renders. \`useState\` is the most common way to add state to a function component.

**Props** are inputs a component receives from its parent. Props are read-only inside the component — the parent owns them. They are how data flows from parent to child.

**Differences:**

- Source: state is internal; props are external.
- Mutability: state can be changed (via the setter); props cannot.
- Ownership: state is owned by the component; props are owned by the parent.
- Re-render trigger: changing state re-renders the component; changing props re-renders the child.

In a typical app, the top of the tree holds the state, and it is passed down as props. Children can call callbacks (also passed as props) to ask the parent to update its state.`,
      explanation: `The mental model of "state up, props down" is the heart of React. The component that owns the data is the one that can change it.`,
      examinerNotes: `Award 1 mark for the two definitions. Award the second mark for a clear distinction (ownership, mutability, or who triggers the re-render).`,
    },
    {
      kind: "short", n: 11, marks: 5, co: "CO1", kl: "KL4",
      prompt: `Compare client-side and server-side form validation. When should each be used? Why is server-side validation always required, even when client-side validation is in place?`,
      solution: `**Client-side validation** runs in the browser, using HTML attributes and JavaScript. It gives the user immediate feedback without a round-trip to the server.

**Server-side validation** runs on the server, in the application code. It is the final authority on whether a request is accepted.

**Comparison:**

- **Speed** — client-side is instant; server-side requires a network request.
- **Security** — client-side is bypassable (a determined user can edit the DOM or send a forged request). Server-side is not.
- **Coverage** — client-side covers only what the browser validates; server-side covers everything the application accepts.
- **UX** — client-side is what the user sees; server-side is what protects the data.

**When to use each:**

- Client-side validation should be used for **every** form a user fills out, because the user experience is dramatically better.
- Server-side validation should be used for **every** endpoint that accepts data, because the application is not safe without it.

**Why server-side validation is always required:** the client cannot be trusted. A user can disable JavaScript, edit the DOM, or send a request directly to the server endpoint using curl. If the server does not validate, an attacker can store malformed or malicious data, or trigger bugs in the application. Treat client-side validation as a courtesy, server-side validation as a security boundary.`,
      explanation: `This is the question students get wrong most often. Client-side validation is for UX; server-side validation is for safety. The two coexist, with different responsibilities.`,
      examinerNotes: `Award 1 mark for the comparison (at least three points). Award 1 mark for the when-to-use answer. Award up to 3 marks for explaining why server-side validation is required (bypass, security, trust boundary).`,
    },
    {
      kind: "code", n: 12, marks: 5, co: "CO1", kl: "KL4",
      prompt: `Provide an illustration of fetching data from a server using \`fetch\`.

\`\`\`js
async function loadUser(id) {
  // write the body
}
\`\`\`

The function should:
- Make a GET request to \`/api/users/\${id}\`.
- If the response is not OK, throw an error.
- Parse the JSON and return it.
- Handle the case where the user does not exist (404).`,
      code: `async function loadUser(id) {
  const res = await fetch("/api/users/" + id);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}`,
      language: "js",
      solution: `\`\`\`js
async function loadUser(id) {
  const res = await fetch("/api/users/" + id);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}
\`\`\`

**Step-by-step:**

1. \`fetch\` returns a Promise that resolves to a Response. \`await\` waits for the response.
2. The 404 check handles "user does not exist" as a normal case — return \`null\`.
3. \`!res.ok\` is true for any non-2xx response. \`throw\` turns the rest into a real error.
4. \`res.json()\` reads the body and parses it as JSON. It returns another Promise; \`await\` waits for it.

**Why this shape?**

- fetch does not throw on 4xx/5xx; the check is the developer's responsibility.
- 404 is not really an error in the application sense — it is a "not found" answer. Returning \`null\` lets the caller decide what to render.
- Other status codes are unexpected and bubble up as exceptions. The caller wraps in try/catch and shows a generic error UI.`,
      explanation: `This is the modern shape of an AJAX call. The XHR form of the original paper is still valid; the fetch form is what new code should use.`,
      examinerNotes: `Award 1 mark for the GET request. Award 1 mark for the !res.ok check. Award 1 mark for the 404 handling. Award 2 marks for parsing the JSON and returning it correctly.`,
    },
    {
      kind: "scenario", n: 13, marks: 5, co: "CO2", kl: "KL4",
      prompt: `A weather dashboard has a search box at the top, a "use my location" button beside it, a row of tabs for "Today / 7 days / Radar", and a content area that changes based on the selected tab. Identify the React components and draw the hierarchy.`,
      solution: `**Components:**

- \`WeatherDashboard\` — the top-level container. Holds the current state (the search query, the selected tab, the fetched data).
- \`SearchBox\` — the text input for the city name and a search button.
- \`LocationButton\` — the "use my location" button.
- \`TabBar\` — the row of three tabs.
- \`Tab\` — a single tab (used three times).
- \`TabContent\` — a container that renders the active tab's content.
- \`TodayView\`, \`SevenDayView\`, \`RadarView\` — the three views.

**Hierarchy:**

\`\`\`
WeatherDashboard
├── SearchBox
├── LocationButton
├── TabBar
│   ├── Tab (Today)
│   ├── Tab (7 days)
│   └── Tab (Radar)
└── TabContent
    ├── TodayView (when "Today" is active)
    ├── SevenDayView (when "7 days" is active)
    └── RadarView (when "Radar" is active)
\`\`\`

The active tab is held in state inside \`WeatherDashboard\`. Each \`Tab\` knows whether it is active and calls a callback when clicked. The data is fetched once and passed down as props to the views that need it.`,
      explanation: `This is the same decomposition pattern as the login form in the original paper: the top container owns the state, the children render pieces, and the children communicate up through callbacks.`,
      examinerNotes: `Award up to 3 marks for identifying reasonable components. Award 2 marks for a clear hierarchy.`,
    },
    {
      kind: "short", n: 14, marks: 5, co: "CO2", kl: "KL4",
      prompt: `What is the difference between props and state in React? Give a short example for each.`,
      solution: `**Props** are how a parent component passes data to a child. The child receives them as a function argument and treats them as read-only.

\`\`\`jsx
function Greeting({ name }) {
  return <p>Hello, {name}.</p>;
}

function App() {
  return <Greeting name="Sora" />;
}
\`\`\`

Here, \`name\` is a prop. \`App\` owns it; \`Greeting\` reads it.

**State** is data a component owns and can change during its lifetime. When state changes, the component re-renders.

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

Here, \`count\` is state. \`Counter\` owns it and updates it.

**Differences:**

- **Source** — props come from outside (the parent); state is internal.
- **Mutability** — props are read-only; state is changed via the setter.
- **Trigger** — props change when the parent re-renders; state changes when the setter is called.
- **Re-render** — a prop change re-renders the child; a state change re-renders the component that owns it.

A common pattern is to keep state high in the tree and pass it down as props. Children that need to change the state receive a setter as a prop too.`,
      explanation: `The same component can be both a parent (owning state) and a child (receiving props). The "state up, props down" rule makes data flow easy to reason about.`,
      examinerNotes: `Award up to 2 marks for the explanation. Award 1 mark for a clear example of props. Award 1 mark for a clear example of state. Award 1 mark for a clear distinction.`,
    },
    {
      kind: "or", n: 15, marks: 10, co: "CO1/CO2", kl: "KL4",
      parts: [
        {
          kind: "code", n: "15a", marks: 10, co: "CO1/CO2", kl: "KL4",
          prompt: `Implement a Course Feedback Form and validate it using JavaScript.

The form should collect:
- Student name (required, at least 3 characters)
- Course code (required, must match the pattern /^[A-Z]{2}\\d{3}$/ — two uppercase letters followed by three digits, e.g. CS3005)
- Overall rating (required, integer from 1 to 5)
- Comments (optional, at most 500 characters)
- Recommend to a friend (required, "Yes" or "No")

Validation should run on submit. Show errors next to each field, and do not submit if any field is invalid.`,
          code: `<form id="feedback" novalidate>
  <label>Student name <input name="name" required></label>
  <p class="err" data-for="name"></p>

  <label>Course code <input name="code" required placeholder="CS3005"></label>
  <p class="err" data-for="code"></p>

  <label>Overall rating
    <select name="rating" required>
      <option value="">—</option>
      <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
    </select>
  </label>
  <p class="err" data-for="rating"></p>

  <label>Comments <textarea name="comments" maxlength="500"></textarea></label>
  <p class="err" data-for="comments"></p>

  <label>Recommend to a friend?
    <select name="recommend" required>
      <option value="">—</option>
      <option>Yes</option><option>No</option>
    </select>
  </label>
  <p class="err" data-for="recommend"></p>

  <button type="submit">Send feedback</button>
</form>
<script>
  const form = document.getElementById("feedback");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const errs = {};

    if (!data.name || data.name.trim().length < 3) errs.name = "Name must be at least 3 characters.";
    if (!/^[A-Z]{2}\\d{3}$/.test(data.code || "")) errs.code = "Course code must look like CS3005.";
    const r = Number(data.rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) errs.rating = "Rating must be between 1 and 5.";
    if ((data.comments || "").length > 500) errs.comments = "Comments are at most 500 characters.";
    if (data.recommend !== "Yes" && data.recommend !== "No") errs.recommend = "Pick Yes or No.";

    document.querySelectorAll(".err").forEach((el) => (el.textContent = ""));
    for (const [f, msg] of Object.entries(errs)) {
      const el = document.querySelector(\`.err[data-for="\${f}"]\`);
      if (el) el.textContent = msg;
    }
    if (Object.keys(errs).length === 0) {
      console.log("Submitting:", data);
    }
  });
</script>`,
          language: "html",
          solution: `The form collects five fields. Validation runs in a single object (\`errs\`) and the errors are written into the matching \`.err\` paragraphs. The form only proceeds when \`errs\` is empty.

Notable details:

- The course code pattern is enforced with a regex.
- The rating is parsed as a number and bounds-checked.
- The comments length is checked explicitly even though \`maxlength\` already prevents typing more.
- The recommend field uses exact string match ("Yes" / "No").`,
          explanation: `Same shape as the original paper's question, with a different domain. The structure is the lesson: one validator function, one error-collection object, one UI update.`,
          examinerNotes: `Award up to 3 marks for HTML structure. Award up to 4 marks for correct validation logic. Award up to 3 marks for displaying errors and not submitting when invalid.`,
        },
        {
          kind: "short", n: "15b", marks: 10, co: "CO2", kl: "KL4",
          prompt: `What are Hooks in React? Name three built-in hooks and explain what each does. Write a small example that uses two of them together.`,
          solution: `Hooks are functions that let function components use React features — state, side effects, refs, memoisation, and more. They are the modern way to write React components.

**Three built-in hooks:**

- **\`useState(initial)\`** — returns a pair: a state value and a setter. Calling the setter triggers a re-render. Use it for any data that changes during the component's life.
  \`\`\`js
  const [count, setCount] = useState(0);
  \`\`\`

- **\`useEffect(callback, deps)\`** — runs the callback after the component renders. \`deps\` is an array; the effect re-runs when any value in the array changes. Use it for side effects: fetching data, attaching event listeners, syncing with the DOM.
  \`\`\`js
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  \`\`\`

- **\`useRef(initial)\`** — returns a mutable object whose \`current\` property holds a value that persists across renders without triggering a re-render. Use it for direct DOM access or mutable state that should not cause a re-render.
  \`\`\`js
  const inputRef = useRef(null);
  inputRef.current.focus();
  \`\`\`

**Example using \`useState\` and \`useEffect\` together:**

\`\`\`jsx
import { useState, useEffect } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{time.toLocaleTimeString()}</p>;
}
\`\`\`

- \`useState\` holds the current time.
- \`useEffect\` sets up an interval when the component mounts.
- The return function from \`useEffect\` cleans up the interval when the component unmounts.
- The empty \`[]\` dependency array means the effect runs once on mount.

**Rules of Hooks:**

- Only call hooks at the top level of a component, not inside conditions or loops.
- Only call hooks from function components or custom hooks (not from regular JavaScript functions).`,
          explanation: `Hooks replaced the older class-based component model. Most new React code uses function components with hooks exclusively.`,
          examinerNotes: `Award up to 3 marks for naming and explaining three hooks. Award up to 4 marks for the example, including a cleanup function. Award up to 3 marks for the rules of hooks.`,
        },
      ],
    },
  ],
};

export const PAPERS: ExamPaper[] = [ORIGINAL_50_MARK, PRACTICE_PAPER_1];

export const PAPER_BY_ID: Record<string, ExamPaper> = Object.fromEntries(PAPERS.map((p) => [p.id, p]));
