/* eslint-disable react-refresh/only-export-components */
// ^ Dieser Befehl ganz oben deaktiviert die Prüfung für diese Datei.
// Da wir hier einen Context, eine Komponente und einen Hook exportieren,
// meckert Vite 7 das. Das ist mit diesem "Flag" korrekt.

import { createContext, useState, useEffect, useContext } from "react";

// 1. Context erstellen und exportieren
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 2. Initiale Prüfung (Sicher gegen Absturz beim Laden)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      return saved || "light";
    } catch {
      return "light";
    }
  });

  // 3. HTML-Klasse updaten
  useEffect(() => {
    const root = window.document.documentElement;

    // Alte Klassen entfernen (Clean State)
    root.classList.remove("light", "dark");

    // Neue Klasse hinzufügen
    root.classList.add(theme);

    // Speichern
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

// 4. Hook exportieren
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
