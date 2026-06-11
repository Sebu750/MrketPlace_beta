import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const collection = {
  name: "Geometries of Belonging",
  designer: "Ayesha Siddiqui",
  season: "Spring / Summer 2026",
  pieces: [
    { id: 1, name: "Ajrak Architect Coat", price: "PKR 48,000", image: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
    { id: 9, name: "Block Print Maxi Dress", price: "PKR 39,000", image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
    { id: 11, name: "Ajrak Wide-Leg Trousers", price: "PKR 24,000", image: "/assets/images/khaddar-modern-suit-adorzia.webp" },
    { id: 15, name: "Bridal Pashmina Dupatta", price: "PKR 85,000", image: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
  ],
};

export default function FeaturedCollection() {
  const ref = useReveal();

  return (
    <section className="relative bg-ivory-50 py-24 md:py-36 overflow-hidden">
      <div ref={ref} className="reveal max-w-[1520px] mx-auto px-6 lg:px-10">
        {/* Ghost collection name */}
        <span className="absolute top-12 left-0 right-0 text-center font-display text-[6rem] sm:text-[9rem] lg:text-[13rem] leading-none text-stone-100 pointer-events-none select-none whitespace-nowrap overflow-hidden">
          {collection.name}
        </span>

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-bronze-500 mb-4">{collection.season}</p>
            <h2 className="font-display text-display-sm md:text-display text-charcoal-900">{collection.name}</h2>
            <p className="mt-3 text-sm text-charcoal-500 font-light">by <span className="text-charcoal-700">{collection.designer}</span></p>
          </div>
          <Link to={`/collections/geometries-of-belonging`}
            className="mt-6 md:mt-0 btn-primary text-sm">
            View the Collection
          </Link>
        </div>

        {/* Product cards */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {collection.pieces.map((p) => (
            <Link key={p.id} to={`/pieces/${p.id}`}
              className="reveal group relative bg-white hover-lift">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
                <img src={p.image} alt={p.name} loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]" />
              </div>
              {/* Info */}
              <div className="p-5">
                <h3 className="font-serif text-base text-charcoal-900 transition-colors duration-500 line-clamp-1">{p.name}</h3>
                <p className="text-sm text-charcoal-600 mt-2 font-light">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
