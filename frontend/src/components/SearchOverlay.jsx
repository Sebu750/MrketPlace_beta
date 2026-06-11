import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPublicProducts } from "../store/productsSlice";
import { fetchPublicCollections } from "../store/collectionsSlice";
import { fetchPublicDesigners } from "../store/designerSlice";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);
const IconX = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconArrow = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ── Quick searches ────────────────────────────────────────────────── */
const quickSearches = [
  { label: "New Arrivals", search: "new" },
  { label: "Ajrak", search: "ajrak" },
  { label: "Bridal", search: "bridal" },
  { label: "Chikankari", search: "chikankari" },
];

/* ── Tab definitions ───────────────────────────────────────────────── */
const TABS = ["All", "Products", "Collections", "Designers"];

/* ═════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  /* ── Redux state ──────────────────────────────────────────────────── */
  const { items: products, loading: productsLoading } = useSelector((s) => s.products.public);
  const { items: collections, loading: collectionsLoading } = useSelector((s) => s.collections.public);
  const { items: designers, loading: designersLoading } = useSelector((s) => s.designer.public);
  const loading = productsLoading || collectionsLoading || designersLoading;

  /* ── Debounce 400ms ──────────────────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  /* ── Fire searches when debounced changes ────────────────────────── */
  useEffect(() => {
    if (debounced.length >= 2) {
      dispatch(fetchPublicProducts({ search: debounced, limit: 12 }));
      dispatch(fetchPublicCollections({ search: debounced, limit: 8 }));
      dispatch(fetchPublicDesigners({ search: debounced, limit: 8 }));
    }
  }, [debounced, dispatch]);

  /* ── Focus input when opened ──────────────────────────────────────── */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
      setQuery("");
      setDebounced("");
      setActiveTab("All");
    }
  }, [open]);

  /* ── Escape key ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* ── Lock body scroll ─────────────────────────────────────────────── */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleQuickSearch = useCallback((term) => {
    setQuery(term);
    setDebounced(term);
    dispatch(fetchPublicProducts({ search: term, limit: 12 }));
    dispatch(fetchPublicCollections({ search: term, limit: 8 }));
    dispatch(fetchPublicDesigners({ search: term, limit: 8 }));
  }, [dispatch]);

  if (!open) return null;

  const hasResults = debounced.length >= 2 && (products.length > 0 || collections.length > 0 || designers.length > 0);
  const showEmpty = debounced.length >= 2 && !loading && !hasResults;

  return (
    <div className="fixed inset-0 z-[100] bg-white/97 backdrop-blur-xl flex flex-col">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="w-full border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-5">
          <IconSearch className="w-5 h-5 text-charcoal-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, collections, designers…"
            className="flex-1 bg-transparent text-charcoal-900 font-serif text-xl md:text-2xl font-light placeholder:text-charcoal-300 outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(""); setDebounced(""); }} className="p-2 text-charcoal-300 hover:text-charcoal-700 transition-colors">
              <IconX className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-charcoal-400 hover:text-charcoal-900 transition-colors duration-300"
            aria-label="Close search"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      {debounced.length >= 2 && (
        <div className="w-full border-b border-stone-100">
          <div className="max-w-5xl mx-auto px-6 flex gap-6">
            {TABS.map((tab) => {
              const count = tab === "Products" ? products.length : tab === "Collections" ? collections.length : tab === "Designers" ? designers.length : products.length + collections.length + designers.length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-[11px] uppercase tracking-[0.2em] border-b-2 transition-all duration-300 ${
                    activeTab === tab
                      ? "border-charcoal-900 text-charcoal-900"
                      : "border-transparent text-charcoal-400 hover:text-charcoal-700"
                  }`}
                >
                  {tab}{count > 0 && <span className="ml-1.5 text-[10px] text-charcoal-300">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Before search — suggestions */}
          {debounced.length < 2 && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mb-6 font-medium">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {quickSearches.map((q) => (
                    <button
                      key={q.search}
                      onClick={() => handleQuickSearch(q.search)}
                      className="px-4 py-2 border border-stone-200 text-xs text-charcoal-600 hover:border-charcoal-400 hover:text-charcoal-900 transition-all duration-300"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>

                <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mb-5 mt-12 font-medium">Browse</p>
                <div className="space-y-3">
                  {[
                    { label: "Shop All Products", to: "/shop" },
                    { label: "Collections Archive", to: "/collections" },
                    { label: "Designers", to: "/designers" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={onClose}
                      className="group flex items-center justify-between py-3 border-b border-stone-100 hover:border-charcoal-300 transition-colors duration-300"
                    >
                      <span className="font-serif text-lg text-charcoal-800 font-light">{item.label}</span>
                      <IconArrow className="w-4 h-4 text-charcoal-300 group-hover:text-charcoal-900 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="md:w-56 md:border-l md:border-stone-200 md:pl-8">
                <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mb-5 font-medium">Quick Navigate</p>
                <div className="space-y-2">
                  {[
                    { label: "New Arrivals", to: "/shop?sort=newest" },
                    { label: "Featured Collections", to: "/collections" },
                    { label: "Featured Designers", to: "/designers" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={onClose}
                      className="block text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors duration-300 py-1"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && debounced.length >= 2 && (
            <div className="py-20 text-center">
              <p className="font-serif text-xl text-charcoal-400 font-light">Searching…</p>
            </div>
          )}

          {/* Results — All Tab */}
          {!loading && debounced.length >= 2 && (activeTab === "All") && (
            <div className="space-y-16">
              {/* Products */}
              {products.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal-400 font-medium">
                      Products ({products.length})
                    </p>
                    <Link
                      to={`/shop?search=${encodeURIComponent(debounced)}`}
                      onClick={onClose}
                      className="text-[10px] uppercase tracking-[0.25em] text-charcoal-700 hover:text-charcoal-900 border-b border-charcoal-300 pb-0.5 transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products.slice(0, 8).map((product) => (
                      <ProductResult key={product._id} product={product} onClose={onClose} />
                    ))}
                  </div>
                </section>
              )}

              {/* Collections */}
              {collections.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal-400 font-medium">
                      Collections ({collections.length})
                    </p>
                    <Link
                      to={`/collections?search=${encodeURIComponent(debounced)}`}
                      onClick={onClose}
                      className="text-[10px] uppercase tracking-[0.25em] text-charcoal-700 hover:text-charcoal-900 border-b border-charcoal-300 pb-0.5 transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {collections.slice(0, 4).map((c) => (
                      <CollectionResult key={c._id} collection={c} onClose={onClose} />
                    ))}
                  </div>
                </section>
              )}

              {/* Designers */}
              {designers.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal-400 font-medium">
                      Designers ({designers.length})
                    </p>
                    <Link
                      to={`/designers?search=${encodeURIComponent(debounced)}`}
                      onClick={onClose}
                      className="text-[10px] uppercase tracking-[0.25em] text-charcoal-700 hover:text-charcoal-900 border-b border-charcoal-300 pb-0.5 transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {designers.slice(0, 6).map((d) => (
                      <DesignerResult key={d._id} designer={d} onClose={onClose} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Results — Products Tab */}
          {!loading && debounced.length >= 2 && activeTab === "Products" && (
            products.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal-400 font-medium">
                    {products.length} product{products.length !== 1 && "s"} for "{debounced}"
                  </p>
                  <Link to={`/shop?search=${encodeURIComponent(debounced)}`} onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.25em] text-charcoal-700 hover:text-charcoal-900 border-b border-charcoal-300 pb-0.5 transition-colors">
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <ProductResult key={product._id} product={product} onClose={onClose} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState term={debounced} />
            )
          )}

          {/* Results — Collections Tab */}
          {!loading && debounced.length >= 2 && activeTab === "Collections" && (
            collections.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal-400 font-medium">
                    {collections.length} collection{collections.length !== 1 && "s"} for "{debounced}"
                  </p>
                  <Link to={`/collections?search=${encodeURIComponent(debounced)}`} onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.25em] text-charcoal-700 hover:text-charcoal-900 border-b border-charcoal-300 pb-0.5 transition-colors">
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {collections.map((c) => (
                    <CollectionResult key={c._id} collection={c} onClose={onClose} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState term={debounced} />
            )
          )}

          {/* Results — Designers Tab */}
          {!loading && debounced.length >= 2 && activeTab === "Designers" && (
            designers.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal-400 font-medium">
                    {designers.length} designer{designers.length !== 1 && "s"} for "{debounced}"
                  </p>
                  <Link to={`/designers?search=${encodeURIComponent(debounced)}`} onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.25em] text-charcoal-700 hover:text-charcoal-900 border-b border-charcoal-300 pb-0.5 transition-colors">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {designers.map((d) => (
                    <DesignerResult key={d._id} designer={d} onClose={onClose} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState term={debounced} />
            )
          )}

          {/* Empty state */}
          {showEmpty && <EmptyState term={debounced} />}
        </div>
      </div>
    </div>
  );
}

/* ── Product Result Card ─────────────────────────────────────────── */
function ProductResult({ product, onClose }) {
  const img = product.gallery?.[0] || product.images?.[0]?.url || "";
  const designerName = typeof product.designer === "object" ? product.designer?.name || "" : product.designer || "";
  const price = product.priceFormatted || (typeof product.price === "number" ? `PKR ${product.price.toLocaleString()}` : product.price || "");

  return (
    <Link to={`/pieces/${product.slug || product._id}`} onClick={onClose} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ivory-50 to-stone-100">
            <span className="font-display text-3xl text-charcoal-200">{product.name?.charAt(0) || "P"}</span>
          </div>
        )}
      </div>
      <div className="pt-3">
        {designerName && <p className="text-[10px] text-charcoal-400 mt-0.5 tracking-wide">{designerName}</p>}
        <h3 className="font-serif text-sm text-charcoal-900 line-clamp-1 group-hover:text-bronze-500 transition-colors">{product.name}</h3>
        {price && <p className="text-xs text-charcoal-500 mt-1">{price}</p>}
      </div>
    </Link>
  );
}

/* ── Collection Result Card ──────────────────────────────────────── */
function CollectionResult({ collection, onClose }) {
  const img = collection.coverImage || "";
  const designerName = typeof collection.designer === "object" ? collection.designer?.name || "" : collection.designer || "";

  return (
    <Link to={`/collections/${collection.slug || collection._id}`} onClick={onClose} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {img ? (
          <img src={img} alt={collection.name} className="absolute inset-0 w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ivory-50 via-stone-100 to-stone-200 flex items-center justify-center">
            <span className="font-display text-4xl text-charcoal-200">{collection.name?.charAt(0) || "C"}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-bronze-400/70 mb-0.5">
            {collection.season || ""} {collection.year ? `, ${collection.year}` : ""}
          </p>
          <h3 className="font-serif text-sm text-white group-hover:text-bronze-400 transition-colors">{collection.name}</h3>
          {designerName && <p className="text-[10px] text-ivory-300 mt-0.5">{designerName}</p>}
        </div>
      </div>
    </Link>
  );
}

/* ── Designer Result Row ─────────────────────────────────────────── */
function DesignerResult({ designer, onClose }) {
  const name = designer.name || "";
  const city = designer.city || "";
  const category = designer.category || "";
  const slug = designer.slug || designer._id || "";
  const avatar = designer.avatar || designer.profileImage || "";

  return (
    <Link to={`/${slug}`} onClick={onClose} className="group flex items-center gap-4 p-4 border border-stone-100 bg-white hover:border-bronze-400/50 transition-all duration-300">
      <div className="shrink-0 w-12 h-12 overflow-hidden bg-stone-100">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ivory-50 to-stone-200">
            <span className="font-display text-lg text-charcoal-300">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors">{name}</h3>
        <p className="text-xs text-charcoal-400 mt-0.5">
          {city}{category && ` · ${Array.isArray(category) ? category.join(", ") : category}`}
        </p>
      </div>
      <IconArrow className="w-4 h-4 text-charcoal-300 group-hover:text-charcoal-900 group-hover:translate-x-1 transition-all duration-300" />
    </Link>
  );
}

/* ── Empty State ──────────────────────────────────────────────────── */
function EmptyState({ term }) {
  return (
    <div className="py-20 text-center">
      <p className="font-serif text-2xl text-charcoal-900 font-light mb-3">No results for "{term}"</p>
      <p className="text-sm text-charcoal-400 mb-8">Try a different search or browse our collections.</p>
      <div className="flex justify-center gap-3 flex-wrap">
        {["/shop", "/collections", "/designers"].map((to) => (
          <Link key={to} to={to} className="px-5 py-2 border border-stone-200 text-xs text-charcoal-600 hover:border-charcoal-400 hover:text-charcoal-900 transition-all duration-300">
            {to === "/shop" ? "Browse Products" : to === "/collections" ? "Collections" : "Designers"}
          </Link>
        ))}
      </div>
    </div>
  );
}
