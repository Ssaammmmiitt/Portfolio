import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { NAV_LINKS } from "../data.js";
import { useTheme } from "../context/ThemeProvider.jsx";
import { gsap } from "../lib/gsap.js";
import { cn } from "../lib/utils.js";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";

const easeOut = [0.22, 1, 0.36, 1];

const Navbar = ({ visible = true, instant = false, show = true }) => {
  const root = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    if (!show) setMenuOpen(false);
  }, [show]);

  useLayoutEffect(() => {
    if (!visible || !root.current) return;

    if (instant) {
      gsap.set(root.current, { y: 0, opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      root.current,
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, delay: 0.15, ease: "power3.out" }
    );

    return () => tween.kill();
  }, [visible, instant]);

  useLayoutEffect(() => {
    if (!root.current) return;

    gsap.to(root.current, {
      y: show ? 0 : -28,
      opacity: show && visible ? 1 : 0,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
    });
  }, [show, visible]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={root}
        className={cn(
          "nav-shell fixed top-0 left-0 z-1001 w-full",
          instant ? "opacity-100" : "opacity-0",
          visible && show ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div className="wrap flex items-center justify-between gap-4 pt-[max(1.25rem,calc(env(safe-area-inset-top)+0.65rem))] sm:pt-[max(1.75rem,calc(env(safe-area-inset-top)+0.85rem))] pb-4">
          <a
            href="#hero"
            className="nav-link nav-interactive nav-brand inline-flex min-h-11 min-w-11 items-center py-2"
            aria-label="Sammit Poudyal  -  Home"
          >
            <Logo size={40} invertIcon={!isLight} showWordmark />
          </a>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link nav-interactive text-base font-medium uppercase tracking-[0.18em] lg:text-lg"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle
              className={cn(
                "nav-interactive nav-interactive-cta",
                isLight
                  ? "border-border-strong text-text hover:border-nav-fg-hover"
                  : "border-white text-white hover:border-nav-fg-hover"
              )}
            />
            <SocialLinks
              size={20}
              linkClassName="nav-link nav-interactive inline-flex"
              className={cn("nav-border ml-2 gap-4 border-l pl-6")}
              includeEmail={false}
            />
            <a
              href="#contact"
              className={cn(
                "nav-link nav-interactive nav-interactive-cta inline-flex min-h-11 items-center rounded-full border px-3.5 text-xs font-medium sm:px-4 sm:text-sm",
                isLight
                  ? "border-border-strong hover:border-nav-fg-hover hover:bg-text/10 hover:text-nav-fg-hover"
                  : "border-white hover:border-nav-fg-hover hover:bg-white/10 hover:text-nav-fg-hover"
              )}
            >
              Connect with me
            </a>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle
              className={cn(
                "nav-interactive nav-interactive-cta",
                isLight ? "border-border-strong text-text" : "border-white text-white"
              )}
            />
            <button
              className="nav-link nav-interactive inline-flex min-h-11 min-w-11 items-center justify-center"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              type="button"
            >
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-1000 flex flex-col items-center justify-center gap-8 bg-background"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35, ease: easeOut }}
                className="nav-interactive font-display text-2xl uppercase tracking-widest text-paper sm:text-3xl"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.08, duration: 0.35, ease: easeOut }}
              className="nav-interactive nav-interactive-cta mt-2 inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-medium text-paper hover:border-acid hover:text-acid"
            >
              Connect with me
            </motion.a>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, ease: easeOut }}
              className="mt-6 flex flex-col items-center gap-5"
            >
              <ThemeToggle />
              <SocialLinks
                size={28}
                includeEmail={false}
                linkClassName="nav-interactive inline-flex text-subtle hover:text-acid"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
