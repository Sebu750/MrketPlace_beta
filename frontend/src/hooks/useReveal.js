import { useEffect, useRef } from "react";

/**
 * Enhanced scroll reveal hook.
 * @param {object} options
 * @param {number} options.threshold - IntersectionObserver threshold (default 0.15)
 * @param {string} options.direction - "up" | "left" | "right" | "scale" (default "up")
 * @param {string} options.rootMargin - IO rootMargin (default "0px 0px -60px 0px")
 * @returns {React.RefObject}
 */
export default function useReveal(options = {}) {
  const { threshold = 0.15, direction = "up", rootMargin = "0px 0px -60px 0px" } = typeof options === "object" && !Array.isArray(options) ? options : { threshold: options };
  const ref = useRef(null);

  const classMap = {
    up: "reveal",
    left: "reveal-left",
    right: "reveal-right",
    scale: "reveal-scale",
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Add the appropriate reveal class if not already present
    const revealClass = classMap[direction] || "reveal";
    if (!el.classList.contains(revealClass)) {
      el.classList.add(revealClass);
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, direction, rootMargin]);

  return ref;
}
