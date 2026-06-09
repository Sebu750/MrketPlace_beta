import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const products = [
  { id: 10, name: "Chikankari Silk Blouse", designer: "Hira Khan", price: "PKR 32,000", image: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
  { id: 14, name: "Khaddar Oversized Shirt", designer: "Sana Javed", price: "PKR 21,000", image: "/assets/images/mirror-rebel-tee-adorzia.webp" },
  { id: 16, name: "Rilli Patchwork Jacket", designer: "Hira Khan", price: "PKR 41,000", image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
  { id: 12, name: "Heritage Clutch Box", designer: "Bilal Raza", price: "PKR 22,000", image: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
  { id: 4, name: "Pashmina Wrap Dress", designer: "Fatima Qureshi", price: "PKR 52,000", image: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
  { id: 8, name: "Indigo Quilt Cape", designer: "Ayesha Siddiqui", price: "PKR 36,500", image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
];

const IconChevronLeft = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="m15 6-6 6 6 6"/></svg>;
const IconChevronRight = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="m9 6 6 6-6 6"/></svg>;
const IconHeart = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><path d="M12 21C12 21 3 13.5 3 8.5 3 5.42 5.42 3 8.5 3c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0 1 15.5 3C18.58 3 21 5.42 21 8.5 21 13.5 12 21 12 21z"/></svg>;

export default function PicksForYou() {
  const scrollRef = useRef(null);
  const [wishId, setWishId] = useState(null);
  const ref = useReveal();

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="bg-ivory-50 py-20 md:py-28">
      <div ref={ref} className="reveal max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-3">Curated for You</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium">Continue Browsing</h2>
            <div className="mt-3 w-16 h-px bg-bronze-300" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => scroll("left")} className="w-10 h-10 flex items-center justify-center border border-bronze-300 text-charcoal-500 hover:border-bronze-500 hover:text-charcoal-900 transition-colors">
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")} className="w-10 h-10 flex items-center justify-center border border-bronze-300 text-charcoal-500 hover:border-bronze-500 hover:text-charcoal-900 transition-colors">
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6 snap-x snap-mandatory">
          {products.map((p) => (
            <Link key={p.id} to={`/pieces/${p.id}`}
              className="group shrink-0 w-[260px] sm:w-[280px] snap-start">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
                <img src={p.image} alt={p.name}
                  className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.04]" />
                <button
                  onClick={(e) => { e.preventDefault(); setWishId(wishId === p.id ? null : p.id); }}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-bronze-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IconHeart className={`w-3.5 h-3.5 ${wishId === p.id ? "text-charcoal-500 fill-charcoal-500" : "text-charcoal-300"}`} />
                </button>
              </div>
              <div className="pt-3 pb-1">
                <h3 className="font-serif text-sm text-charcoal-900 group-hover:text-charcoal-700 transition-colors duration-300 line-clamp-1">{p.name}</h3>
                <p className="text-xs text-charcoal-300 mt-0.5">{p.designer}</p>
                <p className="text-sm text-charcoal-800 mt-2">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
