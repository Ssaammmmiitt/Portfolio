import { FiDownload } from "react-icons/fi";
import { useState } from "react";
import { CV } from "../data.js";
import { getCvDownloadLinkProps, isLocalCv, triggerCvDownload } from "../lib/cv.js";
import { cn } from "../lib/utils.js";

export default function CvDownloadButton({ className = "", label }) {
  const [error, setError] = useState("");
  const linkProps = getCvDownloadLinkProps();
  if (!linkProps) return null;

  const text = label ?? CV.label;
  const isLocal = isLocalCv();
  const buttonClass = cn(
    "nav-interactive inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium",
    className || "border-border-strong bg-background/50 text-text hover:border-text/40"
  );

  const handleDownload = async () => {
    setError("");

    try {
      const result = await triggerCvDownload();
      if (!result.ok) {
        setError(result.error);
      }
    } catch {
      setError("Download failed. Please try again.");
    }
  };

  return (
    <span className="inline-flex flex-col items-stretch">
      {isLocal ? (
        <button
          type="button"
          onClick={handleDownload}
          aria-label={`Download ${CV.label}`}
          aria-describedby={error ? "cv-download-error" : undefined}
          className={buttonClass}
        >
          <FiDownload size={18} aria-hidden="true" />
          <span className="hidden sm:inline">{text}</span>
        </button>
      ) : (
        <a
          {...linkProps}
          aria-label={`Download ${CV.label}`}
          className={buttonClass}
        >
          <FiDownload size={18} aria-hidden="true" />
          <span className="hidden sm:inline">{text}</span>
        </a>
      )}
      {error ? (
        <span id="cv-download-error" role="alert" className="mt-1 max-w-48 text-xs text-red-400">
          {error}
        </span>
      ) : null}
    </span>
  );
}
