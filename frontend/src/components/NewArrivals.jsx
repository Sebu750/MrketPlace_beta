import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProducts } from "../store/productsSlice";
import useReveal from "../hooks/useReveal";
import { Spinner } from "./Skeleton";

const IconChevronLeft = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="m15 6-6 6 6 6"/></svg>;
const IconChevronRight = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="m9 6 6 6-6 6"/></svg>;

export default function NewArrivals() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((s) => s.products.public);
  const scrollRef = useRef(null);
  const ref = useReveal();

  useEffect(() => {
    dispatch(fetchPublicProducts({ sort: "-createdAt", limit: 8 }));
  }, [dispatch]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "";
    return `PKR ${price.toLocaleString("en-PK")}`;
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <div ref={ref} className="reveal max-w-[1520px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="section-label mb-4">New In</p>
            <h2 className="font-display text-display-sm md:text-display text-charcoal-900">Latest Arrivals</h2>
          </div>
          {/* Arrow buttons with hover micro-animation */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => scroll("left")} className="w-11 h-11 flex items-center justify-center border border-stone-200 text-charcoal-500 hover:border-charcoal-400 hover:text-charcoal-900 hover:scale-105 transition-all duration-300">
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")} className="w-11 h-11 flex items-center justify-center border border-stone-200 text-charcoal-500 hover:border-charcoal-400 hover:text-charcoal-900 hover:scale-105 transition-all duration-300">
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && <Spinner />}

        {/* Horizontal scroll */}
        {!loading && (
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-6 lg:-mx-10 px-6 lg:px-10 snap-x snap-mandatory">
            {products.map((p) => (
              <Link key={p._id} to={`/pieces/${p._id}`}
                className="group shrink-0 w-[280px] sm:w-[300px] snap-start">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-ivory-100">
                  <img src={p.images?.[0]?.url || "/assets/images/khaddar-modern-suit-adorzia.webp"} alt={p.name} loading="lazy" decoding="async"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]" />
                </div>
                {/* Info */}
                <div className="pt-4 pb-1">
                  <h3 className="font-serif text-base text-charcoal-900 transition-colors duration-500 line-clamp-1">{p.name}</h3>
                  <p className="text-[11px] text-charcoal-400 mt-1 tracking-wide">{p.designer?.brandName || p.designer?.name || "Independent Designer"}</p>
                  <p className="text-sm text-charcoal-700 mt-2.5 font-light">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}

            {/* View All card */}
            <Link to="/shop" className="group shrink-0 w-[280px] sm:w-[300px] snap-start flex items-center justify-center border border-stone-200 hover:border-charcoal-300 transition-colors duration-500 min-h-[380px]">
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.35em] text-charcoal-400 mb-4">Browse</p>
                <p className="font-serif text-2xl text-charcoal-900 font-light">View All</p>
                <p className="mt-2 text-[11px] text-charcoal-400">{products.length}+ pieces</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
