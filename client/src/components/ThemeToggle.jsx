import { useTheme } from "../../hooks/useTheme";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 
        rounded-full 
        bg-gray-200 dark:bg-gray-700 
        text-gray-800 dark:text-yellow-400 
        transition-colors duration-300 
        hover:scale-110 
        focus:outline-none
      "
      aria-label="Toggle Dark Mode"
    >
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeToggle;
