import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicCollections } from "../store/collectionsSlice";
import { Spinner } from "../components/Skeleton";

/* ── Collection card ────────────────────────────────────────── */
function CollectionCard({ c }) {
  const img = c.coverImage || "";
  const designerName = typeof c.designer === "object" ? c.designer?.name || "" : c.designer || "";
  const designerSlug = typeof c.designer === "object" ? c.designer?.slug || "" : "";
  const crafts = Array.isArray(c.craftTraditions) ? c.craftTraditions : [];
  const link = `/collections/${c.slug || c._id}`;

  return (
    <Link to={link} className="group block hover-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {img ? (
          <img
            src={img}
            alt={c.name}
            loading="lazy" decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200 flex items-center justify-center">
            <span className="font-display text-4xl text-charcoal-200">{c.name?.charAt(0) || "C"}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/15 to-transparent" />
        {/* Featured badge */}
        {c.featured && (
          <div className="absolute top-4 left-4">
            <span className="text-[9px] uppercase tracking-[0.2em] bg-bronze-300 text-charcoal-950 px-2.5 py-1 font-medium">
              Featured
            </span>
          </div>
        )}
        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-400/70 mb-1">
            {c.season || ""} {c.year ? `, ${c.year}` : ""} {c.productCount ? `· ${c.productCount} pieces` : ""}
          </p>
          <h3 className="font-serif text-lg text-white group-hover:text-bronze-400 transition-colors duration-300">
            {c.name}
          </h3>
          {designerName && (
            <p className="text-xs text-ivory-300 mt-1">{designerName}</p>
          )}
          {(crafts.length > 0 || c.category) && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {crafts.slice(0, 2).map((craft) => (
                <span key={craft} className="text-[9px] uppercase tracking-wider text-bronze-500/50 border border-ivory-50/10 px-2 py-0.5">{craft}</span>
              ))}
              {c.category && (
                <span className="text-[9px] uppercase tracking-wider text-bronze-500/50 border border-ivory-50/10 px-2 py-0.5">{c.category}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function CollectionsDirectory() {
  const dispatch = useDispatch();
  const { items: collections, loading } = useSelector((s) => s.collections.public);

  const [filters, setFilters] = useState({ year: "All", category: "All", designer: "All", season: "All" });
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Fetch on mount ─────────────────────────────────────────── */
  useEffect(() => {
    dispatch(fetchPublicCollections({ limit: 100 }));
  }, [dispatch]);

  /* ── Derive filter options from real data ───────────────────── */
  const filterOptions = useMemo(() => {
    const years = [...new Set(collections.map((c) => c.year).filter(Boolean))].sort((a, b) => b - a);
    const categories = [...new Set(collections.map((c) => c.category).filter(Boolean))].sort();
    const designers = [...new Set(collections.map((c) => {
      if (typeof c.designer === "object") return c.designer?.name || "";
      return c.designer || "";
    }).filter(Boolean))].sort();
    const seasons = [...new Set(collections.map((c) => c.season).filter(Boolean))].sort();
    return { year: years, category: categories, designer: designers, season: seasons };
  }, [collections]);

  /* ── Filtered results ───────────────────────────────────────── */
  const filtered = useMemo(() => {
    return collections.filter((c) => {
      if (filters.year !== "All" && c.year !== filters.year) return false;
      if (filters.category !== "All" && c.category !== filters.category) return false;
      if (filters.season !== "All" && c.season !== filters.season) return false;
      if (filters.designer !== "All") {
        const dName = typeof c.designer === "object" ? c.designer?.name || "" : c.designer || "";
        if (dName !== filters.designer) return false;
      }
      if (searchQuery) {
        const term = searchQuery.toLowerCase();
        const dName = typeof c.designer === "object" ? (c.designer?.name || "").toLowerCase() : (c.designer || "").toLowerCase();
        if (!c.name?.toLowerCase().includes(term) && !dName.includes(term)) return false;
      }
      return true;
    });
  }, [collections, filters, searchQuery]);

  const featured = filtered.filter((c) => c.featured);
  const regular = filtered.filter((c) => !c.featured);

  const updateFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));
  const hasActiveFilters = Object.values(filters).some((v) => v !== "All") || searchQuery;
  const resetFilters = () => {
    setFilters({ year: "All", category: "All", designer: "All", season: "All" });
    setSearchQuery("");
  };

  return (
    <div className="bg-white">

      {/* ═══ 1. HEADER ═══════════════════════════════════════════ */}
      <section className="pt-28 pb-12 bg-white border-b border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Explore</p>
          <h1 className="font-display text-4xl md:text-5xl text-charcoal-900 tracking-tight">Collections</h1>
          <p className="mt-3 text-charcoal-400 max-w-xl">
            Every collection tells a story , of craft, of place, of a designer's vision. Browse the complete archive.
          </p>
        </div>
      </section>

      {/* ═══ 2. SEARCH + FILTERS ════════════════════════════════ */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-bronze-200/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search collections…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors"
              />
            </div>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-bronze-500 hover:text-bronze-400 tracking-wider uppercase">
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {Object.entries(filterOptions).map(([key, options]) => {
              if (options.length === 0) return null;
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal-300 shrink-0">{key}:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => updateFilter(key, "All")}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border transition-all duration-200 ${
                        filters[key] === "All"
                          ? "bg-charcoal-900 text-white border-charcoal-900"
                          : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50"
                      }`}
                    >
                      All
                    </button>
                    {options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateFilter(key, opt)}
                        className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border transition-all duration-200 ${
                          filters[key] === opt
                            ? "bg-charcoal-900 text-white border-charcoal-900"
                            : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ LOADING ═════════════════════════════════════════════ */}
      {loading && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Spinner />
          </div>
        </section>
      )}

      {/* ═══ 3. FEATURED COLLECTIONS ════════════════════════════ */}
      {!loading && featured.length > 0 && (
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-2">Featured</p>
                <h2 className="font-serif text-2xl md:text-3xl text-charcoal-900 font-medium">Featured Collections</h2>
                <p className="text-sm text-charcoal-400 mt-1.5">Curated selections , collections we believe deserve your attention.</p>
              </div>
              <span className="text-xs text-charcoal-300 tracking-wider">{featured.length} collection{featured.length !== 1 && "s"}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {featured.map((c) => (
                <CollectionCard key={c._id} c={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 4. ALL OTHER COLLECTIONS ═══════════════════════════ */}
      {!loading && regular.length > 0 && (
        <section className="py-20 md:py-24 bg-white border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-2">Archive</p>
                <h2 className="font-serif text-2xl md:text-3xl text-charcoal-900 font-medium">
                  {featured.length > 0 ? "All Collections" : "Latest Collections"}
                </h2>
                <p className="text-sm text-charcoal-400 mt-1.5">
                  {featured.length > 0
                    ? "The complete archive , every published collection from our designers."
                    : "The newest work from our designers , each collection a distinct point of view."}
                </p>
              </div>
              <span className="text-xs text-charcoal-300 tracking-wider">{regular.length} collection{regular.length !== 1 && "s"}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {regular.map((c) => (
                <CollectionCard key={c._id} c={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 5. EMPTY STATE ═════════════════════════════════════ */}
      {!loading && filtered.length === 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            {hasActiveFilters ? (
              <>
                <p className="font-serif text-2xl text-charcoal-900 mb-3">No collections found</p>
                <p className="text-sm text-charcoal-400 mb-8">Try adjusting your filters or search terms.</p>
                <button onClick={resetFilters} className="px-6 py-2.5 bg-charcoal-900 text-white text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors">
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <p className="font-serif text-2xl text-charcoal-900 mb-3">No collections yet</p>
                <p className="text-sm text-charcoal-400 mb-8">Collections will appear here as designers publish their work.</p>
                <Link to="/designers" className="px-6 py-2.5 bg-charcoal-900 text-white text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors inline-block">
                  Browse Designers
                </Link>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
