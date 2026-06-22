import { motion } from "framer-motion";
import SectionReveal from "../Components/SectionReveal";
import { slideInLeft, slideInRight, staggerContainer } from "../Components/animations";
import { services } from "../data/services";

const Services = () => {
  return (
    <section id="services">
      <SectionReveal>
        <div className="bg-surface text-on-surface mx-4 md:mx-10 rounded-b-3xl md:rounded-b-[50px]">
          <div className="main-container py-10 lg:py-14 px-6 md:px-12 lg:px-20">
            <h3 className="text-2xl md:text-3xl lg:text-4xl">What I Do</h3>
          </div>
        </div>
      </SectionReveal>

      <div className="mt-8 md:mt-12">
        {services.map((s, index) => (
          <motion.div
            key={s.num}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className={`${s.bg} text-white border-t border-white/10`}
          >
            <div className="main-container py-14 lg:py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
                <motion.div
                  variants={slideInLeft}
                  custom={index * 0.1}
                  className={`flex gap-5 lg:gap-10 border-l-4 ${s.accent} pl-6 lg:pl-10`}
                >
                  <span className="text-cyan-400 text-2xl lg:text-4xl tracking-wide font-heading shrink-0 pt-1 font-bold">
                    {s.num}
                  </span>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight text-white">
                    {s.title}
                  </h2>
                </motion.div>

                <motion.div variants={slideInRight} custom={index * 0.1} className="md:pl-4">
                  <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-[1.65rem] leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
