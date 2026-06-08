import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const products = [
  { id: 5, name: "Mirrorwork Bomber Jacket", designer: "Noor & Sons", price: "PKR 44,500", rating: 4.9, image: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
  { id: 4, name: "Pashmina Wrap Dress", designer: "Fatima Qureshi", price: "PKR 52,000", rating: 4.8, image: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
  { id: 1, name: "Ajrak Architect Coat", designer: "Ayesha Siddiqui", price: "PKR 48,000", rating: 4.9, image: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
  { id: 2, name: "Phulkari Reborn Blazer", designer: "Zara Hameed", price: "PKR 42,000", rating: 4.7, image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
  { id: 7, name: "Rilli Sculpt Tote", designer: "Bilal Raza", price: "PKR 28,000", rating: 4.6, image: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
  { id: 3, name: "Khaddar Modern Suit", designer: "Hira Khan", price: "PKR 36,500", rating: 4.5, image: "/assets/images/khaddar-modern-suit-adorzia.webp" },
  { id: 6, name: "Mirror Rebel Tee", designer: "Sana Javed", price: "PKR 18,500", rating: 4.8, image: "/assets/images/mirror-rebel-tee-adorzia.webp" },
  { id: 13, name: "Phulkari Cape Shawl", designer: "Noor & Sons", price: "PKR 58,000", rating: 4.9, image: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
];

const IconStar = (p) => <svg viewBox="0 0 20 20" fill="currentColor" {...p}><path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7l.94-5.49-4-3.9 5.53-.8L10 1.5z"/></svg>;
const IconHeart = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><path d="M12 21C12 21 3 13.5 3 8.5 3 5.42 5.42 3 8.5 3c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0 1 15.5 3C18.58 3 21 5.42 21 8.5 21 13.5 12 21 12 21z"/></svg>;

export default function BestSellers() {
  const ref = useReveal();

  return (
    <section className="bg-white py-20 md:py-28">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">Most Loved</p>
            <h2 className="font-serif text-3xl md:text-4xl text-noir-900 font-medium">Best Sellers</h2>
            <div className="mt-3 w-16 h-px bg-gold-300" />
          </div>
          <Link to="/products" className="text-[11px] uppercase tracking-[0.2em] text-noir-500 hover:text-crimson-600 transition-colors border-b border-noir-300 hover:border-crimson-600 pb-0.5">
            View All
          </Link>
        </div>

        {/* 4-col grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
          {products.map((p) => (
            <Link key={p.id} to={`/pieces/${p.id}`}
              className="reveal group bg-cream-50 transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-parchment-100">
                <img src={p.image} alt={p.name}
                  className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.04]" />
                <button onClick={(e) => e.preventDefault()}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-cream-50/80 backdrop-blur-sm border border-gold-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IconHeart className="w-3.5 h-3.5 text-noir-400" />
                </button>
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-serif text-sm text-noir-900 group-hover:text-crimson-600 transition-colors duration-300 line-clamp-1">{p.name}</h3>
                <p className="text-xs text-noir-400 mt-0.5">{p.designer}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-noir-800">{p.price}</p>
                  <span className="flex items-center gap-1 text-[11px] text-noir-600">
                    <IconStar className="w-3 h-3 text-gold-400" />
                    {p.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
