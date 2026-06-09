import { useEffect, useRef } from "react";

export default function CraftStory() {
  const imgRef = useRef(null);

  /* Parallax — background scrolls slower */
  useEffect(() => {
    const onScroll = () => {
      const el = imgRef.current;
      if (!el) return;
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top) * 0.15;
      el.style.transform = `translateY(${offset}px) scale(1.1)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Parallax background image */}
      <div className="absolute inset-0">
        <div ref={imgRef} className="absolute inset-[-80px]">
          <img
            src="/assets/images/home-hero-runway.webp"
            alt="Heritage craft — Pakistan"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Light cream overlay — keeps it airy, not dark */}
        <div className="absolute inset-0 bg-ivory-50/75" />
      </div>

      {/* Centered quote */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <blockquote className="max-w-3xl text-center">
          <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-charcoal-800 leading-snug">
            "Every thread carries the memory of a hand that spun it, a loom that held it,
            and a tradition that refused to be forgotten."
          </p>
          <cite className="block mt-8 text-[11px] uppercase tracking-[0.3em] text-charcoal-300 not-italic">
            Adorzia · Heritage Manifesto
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
