import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { scrollToTop } from "../lib/scrollTo.js";

const easeOut = [0.22, 1, 0.36, 1];
const SHOW_AFTER_PX = 360;

function readScrollY() {
  return window.__lenis?.scroll ?? window.scrollY;
}

export default function ScrollToTop({ enabled = false }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    let showing = readScrollY() > SHOW_AFTER_PX;
    setVisible(showing);

    const update = () => {
      const next = readScrollY() > SHOW_AFTER_PX;
      if (next === showing) return;
      showing = next;
      setVisible(next);
    };

    window.addEventListener("scroll", update, { passive: true });
    const intervalId = window.setInterval(update, 120);

    return () => {
      window.removeEventListener("scroll", update);
      window.clearInterval(intervalId);
    };
  }, [enabled]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {enabled && visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={{ duration: 0.3, ease: easeOut }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="scroll-to-top-btn fixed z-[10003] flex size-11 items-center justify-center rounded-full sm:size-12 left-[max(1rem,env(safe-area-inset-left))] bottom-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.75rem))] lg:bottom-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          <FiArrowUp size={18} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>,
    document.body
  );
}
