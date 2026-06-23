import { motion } from "framer-motion";
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import SectionReveal from "../Components/SectionReveal";
import { scaleIn, staggerContainer } from "../Components/animations";
import { contactLinks, site } from "../data/site";

const contactIcons = {
  Email: FiMail,
  GitHub: FiGithub,
  LinkedIn: FiLinkedin,
};

const Contact = () => {
  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="main-container">
        <SectionReveal className="max-w-3xl">
          <h3 className="mb-4">Get In Touch</h3>
          <p className="theme-text-muted text-base lg:text-lg mb-12">
            Have a project in mind or want to collaborate? I&apos;d love to hear
            from you.
          </p>
        </SectionReveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mb-16"
        >
          {contactLinks.map((link, i) => {
            const Icon = contactIcons[link.label];
            const isExternal = link.label !== "Email";

            return (
              <motion.a
                key={link.label}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                variants={scaleIn}
                custom={i * 0.1}
                className="group theme-card border theme-border rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(28,181,224,0.1)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon size={24} className="text-cyan-400" />
                  <FiArrowUpRight
                    size={18}
                    className="theme-text-muted group-hover:text-cyan-400 transition-colors"
                  />
                </div>
                <span className="block text-sm theme-text-muted uppercase tracking-wider mb-1">
                  {link.label}
                </span>
                <span className="theme-text text-base break-all">{link.value}</span>
              </motion.a>
            );
          })}
        </motion.div>

        <SectionReveal delay={0.2} className="border-t theme-border pt-12 text-center">
          <h2 className="theme-text text-3xl md:text-5xl lg:text-6xl font-heading mb-6">
            Let&apos;s build something
            <br />
            <span className="text-stroke"> great together.</span>
          </h2>
          <motion.a
            href={`mailto:${site.email}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="btn inline-block uppercase font-heading border-2 border-transparent text-center px-10 sm:px-12 py-3 lg:py-4 rounded-full text-base sm:text-lg transition-transform duration-200"
          >
            Say Hello
          </motion.a>
        </SectionReveal>
      </div>
    </section>
  );
};

export default Contact;
