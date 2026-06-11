import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicProducts } from "../store/productsSlice";
import ProductCard from "../components/ProductCard";

const PER_PAGE = 24;

/* ── Helpers ─────────────────────────────────────────────────────── */
function formatPKR(n) {
  return n ? `PKR ${Number(n).toLocaleString("en-PK")}` : "";
}

/* ── Icons (inline SVG) ──────────────────────────────────────────── */
const Icon = {
  Search: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>,
  Grid2: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><rect x="3" y="3" width="7" height="18"/><rect x="14" y="3" width="7" height="18"/></svg>,
  Grid3: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><rect x="3" y="3" width="5" height="18"/><rect x="9.5" y="3" width="5" height="18"/><rect x="16" y="3" width="5" height="18"/></svg>,
  Grid4: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><rect x="2" y="3" width="4" height="18"/><rect x="7.5" y="3" width="4" height="18"/><rect x="13" y="3" width="4" height="18"/><rect x="18.5" y="3" width="4" height="18"/></svg>,
  Filter: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><path d="M3 4h18M6 8h12M9 12h6M11 16h2"/></svg>,
  X: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Chevron: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><path d="m6 9 6 6 6-6"/></svg>,
  Sliders: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...p}><path d="M4 6h10M4 12h6M4 18h10M18 6v12M14 12v6M14 6v2M18 18v-2"/></svg>,
};

/* ── Filter Section (collapsible) ────────────────────────────────── */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-100 pb-4 mb-4 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-1">
        <span className="text-[10px] uppercase tracking-[0.25em] text-charcoal-300">{title}</span>
        <Icon.Chevron className={`w-3.5 h-3.5 text-charcoal-300 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="mt-3 space-y-1.5">{children}</div>}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */
export default function Products() {
  const dispatch = useDispatch();
  const { items: products, pagination, loading } = useSelector((s) => s.products.public);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [craft, setCraft] = useState("");
  const [designer, setDesigner] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("");
  const [cols, setCols] = useState(4);
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  /* Fetch from API on mount and when filters change */
  useEffect(() => {
    dispatch(fetchPublicProducts({
      category: category || undefined,
      craft: craft || undefined,
      designer: designer || undefined,
      search: search || undefined,
      priceMin: priceMin || undefined,
      priceMax: priceMax || undefined,
      sort: sort || undefined,
      page,
      limit: PER_PAGE,
    }));
  }, [dispatch, search, category, craft, designer, priceMin, priceMax, sort, page]);

  /* Active filters for tags */
  const activeFilters = [
    category ? { label: category, clear: () => { setCategory(""); setPage(1); } } : null,
    craft ? { label: craft, clear: () => { setCraft(""); setPage(1); } } : null,
    designer ? { label: designer, clear: () => { setDesigner(""); setPage(1); } } : null,
    priceMin || priceMax ? { label: `PKR ${priceMin || "0"} – ${priceMax || "∞"}`, clear: () => { setPriceMin(""); setPriceMax(""); setPage(1); } } : null,
  ].filter(Boolean);

  const clearAll = () => { setSearch(""); setCategory(""); setCraft(""); setDesigner(""); setPriceMin(""); setPriceMax(""); setSort(""); setPage(1); };

  const sortOptions = [
    { label: "Featured", value: "" },
    { label: "Newest", value: "newest" },
    { label: "Price: Low → High", value: "price-asc" },
    { label: "Price: High → Low", value: "price-desc" },
  ];

  const gridCols = { 2: "grid-cols-2", 3: "grid-cols-2 md:grid-cols-3", 4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" };

  /* ── Filter sidebar content (shared between desktop & mobile) ─── */
  const FilterContent = (
    <>
      <FilterSection title="Category">
        {(["", "Ready to Wear", "Outerwear", "Accessories", "Unstitched", "Bridal"]).map((c) => (
          <button key={c || "all"} onClick={() => { setCategory(c); setPage(1); }}
            className={`block w-full text-left text-sm px-2 py-1.5 transition-colors ${category === c ? "text-charcoal-900 font-medium bg-stone-100" : "text-charcoal-300 hover:text-charcoal-900"}`}>
            {c || "All"}
          </button>
        ))}
      </FilterSection>

      <FilterSection title="Craft">
        {(["", "Ajrak", "Phulkari", "Pashmina", "Khaddar", "Block Print", "Mirror Work", "Rilli", "Chikankari"]).map((c) => (
          <button key={c || "all"} onClick={() => { setCraft(c); setPage(1); }}
            className={`block w-full text-left text-sm px-2 py-1.5 transition-colors ${craft === c ? "text-charcoal-900 font-medium bg-stone-100" : "text-charcoal-300 hover:text-charcoal-900"}`}>
            {c || "All"}
          </button>
        ))}
      </FilterSection>

      <FilterSection title="Designer">
        {(["", "Ayesha Siddiqui", "Zara Hameed", "Hira Khan", "Fatima Qureshi", "Noor & Sons", "Sana Javed", "Bilal Raza"]).map((d) => (
          <button key={d || "all"} onClick={() => { setDesigner(d); setPage(1); }}
            className={`block w-full text-left text-sm px-2 py-1.5 transition-colors ${designer === d ? "text-charcoal-900 font-medium bg-stone-100" : "text-charcoal-300 hover:text-charcoal-900"}`}>
            {d || "All Designers"}
          </button>
        ))}
      </FilterSection>

      <FilterSection title="Price Range">
        <input type="number" placeholder="Min" value={priceMin} onChange={(e) => { setPriceMin(e.target.value); setPage(1); }}
          className="w-full mb-2 px-3 py-2 text-sm border border-stone-200 bg-white focus:border-charcoal-900 focus:outline-none" />
        <input type="number" placeholder="Max" value={priceMax} onChange={(e) => { setPriceMax(e.target.value); setPage(1); }}
          className="w-full px-3 py-2 text-sm border border-stone-200 bg-white focus:border-charcoal-900 focus:outline-none" />
      </FilterSection>
    </>
  );

  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="bg-white min-h-screen">
      {/* ── Header ────────────────────────────────────────────── */}
      <section className="pt-32 md:pt-36 pb-8 bg-white border-b border-stone-100">
        <div className="max-w-[1440px] mx-auto px-6">
          <p className="section-label mb-3">Marketplace</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-5xl text-charcoal-900 font-medium">All Pieces</h1>
              <p className="mt-3 text-charcoal-300 text-sm max-w-lg">
                Heritage craft reimagined for the contemporary wardrobe , every piece tells a story of Pakistan's artisan legacy.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Icon.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search pieces, designers, crafts…"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 bg-white focus:border-charcoal-900 focus:outline-none transition-colors"
              />
              {search && (
                <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon.X className="w-3.5 h-3.5 text-charcoal-300" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Toolbar ───────────────────────────────────────────── */}
      <section className="border-b border-stone-100 bg-white sticky top-16 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button onClick={() => setMobileFilters(true)} className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-charcoal-500 border border-stone-200 px-4 py-2 hover:border-charcoal-900 transition-colors">
              <Icon.Filter className="w-3.5 h-3.5" /> Filters
              {activeFilters.length > 0 && <span className="bg-charcoal-900 text-white text-[10px] w-4 h-4 flex items-center justify-center">{activeFilters.length}</span>}
            </button>
            <span className="text-xs text-charcoal-400">{loading ? "Loading…" : `${totalItems} ${totalItems === 1 ? "piece" : "pieces"}`}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="text-xs uppercase tracking-wider text-charcoal-500 bg-transparent border border-stone-200 px-3 py-2 focus:border-charcoal-900 focus:outline-none cursor-pointer">
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Grid toggle (desktop only) */}
            <div className="hidden md:flex items-center gap-1 border border-stone-200 px-1 py-1">
              {[
                { n: 2, icon: Icon.Grid2 },
                { n: 3, icon: Icon.Grid3 },
                { n: 4, icon: Icon.Grid4 },
              ].map(({ n, icon: I }) => (
                <button key={n} onClick={() => setCols(n)}
                  className={`p-1.5 transition-colors ${cols === n ? "text-charcoal-900 bg-stone-100" : "text-charcoal-300 hover:text-charcoal-500"}`}>
                  <I className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active filter tags */}
        {activeFilters.length > 0 && (
          <div className="max-w-[1440px] mx-auto px-6 pb-3 flex flex-wrap items-center gap-2">
            {activeFilters.map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-charcoal-700 px-3 py-1">
                {f.label}
                <button onClick={f.clear}><Icon.X className="w-3 h-3" /></button>
              </span>
            ))}
            <button onClick={clearAll} className="text-xs text-charcoal-300 underline hover:text-charcoal-900 transition-colors ml-2">
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* ── Content ───────────────────────────────────────────── */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1440px] mx-auto px-6 pt-8 flex gap-10">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-36">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-charcoal-300">Refine By</span>
                <button onClick={clearAll} className="text-[10px] uppercase tracking-wider text-charcoal-300 hover:text-charcoal-900 transition-colors">Reset</button>
              </div>
              {FilterContent}
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {mobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-stone-100">
                  <span className="text-xs uppercase tracking-[0.2em] text-charcoal-900 font-medium">Filters</span>
                  <button onClick={() => setMobileFilters(false)}><Icon.X className="w-5 h-5 text-charcoal-400" /></button>
                </div>
                <div className="p-5">
                  {FilterContent}
                  <button onClick={() => setMobileFilters(false)}
                    className="w-full mt-6 bg-charcoal-900 text-white text-xs uppercase tracking-wider py-3 hover:bg-charcoal-800 transition-colors">
                    View {filtered.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-24">
                <p className="text-charcoal-300 text-sm">Loading pieces…</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-charcoal-300 text-sm">No pieces match your filters.</p>
                <button onClick={clearAll} className="mt-4 text-xs uppercase tracking-wider text-charcoal-900 underline">Reset Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid ${gridCols[cols]} gap-5 md:gap-6`}>
                  {products.map((p) => (
                    <ProductCard key={p._id || p.id} product={{ ...p, price: formatPKR(p.price) }} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
