import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminProducts } from "../store/adminSlice";

const fmt = (n) => "₨ " + Number(n || 0).toLocaleString("en-PK");

const statusColors = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-stone-100 text-stone-500 border-stone-200",
  sold_out: "bg-red-50 text-red-600 border-red-200",
};

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.admin);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminProducts({ status, category, search, page }));
  }, [dispatch, status, category, search, page]);

  const items = products.items || [];
  const pg = products.pagination || {};

  const categories = ["Womenswear", "Menswear", "Accessories", "Bridal", "Pret", "Luxury", "Streetwear", "Contemporary"];

  return (
    <div className="space-y-6">
      {/* ── Filters ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {["", "active", "draft", "archived", "sold_out"].map((s) => (
            <button key={s || "all"} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-all ${
                status === s
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-charcoal-500 border-stone-200 hover:border-charcoal-400"
              }`}>
              {s ? s.replace("_", " ") : "All"}
            </button>
          ))}
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-3 py-1.5 text-[11px] uppercase tracking-wider border border-stone-200 bg-white text-charcoal-600 focus:outline-none">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="text" placeholder="Search products…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-3 py-1.5 text-sm border border-stone-200 bg-white focus:outline-none focus:border-charcoal-400 w-52" />
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="bg-white border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-charcoal-400 font-medium">Product</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-charcoal-400 font-medium">Designer</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-charcoal-400 font-medium">Category</th>
                <th className="text-right px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-charcoal-400 font-medium">Price</th>
                <th className="text-center px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-charcoal-400 font-medium">Stock</th>
                <th className="text-center px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-charcoal-400 font-medium">Status</th>
                <th className="text-center px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-charcoal-400 font-medium">Featured</th>
              </tr>
            </thead>
            <tbody>
              {loading && items.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-charcoal-400">Loading products…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-charcoal-400">No products found</td></tr>
              ) : items.map((p) => (
                <tr key={p._id} className="border-b border-stone-50 hover:bg-stone-50/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="w-10 h-12 object-cover border border-stone-100" />
                      ) : (
                        <div className="w-10 h-12 bg-stone-100 flex items-center justify-center text-stone-400 text-[10px]">IMG</div>
                      )}
                      <div>
                        <p className="text-charcoal-800 font-medium text-[13px]">{p.name}</p>
                        <p className="text-[10px] text-charcoal-400 mt-0.5 line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-charcoal-600 text-[13px]">{p.designer?.brandName || p.designer?.name || "—"}</td>
                  <td className="px-5 py-3.5 text-charcoal-500 text-[12px]">{p.category || "—"}</td>
                  <td className="px-5 py-3.5 text-right text-charcoal-700 font-medium text-[13px]">{fmt(p.price)}</td>
                  <td className="px-5 py-3.5 text-center text-[12px] text-charcoal-500">{p.stock ?? "—"}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider border ${statusColors[p.status] || statusColors.draft}`}>
                      {p.status || "draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`text-[11px] ${p.featured ? "text-amber-600" : "text-stone-300"}`}>
                      {p.featured ? "★" : "☆"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ──────────────────────────────────── */}
      {pg.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-charcoal-400">
            Showing {((pg.page - 1) * pg.limit) + 1}–{Math.min(pg.page * pg.limit, pg.total)} of {pg.total}
          </p>
          <div className="flex gap-1.5">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-[11px] border border-stone-200 bg-white text-charcoal-500 hover:border-charcoal-400 disabled:opacity-30 transition-colors">
              Prev
            </button>
            <button onClick={() => setPage(Math.min(pg.totalPages, page + 1))} disabled={page >= pg.totalPages}
              className="px-3 py-1.5 text-[11px] border border-stone-200 bg-white text-charcoal-500 hover:border-charcoal-400 disabled:opacity-30 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
