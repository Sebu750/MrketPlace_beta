import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyProducts, deleteProduct, toggleProductStatus } from "../store/productsSlice";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconPlus = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>;
const IconGrid = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconList = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
const IconSearch = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
const IconEdit = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconMore = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
const IconEye = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconCopy = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
const IconTrash = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>;
const IconChevron = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 12 15 18 9"/></svg>;

/* ── Status Maps ──────────────────────────────────────────────────── */
const statusMap = { active: "Active", draft: "Draft", sold_out: "Sold Out", in_review: "In Review" };

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-stone-50 text-charcoal-500 border-stone-200",
  "Sold Out": "bg-red-50 text-red-600 border-red-200",
  "In Review": "bg-amber-50 text-amber-700 border-amber-200",
};

const statusFilters = ["All", "Active", "Draft", "Sold Out"];
const categoryFilters = ["All Categories", "Womenswear", "Menswear", "Unisex", "Accessories"];

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerProducts() {
  const dispatch = useDispatch();
  const { items: products, loading, total } = useSelector((s) => s.products);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All Categories");
  const [colFilter, setColFilter] = useState("All Collections");
  const [sort, setSort] = useState("newest");
  const [menuOpen, setMenuOpen] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const apiStatus = statusFilter === "Active" ? "active" : statusFilter === "Draft" ? "draft" : statusFilter === "Sold Out" ? "sold_out" : null;
    dispatch(fetchMyProducts({ status: apiStatus, category: catFilter !== "All Categories" ? catFilter : null }));
  }, [dispatch, statusFilter, catFilter]);

  /* Derive collections list from data */
  const collectionFilters = ["All Collections", ...new Set(products.map((p) => p.collection?.name || p.collectionId?.name || "").filter(Boolean))];

  /* Filtering (client-side secondary) */
  let filtered = products.map((p) => ({
    ...p,
    id: p._id,
    status: statusMap[p.status] || p.status,
    price: p.priceFormatted || `PKR ${p.price?.toLocaleString("en-PK") || "0"}`,
    priceRaw: p.price || 0,
    img: p.images?.[0] || p.coverImage || "/assets/images/placeholder.webp",
    collection: typeof p.collection === "string" ? p.collection : p.collection?.name || "",
    stock: p.totalStock ?? 0,
    sales: p.totalSold ?? 0,
    views: p.viewCount ?? 0,
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
  })).filter((p) => {
    if (colFilter !== "All Collections" && p.collection !== colFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  /* Sorting */
  if (sort === "newest") filtered.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  if (sort === "price-high") filtered.sort((a, b) => b.priceRaw - a.priceRaw);
  if (sort === "price-low") filtered.sort((a, b) => a.priceRaw - b.priceRaw);
  if (sort === "sales") filtered.sort((a, b) => b.sales - a.sales);

  const activeCount = products.filter((p) => p.status === "active").length;

  const toggleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };
  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) dispatch(deleteProduct(id));
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-charcoal-400">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Products</p>
          <h2 className="font-serif text-3xl text-charcoal-900 font-light">Manage Your Products</h2>
          <p className="text-sm text-charcoal-400 mt-1">{total} products · {activeCount} active</p>
        </div>
        <Link to="new" className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors duration-300">
          <IconPlus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* ── Filters Bar ────────────────────────────────────────── */}
      <div className="bg-white border border-stone-200 p-4 flex flex-col lg:flex-row gap-3 items-start lg:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-xs">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-300 transition-colors"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-1">
          {statusFilters.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all duration-300 border ${
                statusFilter === s ? "bg-charcoal-900 text-white border-charcoal-900" : "bg-white text-charcoal-400 border-stone-200 hover:border-charcoal-300"
              }`}>{s}</button>
          ))}
        </div>

        {/* Category */}
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="border border-stone-200 px-3 py-2 text-xs text-charcoal-600 bg-white focus:outline-none focus:border-bronze-300 appearance-none pr-8 transition-colors">
          {categoryFilters.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Collection */}
        <select value={colFilter} onChange={(e) => setColFilter(e.target.value)}
          className="border border-stone-200 px-3 py-2 text-xs text-charcoal-600 bg-white focus:outline-none focus:border-bronze-300 appearance-none pr-8 transition-colors">
          {collectionFilters.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Sort */}
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="border border-stone-200 px-3 py-2 text-xs text-charcoal-600 bg-white focus:outline-none focus:border-bronze-300 appearance-none pr-8 transition-colors">
          <option value="newest">Newest</option>
          <option value="price-high">Price: High → Low</option>
          <option value="price-low">Price: Low → High</option>
          <option value="sales">Most Sold</option>
        </select>

        {/* View toggle */}
        <div className="flex items-center border border-stone-200">
          <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "bg-charcoal-900 text-white" : "text-charcoal-400 hover:text-charcoal-900"}`}>
            <IconGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-charcoal-900 text-white" : "text-charcoal-400 hover:text-charcoal-900"}`}>
            <IconList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Bulk Actions ───────────────────────────────────────── */}
      {selected.length > 0 && (
        <div className="bg-charcoal-900 text-white px-5 py-3 flex items-center justify-between">
          <span className="text-sm">{selected.length} selected</span>
          <div className="flex items-center gap-3">
            <button className="text-[10px] uppercase tracking-[0.18em] text-ivory-300 hover:text-white transition-colors">Activate</button>
            <button className="text-[10px] uppercase tracking-[0.18em] text-ivory-300 hover:text-white transition-colors">Deactivate</button>
            <button className="text-[10px] uppercase tracking-[0.18em] text-red-400 hover:text-red-300 transition-colors">Delete</button>
          </div>
        </div>
      )}

      {/* ── Grid View ──────────────────────────────────────────── */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white border border-stone-200 group hover:border-stone-300 transition-all duration-300">
              {/* Image */}
              <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden">
                <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Status badge */}
                <span className={`absolute top-3 left-3 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border ${statusStyles[p.status]}`}>
                  {p.status}
                </span>
                {/* Actions overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1.5">
                  <Link to={`${p.id}/edit`} className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm text-charcoal-700 hover:bg-white transition-colors">
                    <IconEdit className="w-3.5 h-3.5" />
                  </Link>
                  <Link to={`/pieces/${p.id}`} className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm text-charcoal-700 hover:bg-white transition-colors">
                    <IconEye className="w-3.5 h-3.5" />
                  </Link>
                </div>
                {/* Checkbox */}
                <button onClick={() => toggleSelect(p.id)}
                  className={`absolute bottom-3 left-3 w-5 h-5 border transition-all ${
                    selected.includes(p.id) ? "bg-charcoal-900 border-charcoal-900" : "bg-white/80 border-stone-300 hover:border-charcoal-500"
                  }`}>
                  {selected.includes(p.id) && <svg className="w-full h-full text-white p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-1">{p.collection}</p>
                <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{p.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-charcoal-900 font-medium">{p.price}</span>
                  <span className="text-[10px] text-charcoal-400">Stock: {p.stock}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] text-charcoal-400">
                  <span>{p.sales} sold</span>
                  <span>{p.views} views</span>
                  <span>{p.updatedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── List View ──────────────────────────────────────────── */}
      {view === "list" && (
        <div className="bg-white border border-stone-200 divide-y divide-stone-100">
          {/* Table header */}
          <div className="px-5 py-3 flex items-center gap-4 bg-stone-50 text-[9px] uppercase tracking-[0.25em] text-charcoal-400 font-medium">
            <button onClick={toggleAll} className={`w-5 h-5 border shrink-0 flex items-center justify-center transition-all ${
              selected.length === filtered.length && filtered.length > 0 ? "bg-charcoal-900 border-charcoal-900" : "border-stone-300 hover:border-charcoal-400"
            }`}>
              {selected.length === filtered.length && filtered.length > 0 && <svg className="w-full h-full text-white p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>}
            </button>
            <span className="w-14 shrink-0">Image</span>
            <span className="flex-1 min-w-0">Product</span>
            <span className="w-24 shrink-0 hidden md:block">Category</span>
            <span className="w-24 shrink-0">Price</span>
            <span className="w-16 shrink-0 text-center">Stock</span>
            <span className="w-16 shrink-0 text-center">Sales</span>
            <span className="w-24 shrink-0">Status</span>
            <span className="w-8 shrink-0" />
          </div>

          {filtered.map((p) => (
            <div key={p.id} className="px-5 py-3.5 flex items-center gap-4 group hover:bg-stone-50/50 transition-colors">
              <button onClick={() => toggleSelect(p.id)}
                className={`w-5 h-5 border shrink-0 flex items-center justify-center transition-all ${
                  selected.includes(p.id) ? "bg-charcoal-900 border-charcoal-900" : "border-stone-300"
                }`}>
                {selected.includes(p.id) && <svg className="w-full h-full text-white p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
              <div className="w-14 h-16 shrink-0 bg-stone-50 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-85" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal-900 truncate group-hover:text-bronze-500 transition-colors">{p.name}</p>
                <p className="text-[11px] text-charcoal-400 mt-0.5">{p.collection} · {p.craft}</p>
              </div>
              <span className="w-24 shrink-0 text-xs text-charcoal-500 hidden md:block">{p.category}</span>
              <span className="w-24 shrink-0 text-sm text-charcoal-900 tabular-nums">{p.price}</span>
              <span className={`w-16 shrink-0 text-sm text-center tabular-nums ${p.stock <= 3 ? "text-red-500 font-medium" : "text-charcoal-700"}`}>{p.stock}</span>
              <span className="w-16 shrink-0 text-sm text-center text-charcoal-700 tabular-nums">{p.sales}</span>
              <span className={`w-24 shrink-0 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border text-center ${statusStyles[p.status]}`}>{p.status}</span>
              <div className="relative w-8 shrink-0">
                <button onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)} className="p-1 text-charcoal-300 hover:text-charcoal-900 transition-colors">
                  <IconMore className="w-5 h-5" />
                </button>
                {menuOpen === p.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-stone-200 shadow-lg z-20 py-1">
                      <Link to={`${p.id}/edit`} className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 hover:bg-stone-50 transition-colors"><IconEdit className="w-3.5 h-3.5" /> Edit</Link>
                      <Link to={`/pieces/${p.id}`} className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 hover:bg-stone-50 transition-colors"><IconEye className="w-3.5 h-3.5" /> View</Link>
                      <button className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 hover:bg-stone-50 transition-colors w-full"><IconCopy className="w-3.5 h-3.5" /> Duplicate</button>
                      <div className="border-t border-stone-100 my-1" />
                      <button onClick={() => handleDelete(p.id)} className="flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors w-full"><IconTrash className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white border border-stone-200">
          <p className="font-serif text-xl text-charcoal-900 mb-2">No products found</p>
          <p className="text-sm text-charcoal-400 mb-6">
            {search ? `No results for "${search}".` : "Add your first product to start selling."}
          </p>
          <Link to="new" className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors">
            <IconPlus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      )}

      {/* ── Results count ──────────────────────────────────────── */}
      {filtered.length > 0 && (
        <p className="text-[11px] text-charcoal-400 text-center">
          Showing {filtered.length} of {total} products
        </p>
      )}
    </div>
  );
}
