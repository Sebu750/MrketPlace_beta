import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicCollections } from "../store/collectionsSlice";
import useReveal from "../hooks/useReveal";
import { Spinner } from "./Skeleton";

export default function FeaturedCollection() {
  const dispatch = useDispatch();
  const { items: collections, loading } = useSelector((s) => s.collections.public);
  const ref = useReveal();

  useEffect(() => {
    dispatch(fetchPublicCollections({ featured: true, limit: 1 }));
  }, [dispatch]);

  if (loading) {
    return (
      <section className="relative bg-white py-24 md:py-36 overflow-hidden flex items-center justify-center min-h-[600px]">
        <Spinner />
      </section>
    );
  }

  const collection = collections[0];

  if (!collection) {
    return null;
  }

  return (
    <section className="relative bg-white py-24 md:py-36 overflow-hidden">
      <div ref={ref} className="reveal max-w-[1520px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 pb-8 border-b border-stone-100">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-bronze-500 mb-4">Featured Collection</p>
            <h2 className="font-display text-display-sm md:text-display text-charcoal-900">{collection.name}</h2>
            <p className="mt-3 text-sm text-charcoal-500 font-light">
              by <span className="text-charcoal-700">{collection.designer?.brandName || collection.designer?.name}</span>
              {collection.season && <span className="text-stone-300 mx-2">·</span>}
              {collection.season && <span className="text-charcoal-400">{collection.season}</span>}
            </p>
          </div>
          <Link to={`/collections/${collection.slug}`}
            className="mt-6 md:mt-0 btn-outline text-sm">
            View Collection →
          </Link>
        </div>

        {/* Product cards - Clean white grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {(collection.products || []).slice(0, 4).map((p) => (
            <Link key={p._id} to={`/pieces/${p._id}`}
              className="group block">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-4">
                <img src={p.images?.[0]?.url || "/assets/images/khaddar-modern-suit-adorzia.webp"} alt={p.name} loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]" />
              </div>
              {/* Info */}
              <div>
                <h3 className="font-serif text-base text-charcoal-900 transition-colors duration-500 line-clamp-1">{p.name}</h3>
                <p className="text-sm text-charcoal-600 mt-1 font-light">PKR {p.price?.toLocaleString("en-PK")}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
