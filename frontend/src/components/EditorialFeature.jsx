import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

export default function EditorialFeature() {
  const imgRef = useRef(null);
  const ref = useReveal(0.2);

  /* Subtle parallax — slow and cinematic */
  useEffect(() => {
    const onScroll = () => {
      const el = imgRef.current;
      if (!el) return;
      const rect = el.parentElement.getBoundingClientRect();
      const offset = rect.top * 0.04;
      el.style.transform = `translateY(${offset}px) scale(1.06)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-ivory-50 py-24 md:py-36 overflow-hidden">
      <div ref={ref} className="reveal max-w-[1520px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-0 items-stretch min-h-[520px] lg:min-h-[640px]">
          {/* ── Left: Full-bleed image with parallax ─────────── */}
          <div className="relative overflow-hidden bg-stone-100">
            <div ref={imgRef} className="absolute inset-[-40px]">
              <img
                src="/assets/images/home-sustainable-fashion.webp"
                alt="The Art of Block Printing — Craft Editorial"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ── Right: Editorial text ────────────────────────── */}
          <div className="relative flex flex-col justify-center py-16 lg:py-20 lg:pl-16 border-l border-stone-200">
            <p className="section-label mb-6">Craft Spotlight</p>

            <h2 className="font-serif text-display-sm md:text-display text-charcoal-900 font-light leading-[0.95]">
              The Art of
              <br />
              <span className="italic">Block Printing</span>
            </h2>

            <p className="mt-8 text-charcoal-500 text-sm md:text-base leading-[1.85] max-w-sm font-light">
              Hand-carved wooden blocks, natural dyes from indigo and pomegranate —
              Ajrak printing is a 3,000-year-old Sindhi tradition being reimagined by a
              new generation of independent designers.
            </p>

            <div className="mt-10">
              <Link to="/crafts/ajrak" className="btn-outline">
                Discover the Craft
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
