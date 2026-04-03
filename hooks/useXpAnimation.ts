import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useXpStore } from "../store/useXpStore";

interface XpAnimationResult {
  animatedXp: Animated.Value;
  displayXp: number;
}

export function useXpAnimation(): XpAnimationResult {
  const xpTotal = useXpStore((s) => s.xpTotal);
  const animatedXp = useRef(new Animated.Value(0)).current;
  const prevXpRef = useRef<number | null>(null);
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    const listenerId = animatedXp.addListener(({ value }) => {
      setDisplayXp(Math.round(value));
    });
    return () => animatedXp.removeListener(listenerId);
  }, [animatedXp]);

  useEffect(() => {
    if (prevXpRef.current === null) {
      // Mount: animate from 0 → current
      animatedXp.setValue(0);
      Animated.timing(animatedXp, {
        toValue: xpTotal,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else if (prevXpRef.current !== xpTotal) {
      // Gain: animate from previous → new
      Animated.timing(animatedXp, {
        toValue: xpTotal,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
    prevXpRef.current = xpTotal;
  }, [xpTotal, animatedXp]);

  return { animatedXp, displayXp };
}
