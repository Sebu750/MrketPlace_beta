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
    <section className="relative bg-cream-100 border-t-[3px] border-crimson-600 py-20 md:py-28 overflow-hidden">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6">
        {/* Ghost collection name */}
        <span className="absolute top-10 left-0 right-0 text-center font-serif text-[5rem] sm:text-[8rem] lg:text-[11rem] leading-none text-crimson-50 pointer-events-none select-none whitespace-nowrap overflow-hidden">
          {collection.name}
        </span>

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-crimson-600 mb-3">{collection.season}</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-noir-900 font-medium">{collection.name}</h2>
            <p className="mt-2 text-sm text-noir-500">by <span className="text-noir-700">{collection.designer}</span></p>
          </div>
          <Link to={`/collections/geometries-of-belonging`}
            className="mt-6 md:mt-0 btn-primary text-sm">
            Shop the Collection
          </Link>
        </div>

        {/* Product cards row */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
          {collection.pieces.map((p) => (
            <Link key={p.id} to={`/pieces/${p.id}`}
              className="reveal group relative bg-white corner-bracket">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-parchment-50">
                <img src={p.image} alt={p.name}
                  className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-serif text-sm text-noir-900 group-hover:text-crimson-600 transition-colors duration-300 line-clamp-1">{p.name}</h3>
                <p className="text-sm text-noir-700 mt-1.5">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
