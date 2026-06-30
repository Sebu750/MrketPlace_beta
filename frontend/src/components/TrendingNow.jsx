import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProducts } from "../store/productsSlice";
import useReveal from "../hooks/useReveal";
import { Spinner } from "./Skeleton";

export default function TrendingNow() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((s) => s.products.public);
  const ref = useReveal();

  useEffect(() => {
    dispatch(fetchPublicProducts({ sort: "-viewCount", limit: 6 }));
  }, [dispatch]);

  if (loading) {
    return (
      <section className="bg-white py-20 md:py-28 flex items-center justify-center min-h-[500px]">
        <Spinner />
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return "";
    return `PKR ${price.toLocaleString("en-PK")}`;
  };

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
        <div className="columns-2 lg:columns-3 gap-4 md:gap-5 space-y-4 md:space-y-5">
          {products.map((p, idx) => (
            <Link key={p._id} to={`/pieces/${p._id}`}
              className="group block break-inside-avoid relative overflow-hidden bg-stone-50">
              <div className={`relative ${idx % 3 === 0 ? "aspect-[3/4.5]" : "aspect-[3/3.5]"} overflow-hidden`}>
                <img src={p.images?.[0]?.url || "/assets/images/khaddar-modern-suit-adorzia.webp"} alt={p.name} loading="lazy" decoding="async"
                  className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.04]" />
              </div>
              {/* Hover tooltip — slides up */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal-900/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <h3 className="font-serif text-sm text-white">{p.name}</h3>
                <p className="text-xs text-white/80 mt-1">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
