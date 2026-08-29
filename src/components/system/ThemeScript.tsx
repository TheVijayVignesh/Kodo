"use client";

/**
 * Inline script that runs before hydration to set the theme class on <html>
 * based on the user's previously chosen theme (or system preference).
 */
const SCRIPT = `(() => {
  try {
    let theme;
    const raw = localStorage.getItem('zen-atlas-v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      theme = parsed?.state?.theme;
    }
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    document.documentElement.dataset.theme = theme;
  } catch {}
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
