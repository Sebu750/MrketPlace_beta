import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollectionBySlug } from "../store/collectionsSlice";

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function CollectionDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { current, loading } = useSelector((s) => s.collections);
  const [activeFilter, setActiveFilter] = useState("All");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (slug) dispatch(fetchCollectionBySlug(slug));
  }, [slug, dispatch]);

  /* ── Derive data ────────────────────────────────────────────── */
  const c = current?.data || current || {};
  const products = Array.isArray(c.products) ? c.products : [];
  const designer = typeof c.designer === "object" ? c.designer || {} : {};
  const designerName = designer.name || "";
  const designerSlug = designer.slug || "";
  const crafts = Array.isArray(c.craftTraditions) ? c.craftTraditions : [];
  const lookbook = Array.isArray(c.lookbookImages) ? c.lookbookImages : [];
  const coverImg = c.coverImage || "";

  /* Product category filters */
  const productCategories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const filteredPieces = activeFilter === "All" ? products : products.filter((p) => p.category === activeFilter);
  const toggleWishlist = (id) => setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  /* ── Loading / empty ────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <p className="font-serif text-xl text-charcoal-400 font-light">Loading collection…</p>
      </div>
    );
  }

  if (!c.name) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-6">
        <p className="font-serif text-2xl text-charcoal-900 mb-3">Collection not found</p>
        <p className="text-sm text-charcoal-400 mb-8">This collection may not exist or has been removed.</p>
        <Link to="/collections" className="px-6 py-2.5 bg-charcoal-900 text-white text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors">
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">

      {/* ═══ 1. HERO ═════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {coverImg ? (
            <img src={coverImg} alt="" className="w-full h-full object-cover opacity-25" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-40 w-full">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-6">
            {c.season || ""} {c.year ? `· ${c.year}` : ""}
          </p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-charcoal-900 leading-[0.92] tracking-tight max-w-4xl">
            {c.name}
          </h1>

          {/* Designer credit */}
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            {designerName && (
              <Link to={designerSlug ? `/${designerSlug}` : "/designers"} className="text-sm text-bronze-500 hover:text-bronze-400 transition-colors tracking-wide">
                by {designerName}
              </Link>
            )}
            {crafts.length > 0 && (
              <>
                {designerName && <span className="text-stone-300">|</span>}
                <span className="text-xs uppercase tracking-[0.2em] text-charcoal-400">{crafts.join(" · ")}</span>
              </>
            )}
            {c.category && (
              <>
                <span className="text-stone-300">|</span>
                <span className="text-xs text-charcoal-400">{c.category}</span>
              </>
            )}
          </div>

          {c.description && (
            <p className="mt-6 text-charcoal-500 max-w-2xl leading-relaxed text-base md:text-lg italic">
              "{c.description.slice(0, 300)}{c.description.length > 300 ? "…" : ""}"
            </p>
          )}
        </div>
      </section>

      {/* ═══ 2. COLLECTION NARRATIVE ════════════════════════════ */}
      {c.description && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">The Story</p>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Collection Narrative</h2>
              {c.description.split("\n\n").map((para, i) => (
                <p key={i} className={`${i > 0 ? "mt-6" : ""} text-charcoal-500 leading-[1.9] text-base md:text-lg`}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 3. LOOKBOOK ════════════════════════════════════════ */}
      {lookbook.length > 0 && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Campaign</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-4">Lookbook</h2>
            <p className="text-sm text-charcoal-400 mb-14 max-w-xl">Full campaign imagery , each look styled and photographed as a standalone editorial.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lookbook.map((img, i) => {
                const src = typeof img === "string" ? img : img.url || "";
                return (
                  <div key={i} className="group relative overflow-hidden cursor-pointer">
                    <div className={`${i === 0 ? "aspect-[3/4] md:col-span-2 md:row-span-2" : "aspect-[3/4]"}`}>
                      <img
                        src={src}
                        alt={`${c.name} , Look ${i + 1}`}
                        className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-charcoal-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-xs text-white tracking-wide">Look {i + 1}</p>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="font-serif text-sm text-white/60 bg-charcoal-950/30 backdrop-blur-sm px-2 py-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 4. PRODUCTS ════════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">The Collection</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-4">Products</h2>
            <p className="text-sm text-charcoal-400 mb-10">
              {products.length} pieces · {c.season || ""} {c.year || ""}
            </p>

            {/* Category filters */}
            {productCategories.length > 2 && (
              <div className="flex flex-wrap gap-3 mb-12">
                {productCategories.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-5 py-2 text-[11px] uppercase tracking-[0.18em] border transition-all duration-300 ${
                      activeFilter === f
                        ? "bg-charcoal-900 text-white border-charcoal-900"
                        : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPieces.map((p) => {
                const img = p.gallery?.[0] || p.images?.[0]?.url || "";
                const price = p.priceFormatted || (typeof p.price === "number" ? `PKR ${p.price.toLocaleString()}` : p.price || "");
                const dName = typeof p.designer === "object" ? p.designer?.name || "" : p.designer || "";
                return (
                  <article key={p._id} className="group">
                    <Link to={`/pieces/${p.slug || p._id}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
                        {img ? (
                          <img
                            src={img}
                            alt={p.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-ivory-50 to-stone-100 flex items-center justify-center">
                            <span className="font-display text-3xl text-charcoal-200">{p.name?.charAt(0) || "P"}</span>
                          </div>
                        )}
                        {/* Wishlist */}
                        <button
                          onClick={(e) => { e.preventDefault(); toggleWishlist(p._id); }}
                          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/60 backdrop-blur-sm transition-colors"
                        >
                          <svg className={`w-4 h-4 ${wishlist.includes(p._id) ? "text-bronze-500" : "text-charcoal-900/40"}`} fill={wishlist.includes(p._id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        {/* Sizes */}
                        {p.sizes?.length > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal-950/80 to-transparent">
                            <div className="flex gap-1.5 flex-wrap">
                              {p.sizes.map((s) => (
                                <span key={s} className="text-[10px] text-ivory-200 border border-ivory-50/15 px-2 py-0.5">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        {p.craft && <p className="text-[10px] uppercase tracking-[0.15em] text-bronze-500/60 mb-1">{p.craft}</p>}
                        <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{p.name}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-charcoal-400">{price}</span>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-bronze-500">View →</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* No products message */}
      {!loading && products.length === 0 && (
        <section className="py-24 bg-white border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-serif text-xl text-charcoal-400 font-light">No products published for this collection yet.</p>
          </div>
        </section>
      )}

      {/* ═══ 5. CRAFT TRADITIONS ════════════════════════════════ */}
      {crafts.length > 0 && (
        <section className="py-24 md:py-32 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Heritage</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-12">Craft Traditions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {crafts.map((craft) => (
                <Link
                  key={craft}
                  to={`/crafts/${craft.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group border border-stone-200 bg-white p-8 hover:border-bronze-400/50 transition-all duration-300"
                >
                  <h3 className="font-serif text-xl text-charcoal-900 mb-2">{craft}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-bronze-500 group-hover:text-bronze-400 transition-colors">Explore Craft →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 6. DESIGNER INFORMATION ════════════════════════════ */}
      {designerName && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">The Designer</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium mb-14">About {designerName}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-4">
                <Link to={designerSlug ? `/${designerSlug}` : "/designers"} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    {designer.avatar || designer.profileImage ? (
                      <img src={designer.avatar || designer.profileImage} alt={designerName}
                        className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-ivory-50 to-stone-200 flex items-center justify-center">
                        <span className="font-display text-6xl text-charcoal-200">{designerName.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="font-serif text-xl text-white">{designerName}</h3>
                      {designer.city && <p className="text-xs text-ivory-300 mt-1">{designer.city}</p>}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-bronze-500 text-sm">
                    <span>View Profile</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              </div>

              <div className="lg:col-span-8">
                {designer.bio && (
                  <p className="text-charcoal-500 leading-[1.85] text-base md:text-lg">{designer.bio}</p>
                )}
                {designer.philosophy && (
                  <div className="mt-8 border-l-2 border-bronze-400 pl-6">
                    <p className="font-serif text-xl md:text-2xl text-charcoal-800 italic">"{designer.philosophy}"</p>
                  </div>
                )}
                {designer.category && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {Array.isArray(designer.category) ? designer.category.map((cat) => (
                      <span key={cat} className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 border border-stone-200 px-3 py-1">{cat}</span>
                    )) : (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 border border-stone-200 px-3 py-1">{designer.category}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ 7. BACK TO COLLECTIONS ════════════════════════════ */}
      <section className="py-16 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="uppercase tracking-[0.2em]">All Collections</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
