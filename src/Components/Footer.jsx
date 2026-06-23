import Logo from "./Logo";
import SectionReveal from "./SectionReveal";
import SocialLinks from "./SocialLinks";
import { site } from "../data/site";

const Footer = () => {
  return (
    <SectionReveal as="footer" className="border-t theme-border">
      <div className="main-container py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Logo size={36} />
          <span className="theme-text-muted text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
        </div>
        <SocialLinks size={20} />
      </div>
    </SectionReveal>
  );
};

export default Footer;
