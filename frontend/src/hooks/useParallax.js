import { useEffect, useRef, useState } from "react";

/**
 * Parallax scroll hook — applies translateY transform based on scroll position.
 * @param {number} speed - Parallax speed multiplier (default 0.3, lower = slower)
 * @returns {React.RefObject}
 */
export default function useParallax(speed = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const windowH = window.innerHeight;
          // Only transform when element is in view
          if (rect.top < windowH && rect.bottom > 0) {
            const offset = (rect.top - windowH / 2) * speed;
            el.style.transform = `translateY(${offset}px)`;
            el.style.willChange = "transform";
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (el) el.style.willChange = "auto";
    };
  }, [speed]);

  return ref;
}
