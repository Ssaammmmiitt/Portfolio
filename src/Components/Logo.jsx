import { useId } from "react";
import { cn } from "../lib/utils";

const Logo = ({ size = 44, className, showWordmark = false }) => {
  const uid = useId().replace(/:/g, "");
  const gradientId = `logo-gradient-${uid}`;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="4" y1="24" x2="44" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1CB5E0" />
            <stop offset="1" stopColor="#000851" />
          </linearGradient>
        </defs>

        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="13"
          fill="var(--logo-bg)"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
        />

        <text x="10" y="33" fill="#1CB5E0" fontFamily="Bungee, sans-serif" fontSize="23">
          S
        </text>
        <text x="25" y="33" fill="var(--logo-text)" fontFamily="Bungee, sans-serif" fontSize="23">
          P
        </text>
      </svg>

      {showWordmark && (
        <span className="hidden md:inline font-heading text-lg lg:text-xl tracking-wide leading-none theme-text">
          Sammit<span className="text-cyan-400">.</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
