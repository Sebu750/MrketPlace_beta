import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProducts } from "../store/productsSlice";
import useReveal from "../hooks/useReveal";
import { Spinner } from "./Skeleton";

const IconStar = (p) => <svg viewBox="0 0 20 20" fill="currentColor" {...p}><path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7l.94-5.49-4-3.9 5.53-.8L10 1.5z"/></svg>;
const IconHeart = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><path d="M12 21C12 21 3 13.5 3 8.5 3 5.42 5.42 3 8.5 3c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0 1 15.5 3C18.58 3 21 5.42 21 8.5 21 13.5 12 21 12 21z"/></svg>;

export default function BestSellers() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((s) => s.products.public);
  const ref = useReveal();

  useEffect(() => {
    dispatch(fetchPublicProducts({ sort: "-salesCount", limit: 8 }));
  }, [dispatch]);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "";
    return `PKR ${price.toLocaleString("en-PK")}`;
  };

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

        {/* Loading */}
        {loading && <Spinner />}

        {/* 4-col grid */}
        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {products.map((p) => (
              <Link key={p._id} to={`/pieces/${p._id}`}
                className="reveal group bg-ivory-50 hover-lift">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                  <img src={p.images?.[0]?.url || "/assets/images/khaddar-modern-suit-adorzia.webp"} alt={p.name} loading="lazy" decoding="async"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]" />
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="font-serif text-base text-charcoal-900 transition-colors duration-500 line-clamp-1">{p.name}</h3>
                  <p className="text-[11px] text-charcoal-400 mt-1 tracking-wide">{p.designer?.brandName || p.designer?.name || "Independent Designer"}</p>
                  <p className="text-sm text-charcoal-700 mt-2.5 font-light">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
