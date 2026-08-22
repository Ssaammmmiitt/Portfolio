import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiHome, FiMail, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { useTheme } from "../context/ThemeProvider.jsx";
import { scrollToHash } from "../lib/scrollTo.js";
import Dock from "./Dock.jsx";

const easeOut = [0.22, 1, 0.36, 1];

export default function NavDock({ visible = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const items = useMemo(
    () => [
      {
        icon: <FiHome size={18} />,
        label: "Home",
        onClick: () => scrollToHash("#hero"),
      },
      {
        icon: <FiBriefcase size={18} />,
        label: "Work",
        onClick: () => scrollToHash("#works"),
      },
      {
        icon: <FiUser size={18} />,
        label: "About",
        onClick: () => scrollToHash("#about"),
      },
      {
        icon: <FiMail size={18} />,
        label: "Contact",
        onClick: () => scrollToHash("#contact"),
      },
      {
        icon: isDark ? <FiSun size={18} /> : <FiMoon size={18} />,
        label: isDark ? "Light mode" : "Dark mode",
        onClick: toggleTheme,
        className: "dock-item-accent",
      },
    ],
    [isDark, toggleTheme]
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.35, ease: easeOut }}
          className="fixed inset-x-0 bottom-0 z-1001 flex justify-center pb-[max(0.65rem,env(safe-area-inset-bottom))]"
        >
          <Dock
            items={items}
            panelHeight={compact ? 56 : 64}
            baseItemSize={compact ? 40 : 44}
            itemSlotWidth={compact ? 48 : 58}
            magnification={compact ? 48 : 58}
            distance={compact ? 100 : 130}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
