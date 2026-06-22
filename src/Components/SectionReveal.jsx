import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "./animations";
import { cn } from "../lib/utils";

const SectionReveal = ({ children, className, delay = 0, as = "div", ...props }) => {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      custom={delay}
      variants={fadeUp}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default SectionReveal;
