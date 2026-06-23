import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { navLinks } from "../data/site";
import { useTheme } from "../context/ThemeProvider";
import { easeOut } from "./animations";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const barClass = theme === "dark" ? "bg-white" : "bg-[var(--color-text)]";

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "theme-nav shadow-lg backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="main-container py-4 sm:py-5 flex justify-between items-center gap-4">
          <a href="#" className="hover:opacity-85 transition-opacity" aria-label="Sammit Poudyal — Home">
            <Logo size={40} showWordmark />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                className="theme-text text-base lg:text-lg uppercase tracking-[0.18em] font-medium hover:text-cyan-400 transition-colors duration-200"
              >
                {link.label}
              </motion.a>
            ))}
            <ThemeToggle />
            <SocialLinks size={20} className="ml-2 border-l theme-border pl-6 gap-4" includeEmail={false} />
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="flex items-center justify-center cursor-pointer z-50 relative theme-text"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              type="button"
            >
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 theme-bg flex flex-col justify-center items-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="text-2xl sm:text-3xl font-heading uppercase tracking-widest theme-text hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-6 flex flex-col items-center gap-5"
            >
              <ThemeToggle />
              <SocialLinks size={28} includeEmail={false} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
