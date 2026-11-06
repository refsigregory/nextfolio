'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Props = {
  text: string;
  /** Milliseconds before the first character appears. */
  startDelay?: number;
  /** Base milliseconds per character. */
  speed?: number;
};

/** Extra pause after punctuation so it reads like someone typing. */
function pauseAfter(char: string) {
  if (char === '.') return 350;
  if (char === ',') return 160;
  return 0;
}

/**
 * Types `text` out one character at a time with a cursor.
 * The untyped part is rendered invisibly, so the paragraph keeps its final size and line breaks
 * from the start and nothing around it moves while typing.
 */
export default function Typewriter({ text, startDelay = 0, speed = 24 }: Props) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;

    const tick = () => {
      if (reduceMotion) {
        setCount(text.length);
        return;
      }
      i += 1;
      setCount(i);
      if (i < text.length) {
        // A little randomness keeps the rhythm from feeling mechanical.
        timer = setTimeout(tick, speed + Math.random() * speed * 0.8 + pauseAfter(text[i - 1]));
      }
    };

    timer = setTimeout(tick, reduceMotion ? 0 : startDelay);
    return () => clearTimeout(timer);
  }, [text, startDelay, speed, reduceMotion]);

  const done = count >= text.length;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {/* Zero-width wrapper so the cursor never pushes text around. */}
        <span className="relative inline-block h-[1.1em] w-0 align-[-0.2em]">
          <span className={`absolute top-0 left-px h-full w-0.5 bg-teal-800 ${done ? 'caret-blink' : ''}`} />
        </span>
        <span className="opacity-0">{text.slice(count)}</span>
      </span>
    </>
  );
}
