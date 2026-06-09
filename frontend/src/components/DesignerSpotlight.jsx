import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

export default function DesignerSpotlight() {
  const ref = useReveal();

  return (
    <section className="bg-stone-50 py-20 md:py-28">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-0 items-center">
          {/* ── Left: Portrait with corner bracket ────────────── */}
          <div className="relative ">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
              <img
                src="/assets/images/Zara-ahmad.webp"
                alt="Zara Hameed — Designer Spotlight"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/20 to-transparent" />
            </div>
          </div>

          {/* ── Right: Editorial text with gold hairline ──────── */}
          <div className="lg:pl-12 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-bronze-300 lg:pl-14">
            <p className="text-[10px] uppercase tracking-[0.35em] text-bronze-500 mb-4">Spotlight</p>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal-900 font-medium leading-tight">
              Zara Hameed
            </h2>

            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-charcoal-300">
              Phulkari & Pashmina · Islamabad
            </p>

            <p className="mt-6 text-charcoal-400 text-base leading-relaxed max-w-md">
              Punjabi Phulkari reimagined for the contemporary wardrobe — each stitch a quiet
              act of cultural preservation, connecting rural artisan communities with global fashion audiences.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <Link to="/zara-hameed"
                className="text-xs uppercase tracking-[0.2em] text-charcoal-700 hover:text-charcoal-800 transition-colors border-b border-charcoal-700 pb-0.5">
                Shop Their Work →
              </Link>
              <Link to="/designers"
                className="text-xs uppercase tracking-[0.2em] text-charcoal-400 hover:text-charcoal-900 transition-colors">
                All Designers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
