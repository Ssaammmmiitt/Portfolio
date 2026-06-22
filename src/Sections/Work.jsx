import GradientButton from "../Components/GradientButton";
import HoverExpand from "../Components/HoverExpand";
import SectionReveal from "../Components/SectionReveal";
import { projects } from "../data/projects";
import { site } from "../data/site";

const Work = () => {
  return (
    <section id="work" className="bg-surface text-on-surface py-20 lg:py-28">
      <div className="main-container">
        <SectionReveal className="pb-10 lg:pb-14 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div className="max-w-xl">
            <h3 className="mb-3">Selected Works</h3>
            <p className="text-on-surface-muted text-lg lg:text-xl">
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
