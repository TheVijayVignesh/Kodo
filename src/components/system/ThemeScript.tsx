"use client";

/**
 * Inline script that runs before hydration to set the theme class on <html>
 * based on the user's previously chosen theme (or system preference).
 */
const SCRIPT = `(() => {
  try {
    const stored = localStorage.getItem('zen-atlas-theme');
    const theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
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
