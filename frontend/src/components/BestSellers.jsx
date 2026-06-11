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
    <section className="bg-white py-24 md:py-32 border-t border-stone-100">
      <div ref={ref} className="reveal max-w-[1520px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="section-label mb-4">Most Loved</p>
            <h2 className="font-display text-display-sm md:text-display text-charcoal-900">Best Sellers</h2>
          </div>
          <Link to="/shop" className="btn-text">
            View All
          </Link>
        </div>

        {/* 4-col grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {products.map((p) => (
            <Link key={p.id} to={`/pieces/${p.id}`}
              className="reveal group bg-ivory-50 hover-lift">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <img src={p.image} alt={p.name} loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]" />
              </div>
              {/* Info */}
              <div className="p-5">
                <h3 className="font-serif text-base text-charcoal-900 transition-colors duration-500 line-clamp-1">{p.name}</h3>
                <p className="text-[11px] text-charcoal-400 mt-1 tracking-wide">{p.designer}</p>
                <p className="text-sm text-charcoal-700 mt-2.5 font-light">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
