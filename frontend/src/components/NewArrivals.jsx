import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const products = [
  { id: 1, name: "Ajrak Architect Coat", designer: "Ayesha Siddiqui", price: "PKR 48,000", image: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
  { id: 2, name: "Phulkari Reborn Blazer", designer: "Zara Hameed", price: "PKR 42,000", image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
  { id: 3, name: "Pashmina Wrap Dress", designer: "Fatima Qureshi", price: "PKR 52,000", image: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
  { id: 5, name: "Mirrorwork Bomber Jacket", designer: "Noor & Sons", price: "PKR 44,500", image: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
  { id: 6, name: "Mirror Rebel Tee", designer: "Sana Javed", price: "PKR 18,500", image: "/assets/images/mirror-rebel-tee-adorzia.webp" },
  { id: 7, name: "Rilli Sculpt Tote", designer: "Bilal Raza", price: "PKR 28,000", image: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
  { id: 4, name: "Khaddar Modern Suit", designer: "Hira Khan", price: "PKR 36,500", image: "/assets/images/khaddar-modern-suit-adorzia.webp" },
  { id: 8, name: "Indigo Quilt Cape", designer: "Ayesha Siddiqui", price: "PKR 36,500", image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
];

const IconChevronLeft = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="m15 6-6 6 6 6"/></svg>;
const IconChevronRight = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="m9 6 6 6-6 6"/></svg>;
const IconHeart = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><path d="M12 21C12 21 3 13.5 3 8.5 3 5.42 5.42 3 8.5 3c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0 1 15.5 3C18.58 3 21 5.42 21 8.5 21 13.5 12 21 12 21z"/></svg>;

export default function NewArrivals() {
  const scrollRef = useRef(null);
  const [wishId, setWishId] = useState(null);
  const ref = useReveal();

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="bg-cream-50 py-20 md:py-28">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-3">Just Landed</p>
            <h2 className="font-serif text-3xl md:text-4xl text-noir-900 font-medium">New Arrivals</h2>
            <div className="mt-3 w-16 h-px bg-gold-300" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => scroll("left")} className="w-10 h-10 flex items-center justify-center border border-gold-300 text-noir-600 hover:border-gold-500 hover:text-noir-900 transition-colors">
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")} className="w-10 h-10 flex items-center justify-center border border-gold-300 text-noir-600 hover:border-gold-500 hover:text-noir-900 transition-colors">
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll row */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6 snap-x snap-mandatory">
          {products.map((p) => (
            <Link key={p.id} to={`/pieces/${p.id}`}
              className="group shrink-0 w-[260px] sm:w-[280px] snap-start">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-parchment-100">
                <img src={p.image} alt={p.name}
                  className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.04]" />
                {/* Wishlist */}
                <button
                  onClick={(e) => { e.preventDefault(); setWishId(wishId === p.id ? null : p.id); }}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-cream-50/80 backdrop-blur-sm border border-gold-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IconHeart className={`w-3.5 h-3.5 ${wishId === p.id ? "text-crimson-500 fill-crimson-500" : "text-noir-400"}`} />
                </button>
              </div>
              {/* Info */}
              <div className="pt-3 pb-1">
                <h3 className="font-serif text-sm text-noir-900 group-hover:text-crimson-600 transition-colors duration-300 line-clamp-1">{p.name}</h3>
                <p className="text-xs text-noir-400 mt-0.5">{p.designer}</p>
                <p className="text-sm text-noir-800 mt-2">{p.price}</p>
              </div>
            </Link>
          ))}

          {/* View All card */}
          <Link to="/products" className="group shrink-0 w-[260px] sm:w-[280px] snap-start flex items-center justify-center border border-gold-200 bg-parchment-50 hover:border-gold-400 transition-colors duration-300 min-h-[340px]">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-noir-400 mb-3">Browse</p>
              <p className="font-serif text-xl text-noir-900">View All</p>
              <p className="mt-2 text-xs text-noir-500">{products.length}+ pieces</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
