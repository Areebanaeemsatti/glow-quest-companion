import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("glow-theme")) as
      | "light"
      | "dark"
      | null;
    const initial = saved ?? "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      localStorage.setItem("glow-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  return { theme, toggle };
}
