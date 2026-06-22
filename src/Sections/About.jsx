import { motion } from "framer-motion";
import SectionReveal from "../Components/SectionReveal";
import { fadeUp, staggerContainer } from "../Components/animations";

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24">
      <SectionReveal>
        <div className="mx-4 md:mx-10 bg-surface rounded-3xl md:rounded-[50px] overflow-hidden">
          <div className="main-container py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-20">
            <h3 className="mb-8 md:mb-10">About Me</h3>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              <motion.p
                variants={fadeUp}
                className="text-on-surface text-lg md:text-xl lg:text-2xl leading-relaxed font-medium"
              >
                I&apos;m a fullstack developer and AI/ML enthusiast who works across
                frontend, backend, and mobile development. I enjoy creating clean,
                responsive interfaces and turning ideas into smooth, user-friendly
                products.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="text-on-surface-muted text-base md:text-lg leading-relaxed"
              >
                <p className="mb-4">
                  I&apos;m always exploring new technologies, improving my development
                  workflow, and working on side projects to sharpen my skills. My goal
                  is to build applications that feel simple, fast, and intuitive for
                  everyone who uses them.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="border-l-2 border-cyan-500 pl-4">
                    <span className="block text-3xl font-heading text-on-surface">2+</span>
                    <span className="text-sm text-on-surface-muted uppercase tracking-wider">
                      Years Experience
                    </span>
                  </div>
                  <div className="border-l-2 border-cyan-500 pl-4">
                    <span className="block text-3xl font-heading text-on-surface">10+</span>
                    <span className="text-sm text-on-surface-muted uppercase tracking-wider">
                      Projects Built
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
};

export default About;
