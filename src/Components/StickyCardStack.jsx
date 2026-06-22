import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { cn } from "../lib/utils";

gsap.registerPlugin(ScrollTrigger);

const StickyCardStack = ({ cards, className, containerClassName }) => {
  const container = useRef(null);
  const stickyRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(
    () => {
      const cardElements = cardRefs.current.filter(Boolean);
      const totalCards = cardElements.length;

      if (!stickyRef.current || totalCards < 1) return;

      gsap.set(cardElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        gsap.set(cardElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stickyRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardElements[i];
        const nextCard = cardElements[i + 1];
        const position = i;

        scrollTimeline.to(
          currentCard,
          { scale: 0.7, rotation: 5, duration: 1, ease: "none" },
          position
        );

        scrollTimeline.to(
          nextCard,
          { y: "0%", duration: 1, ease: "none" },
          position
        );
      }

      const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
      };
    },
    { scope: container, dependencies: [cards.length] }
  );

  return (
    <div className={cn("relative w-full", className)} ref={container}>
      <div
        ref={stickyRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden px-4 py-8 lg:px-8"
      >
        <div
          className={cn(
            "relative h-[75vh] w-full max-w-sm overflow-hidden rounded-3xl sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl",
            containerClassName
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute h-full w-full overflow-hidden rounded-3xl shadow-2xl"
            >
              <img
                src={card.image}
                alt={card.alt || card.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-8">
                <p className="text-sm text-cyan-400 font-medium mb-2">{card.code}</p>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-heading text-white mb-2">
                  {card.title}
                </h4>
                <p className="text-sm sm:text-base text-white/70 line-clamp-2 mb-4">
                  {card.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {card.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase tracking-wider text-white/80 bg-white/10 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={card.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/80 hover:text-cyan-400 transition-colors"
                  >
                    <FiGithub size={18} />
                    <span>Source</span>
                  </a>
                  {card.live && (
                    <a
                      href={card.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/80 hover:text-cyan-400 transition-colors"
                    >
                      <FiExternalLink size={18} />
                      <span>Live</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyCardStack;
