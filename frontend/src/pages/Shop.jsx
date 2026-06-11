import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProducts } from "../store/productsSlice";

/* ── Filter definitions ─────────────────────────────────────── */
const filterConfig = {
  designer: ["All", "Ayesha Siddiqui", "Zara Hameed", "Bilal Raza", "Noor & Sons", "Hira Khan", "Fatima Asad", "Mehreen Aslam", "Hamza Tariq", "Aleeza Noor"],
  price: ["All", "Under PKR 15,000", "PKR 15,000–30,000", "PKR 30,000–50,000", "Over PKR 50,000"],
  category: ["All", "Outerwear", "Dress", "Formal", "Pret", "Accessories"],
  craft: ["All", "Ajrak", "Phulkari", "Block Printing", "Handloom", "Sindhi Mirror Work", "Zardozi", "Ralli Quilting", "Chikankari"],
  size: ["All", "XS", "S", "M", "L", "XL", "One Size"],
  color: ["All", "Indigo", "Crimson", "Sand", "Bone", "Charcoal", "Multi", "Noir", "White", "Terracotta", "Saffron"],
};

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function Shop() {
  const dispatch = useDispatch();
  const { items: products, pagination, loading } = useSelector((s) => s.products.public);
  const [filters, setFilters] = useState({ designer: "All", price: "All", category: "All", craft: "All", size: "All", color: "All" });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "editorial"
  const [sort, setSort] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const updateFilter = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  };
  const hasActive = Object.values(filters).some((v) => v !== "All") || searchQuery;

  const resetFilters = () => {
    setFilters({ designer: "All", price: "All", category: "All", craft: "All", size: "All", color: "All" });
    setSearchQuery("");
    setPage(1);
  };

  /* Build API params from filters */
  const apiParams = useMemo(() => {
    const params = { page, limit: PER_PAGE };
    if (filters.designer !== "All") params.designer = filters.designer;
    if (filters.category !== "All") params.category = filters.category;
    if (filters.craft !== "All") params.craft = filters.craft;
    if (searchQuery) params.search = searchQuery;
    if (filters.price !== "All") {
      if (filters.price === "Under PKR 15,000") { params.priceMin = 0; params.priceMax = 15000; }
      else if (filters.price === "PKR 15,000–30,000") { params.priceMin = 15000; params.priceMax = 30000; }
      else if (filters.price === "PKR 30,000–50,000") { params.priceMin = 30000; params.priceMax = 50000; }
      else if (filters.price === "Over PKR 50,000") { params.priceMin = 50000; }
    }
    if (sort === "price-low") params.sort = "price-asc";
    else if (sort === "price-high") params.sort = "price-desc";
    else params.sort = sort;
    return params;
  }, [filters, searchQuery, sort, page]);

  /* Fetch from API */
  useEffect(() => {
    dispatch(fetchPublicProducts(apiParams));
  }, [dispatch, apiParams]);

  const fmtPrice = (n) => n ? `PKR ${Number(n).toLocaleString()}` : "";
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="bg-white min-h-screen">

      {/* ═══════════════════════════════════════════════════════════
          1. HEADER
      ═══════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-8 bg-white border-b border-bronze-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-bronze-500 mb-4">Shop</p>
          <h1 className="font-display text-4xl md:text-5xl text-charcoal-900 tracking-tight">All Products</h1>
          <p className="mt-3 text-charcoal-400 max-w-xl">Every piece on the marketplace , curated from Pakistan's emerging design talent.</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. TOOLBAR , Search, Sort, View Toggle
      ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-bronze-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search products…" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 text-charcoal-900 text-sm placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-400 transition-colors" />
          </div>

          {/* Sort */}
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 bg-white border border-stone-200 text-charcoal-500 text-sm focus:outline-none focus:border-bronze-400">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>

          {/* View toggle */}
          <div className="flex border border-stone-200 bg-white">
            <button onClick={() => setViewMode("grid")} className={`px-3 py-2 transition-colors ${viewMode === "grid" ? "bg-charcoal-900 text-white" : "text-charcoal-400 hover:text-charcoal-900"}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode("editorial")} className={`px-3 py-2 transition-colors ${viewMode === "editorial" ? "bg-charcoal-900 text-white" : "text-charcoal-400 hover:text-charcoal-900"}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>

          {/* Filter toggle (mobile) */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden px-4 py-2.5 bg-white border border-stone-200 text-charcoal-400 text-sm">
            Filters
          </button>

          {/* Result count */}
          <span className="text-xs text-charcoal-300 ml-auto">{loading ? "Loading…" : `${totalItems} product${totalItems !== 1 ? "s" : ""}`}</span>

          {hasActive && (
            <button onClick={resetFilters} className="text-xs text-bronze-500 hover:text-bronze-400 tracking-wider uppercase">Clear</button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-10">

          {/* ═══════════════════════════════════════════════════════════
              3. FILTER SIDEBAR
          ═══════════════════════════════════════════════════════════ */}
          <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
            <div className="md:sticky md:top-36 space-y-8">
              {Object.entries(filterConfig).map(([key, options]) => (
                <div key={key}>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-300 mb-3">{key}</p>
                  <div className="flex flex-col gap-1.5">
                    {options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateFilter(key, opt)}
                        className={`text-left px-3 py-1.5 text-xs tracking-wide transition-all duration-200 ${
                          filters[key] === opt
                            ? "bg-charcoal-900 text-white"
                            : "text-charcoal-400 hover:text-charcoal-900 hover:bg-stone-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════════
              4. PRODUCT GRID / EDITORIAL VIEW
          ═══════════════════════════════════════════════════════════ */}
          <div className="flex-1">
            {loading ? (
              <div className="py-24 text-center">
                <p className="text-sm text-charcoal-400">Loading products…</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-serif text-2xl text-charcoal-900 mb-3">No products found</p>
                <p className="text-sm text-charcoal-400 mb-8">Try adjusting your filters or search terms.</p>
                <button onClick={resetFilters} className="px-6 py-2.5 bg-charcoal-900 text-white text-xs uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* ── GRID VIEW ── */
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => (
                  <Link key={p._id || p.id} to={`/pieces/${p.slug || p._id || p.id}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
                      <img src={p.images?.[0] || p.img || "/assets/images/placeholder.webp"} alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] uppercase tracking-[0.15em] bg-white/70 backdrop-blur-sm text-charcoal-500 px-2 py-0.5">{p.craft}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-bronze-500/60 mb-1">{p.designer?.name || p.designer}</p>
                      <h3 className="font-serif text-sm text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{p.name}</h3>
                      <p className="text-xs text-charcoal-400 mt-1">{fmtPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* ── EDITORIAL VIEW ── */
              <div className="space-y-8">
                {products.map((p) => (
                  <Link key={p._id || p.id} to={`/pieces/${p.slug || p._id || p.id}`} className="group block">
                    <div className="flex flex-col md:flex-row gap-6 border border-stone-100 bg-white p-5 hover:border-bronze-300/50 transition-colors duration-300">
                      <div className="shrink-0 w-full md:w-48 aspect-[3/4] overflow-hidden bg-stone-50">
                        <img src={p.images?.[0] || p.img || "/assets/images/placeholder.webp"} alt={p.name}
                          className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-bronze-500 mb-2">{p.craft}</p>
                          <h3 className="font-serif text-xl text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{p.name}</h3>
                          <p className="text-sm text-charcoal-400 mt-1">{p.designer?.name || p.designer}{p.collection ? ` , ${p.collection.name || p.collection}` : ""}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          <span className="font-serif text-lg text-charcoal-900">{fmtPrice(p.price)}</span>
                          <span className="text-xs text-charcoal-300">{p.category}</span>
                          <div className="flex gap-1">
                            {(p.sizes || []).map((s) => (
                              <span key={s} className="text-[10px] text-charcoal-300 border border-stone-200 px-2 py-0.5">{s}</span>
                            ))}
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-bronze-500 ml-auto">View →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
