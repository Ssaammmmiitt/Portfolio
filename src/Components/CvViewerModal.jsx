import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiDownload,
  FiMaximize2,
  FiMinimize2,
  FiX,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import { CV, NAME } from "../data.js";
import {
  CV_ERROR_MESSAGES,
  getCvDownloadLinkProps,
  getCvPreviewUrl,
  triggerCvDownload,
  verifyCvAvailability,
} from "../lib/cv.js";
import { cn } from "../lib/utils.js";

const easeOut = [0.22, 1, 0.36, 1];
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.15;
const IFRAME_HEIGHT = 1200;
const PREVIEW_LOAD_TIMEOUT_MS = 12000;

function ToolbarButton({ label, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-border-strong text-soft transition-colors hover:border-acid hover:text-acid",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function CvViewerModal({
  open,
  onClose,
  collapsed = false,
  onCollapsedChange,
}) {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [previewState, setPreviewState] = useState("idle");
  const [previewError, setPreviewError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const panelRef = useRef(null);
  const previewUrl = getCvPreviewUrl();
  const downloadLinkProps = getCvDownloadLinkProps();

  const resetPreviewState = useCallback(() => {
    setPreviewState("idle");
    setPreviewError("");
    setDownloadError("");
  }, []);

  const loadPreview = useCallback(async () => {
    if (!previewUrl) {
      setPreviewState("error");
      setPreviewError(CV_ERROR_MESSAGES.notConfigured);
      return;
    }

    setPreviewState("checking");
    setPreviewError("");

    try {
      const availability = await verifyCvAvailability();
      if (!availability.ok) {
        setPreviewState("error");
        setPreviewError(availability.error);
        return;
      }

      setPreviewState("loading");
    } catch {
      setPreviewState("error");
      setPreviewError(CV_ERROR_MESSAGES.loadFailed);
    }
  }, [previewUrl]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      onCollapsedChange?.(false);
      setZoom(1);
      resetPreviewState();
      return;
    }

    if (!collapsed) {
      loadPreview();
    }
  }, [open, collapsed, onCollapsedChange, resetPreviewState, loadPreview]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setZoom((z) => Math.min(ZOOM_MAX, Number((z + ZOOM_STEP).toFixed(2))));
      }
      if (event.key === "-") {
        event.preventDefault();
        setZoom((z) => Math.max(ZOOM_MIN, Number((z - ZOOM_STEP).toFixed(2))));
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || collapsed || !panelRef.current) return;
    panelRef.current.focus();
  }, [open, collapsed]);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, Number((z + ZOOM_STEP).toFixed(2))));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, Number((z - ZOOM_STEP).toFixed(2))));
  }, []);

  const resetZoom = useCallback(() => setZoom(1), []);

  const setCollapsed = useCallback(
    (value) => {
      onCollapsedChange?.(value);
    },
    [onCollapsedChange]
  );

  const expand = useCallback(() => setCollapsed(false), [setCollapsed]);

  const handleDownload = useCallback(async () => {
    setDownloadError("");

    try {
      const result = await triggerCvDownload();
      if (!result.ok) {
        setDownloadError(result.error);
      }
    } catch {
      setDownloadError(CV_ERROR_MESSAGES.downloadFailed);
    }
  }, []);

  const handlePreviewError = useCallback(() => {
    setPreviewState("error");
    setPreviewError(CV_ERROR_MESSAGES.loadFailed);
  }, []);

  useEffect(() => {
    if (!open || collapsed || previewState !== "loading") return;

    const timeoutId = window.setTimeout(() => {
      setPreviewState("error");
      setPreviewError(CV_ERROR_MESSAGES.previewTimeout);
    }, PREVIEW_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [open, collapsed, previewState, previewUrl]);

  const handlePreviewLoad = useCallback(() => {
    setPreviewState("ready");
    setPreviewError("");
  }, []);

  if (!mounted || !previewUrl) return null;

  const showIframe = previewState === "loading" || previewState === "ready";
  const showPreviewError = previewState === "error";
  const showPreviewLoading = previewState === "checking";

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {!collapsed && (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-label="Close CV viewer backdrop"
              className="fixed inset-0 z-[10004] bg-background/80 backdrop-blur-sm"
              onClick={onClose}
            />
          )}

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${NAME} CV`}
            tabIndex={-1}
            initial={{ opacity: 0, y: collapsed ? 40 : 24, scale: collapsed ? 0.96 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: collapsed ? 40 : 24, scale: 0.98 }}
            transition={{ duration: 0.32, ease: easeOut }}
            className={cn(
              "fixed z-[10005] flex flex-col overflow-hidden outline-hidden",
              collapsed
                ? "cv-viewer-pill right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(7.25rem,calc(env(safe-area-inset-bottom)+6.25rem))] left-auto w-[min(19rem,calc(100vw-1.5rem))] max-h-[3.75rem] rounded-full sm:right-4 sm:w-[min(21rem,72vw)] lg:bottom-[max(1.35rem,env(safe-area-inset-bottom))] lg:right-[max(1.25rem,env(safe-area-inset-right))] lg:w-[min(19rem,28vw)] xl:right-8"
                : "inset-x-3 top-[max(1rem,env(safe-area-inset-top))] bottom-[max(1rem,env(safe-area-inset-bottom))] rounded-2xl border border-border bg-background shadow-[0_24px_80px_rgb(0_0_0/0.45)] sm:inset-x-5 sm:top-6 sm:bottom-6 md:inset-x-8 md:top-10 md:bottom-10 lg:inset-x-auto lg:top-12 lg:bottom-12 lg:left-1/2 lg:w-[min(92vw,56rem)] lg:-translate-x-1/2 xl:w-[min(88vw,64rem)]"
            )}
          >
            <div
              className={cn(
                "flex shrink-0 items-center gap-2 px-3 sm:px-4",
                collapsed ? "py-2.5" : "border-b border-border bg-muted/30 py-2 sm:py-3"
              )}
            >
              {collapsed ? (
                <button
                  type="button"
                  onClick={expand}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="cv-viewer-pill-kicker truncate font-condensed text-[0.68rem] uppercase tracking-[0.22em] sm:text-xs sm:tracking-[0.28em]">
                    Resume
                  </p>
                  <p className="cv-viewer-pill-title truncate text-sm font-semibold sm:text-[0.95rem]">
                    {CV.label}
                  </p>
                </button>
              ) : (
                <div className="min-w-0 flex-1">
                  <p className="truncate font-condensed text-[0.65rem] uppercase tracking-[0.22em] text-faint sm:text-xs sm:tracking-[0.28em]">
                    Resume
                  </p>
                  <p className="truncate text-sm font-medium text-paper sm:text-base">
                    {NAME} · {CV.label}
                  </p>
                </div>
              )}

              {!collapsed && (
                <div className="hidden items-center gap-1.5 sm:flex">
                  <ToolbarButton label="Zoom out" onClick={zoomOut}>
                    <FiZoomOut size={16} />
                  </ToolbarButton>
                  <button
                    type="button"
                    onClick={resetZoom}
                    className="min-w-11 rounded-full px-2 text-xs tabular-nums text-subtle transition-colors hover:text-paper"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <ToolbarButton label="Zoom in" onClick={zoomIn}>
                    <FiZoomIn size={16} />
                  </ToolbarButton>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                {!collapsed && (
                  <>
                    <ToolbarButton
                      label="Download CV"
                      className="hidden sm:inline-flex"
                      onClick={handleDownload}
                    >
                      <FiDownload size={16} />
                    </ToolbarButton>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex min-h-9 items-center rounded-full border border-border-strong px-3 text-xs font-medium text-soft transition-colors hover:border-acid hover:text-acid sm:hidden"
                    >
                      PDF
                    </button>
                  </>
                )}

                <ToolbarButton
                  label={collapsed ? "Expand CV viewer" : "Minimize CV viewer"}
                  onClick={() => setCollapsed(!collapsed)}
                  className={collapsed ? "cv-viewer-pill-btn" : undefined}
                >
                  {collapsed ? <FiMaximize2 size={16} /> : <FiMinimize2 size={16} />}
                </ToolbarButton>

                <ToolbarButton
                  label="Close CV viewer"
                  onClick={onClose}
                  className={collapsed ? "cv-viewer-pill-btn" : undefined}
                >
                  <FiX size={16} />
                </ToolbarButton>
              </div>
            </div>

            {!collapsed && (
              <div className="cv-viewer-scroll min-h-0 flex-1 overflow-auto bg-muted/20">
                {showPreviewLoading ? (
                  <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="size-8 animate-pulse rounded-full bg-border" aria-hidden="true" />
                    <p className="text-sm text-subtle">Loading CV preview…</p>
                  </div>
                ) : null}

                {showPreviewError ? (
                  <div
                    role="alert"
                    className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-4 p-6 text-center"
                  >
                    <p className="max-w-md text-sm text-subtle">{previewError}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={loadPreview}
                        className="inline-flex min-h-9 items-center rounded-full border border-border-strong px-4 text-sm font-medium text-soft transition-colors hover:border-acid hover:text-acid"
                      >
                        Try again
                      </button>
                      {downloadLinkProps ? (
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="inline-flex min-h-9 items-center rounded-full border border-border-strong px-4 text-sm font-medium text-soft transition-colors hover:border-acid hover:text-acid"
                        >
                          Download PDF
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {showIframe ? (
                  <div
                    className="mx-auto origin-top p-3 transition-transform duration-200 sm:p-4"
                    style={{
                      transform: `scale(${zoom})`,
                      width: zoom < 1 ? `${100 / zoom}%` : "100%",
                    }}
                  >
                    <iframe
                      src={previewUrl}
                      title={`${NAME} CV preview`}
                      className="w-full rounded-lg border border-border bg-background"
                      style={{ height: IFRAME_HEIGHT }}
                      loading="lazy"
                      onLoad={handlePreviewLoad}
                      onError={handlePreviewError}
                    />
                  </div>
                ) : null}

                {downloadError ? (
                  <p role="alert" className="px-4 pb-4 text-center text-xs text-red-400">
                    {downloadError}
                  </p>
                ) : null}
              </div>
            )}

            {!collapsed && (
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border px-3 py-2 text-xs text-faint sm:px-4 sm:py-2.5">
                <p className="hidden sm:block">Scroll to read · +/- to zoom · Esc to close</p>
                <p className="sm:hidden">Pinch-scroll · Esc closes</p>
                <div className="flex items-center gap-1.5 sm:hidden">
                  <ToolbarButton label="Zoom out" onClick={zoomOut}>
                    <FiZoomOut size={15} />
                  </ToolbarButton>
                  <span className="min-w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
                  <ToolbarButton label="Zoom in" onClick={zoomIn}>
                    <FiZoomIn size={15} />
                  </ToolbarButton>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
