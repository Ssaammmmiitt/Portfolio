const GradientButton = ({ text, link, className = "" }) => (
  <a
    href={link}
    className={`btn mb-4 md:mb-0 uppercase font-heading border-2 border-transparent text-center min-w-[180px] px-8 py-2 lg:py-3 rounded-full text-sm md:text-base transition-all duration-200 hover:scale-105 ${className}`}
  >
    {text}
  </a>
);

export default GradientButton;
