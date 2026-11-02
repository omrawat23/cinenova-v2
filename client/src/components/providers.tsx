import { useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getSystemTheme());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => setTheme(mediaQuery.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", syncTheme);
    return () => mediaQuery.removeEventListener("change", syncTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return children;
}
