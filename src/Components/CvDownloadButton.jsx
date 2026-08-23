import { FiDownload } from "react-icons/fi";
import { CV } from "../data.js";
import { cn } from "../lib/utils.js";

export default function CvDownloadButton({ className = "" }) {
  if (!CV.url) return null;

  const isLocal = CV.url.startsWith("/");

  return (
    <a
      href={CV.url}
      {...(isLocal ? { download: CV.fileName } : { target: "_blank", rel: "noopener noreferrer" })}
      aria-label={`Download ${CV.label}`}
      className={cn(
        "nav-interactive inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium",
        className || "border-border-strong bg-background/50 text-text hover:border-text/40"
      )}
    >
      <FiDownload size={18} aria-hidden="true" />
      <span className="hidden sm:inline">{CV.label}</span>
    </a>
  );
}
