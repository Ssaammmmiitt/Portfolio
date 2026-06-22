import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { useIsDesktop } from "../hooks/useMediaQuery";
import { cn } from "../lib/utils";

const HoverExpand = ({ projects, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useIsDesktop();

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-x-auto pb-4 -mx-4 px-4 md:overflow-visible md:mx-0 md:px-0 scrollbar-hide">
        <div className="flex w-max md:w-full items-center justify-start md:justify-center gap-2 md:gap-2 min-h-[16rem] sm:min-h-[20rem] md:min-h-[30rem]">
          {projects.map((project, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={project.code}
                className="relative shrink-0 cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl"
                initial={false}
                animate={{
                  width: isActive ? (isDesktop ? "30rem" : "16rem") : isDesktop ? "6rem" : "3.5rem",
                  height: isDesktop ? "30rem" : "16rem",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => isDesktop && setActiveIndex(index)}
              >
                <img
                  src={project.image}
                  className="size-full object-cover"
                  alt={project.title}
                  loading="lazy"
                />

                <AnimatePresence>
                  {isActive && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute inset-0 flex flex-col items-start justify-end p-4 md:p-6"
                      >
                        <p className="text-sm text-cyan-400 font-medium mb-1.5">{project.code}</p>
                        <h4 className="text-base md:text-xl lg:text-2xl font-heading text-white leading-tight mb-2">
                          {project.title}
                        </h4>
                        {isDesktop && (
                          <p className="text-sm text-white/60 line-clamp-2 mb-4">{project.desc}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                          {(isDesktop ? project.tags : project.tags.slice(0, 2)).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs uppercase tracking-wider text-white/70 bg-white/10 px-2.5 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-cyan-400 transition-colors"
                          >
                            <FiGithub size={18} />
                            {isDesktop && <span>Source</span>}
                          </a>
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-cyan-400 transition-colors"
                            >
                              <FiExternalLink size={18} />
                              {isDesktop && <span>Live</span>}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HoverExpand;
