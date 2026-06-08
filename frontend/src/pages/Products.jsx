import { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";

/* ── Mock data ──────────────────────────────────────────────────── */
const allProducts = [
  { id: 1, name: "Ajrak Architect Coat", designer: "Ayesha Siddiqui", price: 48000, tag: "New Arrival", category: "Outerwear", craft: "Ajrak", size: ["S", "M", "L"], image: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
  { id: 2, name: "Phulkari Reborn Blazer", designer: "Zara Hameed", price: 42000, tag: "Limited", category: "Outerwear", craft: "Phulkari", size: ["XS", "S", "M", "L"], image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
  { id: 3, name: "Khaddar Modern Suit", designer: "Hira Khan", price: 36500, tag: null, category: "Unstitched", craft: "Khaddar", size: ["S", "M", "L", "XL"], image: "/assets/images/khaddar-modern-suit-adorzia.webp" },
  { id: 4, name: "Pashmina Wrap Dress", designer: "Fatima Qureshi", price: 52000, tag: "Exclusive", category: "Ready to Wear", craft: "Pashmina", size: ["XS", "S", "M"], image: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
  { id: 5, name: "Mirrorwork Bomber Jacket", designer: "Noor & Sons", price: 44500, tag: "Bestseller", category: "Outerwear", craft: "Mirror Work", size: ["S", "M", "L", "XL"], image: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
  { id: 6, name: "Mirror Rebel Tee", designer: "Sana Javed", price: 18500, tag: null, category: "Ready to Wear", craft: "Mirror Work", size: ["XS", "S", "M", "L"], image: "/assets/images/mirror-rebel-tee-adorzia.webp" },
  { id: 7, name: "Rilli Sculpt Tote", designer: "Bilal Raza", price: 28000, tag: "Handcrafted", category: "Accessories", craft: "Rilli", size: ["One Size"], image: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
  { id: 8, name: "Indigo Quilt Cape", designer: "Ayesha Siddiqui", price: 36500, tag: null, category: "Outerwear", craft: "Rilli", size: ["S/M", "L/XL"], image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
  { id: 9, name: "Block Print Maxi Dress", designer: "Zara Hameed", price: 39000, tag: "New Arrival", category: "Ready to Wear", craft: "Block Print", size: ["XS", "S", "M", "L"], image: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
  { id: 10, name: "Chikankari Silk Blouse", designer: "Hira Khan", price: 32000, tag: null, category: "Ready to Wear", craft: "Chikankari", size: ["XS", "S", "M"], image: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
  { id: 11, name: "Ajrak Wide-Leg Trousers", designer: "Fatima Qureshi", price: 24000, tag: null, category: "Ready to Wear", craft: "Ajrak", size: ["S", "M", "L"], image: "/assets/images/khaddar-modern-suit-adorzia.webp" },
  { id: 12, name: "Heritage Clutch Box", designer: "Bilal Raza", price: 22000, tag: "Handcrafted", category: "Accessories", craft: "Block Print", size: ["One Size"], image: "/assets/images/rilli-sculpt-tote-adorzia.webp" },
  { id: 13, name: "Phulkari Cape Shawl", designer: "Noor & Sons", price: 58000, tag: "Exclusive", category: "Accessories", craft: "Phulkari", size: ["One Size"], image: "/assets/images/mirrorwork-bomber-jacket-adorzia.webp" },
  { id: 14, name: "Khaddar Oversized Shirt", designer: "Sana Javed", price: 21000, tag: null, category: "Ready to Wear", craft: "Khaddar", size: ["S", "M", "L", "XL"], image: "/assets/images/mirror-rebel-tee-adorzia.webp" },
  { id: 15, name: "Bridal Pashmina Dupatta", designer: "Ayesha Siddiqui", price: 85000, tag: "Bridal", category: "Bridal", craft: "Pashmina", size: ["One Size"], image: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
  { id: 16, name: "Rilli Patchwork Jacket", designer: "Hira Khan", price: 41000, tag: "Limited", category: "Outerwear", craft: "Rilli", size: ["S", "M", "L"], image: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
];

const categories = ["All", "Ready to Wear", "Outerwear", "Accessories", "Unstitched", "Bridal"];
const crafts = ["All", "Ajrak", "Phulkari", "Pashmina", "Khaddar", "Block Print", "Mirror Work", "Rilli", "Chikankari"];
const designers = ["All Designers", "Ayesha Siddiqui", "Zara Hameed", "Hira Khan", "Fatima Qureshi", "Noor & Sons", "Sana Javed", "Bilal Raza"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under PKR 25,000", min: 0, max: 25000 },
  { label: "PKR 25,000 – 40,000", min: 25000, max: 40000 },
  { label: "PKR 40,000 – 60,000", min: 40000, max: 60000 },
  { label: "Over PKR 60,000", min: 60000, max: Infinity },
];
const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Name: A → Z", value: "name" },
];
const PER_PAGE = 12;

/* ── Helpers ─────────────────────────────────────────────────────── */
function formatPKR(n) {
  return `PKR ${n.toLocaleString("en-PK")}`;
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
    <div className="border-b border-noir-100 pb-4 mb-4 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-1">
        <span className="text-[10px] uppercase tracking-[0.25em] text-noir-400">{title}</span>
        <Icon.Chevron className={`w-3.5 h-3.5 text-noir-400 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="mt-3 space-y-1.5">{children}</div>}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */
export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [craft, setCraft] = useState("All");
  const [designer, setDesigner] = useState("All Designers");
  const [priceIdx, setPriceIdx] = useState(0);
  const [sort, setSort] = useState("featured");
  const [cols, setCols] = useState(4);
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  /* Filter + sort */
  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.designer.toLowerCase().includes(q) || p.craft.toLowerCase().includes(q));
    }
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (craft !== "All") list = list.filter((p) => p.craft === craft);
    if (designer !== "All Designers") list = list.filter((p) => p.designer === designer);

    const range = priceRanges[priceIdx];
    list = list.filter((p) => p.price >= range.min && p.price < range.max);

    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return list;
  }, [search, category, craft, designer, priceIdx, sort]);

  /* Pagination */
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* Active filters for tags */
  const activeFilters = [
    category !== "All" ? { label: category, clear: () => { setCategory("All"); setPage(1); } } : null,
    craft !== "All" ? { label: craft, clear: () => { setCraft("All"); setPage(1); } } : null,
    designer !== "All Designers" ? { label: designer, clear: () => { setDesigner("All Designers"); setPage(1); } } : null,
    priceIdx !== 0 ? { label: priceRanges[priceIdx].label, clear: () => { setPriceIdx(0); setPage(1); } } : null,
  ].filter(Boolean);

  const clearAll = () => { setSearch(""); setCategory("All"); setCraft("All"); setDesigner("All Designers"); setPriceIdx(0); setSort("featured"); setPage(1); };

  const gridCols = { 2: "grid-cols-2", 3: "grid-cols-2 md:grid-cols-3", 4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" };

  /* ── Filter sidebar content (shared between desktop & mobile) ─── */
  const FilterContent = (
    <>
      <FilterSection title="Category">
        {categories.map((c) => (
          <button key={c} onClick={() => { setCategory(c); setPage(1); }}
            className={`block w-full text-left text-sm px-2 py-1.5 transition-colors ${category === c ? "text-noir-900 font-medium bg-stone-100" : "text-noir-500 hover:text-noir-900"}`}>
            {c}
          </button>
        ))}
      </FilterSection>

      <FilterSection title="Craft">
        {crafts.map((c) => (
          <button key={c} onClick={() => { setCraft(c); setPage(1); }}
            className={`block w-full text-left text-sm px-2 py-1.5 transition-colors ${craft === c ? "text-noir-900 font-medium bg-stone-100" : "text-noir-500 hover:text-noir-900"}`}>
            {c}
          </button>
        ))}
      </FilterSection>

      <FilterSection title="Designer">
        {designers.map((d) => (
          <button key={d} onClick={() => { setDesigner(d); setPage(1); }}
            className={`block w-full text-left text-sm px-2 py-1.5 transition-colors ${designer === d ? "text-noir-900 font-medium bg-stone-100" : "text-noir-500 hover:text-noir-900"}`}>
            {d}
          </button>
        ))}
      </FilterSection>

      <FilterSection title="Price Range">
        {priceRanges.map((r, i) => (
          <button key={r.label} onClick={() => { setPriceIdx(i); setPage(1); }}
            className={`block w-full text-left text-sm px-2 py-1.5 transition-colors ${priceIdx === i ? "text-noir-900 font-medium bg-stone-100" : "text-noir-500 hover:text-noir-900"}`}>
            {r.label}
          </button>
        ))}
      </FilterSection>
    </>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* ── Header ────────────────────────────────────────────── */}
      <section className="pt-32 md:pt-36 pb-8 bg-white border-b border-noir-100">
        <div className="max-w-[1440px] mx-auto px-6">
          <p className="section-label mb-3">Marketplace</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-5xl text-noir-900 font-medium">All Pieces</h1>
              <p className="mt-3 text-noir-400 text-sm max-w-lg">
                Heritage craft reimagined for the contemporary wardrobe — every piece tells a story of Pakistan's artisan legacy.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Icon.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search pieces, designers, crafts…"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-noir-200 bg-white focus:border-noir-900 focus:outline-none transition-colors"
              />
              {search && (
                <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon.X className="w-3.5 h-3.5 text-noir-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Toolbar ───────────────────────────────────────────── */}
      <section className="border-b border-noir-100 bg-white sticky top-16 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button onClick={() => setMobileFilters(true)} className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-noir-600 border border-noir-200 px-4 py-2 hover:border-noir-900 transition-colors">
              <Icon.Filter className="w-3.5 h-3.5" /> Filters
              {activeFilters.length > 0 && <span className="bg-noir-900 text-white text-[10px] w-4 h-4 flex items-center justify-center">{activeFilters.length}</span>}
            </button>
            <span className="text-xs text-noir-500">{filtered.length} {filtered.length === 1 ? "piece" : "pieces"}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="text-xs uppercase tracking-wider text-noir-600 bg-transparent border border-noir-200 px-3 py-2 focus:border-noir-900 focus:outline-none cursor-pointer">
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Grid toggle (desktop only) */}
            <div className="hidden md:flex items-center gap-1 border border-noir-200 px-1 py-1">
              {[
                { n: 2, icon: Icon.Grid2 },
                { n: 3, icon: Icon.Grid3 },
                { n: 4, icon: Icon.Grid4 },
              ].map(({ n, icon: I }) => (
                <button key={n} onClick={() => setCols(n)}
                  className={`p-1.5 transition-colors ${cols === n ? "text-noir-900 bg-stone-100" : "text-noir-400 hover:text-noir-600"}`}>
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
              <span key={f.label} className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-noir-700 px-3 py-1">
                {f.label}
                <button onClick={f.clear}><Icon.X className="w-3 h-3" /></button>
              </span>
            ))}
            <button onClick={clearAll} className="text-xs text-noir-400 underline hover:text-noir-900 transition-colors ml-2">
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
                <span className="text-[10px] uppercase tracking-[0.25em] text-noir-400">Refine By</span>
                <button onClick={clearAll} className="text-[10px] uppercase tracking-wider text-noir-400 hover:text-noir-900 transition-colors">Reset</button>
              </div>
              {FilterContent}
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {mobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-noir-100">
                  <span className="text-xs uppercase tracking-[0.2em] text-noir-900 font-medium">Filters</span>
                  <button onClick={() => setMobileFilters(false)}><Icon.X className="w-5 h-5 text-noir-500" /></button>
                </div>
                <div className="p-5">
                  {FilterContent}
                  <button onClick={() => setMobileFilters(false)}
                    className="w-full mt-6 bg-noir-900 text-white text-xs uppercase tracking-wider py-3 hover:bg-noir-800 transition-colors">
                    View {filtered.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-noir-400 text-sm">No pieces match your filters.</p>
                <button onClick={clearAll} className="mt-4 text-xs uppercase tracking-wider text-noir-900 underline">Reset Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid ${gridCols[cols]} gap-5 md:gap-6`}>
                  {paginated.map((p) => (
                    <ProductCard key={p.id} product={{ ...p, price: formatPKR(p.price) }} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}
                      className="px-4 py-2 text-xs uppercase tracking-wider border border-noir-200 text-noir-600 disabled:opacity-30 hover:border-noir-900 transition-colors">
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button key={n} onClick={() => setPage(n)}
                        className={`w-9 h-9 text-xs border transition-colors ${page === n ? "bg-noir-900 text-white border-noir-900" : "border-noir-200 text-noir-600 hover:border-noir-900"}`}>
                        {n}
                      </button>
                    ))}
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                      className="px-4 py-2 text-xs uppercase tracking-wider border border-noir-200 text-noir-600 disabled:opacity-30 hover:border-noir-900 transition-colors">
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
