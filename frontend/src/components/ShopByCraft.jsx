import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCrafts } from "../store/craftsSlice";
import useReveal from "../hooks/useReveal";
import { Spinner } from "./Skeleton";

export default function ShopByCraft() {
  const dispatch = useDispatch();
  const { items: crafts, loading } = useSelector((s) => s.crafts.list);
  const ref = useReveal();

  useEffect(() => {
    dispatch(fetchCrafts({ limit: 6 }));
  }, [dispatch]);

  if (loading) {
    return (
      <section className="bg-white py-24 md:py-32 flex items-center justify-center min-h-[500px]">
        <Spinner />
      </section>
    );
  }

  if (!crafts || crafts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div ref={ref} className="reveal max-w-[1520px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14 max-w-lg">
          <p className="section-label mb-4">Heritage Traditions</p>
          <h2 className="font-display text-display-sm md:text-display text-charcoal-900">
            Craft as
            <br />
            <span className="italic font-serif font-light">Identity</span>
          </h2>
          <p className="mt-6 text-charcoal-500 text-sm leading-[1.85] font-light">
            Each craft tradition carries centuries of knowledge, community, and cultural identity.
            Explore by the art form that speaks to you.
          </p>
        </div>

        {/* 6-tile grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {crafts.map((c) => (
            <Link key={c._id} to={`/crafts/${c.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-stone-100">
              {/* Image */}
              <img src={c.coverImage || "/assets/images/craft.webp"} alt={c.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]" />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/10 to-transparent" />
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-serif text-xl md:text-2xl text-white font-light">{c.name}</h3>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/60 mt-1.5 font-light">{c.region || "Pakistan"}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
