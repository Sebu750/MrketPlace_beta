import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicDesigners } from "../store/designerSlice";
import { Spinner } from "../components/Skeleton";

/* ── Filter categories ──────────────────────────────────────────── */
const categories = [
  "All", "Womenswear", "Menswear", "Luxury", "Contemporary", "Bridal", "Pret", "Streetwear", "Accessories",
];

/* ── Designer Card ─────────────────────────────────────────────── */
function DesignerCard({ d, featured = false, emerging = false }) {
  const name = d.name || "";
  const city = d.studioCity || d.city || "";
  const cats = Array.isArray(d.category) ? d.category : (d.category ? [d.category] : []);
  const bio = d.bio || "";
  const slug = d.slug || d._id || "";
  const avatar = d.logo || d.avatar || d.profileImage || "";
  const collections = d.collectionCount || d.collections || 0;

  return (
    <Link to={`/${slug}`} className="group block hover-lift">
      {featured ? (
        /* Featured Card — editorial, large */
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
          {avatar ? (
            <img src={avatar} alt={name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200 flex items-center justify-center">
              <span className="font-display text-6xl text-charcoal-200">{name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent" />
          {featured && (
            <div className="absolute top-4 left-4">
              <span className="text-[9px] uppercase tracking-[0.2em] bg-bronze-300 text-charcoal-950 px-2.5 py-1 font-medium">Featured</span>
            </div>
          )}
          {cats.length > 0 && (
            <div className="absolute top-4 right-4 flex flex-col gap-1.5">
              {cats.slice(0, 2).map((cat) => (
                <span key={cat} className="text-[9px] uppercase tracking-[0.15em] bg-white/60 backdrop-blur-sm text-charcoal-700 px-2 py-0.5 text-right">{cat}</span>
              ))}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end gap-3">
              {avatar && (
                <img src={avatar} alt={name} className="w-11 h-11 rounded-full object-cover border-2 border-charcoal-950/50 shrink-0" loading="lazy" />
              )}
              <div>
                <h3 className="font-serif text-lg text-white group-hover:text-bronze-400 transition-colors duration-300">{name}</h3>
                <p className="text-xs text-ivory-300 mt-0.5">{city}{collections > 0 && ` · ${collections} collection${collections !== 1 ? "s" : ""}`}</p>
              </div>
            </div>
            {bio && <p className="text-xs text-stone-400 mt-3 leading-relaxed line-clamp-2">{bio}</p>}
          </div>
        </div>
      ) : (
        /* Emerging Card — lighter, editorial */
        <div className="bg-white border border-stone-100 hover:border-bronze-300/50 transition-all duration-300">
          <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
            {avatar ? (
              <img src={avatar} alt={name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.05]" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200 flex items-center justify-center">
                <span className="font-display text-5xl text-charcoal-200">{name.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
            {emerging && (
              <div className="absolute top-3 left-3">
                <span className="text-[9px] uppercase tracking-[0.2em] bg-charcoal-900 text-white px-2.5 py-1 font-medium">New</span>
              </div>
            )}
            {d.verified && (
              <div className="absolute top-3 right-3">
                <span className="text-[9px] uppercase tracking-[0.15em] bg-white/70 backdrop-blur-sm text-bronze-500 px-2 py-0.5 border border-stone-200/50">Verified</span>
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{name}</h3>
            <p className="text-xs text-charcoal-300 mt-0.5">{city}{collections > 0 && ` · ${collections} collection${collections !== 1 ? "s" : ""}`}</p>
            {cats.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {cats.slice(0, 3).map((cat) => (
                  <span key={cat} className="text-[10px] uppercase tracking-wider text-bronze-500/70 border border-stone-100 px-2 py-0.5">{cat}</span>
                ))}
              </div>
            )}
            {bio && <p className="text-sm text-charcoal-400 mt-3 leading-relaxed line-clamp-2">{bio}</p>}
            <span className="inline-flex items-center gap-1.5 text-xs text-bronze-500 mt-4 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View Profile
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function DesignerDirectory() {
  const dispatch = useDispatch();
  const { items: designers, pagination, loading } = useSelector((s) => s.designer.public);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const updateCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  /* Build API params */
  const apiParams = useMemo(() => {
    const params = { page, limit: PER_PAGE };
    if (activeCategory !== "All") params.category = activeCategory;
    if (search) params.search = search;
    return params;
  }, [search, activeCategory, page]);

  /* Fetch from API */
  useEffect(() => {
    dispatch(fetchPublicDesigners(apiParams));
  }, [dispatch, apiParams]);

  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  /* Featured = verified designers, Emerging = non-verified */
  const featured = designers.filter((d) => d.verified);
  const emerging = designers.filter((d) => !d.verified);

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════
          1. PAGE HEADER
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-white border-b border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Discover</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-charcoal-900 leading-tight">
            Designers
          </h1>
          <p className="mt-5 text-charcoal-400 max-w-xl leading-relaxed">
            Emerging Pakistani fashion talent , every designer on Adorzia has been curated for craft quality, design vision, and creative ambition.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <div className="inline-flex items-baseline gap-2 border border-bronze-300/50 bg-ivory-50 px-5 py-3">
              <span className="font-serif text-2xl text-bronze-500">{loading ? "…" : totalItems}</span>
              <span className="text-xs text-charcoal-400 uppercase tracking-wider">Designers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. SEARCH + CATEGORY FILTERS — sticky
      ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-bronze-200/50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top row: search */}
          <div className="flex items-center gap-4 py-4">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search designers…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-white border border-stone-200/70 text-charcoal-900 text-sm pl-10 pr-4 py-2.5 placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors"
              />
              {search && (
                <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-700">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-xs text-charcoal-300 hidden sm:block">
              {loading ? "Loading…" : `${totalItems} result${totalItems !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 pb-4 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateCategory(cat)}
                className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.15em] border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-charcoal-900 text-white border-charcoal-900"
                    : "bg-white text-charcoal-400 border-stone-200 hover:border-bronze-400/50 hover:text-charcoal-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          LOADING STATE
      ═══════════════════════════════════════════════════════════ */}
      {loading && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Spinner />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          3. FEATURED DESIGNERS
      ═══════════════════════════════════════════════════════════ */}
      {!loading && featured.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-bronze-300 rounded-full" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-bronze-500">Featured Designers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((d) => (
                <DesignerCard key={d._id} d={d} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          4. EMERGING DESIGNERS
      ═══════════════════════════════════════════════════════════ */}
      {!loading && emerging.length > 0 && (
        <section className="py-16 md:py-20 bg-stone-50 border-t border-bronze-200/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 bg-bronze-300 rounded-full animate-pulse" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-bronze-500">Emerging Designers</p>
            </div>
            <p className="text-sm text-charcoal-400 mb-10 max-w-lg">
              New talent just launching on Adorzia , be the first to discover their work.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emerging.map((d) => (
                <DesignerCard key={d._id} d={d} emerging />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          5. EMPTY STATE
      ═══════════════════════════════════════════════════════════ */}
      {!loading && designers.length === 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-serif text-2xl text-charcoal-400 mb-2">No designers found</p>
            <p className="text-sm text-charcoal-300">Try adjusting your search or category filter</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-6 text-xs uppercase tracking-wider text-bronze-500 hover:text-bronze-400 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          6. PAGINATION
      ═══════════════════════════════════════════════════════════ */}
      {!loading && totalPages > 1 && (
        <section className="py-10 bg-white border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}
              className="px-4 py-2 text-xs uppercase tracking-wider border border-stone-200 text-charcoal-500 disabled:opacity-30 hover:border-charcoal-900 transition-colors">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-9 h-9 text-xs border transition-colors ${page === n ? "bg-charcoal-900 text-white border-charcoal-900" : "border-stone-200 text-charcoal-500 hover:border-charcoal-900"}`}>
                {n}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
              className="px-4 py-2 text-xs uppercase tracking-wider border border-stone-200 text-charcoal-500 disabled:opacity-30 hover:border-charcoal-900 transition-colors">
              Next
            </button>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          7. DESIGNER APPLICATION CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white border-t border-bronze-200/40">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Open Call</p>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal-900 font-medium leading-tight mb-6">
            Are you the next<br /><span className="italic text-bronze-500">name on this list?</span>
          </h2>
          <p className="text-charcoal-400 leading-relaxed max-w-lg mx-auto mb-10">
            Adorzia is actively seeking emerging Pakistani fashion talent , from final-year students
            to independent creatives ready for their first international showcase.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/designer/register" className="bg-charcoal-900 text-white px-8 py-3 text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors">
              Apply to Join
            </Link>
            <Link to="/designer/plans" className="border border-bronze-400 text-charcoal-700 px-8 py-3 text-xs uppercase tracking-[0.18em] hover:bg-ivory-50 transition-colors">
              View Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
