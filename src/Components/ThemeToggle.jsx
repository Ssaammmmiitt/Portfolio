import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeProvider";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(event) => {
        toggleTheme();
        event.currentTarget.blur();
      }}
      onKeyDown={(event) => {
        if (event.code !== "Space" && event.key !== " ") return;
        event.preventDefault();
        event.currentTarget.blur();
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`nav-interactive inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${className || "border-border-strong bg-background/50 text-text hover:border-text/40"}`}
    >
      {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;
