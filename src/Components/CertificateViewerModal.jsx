import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { certificatePreviewSrc } from "../lib/certificates.js";

const easeOut = [0.22, 1, 0.36, 1];

export default function CertificateViewerModal({ certificate, onClose }) {
  const [mounted, setMounted] = useState(false);
  const open = Boolean(certificate);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const previewSrc = certificate ? certificatePreviewSrc(certificate.file) : "";

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="certificate-viewer"
          className="fixed inset-0 z-[10006] flex items-end justify-center p-0 sm:items-center sm:p-5 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close certificate preview"
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={certificate?.title || "Certificate preview"}
            className="certificate-viewer relative z-10 flex h-[min(94dvh,56rem)] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-2xl sm:rounded-2xl"
            initial={{ y: 28, opacity: 0.85, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <header className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-3 sm:items-center sm:px-5 sm:py-3.5">
              <div className="min-w-0 flex-1">
                <p className="meta-label tracking-[0.2em] text-acid">{certificate.issuer}</p>
                <h2 className="mt-1 truncate font-sans text-base text-paper sm:text-lg">
                  {certificate.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-soft transition-colors hover:border-acid hover:text-acid"
              >
                <FiX size={18} />
              </button>
            </header>

            <div className="relative min-h-0 flex-1 bg-muted/30">
              <iframe
                title={`${certificate.title} certificate`}
                src={previewSrc}
                className="absolute inset-0 h-full w-full border-0 bg-background"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
