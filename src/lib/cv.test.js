import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CV_ERROR_MESSAGES,
  getCvDownloadLinkProps,
  getCvFileName,
  getCvPreviewUrl,
  hasCv,
  isLocalCv,
  triggerCvDownload,
  verifyCvAvailability,
} from "./cv.js";

describe("cv helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("builds Google Drive preview URL from download link", () => {
    expect(
      getCvPreviewUrl({
        url: "https://drive.google.com/uc?export=download&id=abc123",
      })
    ).toBe("https://drive.google.com/file/d/abc123/preview");
  });

  it("uses explicit previewUrl when provided", () => {
    expect(
      getCvPreviewUrl({
        url: "/cv.pdf",
        previewUrl: "https://example.com/preview",
      })
    ).toBe("https://example.com/preview");
  });

  it("returns local path for hosted PDFs", () => {
    expect(getCvPreviewUrl({ url: "/CV/Sammit-CV.pdf" })).toBe("/CV/Sammit-CV.pdf");
  });

  it("detects local CV files", () => {
    expect(isLocalCv({ url: "/CV/Sammit-CV.pdf" })).toBe(true);
    expect(isLocalCv({ url: "https://example.com/cv.pdf" })).toBe(false);
  });

  it("builds download link props for local PDFs", () => {
    expect(
      getCvDownloadLinkProps({
        url: "/CV/Sammit-CV.pdf",
        fileName: "Sammit-CV.pdf",
      })
    ).toEqual({
      href: "/CV/Sammit-CV.pdf",
      download: "Sammit-CV.pdf",
    });
  });

  it("falls back to the URL basename for download filename", () => {
    expect(getCvFileName({ url: "/CV/Sammit-CV.pdf" })).toBe("Sammit-CV.pdf");
  });

  it("detects configured CV", () => {
    expect(hasCv()).toBe(true);
  });

  it("verifies local CV availability with HEAD", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
      })
    );

    await expect(verifyCvAvailability({ url: "/CV/Sammit-CV.pdf" })).resolves.toEqual({
      ok: true,
    });
    expect(fetch).toHaveBeenCalledWith("/CV/Sammit-CV.pdf", { method: "HEAD" });
  });

  it("returns not found when local CV HEAD fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      })
    );

    await expect(verifyCvAvailability({ url: "/CV/missing.pdf" })).resolves.toEqual({
      ok: false,
      error: CV_ERROR_MESSAGES.notFound,
    });
  });

  it("returns load failure when HEAD throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    await expect(verifyCvAvailability({ url: "/CV/Sammit-CV.pdf" })).resolves.toEqual({
      ok: false,
      error: CV_ERROR_MESSAGES.loadFailed,
    });
  });

  it("skips availability checks for remote CV URLs", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      verifyCvAvailability({ url: "https://example.com/cv.pdf" })
    ).resolves.toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports download failure when CV is not configured", async () => {
    await expect(triggerCvDownload({ url: "" })).resolves.toEqual({
      ok: false,
      error: CV_ERROR_MESSAGES.notConfigured,
    });
  });
});
