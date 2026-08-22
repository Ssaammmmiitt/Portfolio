import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { EMAIL, SOCIALS } from "../data.js";
import { cn } from "../lib/utils.js";

const icons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  email: FiMail,
};

const links = [
  ...SOCIALS.map(({ label, href }) => ({
    key: label,
    href,
    label: label.charAt(0).toUpperCase() + label.slice(1),
  })),
  { key: "email", href: `mailto:${EMAIL}`, label: "Email" },
];

const SocialLinks = ({ size = 20, className, linkClassName, includeEmail = true }) => {
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
            className={cn("text-subtle transition-colors duration-200 hover:text-acid", linkClassName)}
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
