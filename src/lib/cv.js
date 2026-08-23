import { CV } from "../data.js";

/** Google Drive download URL → embeddable preview URL for iframe viewing. */
export function getCvPreviewUrl(cv = CV) {
  if (!cv?.url) return "";

  if (cv.previewUrl) return cv.previewUrl;

  if (cv.url.startsWith("/")) return cv.url;

  const fromQuery = cv.url.match(/[?&]id=([^&]+)/)?.[1];
  const fromPath = cv.url.match(/\/d\/([^/]+)/)?.[1];
  const fileId = fromQuery || fromPath;

  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return cv.url;
}

export function hasCv() {
  return Boolean(CV.url);
}
