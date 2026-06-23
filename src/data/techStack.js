export const techStack = [
  "React",
  "Next.js",
  "React Native",
  "JavaScript",
  "TypeScript",
  "Python",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "Firebase",
  "Git",
  "Figma",
];

const simpleIcon = (slug, color) =>
  `https://cdn.simpleicons.org/${slug}/${color.replace("#", "")}`;

export const getTechStackLogos = (theme = "dark") => {
  const mono = theme === "dark" ? "ffffff" : "000000";

  return [
  {
    src: simpleIcon("react", "61DAFB"),
    alt: "React",
    title: "React",
    href: "https://react.dev/",
  },
  {
    src: simpleIcon("nextdotjs", mono),
    alt: "Next.js",
    title: "Next.js",
    href: "https://nextjs.org/",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/reactnative/reactnative-original.svg",
    alt: "React Native",
    title: "React Native",
    href: "https://reactnative.dev/",
  },
  {
    src: simpleIcon("javascript", "F7DF1E"),
    alt: "JavaScript",
    title: "JavaScript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    src: simpleIcon("typescript", "3178C6"),
    alt: "TypeScript",
    title: "TypeScript",
    href: "https://www.typescriptlang.org/",
  },
  {
    src: simpleIcon("python", "3776AB"),
    alt: "Python",
    title: "Python",
    href: "https://www.python.org/",
  },
  {
    src: simpleIcon("tailwindcss", "06B6D4"),
    alt: "Tailwind CSS",
    title: "Tailwind CSS",
    href: "https://tailwindcss.com/",
  },
  {
    src: simpleIcon("nodedotjs", "339933"),
    alt: "Node.js",
    title: "Node.js",
    href: "https://nodejs.org/",
  },
  {
    src: simpleIcon("express", mono),
    alt: "Express",
    title: "Express",
    href: "https://expressjs.com/",
  },
  {
    src: simpleIcon("firebase", "FFCA28"),
    alt: "Firebase",
    title: "Firebase",
    href: "https://firebase.google.com/",
  },
  {
    src: simpleIcon("git", "F05032"),
    alt: "Git",
    title: "Git",
    href: "https://git-scm.com/",
  },
  {
    src: simpleIcon("figma", "F24E1E"),
    alt: "Figma",
    title: "Figma",
    href: "https://www.figma.com/",
  },
];
};
