import GradientButton from "../Components/GradientButton";
import SectionReveal from "../Components/SectionReveal";
import StickyCardStack from "../Components/StickyCardStack";
import { projects } from "../data/projects";
import { site } from "../data/site";

const projectCards = projects.map((project) => ({
  id: project.code,
  image: project.image,
  alt: project.title,
  title: project.title,
  desc: project.desc,
  tags: project.tags,
  github: project.github,
  live: project.live,
  code: project.code,
}));

const Work = () => {
  return (
    <section id="work" className="bg-surface text-on-surface">
      <div className="main-container py-24 lg:py-32">
        <SectionReveal className="pb-12 lg:pb-16 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div className="max-w-2xl">
            <h3 className="mb-4 text-2xl md:text-3xl lg:text-4xl">Selected Works</h3>
            <p className="text-on-surface-muted text-xl lg:text-2xl leading-relaxed">
              Scroll through projects — each card scales and rotates as the next
              one stacks into view.
            </p>
          </div>
          <GradientButton text="View All" className="btn-light" link={site.github} />
        </SectionReveal>
      </div>

      <StickyCardStack cards={projectCards} />
    </section>
  );
};

export default Work;
