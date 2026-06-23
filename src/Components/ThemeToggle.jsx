import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="theme-toggle inline-flex items-center gap-2 rounded-full border theme-border px-3 py-2 text-sm font-medium theme-text transition-colors duration-300 hover:text-cyan-400"
    >
      {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;
