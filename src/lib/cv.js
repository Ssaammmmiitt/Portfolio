import { CV } from "../data.js";

export const CV_ERROR_MESSAGES = {
  notConfigured: "CV is not configured.",
  notFound: "CV file could not be found. It may have been moved or removed.",
  loadFailed: "Could not load the CV. Check your connection and try again.",
  downloadFailed: "Download failed. Please try again.",
  previewTimeout: "The CV preview is taking too long to load.",
};

export function isLocalCv(cv = CV) {
  return Boolean(cv?.url?.startsWith("/"));
}

/** Preview URL for the CV modal iframe (local PDF path or Google Drive embed). */
export function getCvPreviewUrl(cv = CV) {
  if (!cv?.url) return "";

  if (cv.previewUrl) return cv.previewUrl;

  if (isLocalCv(cv)) return cv.url;

  const fromQuery = cv.url.match(/[?&]id=([^&]+)/)?.[1];
  const fromPath = cv.url.match(/\/d\/([^/]+)/)?.[1];
  const fileId = fromQuery || fromPath;

  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return cv.url;
}

export function getCvFileName(cv = CV) {
  return cv?.fileName || cv?.url?.split("/").pop() || "cv.pdf";
}

/** Anchor props for downloading the CV (local files use the `download` attribute). */
export function getCvDownloadLinkProps(cv = CV) {
  if (!cv?.url) return null;

  if (isLocalCv(cv)) {
    return {
      href: cv.url,
      download: getCvFileName(cv),
    };
  }

  return {
    href: cv.url,
    target: "_blank",
    rel: "noopener noreferrer",
  };
}

/** Check whether the configured CV is reachable (HEAD for local files). */
export async function verifyCvAvailability(cv = CV) {
  if (!cv?.url) {
    return { ok: false, error: CV_ERROR_MESSAGES.notConfigured };
  }

  if (!isLocalCv(cv)) {
    return { ok: true };
  }

  try {
    const response = await fetch(cv.url, { method: "HEAD" });

    if (!response.ok) {
      return { ok: false, error: CV_ERROR_MESSAGES.notFound };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: CV_ERROR_MESSAGES.loadFailed };
  }
}

/** Trigger a CV download from button handlers (dock, modal toolbar). */
export async function triggerCvDownload(cv = CV) {
  const props = getCvDownloadLinkProps(cv);
  if (!props) {
    return { ok: false, error: CV_ERROR_MESSAGES.notConfigured };
  }

  if (isLocalCv(cv)) {
    const availability = await verifyCvAvailability(cv);
    if (!availability.ok) return availability;
  }

  try {
    const link = document.createElement("a");
    link.href = props.href;
    if (props.download) link.download = props.download;
    if (props.target) {
      link.target = props.target;
      link.rel = props.rel ?? "noopener noreferrer";
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
    return { ok: true };
  } catch {
    return { ok: false, error: CV_ERROR_MESSAGES.downloadFailed };
  }
}

export function hasCv(cv = CV) {
  return Boolean(cv?.url);
}
