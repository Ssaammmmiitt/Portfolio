import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "./Components/Navbar.jsx";
import NavDock from "./Components/NavDock.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import Hero from "./Components/Hero.jsx";
import Manifesto from "./Components/Manifesto.jsx";
import Marquee from "./Components/Marquee.jsx";
import Stack from "./Components/Stack.jsx";
import Stats from "./Components/Stats.jsx";
import Works from "./Components/Works.jsx";
import About from "./Components/About.jsx";
import Leadership from "./Components/Leadership.jsx";
import Contact from "./Components/Contact.jsx";
import Footer from "./Components/Footer.jsx";
import Preloader from "./Components/Preloader.jsx";
import CvViewerModal from "./Components/CvViewerModal.jsx";
import { useLenis } from "./hooks/useLenis.js";
import { useInPageNav } from "./hooks/useInPageNav.js";
import { useScrollNav } from "./hooks/useScrollNav.js";
import { useThemeScrollSync } from "./hooks/useThemeScrollSync.js";
import { gsap } from "./lib/gsap.js";
import { hasCv } from "./lib/cv.js";
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
  const [scrollUnlocked, setScrollUnlocked] = useState(returning);
  const [cvOpen, setCvOpen] = useState(false);
  const [cvCollapsed, setCvCollapsed] = useState(false);
  const progressRef = useRef(null);

  const unlockScroll = useCallback(() => {
    setScrollUnlocked(true);
  }, []);

  const openCv = useCallback(() => {
    setCvOpen(true);
    setCvCollapsed(false);
  }, []);

  const closeCv = useCallback(() => {
    setCvOpen(false);
    setCvCollapsed(false);
  }, []);

  const handleViewCv = useCallback(() => {
    if (cvOpen && cvCollapsed) {
      setCvCollapsed(false);
      return;
    }
    openCv();
  }, [cvOpen, cvCollapsed, openCv]);

  useLayoutEffect(() => {
    disableBrowserScrollRestore();
    if (returning && savedScroll > 0) {
      window.scrollTo(0, savedScroll);
    }
  }, [returning, savedScroll]);

  useLenis(preloaderDone, savedScroll, scrollUnlocked);
  useInPageNav(preloaderDone);
  const { showTopNav, showDock } = useScrollNav(preloaderDone);
  useThemeScrollSync();

  useEffect(() => {
    // Hide overflow until preloader finishes AND hero intro unlocks scroll.
    document.body.style.overflow = preloaderDone && scrollUnlocked ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [preloaderDone, scrollUnlocked]);

  useEffect(() => {
    if (!preloaderDone || returning || scrollUnlocked) return;
    // Safety unlock if hero intro callback is delayed/missed.
    const id = window.setTimeout(unlockScroll, 3200);
    return () => window.clearTimeout(id);
  }, [preloaderDone, returning, scrollUnlocked, unlockScroll]);

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
    <div className="relative w-full bg-background text-text">
      {!preloaderDone && <Preloader onDone={finishIntro} />}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 z-10002 h-px w-full origin-left scale-x-0 bg-linear-to-r from-acid via-paper to-primary"
      />
      <Navbar
        visible={preloaderDone}
        instant={returning}
        show={showTopNav}
        onViewCv={handleViewCv}
      />
      <NavDock visible={preloaderDone && showDock} />
      <ScrollToTop enabled={preloaderDone} />
      <main className="flex flex-col">
        <Hero animate={preloaderDone} instant={returning} onIntroReady={unlockScroll} />
        <Manifesto ready={preloaderDone} />
        <Marquee />
        <Works ready={preloaderDone} onViewCv={handleViewCv} />
        <Stack ready={preloaderDone} />
        {/* <Strategy ready={preloaderDone} /> */}
        <Stats ready={preloaderDone} />
        <Leadership ready={preloaderDone} />
        <About ready={preloaderDone} />
        <Contact ready={preloaderDone} />
      </main>
      <Footer ready={preloaderDone} />
      {hasCv() && (
        <CvViewerModal
          open={cvOpen}
          collapsed={cvCollapsed}
          onCollapsedChange={setCvCollapsed}
          onClose={closeCv}
        />
      )}
    </div>
  );
}
