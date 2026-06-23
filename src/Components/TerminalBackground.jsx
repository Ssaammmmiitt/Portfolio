import { useMemo } from "react";
import { useTheme } from "../context/ThemeProvider";
import FaultyTerminal from "./FaultyTerminal";
import "./TerminalBackground.css";

const TerminalBackground = () => {
  const { theme } = useTheme();

  const terminalProps = useMemo(
    () =>
      theme === "dark"
        ? {
            tint: "#22d3ee",
            brightness: 0.42,
            scanlineIntensity: 0.55,
            noiseAmp: 0.65,
            glitchAmount: 0.85,
            flickerAmount: 0.65,
          }
        : {
            tint: "#0e7490",
            brightness: 0.72,
            scanlineIntensity: 0.8,
            noiseAmp: 0.9,
            glitchAmount: 1,
            flickerAmount: 0.85,
          },
    [theme]
  );

  return (
    <div className="terminal-background" aria-hidden="true">
      <FaultyTerminal
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.2}
        timeScale={0.45}
        pause={false}
        scanlineIntensity={terminalProps.scanlineIntensity}
        glitchAmount={terminalProps.glitchAmount}
        flickerAmount={terminalProps.flickerAmount}
        noiseAmp={terminalProps.noiseAmp}
        chromaticAberration={0}
        dither={0}
        curvature={0.12}
        tint={terminalProps.tint}
        mouseReact
        mouseStrength={0.35}
        pageLoadAnimation
        brightness={terminalProps.brightness}
      />
      <div className="terminal-background__overlay" data-theme={theme} />
      <div className="terminal-background__vignette" />
    </div>
  );
};

export default TerminalBackground;
