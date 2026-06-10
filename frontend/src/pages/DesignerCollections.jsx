import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyCollections, updateCollectionStatus } from "../store/collectionsSlice";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconPlus = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>;
const IconEdit = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>;
const IconMore = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
const IconEye = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconCheck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;

/* ── Status Map ───────────────────────────────────────────────────── */
const statusMap = { published: "Published", in_review: "In Review", draft: "Draft", archived: "Archived" };

const statusStyles = {
  Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In Review": "bg-amber-50 text-amber-700 border-amber-200",
  Draft: "bg-stone-50 text-charcoal-500 border-stone-200",
};

const filters = ["All", "Published", "In Review", "Draft"];

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerCollections() {
  const dispatch = useDispatch();
  const { items: collections, loading } = useSelector((s) => s.collections);
  const [activeFilter, setActiveFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    dispatch(fetchMyCollections());
  }, [dispatch]);

  const mapped = collections.map((c) => ({
    ...c,
    id: c._id,
    status: statusMap[c.status] || c.status,
    pieces: c.productCount ?? c.products?.length ?? 0,
    sales: c.totalSold ?? 0,
    revenue: c.totalRevenue ?? 0,
    views: c.viewCount ?? 0,
    image: c.coverImage || "/assets/images/placeholder.webp",
    createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
    season: c.season || "",
    category: c.category || "",
  }));

  const filtered = activeFilter === "All"
    ? mapped
    : mapped.filter((c) => c.status === activeFilter);

  const totalRevenue = mapped.reduce((s, c) => s + c.revenue, 0);
  const totalSales = mapped.reduce((s, c) => s + c.sales, 0);
  const totalPieces = mapped.reduce((s, c) => s + c.pieces, 0);

  const handleStatusChange = (id, status) => {
    const apiStatus = status === "Published" ? "published" : status === "In Review" ? "in_review" : "draft";
    dispatch(updateCollectionStatus({ id, status: apiStatus }));
  };

  if (loading && collections.length === 0) {
    return <div className="flex items-center justify-center py-20"><p className="text-sm text-charcoal-400">Loading collections...</p></div>;
  }

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Collections</p>
          <h2 className="font-serif text-3xl text-charcoal-900 font-light">Manage Your Collections</h2>
          <p className="text-sm text-charcoal-400 mt-1">
            {mapped.length} collections · {totalPieces} pieces · PKR {(totalRevenue / 1000).toFixed(0)}K revenue
          </p>
        </div>
        <Link
          to="new"
          className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors duration-300"
        >
          <IconPlus className="w-4 h-4" />
          New Collection
        </Link>
      </div>

      {/* ── Summary Stats ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Collections", value: mapped.length },
          { label: "Published", value: mapped.filter(c => c.status === "Published").length },
          { label: "Total Sales", value: totalSales },
          { label: "Total Revenue", value: `PKR ${(totalRevenue / 1000).toFixed(0)}K` },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 mb-1">{s.label}</p>
            <p className="font-serif text-xl text-charcoal-900 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-stone-200">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 border-b-2 ${
              activeFilter === f
                ? "text-charcoal-900 border-charcoal-900"
                : "text-charcoal-400 border-transparent hover:text-charcoal-600"
            }`}
          >
            {f}
            {f !== "All" && (
              <span className="ml-1.5 text-[9px] text-charcoal-300">
                ({mapped.filter(c => c.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Collection Cards ───────────────────────────────────── */}
      <div className="space-y-4">
        {filtered.map((col) => (
          <div
            key={col.id}
            className="bg-white border border-stone-200 hover:border-stone-300 transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="sm:w-48 h-48 sm:h-auto bg-stone-50 overflow-hidden shrink-0">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-serif text-xl text-charcoal-900">{col.name}</h3>
                        <span className={`text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border ${statusStyles[col.status]}`}>
                          {col.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-400">
                        {col.season} · {col.category} · Created {col.createdAt}
                      </p>
                    </div>

                    {/* Actions menu */}
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === col.id ? null : col.id)}
                        className="p-1.5 text-charcoal-300 hover:text-charcoal-900 transition-colors"
                      >
                        <IconMore className="w-5 h-5" />
                      </button>
                      {menuOpen === col.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-stone-200 shadow-lg z-20 py-1">
                            <button className="w-full text-left px-4 py-2 text-xs text-charcoal-700 hover:bg-stone-50 transition-colors flex items-center gap-2">
                              <IconEdit className="w-3.5 h-3.5" /> Edit Collection
                            </button>
                            <button className="w-full text-left px-4 py-2 text-xs text-charcoal-700 hover:bg-stone-50 transition-colors flex items-center gap-2">
                              <IconEye className="w-3.5 h-3.5" /> View on Store
                            </button>
                            {col.status === "Draft" && (
                              <button onClick={() => handleStatusChange(col.id, "In Review")} className="w-full text-left px-4 py-2 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-2">
                                <IconCheck className="w-3.5 h-3.5" /> Submit for Review
                              </button>
                            )}
                            <div className="border-t border-stone-100 my-1" />
                            <button className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                              <IconTrash className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-300">Pieces</span>
                    <p className="text-sm text-charcoal-900 tabular-nums">{col.pieces}</p>
                  </div>
                  <div className="w-px h-8 bg-stone-200" />
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-300">Sales</span>
                    <p className="text-sm text-charcoal-900 tabular-nums">{col.sales}</p>
                  </div>
                  <div className="w-px h-8 bg-stone-200" />
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-300">Revenue</span>
                    <p className="text-sm text-charcoal-900 tabular-nums">
                      {col.revenue > 0 ? `PKR ${(col.revenue / 1000).toFixed(0)}K` : "—"}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-stone-200" />
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-300">Views</span>
                    <p className="text-sm text-charcoal-900 tabular-nums">{col.views.toLocaleString()}</p>
                  </div>
                  <div className="ml-auto">
                    <Link
                      to={`/collections/${col.slug}`}
                      className="text-[10px] uppercase tracking-[0.2em] text-bronze-500 hover:text-bronze-600 transition-colors flex items-center gap-1"
                    >
                      View Live <IconEye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white border border-stone-200">
          <p className="font-serif text-xl text-charcoal-900 mb-2">No collections found</p>
          <p className="text-sm text-charcoal-400 mb-6">
            {activeFilter === "All" ? "Create your first collection to get started." : `No ${activeFilter.toLowerCase()} collections yet.`}
          </p>
          <Link
            to="new"
            className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors duration-300"
          >
            <IconPlus className="w-4 h-4" />
            Create Collection
          </Link>
        </div>
      )}
    </div>
  );
}
