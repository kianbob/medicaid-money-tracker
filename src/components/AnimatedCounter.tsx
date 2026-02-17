"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

function parseTarget(value: string): { prefix: string; number: number; suffix: string; decimals: number } {
  // Extract prefix (like "$"), number, and suffix (like "T", "M", "K")
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: "", decimals: 0 };
  const numStr = match[2];
  const decimalIndex = numStr.indexOf(".");
  const decimals = decimalIndex >= 0 ? numStr.length - decimalIndex - 1 : 0;
  return {
    prefix: match[1],
    number: parseFloat(numStr),
    suffix: match[3],
    decimals,
  };
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number>(0);
  const hasAnimated = useRef(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hasAnimated.current) return;

    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();
          animate();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    function animate() {
      const { prefix, number: target, suffix, decimals } = parseTarget(value);
      const duration = 2000;
      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(value);
        }
      }

      setDisplay(`${parseTarget(value).prefix}0${parseTarget(value).suffix}`);
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <span ref={elRef} className={className}>
      {display}
    </span>
  );
}
