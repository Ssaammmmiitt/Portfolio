import { FiFileText } from "react-icons/fi";
import { CV } from "../data.js";
import { hasCv } from "../lib/cv.js";
import { cn } from "../lib/utils.js";

export default function CvViewButton({ className = "", onClick, onOpen }) {
  if (!hasCv()) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        onOpen?.();
      }}
      aria-label={`View ${CV.label}`}
      className={cn(
        "nav-interactive inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium",
        className || "border-border-strong bg-background/50 text-text hover:border-text/40"
      )}
    >
      <FiFileText size={18} aria-hidden="true" />
      <span className="hidden sm:inline">View {CV.label}</span>
    </button>
  );
}
