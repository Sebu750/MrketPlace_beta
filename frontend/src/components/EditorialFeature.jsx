import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

export default function EditorialFeature() {
  const imgRef = useRef(null);
  const ref = useReveal(0.2);

  /* Subtle parallax on image */
  useEffect(() => {
    const onScroll = () => {
      const el = imgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewH = window.innerHeight;
      const offset = (center - viewH / 2) * 0.06;
      el.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-cream-100 py-20 md:py-28 overflow-hidden">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-0 items-stretch min-h-[500px] lg:min-h-[600px]">
          {/* ── Left: Large image ────────────────────────────── */}
          <div className="relative overflow-hidden bg-parchment-200">
            <div ref={imgRef} className="absolute inset-[-40px]">
              <img
                src="/assets/images/home-sustainable-fashion.webp"
                alt="Editorial — heritage craft"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cream-100/20" />
          </div>

          {/* ── Gold vertical hairline ────────────────────────── */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gold-400 to-transparent" />

          {/* ── Right: Editorial text ────────────────────────── */}
          <div className="relative flex flex-col justify-center py-12 lg:py-16 lg:pl-12">
            {/* Ghost watermark behind text */}
            <span className="absolute top-6 right-4 font-serif text-[7rem] lg:text-[9rem] leading-none text-crimson-100/40 pointer-events-none select-none">
              Ajrak
            </span>

            <p className="section-label mb-4">Craft Spotlight</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-noir-900 font-medium leading-tight relative z-10">
              The Art of
              <br />
              <span className="italic">Block Printing</span>
            </h2>
            <p className="mt-6 text-noir-500 text-base leading-relaxed max-w-sm relative z-10">
              Hand-carved wooden blocks, natural dyes from indigo and pomegranate —
              Ajrak printing is a 300-year-old Sindhi tradition being reimagined by a
              new generation of designers.
            </p>
            <div className="mt-8 relative z-10">
              <Link to="/craft/ajrak" className="btn-outline">
                Discover the Craft
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
