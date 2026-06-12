import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCrafts } from "../store/craftsSlice";
import { Spinner } from "../components/Skeleton";

/* ════════════════════════════════════════════════════════════════
   CRAFTS ARCHIVE — Pakistan's living craft heritage, real data
════════════════════════════════════════════════════════════════ */
export default function CraftsArchive() {
  const dispatch = useDispatch();
  const { items: crafts, pagination, loading } = useSelector((s) => s.crafts.list);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    dispatch(fetchCrafts(params));
  }, [dispatch, search]);

  const totalCrafts = pagination?.total ?? crafts.length;

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. HEADER
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-12 bg-white border-b border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Heritage</p>
          <h1 className="font-display text-4xl md:text-5xl text-charcoal-900 tracking-tight">Crafts Archive</h1>
          <p className="mt-4 text-charcoal-400 max-w-2xl leading-relaxed">
            Pakistan's textile heritage stretches back millennia. This archive documents the living craft traditions
            that our designers work with, each one sustained by artisans who have practiced these techniques for generations.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search craft traditions..."
                className="w-full border border-stone-200 bg-white px-4 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:border-bronze-400 focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-500 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. CRAFT GRID
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">

          {/* Loading state */}
          {loading && (
            <Spinner />
          )}

          {/* Empty state */}
          {!loading && crafts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-charcoal-900 mb-3">
                {search ? "No craft traditions found" : "Craft archive coming soon"}
              </p>
              <p className="text-sm text-charcoal-400">
                {search ? `No results for "${search}". Try a different search term.` : "Our heritage archive is being curated. Check back soon."}
              </p>
            </div>
          )}

          {/* Craft grid */}
          {!loading && crafts.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-10">
                <span className="text-xs text-charcoal-300 uppercase tracking-wider">
                  {totalCrafts} tradition{totalCrafts !== 1 && "s"} documented
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crafts.map((craft) => (
                  <Link key={craft.slug || craft._id} to={`/crafts/${craft.slug}`} className="group block hover-lift">
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                      {craft.coverImage ? (
                        <img
                          src={craft.coverImage}
                          alt={craft.name}
                          loading="lazy" decoding="async"
                          className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:opacity-90 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-100 flex items-center justify-center">
                          <span className="font-display text-4xl text-stone-300">{craft.name?.[0]}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-bronze-400/70 mb-1">{craft.era}</p>
                        <h2 className="font-serif text-2xl text-white group-hover:text-bronze-400 transition-colors duration-300">
                          {craft.name}
                        </h2>
                        <p className="text-xs text-ivory-300 mt-1">{craft.region}</p>
                      </div>
                    </div>
                    <div className="mt-5 px-1">
                      <p className="text-sm text-charcoal-400 italic leading-relaxed">{craft.tagline}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <span className="text-[10px] uppercase tracking-wider text-charcoal-300">
                          {craft.designerCount ?? 0} designer{(craft.designerCount ?? 0) !== 1 && "s"}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-[10px] uppercase tracking-wider text-charcoal-300">
                          {craft.productCount ?? 0} product{(craft.productCount ?? 0) !== 1 && "s"}
                        </span>
                        <span className="ml-auto text-[10px] uppercase tracking-wider text-bronze-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. MISSION STATEMENT
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-stone-50 border-t border-bronze-200/40">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-6">Why This Matters</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-medium leading-tight">
            Preserving What Mass Production
            <br />
            <span className="italic text-bronze-500">Cannot Replicate</span>
          </h2>
          <p className="mt-8 text-charcoal-400 leading-relaxed max-w-xl mx-auto">
            Every craft tradition in this archive is a living practice, sustained by specific artisans in specific communities.
            When a designer uses these techniques, they're not referencing heritage, they're funding its continuation.
            This is what makes Adorzia different: provenance, not appropriation.
          </p>
        </div>
      </section>
    </div>
  );
}
