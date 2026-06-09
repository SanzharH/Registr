import { useEffect, useState } from "react";

export default function TypewriterText({ text, isFinal }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    setVisibleText("");
    if (!text) {
      return undefined;
    }

    let index = 0;
    let timeoutId;

    const tick = () => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index < text.length) {
        timeoutId = window.setTimeout(tick, 2 + Math.random() * 18);
      }
    };

    tick();
    return () => window.clearTimeout(timeoutId);
  }, [text]);

  return (
    <p className="typewriter">
      {visibleText || "Ответ чат-бота появится здесь"}
      {!isFinal && <span className="cursor" />}
    </p>
  );
}
