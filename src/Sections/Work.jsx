import GradientButton from "../Components/GradientButton";
import HoverExpand from "../Components/HoverExpand";
import SectionReveal from "../Components/SectionReveal";
import { projects } from "../data/projects";
import { site } from "../data/site";

const Work = () => {
  return (
    <section id="work" className="bg-surface text-on-surface py-24 lg:py-36">
      <div className="main-container">
        <SectionReveal className="pb-12 lg:pb-20 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div className="max-w-2xl">
            <h3 className="mb-4 text-2xl md:text-3xl lg:text-4xl">Selected Works</h3>
            <p className="text-on-surface-muted text-xl lg:text-2xl leading-relaxed">
              A showcase of projects and collaborations I&apos;ve worked on.
              Hover or tap to explore.
            </p>
          </div>
          <GradientButton text="View All" className="btn-light" link={site.github} />
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <HoverExpand projects={projects} />
        </SectionReveal>
      </div>
    </section>
  );
};

export default Work;
