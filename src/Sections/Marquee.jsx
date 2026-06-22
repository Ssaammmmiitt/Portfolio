import SectionReveal from "../Components/SectionReveal";
import { techStack } from "../data/techStack";

const MarqueeRow = ({ reverse = false }) => (
  <div className="overflow-hidden py-3">
    <div
      className={`flex gap-4 sm:gap-6 whitespace-nowrap ${
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      }`}
    >
      {[...techStack, ...techStack].map((tech, i) => (
        <span
          key={i}
          className="inline-block text-base sm:text-lg md:text-xl font-medium text-white/60 border border-white/15 px-5 sm:px-6 py-2 rounded-full hover:text-cyan-400 hover:border-cyan-500/30 transition-colors duration-200 cursor-default"
        >
          {tech}
        </span>
      ))}
    </div>
  </div>
);

const Marquee = () => {
  return (
    <section className="bg-black py-16 md:py-20 overflow-hidden">
      <SectionReveal className="main-container mb-10">
        <h3 className="mb-3">Tech Stack</h3>
        <p className="text-white/70 text-base lg:text-lg">
          Technologies I work with regularly.
        </p>
      </SectionReveal>
      <MarqueeRow />
      <MarqueeRow reverse />
    </section>
  );
};

export default Marquee;
