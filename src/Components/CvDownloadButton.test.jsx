import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CvDownloadButton from "./CvDownloadButton.jsx";
import { CV_ERROR_MESSAGES } from "../lib/cv.js";

vi.mock("../lib/cv.js", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isLocalCv: vi.fn(() => true),
    triggerCvDownload: vi.fn(),
    getCvDownloadLinkProps: vi.fn(() => ({
      href: "/CV/Sammit-CV.pdf",
      download: "Sammit-CV.pdf",
    })),
  };
});

import { triggerCvDownload } from "../lib/cv.js";

describe("CvDownloadButton", () => {
  it("shows an error when download fails", async () => {
    const user = userEvent.setup();
    triggerCvDownload.mockResolvedValueOnce({
      ok: false,
      error: CV_ERROR_MESSAGES.notFound,
    });

    render(<CvDownloadButton />);

    await user.click(screen.getByRole("button", { name: /download cv/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(CV_ERROR_MESSAGES.notFound);
  });

  it("shows a fallback error when download throws", async () => {
    const user = userEvent.setup();
    triggerCvDownload.mockRejectedValueOnce(new Error("network"));

    render(<CvDownloadButton />);

    await user.click(screen.getByRole("button", { name: /download cv/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Download failed. Please try again.");
  });
});
