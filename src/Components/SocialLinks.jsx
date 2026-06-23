import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { site } from "../data/site";
import { cn } from "../lib/utils";

const icons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  email: FiMail,
};

const links = [
  { key: "github", href: site.github, label: "GitHub" },
  { key: "linkedin", href: site.linkedin, label: "LinkedIn" },
  { key: "email", href: `mailto:${site.email}`, label: "Email" },
];

const SocialLinks = ({ size = 20, className, includeEmail = true }) => {
  const visibleLinks = includeEmail ? links : links.filter((l) => l.key !== "email");

  return (
    <div className={cn("flex items-center gap-5", className)}>
      {visibleLinks.map(({ key, href, label }) => {
        const Icon = icons[key];
        const isExternal = key !== "email";

        return (
          <a
            key={key}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="theme-icon-muted hover:text-cyan-400 transition-colors duration-200"
            aria-label={label}
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
