import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import GradientButton from "../Components/GradientButton";
import SocialLinks from "../Components/SocialLinks";
import { easeOut, fadeUp, staggerContainer } from "../Components/animations";
import { site } from "../data/site";

const Hero = () => {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="main-container min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center items-start pt-28 pb-16 lg:py-12 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl lg:max-w-4xl"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-cyan-400 text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-semibold"
          >
            Hello, I&apos;m
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={0.1}
            className="hero-name text-4xl sm:text-5xl md:text-6xl lg:text-[5.5vw] uppercase font-heading font-bold leading-tight mb-4"
          >
            {site.name}
          </motion.h1>

          <motion.h2
            variants={fadeUp}
            custom={0.2}
            className="theme-text text-4xl sm:text-5xl md:text-6xl lg:text-[6.5vw] font-heading font-bold leading-none tracking-tight"
          >
            {site.title}{" "}
            <span className="text-stroke">{site.titleAccent}</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={0.25}
            className="text-xs sm:text-sm text-cyan-400/80 uppercase tracking-[0.2em] mt-3 mb-8 font-medium"
          >
            {site.subtitle}
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={0.3}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <GradientButton text="Let's Connect" link={`mailto:${site.email}`} />
            <GradientButton text="View Work" link="#work" className="btn-light-dark" />
          </motion.div>

          <motion.div variants={fadeUp} custom={0.4} className="mt-8 sm:mt-10">
            <SocialLinks size={22} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 40 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: easeOut }}
        className="absolute -z-10 top-32 sm:top-28 lg:top-20 right-[-20%] sm:right-[-10%] md:right-[-5%] lg:right-0 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] pointer-events-none"
      >
        <Spline scene="https://prod.spline.design/rrwZ-JfRgHA8TcXd/scene.splinecode" />
      </motion.div>
    </section>
  );
};

export default Hero;
