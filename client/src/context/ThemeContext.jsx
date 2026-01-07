import { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Initiale Prüfung
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      return saved || "light";
    } catch {
      return "light";
    }
  });

  // 2. HTML-Klasse updaten
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// useTheme wurde entfernt, weil es jetzt in useTheme.js ist
