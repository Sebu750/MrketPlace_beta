import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCraftDetail, clearCraftDetail } from "../store/craftsSlice";
import { Spinner } from "../components/Skeleton";

/* ════════════════════════════════════════════════════════════════
   CRAFT DETAIL — real data from API
════════════════════════════════════════════════════════════════ */
export default function CraftDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { item: craft, loading, error } = useSelector((s) => s.crafts.detail);

  useEffect(() => {
    dispatch(fetchCraftDetail(slug));
    return () => dispatch(clearCraftDetail());
  }, [dispatch, slug]);

  /* ── Loading ───────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <Spinner />
      </div>
    );
  }

  /* ── Error / Not found ─────────────────────────────────────────── */
  if (!craft || error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="font-serif text-2xl text-charcoal-900 mb-4">{error || "Craft not found"}</p>
          <Link to="/crafts" className="text-sm text-bronze-500 hover:text-bronze-400">← Back to Crafts Archive</Link>
        </div>
      </div>
    );
  }

  const { products = [], collections = [], designers = [] } = craft;

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {craft.coverImage ? (
            <img src={craft.coverImage} alt="" className="w-full h-full object-cover opacity-25" />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-stone-100 to-white" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
          <Link to="/crafts" className="text-xs text-bronze-500 hover:text-bronze-400 tracking-wider uppercase mb-6 inline-block">
            ← Crafts Archive
          </Link>
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">{craft.era}</p>
          <h1 className="font-display text-5xl md:text-7xl text-charcoal-900 leading-[0.92] tracking-tight">{craft.name}</h1>
          <p className="mt-4 text-sm text-charcoal-400">{craft.region}</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. CRAFT STORY
      ═══════════════════════════════════════════════════════════ */}
      {craft.story && (
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">The Craft</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Craft Story</h2>
            <div className="max-w-3xl">
              <p className="text-charcoal-500 leading-[1.9] text-base md:text-lg">{craft.story}</p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          3. HISTORICAL BACKGROUND
      ═══════════════════════════════════════════════════════════ */}
      {craft.history && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Heritage</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Historical Background</h2>
            <div className="max-w-3xl">
              <p className="text-charcoal-500 leading-[1.9] text-base md:text-lg">{craft.history}</p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          4. DESIGNERS USING THIS CRAFT
      ═══════════════════════════════════════════════════════════ */}
      {designers.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Practitioners</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-4">
              Designers Using {craft.name}
            </h2>
            <p className="text-sm text-charcoal-400 mb-12">{designers.length} designer{designers.length !== 1 && "s"} working with this tradition</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {designers.map((d) => (
                <Link
                  key={d._id}
                  to={`/${d.slug}`}
                  className="group block border border-stone-100 bg-white p-6 hover:border-bronze-300/50 transition-colors duration-300"
                >
                  <h3 className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">
                    {d.brandName || d.name}
                  </h3>
                  <p className="text-xs text-charcoal-400 mt-1">{d.studioCity}</p>
                  {d.category && (
                    <p className="text-xs text-bronze-500/70 mt-3 uppercase tracking-wider">{d.category}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          5. PRODUCTS
      ═══════════════════════════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Shop</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-4">Selected Works</h2>
            <p className="text-sm text-charcoal-400 mb-12">{products.length} piece{products.length !== 1 && "s"} in {craft.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const img = p.images?.[0]?.url;
                return (
                  <Link key={p._id} to={`/pieces/${p._id}`} className="group cursor-pointer block hover-lift">
                    <div className="relative aspect-[3/4] overflow-hidden bg-white">
                      {img ? (
                        <img
                          src={img}
                          alt={p.name}
                          loading="lazy" decoding="async"
                          className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center">
                          <span className="font-display text-3xl text-stone-200">{p.name?.[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-bronze-500/60 mb-1">
                        {p.designer?.brandName || p.designer?.name}
                      </p>
                      <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">
                        {p.name}
                      </h3>
                      <p className="text-sm text-charcoal-400 mt-1">{p.priceFormatted || `PKR ${p.price?.toLocaleString()}`}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-10 text-center">
              <Link
                to={`/shop?craft=${encodeURIComponent(craft.name)}`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-bronze-500 hover:text-bronze-400 transition-colors"
              >
                View all {craft.name} products →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          6. COLLECTIONS
      ═══════════════════════════════════════════════════════════ */}
      {collections.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Explore</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {collections.map((c) => (
                <Link key={c._id} to={`/collections/${c.slug}`} className="group block hover-lift">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {c.coverImage ? (
                      <img
                        src={c.coverImage}
                        alt={c.name}
                        loading="lazy" decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-200 to-charcoal-100 flex items-center justify-center">
                        <span className="font-display text-4xl text-charcoal-300">{c.name?.[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/15 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-400/70 mb-1">
                        {c.season} · {c.year}
                      </p>
                      <h3 className="font-serif text-lg text-white group-hover:text-bronze-400 transition-colors duration-300">
                        {c.name}
                      </h3>
                      <p className="text-xs text-ivory-300 mt-1">{c.designer?.brandName || c.designer?.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          7. BACK TO ARCHIVE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link to="/crafts" className="inline-flex items-center gap-2 text-sm text-bronze-500 tracking-wider hover:text-bronze-400 transition-colors uppercase">
            ← Back to Crafts Archive
          </Link>
        </div>
      </section>
    </div>
  );
}
