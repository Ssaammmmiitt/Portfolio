import { useEffect, useState } from "react";
import { cn } from "../lib/utils.js";

function randomScrambleChar() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function Letter({ letter, settled }) {
  const [display, setDisplay] = useState(() =>
    settled ? letter : letter === " " ? "\u00A0" : randomScrambleChar()
  );

  useEffect(() => {
    if (settled || letter === " ") {
      setDisplay(letter === " " ? "\u00A0" : letter);
      return;
    }

    let count = Math.floor(Math.random() * 10) + 5;
    const interval = setInterval(() => {
      setDisplay(randomScrambleChar());
      count -= 1;
      if (count === 0) {
        setDisplay(letter);
        clearInterval(interval);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [letter, settled]);

  return <>{display === " " ? "\u00A0" : display}</>;
}

export default function GibberishText({ text, settled = false }) {
  return text.split("").map((letter, index) => (
    <Letter key={`${index}-${letter}`} letter={letter} settled={settled} />
  ));
}

export function GibberishSplitChars({ text, className, instant = false, settled = false }) {
  const showFinal = settled || instant;

  return (
    <>
      {text.split("").map((letter, index) => (
        <span key={`${index}-${letter}`} className="inline-block overflow-hidden align-bottom">
          <span
            className={cn(
              className,
              "inline-block",
              instant ? "translate-y-0" : "translate-y-[110%]"
            )}
          >
            <Letter letter={letter} settled={showFinal} />
          </span>
        </span>
      ))}
    </>
  );
}
