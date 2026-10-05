import { expect, test } from "@playwright/test";
import { MODULE_3 } from "../../src/lib/curriculum/lectures";

const MODULE_3_LECTURE_IDS = [
  "m3l01",
  "m3l02",
  "m3l03",
  "m3l04",
  "m3l05",
  "m3l06",
  "m3l07",
  "m3l08",
];
const MODULE_3_SOURCE_URLS = [
  ...new Set(
    MODULE_3.lectures.flatMap((lecture) =>
      lecture.sources.flatMap((source) => (source.url ? [source.url] : []))
    )
  ),
];

test("Module 3 lists its eight lessons", async ({ page }) => {
  await page.goto("/modules/3");

  await expect(
    page.getByRole("heading", { name: "Server-Side Web Technology" })
  ).toBeVisible();
  await expect(page.getByText(/Module 3\s*·\s*8 lectures/i)).toBeVisible();

  const lessonLinks = page.locator('a[href^="/modules/3/m3l"]');
  await expect(lessonLinks).toHaveCount(8);
  const hrefs = await lessonLinks.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(hrefs).toEqual(MODULE_3_LECTURE_IDS.map((id) => `/modules/3/${id}`));
});

for (const id of MODULE_3_LECTURE_IDS) {
  test(`${id} route renders a heading and a quiz or exercise`, async ({ page }) => {
    const response = await page.goto(`/modules/3/${id}`);

    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    const lessonContent = page.locator(".container-prose").first();
    const openingParagraph = lessonContent.locator("p").first();
    await expect(openingParagraph).toBeVisible();
    expect((await openingParagraph.innerText()).trim().length).toBeGreaterThan(100);
    await expect(
      lessonContent.getByText(/(Coding exercise|Knowledge check)/i).first()
    ).toBeVisible();
  });
}

test("Module 3 lesson route rejects unknown and other-module lectures", async ({ page }) => {
  const wrongModule = await page.goto("/modules/3/m1l01");
  expect(wrongModule?.status()).toBe(404);

  const unknownLecture = await page.goto("/modules/3/not-a-lecture");
  expect(unknownLecture?.status()).toBe(404);
});

test("Module 3 lesson navigation stays on Module 3 URLs", async ({ page }) => {
  await page.goto("/modules/3/m3l02");

  const breadcrumb = page.locator('main a[href="/modules/3"]');
  await expect(breadcrumb).toHaveText("Module 3");
  await expect(breadcrumb).toHaveAttribute("href", "/modules/3");
  await expect(page.getByRole("link", { name: "Next lecture" })).toHaveAttribute(
    "href",
    "/modules/3/m3l03"
  );
  await expect(page.locator('a[href="/modules/3/m3l01"]')).toHaveCount(1);
  await expect(page.locator('a[href="/modules/3/m3l03"]')).toHaveCount(2);
});

test("Module 2 lesson navigation retains its existing lesson URLs", async ({ page }) => {
  await page.goto("/modules/1/m2l02");

  const breadcrumb = page.locator('main a[href="/modules/2"]');
  await expect(breadcrumb).toHaveText("Module 2");
  await expect(breadcrumb).toHaveAttribute("href", "/modules/2");
  await expect(page.getByRole("link", { name: "Next lecture" })).toHaveAttribute(
    "href",
    "/modules/1/m2l03"
  );
  await expect(page.locator('a[href="/modules/1/m2l01"]')).toHaveCount(1);
  await expect(page.locator('a[href="/modules/1/m2l03"]')).toHaveCount(2);
});

test("the home learning path includes all Module 3 lessons", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /path through server-side programming/i })).toBeVisible();
  await expect(page.locator('a[href^="/modules/3/m3l"]')).toHaveCount(8);
});

test("Module 3 progression waits for Module 2 completion and unlocks sequentially", async ({ page }) => {
  await page.goto("/modules/3");

  const firstLesson = page.locator('a[href="/modules/3/m3l01"]');
  const secondLesson = page.locator('a[href="/modules/3/m3l02"]');
  await expect(firstLesson).toHaveClass(/pointer-events-none/);
  await expect(secondLesson).toHaveClass(/pointer-events-none/);

  await page.evaluate(() => {
    localStorage.setItem(
      "zen-atlas-v1",
      JSON.stringify({
        state: {
          progress: {
            m2l10: { visited: true, completed: true, exercisesPassed: [] },
          },
        },
        version: 1,
      })
    );
  });
  await page.reload();

  await expect(firstLesson).not.toHaveClass(/pointer-events-none/);
  await expect(secondLesson).toHaveClass(/pointer-events-none/);
  await firstLesson.click();
  await expect(page).toHaveURL(/\/modules\/3\/m3l01$/);
  await expect(page.locator("h1")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const persisted = JSON.parse(localStorage.getItem("zen-atlas-v1") ?? "{}");
        return persisted.state?.progress?.m3l01?.visited;
      })
    )
    .toBe(true);

  await page.goto("/modules/3");
  await expect(secondLesson).not.toHaveClass(/pointer-events-none/);
  await expect(page.locator('a[href="/modules/3/m3l03"]')).toHaveClass(/pointer-events-none/);
});

test("search returns a Module 3 lesson with its Module 3 route", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open search" }).click();
  await page.getByPlaceholder(/Search lectures, concepts, exercises, exams/i).fill(
    "Server-side Programming and Node.js"
  );

  await expect(
    page.locator(".fixed.inset-0").getByRole("link", {
      name: /Server-side Programming and Node.js/,
    })
  ).toHaveAttribute("href", "/modules/3/m3l01");
});

test("the sources index includes lesson-specific Module 3 documentation", async ({ page }) => {
  await page.goto("/sources");

  await expect(page.locator('a[href="https://nodejs.org/api/http.html"]')).toHaveCount(1);

  const sourceLinks = await page.locator('a[href^="https://"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href"))
  );
  for (const url of MODULE_3_SOURCE_URLS) {
    expect(sourceLinks.filter((href) => href === url), `${url} should render exactly once`).toHaveLength(1);
  }
});

test("the in-browser file-management exercise shows checker feedback", async ({ page }) => {
  // m3l03 models file operations in memory; this test only runs the browser checker.
  await page.goto("/modules/3/m3l03");
  const exerciseHeading = page.getByText(/Coding exercise/i).first();
  await expect(exerciseHeading).toBeVisible();
  await exerciseHeading.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Run tests/i }).click();

  await expect(page.getByText(/All tests passed|Some tests failed/i).first()).toBeVisible({
    timeout: 5000,
  });
});

test("Module 3 lesson progress persists after reload", async ({ page }) => {
  await page.goto("/modules/3/m3l03");
  const markCompleteButton = page.getByRole("button", { name: "Mark complete" });
  await expect(markCompleteButton).toBeVisible();
  await markCompleteButton.click();
  await expect(page.getByText("You've marked this lecture as complete.")).toBeVisible();

  await page.reload();

  await expect(page.getByText("You've marked this lecture as complete.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Completed" })).toBeDisabled();
});

for (const id of ["m3l07", "m3l08"]) {
  test(`${id} lesson fits a 390px viewport without horizontal page overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/modules/3/${id}`);

    const layout = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const traceAncestors = (element: Element | null) => {
        const ancestors = [];
        let current = element;
        while (current && ancestors.length < 8) {
          const rect = current.getBoundingClientRect();
          const style = getComputedStyle(current);
          ancestors.push({
            tag: current.tagName,
            className: typeof current.className === "string" ? current.className : "",
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            clientWidth: current.clientWidth,
            scrollWidth: current.scrollWidth,
            minWidth: style.minWidth,
            overflowX: style.overflowX,
            display: style.display,
          });
          current = current.parentElement;
        }
        return ancestors;
      };
      const isInsideVisibleScroller = (element: Element) => {
        let parent = element.parentElement;
        while (parent) {
          const style = getComputedStyle(parent);
          if (
            (style.overflowX === "auto" || style.overflowX === "scroll") &&
            parent.getBoundingClientRect().right <= viewportWidth + 1
          ) {
            return true;
          }
          parent = parent.parentElement;
        }
        return false;
      };
      const overflowing = Array.from(document.querySelectorAll("body *"))
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.right > viewportWidth + 1 && !isInsideVisibleScroller(element);
        })
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName,
            className: typeof element.className === "string" ? element.className : "",
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            scrollWidth: element.scrollWidth,
            text: element.textContent?.trim().slice(0, 80),
          };
        })
        .slice(0, 12);
      const quizCode = document.querySelector("main .paper ol pre");
      const quizAnswer = quizCode?.parentElement?.parentElement ?? null;
      const lessonCode = document.querySelector(".container-prose figure pre");

      return {
        viewportWidth,
        documentWidth: document.documentElement.scrollWidth,
        overflowing,
        quizAnswerAncestors: traceAncestors(quizAnswer),
        quizCodeAncestors: traceAncestors(quizCode),
        lessonCodeAncestors: traceAncestors(lessonCode),
      };
    });

    expect(
      layout.documentWidth,
      JSON.stringify(
        {
          overflowing: layout.overflowing,
          quizAnswerAncestors: layout.quizAnswerAncestors,
          quizCodeAncestors: layout.quizCodeAncestors,
          lessonCodeAncestors: layout.lessonCodeAncestors,
        },
        null,
        2
      )
    ).toBeLessThanOrEqual(layout.viewportWidth);
  });
}

test("rehydrating older saved progress fills missing Module 3 entries", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "zen-atlas-v1",
      JSON.stringify({
        state: {
          theme: "dark",
          progress: {
            m1l01: {
              visited: true,
              completed: false,
              exercisesPassed: ["m1l01-ex01"],
            },
          },
          bookmarks: [],
          notes: {},
          examAttempts: [],
        },
        version: 1,
      })
    );
  });

  await page.goto("/modules/1/m1l01");
  await page.getByRole("button", { name: "Mark complete" }).click();

  const savedProgress = await page.evaluate(() => {
    const persisted = JSON.parse(localStorage.getItem("zen-atlas-v1") ?? "{}");
    return persisted.state.progress;
  });

  expect(savedProgress.m1l01).toMatchObject({
    visited: true,
    completed: true,
    exercisesPassed: ["m1l01-ex01"],
  });
  expect(savedProgress.m3l01).toEqual({
    visited: false,
    completed: false,
    exercisesPassed: [],
  });
});
