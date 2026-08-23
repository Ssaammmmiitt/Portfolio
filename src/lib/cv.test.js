import { describe, expect, it } from "vitest";
import { getCvPreviewUrl, hasCv } from "./cv.js";

describe("cv helpers", () => {
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
    expect(getCvPreviewUrl({ url: "/Sammit-CV.pdf" })).toBe("/Sammit-CV.pdf");
  });

  it("detects configured CV", () => {
    expect(hasCv()).toBe(true);
  });
});
