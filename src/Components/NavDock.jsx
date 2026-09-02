import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiBriefcase, FiDownload, FiHome, FiMail, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { CV } from "../data.js";
import { useTheme } from "../context/ThemeProvider.jsx";
import { triggerCvDownload } from "../lib/cv.js";
import { scrollToHash } from "../lib/scrollTo.js";
import Dock from "./Dock.jsx";

const easeOut = [0.22, 1, 0.36, 1];

const DOCK_SIZES = {
  compact: {
    panelHeight: 56,
    baseItemSize: 40,
    itemSlotWidth: 48,
    magnification: 48,
    distance: 100,
    iconSize: 18,
  },
  default: {
    panelHeight: 64,
    baseItemSize: 44,
    itemSlotWidth: 58,
    magnification: 58,
    distance: 130,
    iconSize: 18,
  },
  large: {
    panelHeight: 72,
    baseItemSize: 50,
    itemSlotWidth: 64,
    magnification: 64,
    distance: 145,
    iconSize: 20,
  },
  xl: {
    panelHeight: 82,
    baseItemSize: 56,
    itemSlotWidth: 72,
    magnification: 72,
    distance: 160,
    iconSize: 22,
  },
};

function useDockSize() {
  const [tier, setTier] = useState("default");

  useEffect(() => {
    const compact = window.matchMedia("(max-width: 639px)");
    const large = window.matchMedia("(min-width: 1024px)");
    const xl = window.matchMedia("(min-width: 1280px)");

    const update = () => {
      if (compact.matches) setTier("compact");
      else if (xl.matches) setTier("xl");
      else if (large.matches) setTier("large");
      else setTier("default");
    };

    update();
    compact.addEventListener("change", update);
    large.addEventListener("change", update);
    xl.addEventListener("change", update);

    return () => {
      compact.removeEventListener("change", update);
      large.removeEventListener("change", update);
      xl.removeEventListener("change", update);
    };
  }, []);

  return DOCK_SIZES[tier];
}

export default function NavDock({ visible = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const dockSize = useDockSize();

  const items = useMemo(
    () => [
      {
        icon: <FiHome size={dockSize.iconSize} />,
        label: "Home",
        onClick: () => scrollToHash("#hero"),
      },
      {
        icon: <FiBriefcase size={dockSize.iconSize} />,
        label: "Work",
        onClick: () => scrollToHash("#works"),
      },
      {
        icon: <FiUser size={dockSize.iconSize} />,
        label: "About",
        onClick: () => scrollToHash("#about"),
      },
      {
        icon: <FiMail size={dockSize.iconSize} />,
        label: "Contact",
        onClick: () => scrollToHash("#contact"),
      },
      ...(CV.url
        ? [
            {
              icon: <FiDownload size={dockSize.iconSize} />,
              label: `Download ${CV.label}`,
              onClick: () => triggerCvDownload(),
            },
          ]
        : []),
      {
        icon: isDark ? <FiSun size={dockSize.iconSize} /> : <FiMoon size={dockSize.iconSize} />,
        label: isDark ? "Light mode" : "Dark mode",
        onClick: toggleTheme,
        className: "dock-item-accent",
      },
    ],
    [dockSize.iconSize, isDark, toggleTheme]
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.35, ease: easeOut }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-1001 flex justify-center pb-[max(0.65rem,env(safe-area-inset-bottom))] lg:pb-[max(0.85rem,env(safe-area-inset-bottom))] xl:pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <Dock
            items={items}
            panelHeight={dockSize.panelHeight}
            baseItemSize={dockSize.baseItemSize}
            itemSlotWidth={dockSize.itemSlotWidth}
            magnification={dockSize.magnification}
            distance={dockSize.distance}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
