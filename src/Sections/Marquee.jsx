import { useMemo } from "react";
import LogoLoop from "../Components/LogoLoop";
import SectionReveal from "../Components/SectionReveal";
import { useTheme } from "../context/ThemeProvider";
import { getTechStackLogos } from "../data/techStack";

const Marquee = () => {
  const { theme } = useTheme();
  const logos = useMemo(() => getTechStackLogos(theme), [theme]);

  const logoLoopProps = {
  logos,
  logoHeight: 40,
  gap: 56,
  fadeOut: true,
  fadeOutColor: "var(--color-bg-soft)",
  pauseOnHover: true,
  scaleOnHover: true,
  ariaLabel: "Technologies I work with",
};

  return (
    <section className="theme-bg-soft py-16 md:py-20 overflow-hidden">
      <SectionReveal className="main-container mb-10">
        <h3 className="mb-3">Tech Stack</h3>
        <p className="theme-text-muted text-base lg:text-lg">
          Technologies I work with regularly.
        </p>
      </SectionReveal>

      <div className="space-y-6 md:space-y-8">
        <div className="px-5 md:px-10 lg:px-20 ml-5">
        <LogoLoop {...logoLoopProps} speed={90} direction="left" />
        </div>
        <LogoLoop {...logoLoopProps} speed={70} direction="right" />
      </div>
    </section>
  );
};

export default Marquee;
