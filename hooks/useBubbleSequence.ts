import { useState, useEffect } from "react";

/**
 * Shows bubbles one at a time with typing indicator.
 * Only the current bubble is visible — previous ones disappear.
 * Won't start until `ready` is true.
 */
export function useBubbleSequence(bubbles: string[], screenKey: number, ready = true, startDelay = 100) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setCurrentIndex(-1);
    setIsTyping(false);

    if (!ready) return;

    let cancelled = false;

    const delay = (ms: number) => new Promise<void>((resolve) => {
      setTimeout(() => { if (!cancelled) resolve(); }, ms);
    });

    const run = async () => {
      await delay(startDelay);

      for (let i = 0; i < bubbles.length; i++) {
        if (cancelled) return;

        setIsTyping(true);
        await delay(350);
        if (cancelled) return;

        setIsTyping(false);
        setCurrentIndex(i);

        // Pause before next bubble (not on last one)
        if (i < bubbles.length - 1) {
          const pause = Math.min(bubbles[i].length * 30, 2500);
          await delay(pause);
        }
      }
    };

    run();

    return () => { cancelled = true; };
  }, [screenKey, ready]);

  const isDone = currentIndex === bubbles.length - 1 && !isTyping;

  return { currentIndex, isTyping, isDone };
}
