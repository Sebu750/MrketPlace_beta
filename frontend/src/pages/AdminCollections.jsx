import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminCollections, adminUpdateCollection } from "../store/adminSlice";

const statusColor = { published: "bg-emerald-50 text-emerald-700", in_review: "bg-amber-50 text-amber-700", draft: "bg-stone-50 text-charcoal-500", archived: "bg-red-50 text-red-600" };
const tabs = ["All", "Published", "In Review", "Draft", "Archived"];

export default function AdminCollections() {
  const dispatch = useDispatch();
  const { collections, loading } = useSelector((s) => s.admin);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    const status = tab === "All" ? null : tab.toLowerCase().replace(" ", "_");
    dispatch(fetchAdminCollections({ status }));
  }, [dispatch, tab]);

  const updateStatus = (id, status) => {
    dispatch(adminUpdateCollection({ id, status })).then(() => {
      const s = tab === "All" ? null : tab.toLowerCase().replace(" ", "_");
      dispatch(fetchAdminCollections({ status: s }));
    });
  };

  const toggleFeatured = (id, current) => {
    dispatch(adminUpdateCollection({ id, featured: !current })).then(() => {
      const s = tab === "All" ? null : tab.toLowerCase().replace(" ", "_");
      dispatch(fetchAdminCollections({ status: s }));
    });
  };

  const items = collections.items || [];

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border border-stone-200 bg-white w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
              tab === t ? "bg-charcoal-900 text-white" : "text-charcoal-500 hover:bg-stone-50"
            }`}>{t}</button>
        ))}
      </div>

      <div className="border border-stone-200 bg-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {["Collection", "Designer", "Season", "Products", "Status", "Featured", "Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {items.map((c) => (
              <tr key={c._id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-5 py-3">
                  <p className="text-sm text-charcoal-900 font-medium">{c.name}</p>
                  <p className="text-[10px] text-charcoal-400">{c.category || ","}</p>
                </td>
                <td className="px-5 py-3 text-sm text-charcoal-700">{c.designer?.brandName || c.designer?.name || ","}</td>
                <td className="px-5 py-3 text-xs text-charcoal-600">{c.season || ","}</td>
                <td className="px-5 py-3 text-sm text-charcoal-700">{c.productCount || 0}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] px-2 py-0.5 ${statusColor[c.status] || ""}`}>{c.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleFeatured(c._id, c.featured)}
                    className={`text-[10px] px-2.5 py-1 transition-colors ${c.featured ? "bg-amber-50 text-amber-700" : "bg-stone-100 text-charcoal-400"}`}>
                    {c.featured ? "Featured" : "Not Featured"}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}
                    className="text-xs border border-stone-200 px-2 py-1 focus:outline-none">
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-charcoal-400">{loading ? "Loading..." : "No collections found"}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
