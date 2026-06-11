import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const items = [
  { id: 1, name: "Ajrak Architect Coat", price: "PKR 48,000", tall: true, image: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
  { id: 7, name: "Rilli Sculpt Tote", price: "PKR 28,000", tall: false, image: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
  { id: 3, name: "Pashmina Wrap Dress", price: "PKR 52,000", tall: false, image: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
  { id: 5, name: "Mirrorwork Bomber Jacket", price: "PKR 44,500", tall: true, image: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
  { id: 2, name: "Phulkari Reborn Blazer", price: "PKR 42,000", tall: false, image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
  { id: 6, name: "Mirror Rebel Tee", price: "PKR 18,500", tall: true, image: "/assets/images/mirror-rebel-tee-adorzia.webp" },
];

export default function TrendingNow() {
  const ref = useReveal();

  return (
    <section className="bg-white py-20 md:py-28">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="section-label mb-3">Right Now</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium">Trending Now</h2>
          <div className="mt-3 w-16 h-px bg-bronze-300" />
        </div>

        {/* Masonry grid */}
        <div className="columns-2 lg:columns-3 gap-4 md:gap-5 stagger-children space-y-4 md:space-y-5">
          {items.map((p) => (
            <Link key={p.id} to={`/pieces/${p.id}`}
              className="reveal group block break-inside-avoid relative overflow-hidden bg-stone-50">
              <div className={`relative ${p.tall ? "aspect-[3/4.5]" : "aspect-[3/3.5]"} overflow-hidden`}>
                <img src={p.image} alt={p.name} loading="lazy" decoding="async"
                  className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.04]" />
              </div>
              {/* Hover tooltip — slides up */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal-900/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <h3 className="font-serif text-sm text-white">{p.name}</h3>
                <p className="text-xs text-white/80 mt-1">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
