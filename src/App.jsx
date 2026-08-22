import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "./Components/Navbar.jsx";
import NavDock from "./Components/NavDock.jsx";
import Hero from "./Components/Hero.jsx";
import Manifesto from "./Components/Manifesto.jsx";
import Marquee from "./Components/Marquee.jsx";
import Strategy from "./Components/Strategy.jsx";
import Stack from "./Components/Stack.jsx";
import Stats from "./Components/Stats.jsx";
import Works from "./Components/Works.jsx";
import About from "./Components/About.jsx";
import Contact from "./Components/Contact.jsx";
import Footer from "./Components/Footer.jsx";
import Preloader from "./Components/Preloader.jsx";
import Cursor from "./Components/Cursor.jsx";
import { useLenis } from "./hooks/useLenis.js";
import { useInPageNav } from "./hooks/useInPageNav.js";
import { useScrollNav } from "./hooks/useScrollNav.js";
import { useThemeScrollSync } from "./hooks/useThemeScrollSync.js";
import { gsap } from "./lib/gsap.js";
import {
  disableBrowserScrollRestore,
  hasVisited,
  markVisited,
  readScroll,
} from "./lib/visitCache.js";

export default function App() {
  const [{ returning, scroll: savedScroll }] = useState(() => {
    const returningVisit = hasVisited();
    return {
      returning: returningVisit,
      scroll: returningVisit ? readScroll() : 0,
    };
  });
  const [preloaderDone, setPreloaderDone] = useState(returning);
  const [spaceScrollEnabled, setSpaceScrollEnabled] = useState(returning);
  const progressRef = useRef(null);

  const enableSpaceScroll = useCallback(() => {
    setSpaceScrollEnabled(true);
  }, []);

  useLayoutEffect(() => {
    disableBrowserScrollRestore();
    if (returning && savedScroll > 0) {
      window.scrollTo(0, savedScroll);
    }
  }, [returning, savedScroll]);

  useLenis(preloaderDone, savedScroll, spaceScrollEnabled);
  useInPageNav(preloaderDone);
  const { showTopNav, showDock } = useScrollNav(preloaderDone);
  useThemeScrollSync();

  useEffect(() => {
    document.body.style.overflow = preloaderDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [preloaderDone]);

  useEffect(() => {
    if (!preloaderDone || returning) return;
    const id = window.setTimeout(enableSpaceScroll, 2000);
    return () => window.clearTimeout(id);
  }, [preloaderDone, returning, enableSpaceScroll]);

  useEffect(() => {
    if (!preloaderDone || !progressRef.current) return;
    const tween = gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.3,
      },
    });
    return () => tween.kill();
  }, [preloaderDone]);

  const finishIntro = () => {
    markVisited();
    setPreloaderDone(true);
  };

  return (
    <div className="relative w-full overflow-x-clip bg-background text-text">
      {!preloaderDone && <Preloader onDone={finishIntro} />}
      <Cursor />
      <div
        ref={progressRef}
        className="fixed top-0 left-0 z-10002 h-px w-full origin-left scale-x-0 bg-linear-to-r from-acid via-paper to-primary"
      />
      <Navbar visible={preloaderDone} instant={returning} show={showTopNav} />
      <NavDock visible={preloaderDone && showDock} />
      <main>
        <Hero animate={preloaderDone} instant={returning} onIntroReady={enableSpaceScroll} />
        <Manifesto ready={preloaderDone} />
        <Marquee />
        <Strategy ready={preloaderDone} />
        <Stack ready={preloaderDone} />
        <Stats ready={preloaderDone} />
        <Works ready={preloaderDone} />
        <About ready={preloaderDone} />
        <Contact ready={preloaderDone} />
      </main>
      <Footer ready={preloaderDone} />
    </div>
  );
}
