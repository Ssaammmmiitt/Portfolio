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
          fill="#09090b"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
        />

        <path
          d="M14 16c0-3.5 2.8-6 6.5-6 2.2 0 4 1 4 2.8 0 1.4-1 2.2-2.6 2.8-2.2.8-3.4 1.6-3.4 3.6 0 2.4 2.2 4 5.5 4 2.4 0 4.6-.9 6-2.2"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <path
          d="M27 10v28M27 10c5.5 0 8 3.2 8 7s-2.5 7-8 7"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <circle cx="38" cy="12" r="2" fill="#1CB5E0" />
      </svg>

      {showWordmark && (
        <span className="logo-wordmark hidden md:inline font-heading text-lg lg:text-xl tracking-wide leading-none">
          Sammit<span className="text-cyan-400">.</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
