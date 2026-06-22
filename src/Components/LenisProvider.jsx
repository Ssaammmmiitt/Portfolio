import { ReactLenis } from "lenis/react";
import ScrollSync from "./ScrollSync";

const LenisProvider = ({ children }) => (
  <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
    <ScrollSync />
    {children}
  </ReactLenis>
);

export default LenisProvider;
