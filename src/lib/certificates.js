export function encodeCertPath(path) {
  return path
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}

export function certificatePreviewSrc(file) {
  return `${encodeCertPath(file)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
}
