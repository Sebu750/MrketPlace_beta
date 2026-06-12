import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminDesigners, updateDesigner, deleteDesigner } from "../store/adminSlice";

const planColors = { free: "bg-stone-50 text-charcoal-500", pro: "bg-amber-50 text-amber-700", enterprise: "bg-violet-50 text-violet-700" };

export default function AdminDesigners() {
  const dispatch = useDispatch();
  const { designers, loading } = useSelector((s) => s.admin);
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState(undefined);

  useEffect(() => {
    dispatch(fetchAdminDesigners({ search: search || null, verified: verifiedFilter }));
  }, [dispatch, verifiedFilter]);

  const handleSearch = () => dispatch(fetchAdminDesigners({ search: search || null, verified: verifiedFilter }));

  const toggleVerified = (id, current) => {
    dispatch(updateDesigner({ id, verified: !current })).then(() =>
      dispatch(fetchAdminDesigners({ verified: verifiedFilter }))
    );
  };

  const changePlan = (id, plan) => {
    dispatch(updateDesigner({ id, plan })).then(() =>
      dispatch(fetchAdminDesigners({ verified: verifiedFilter }))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this designer and all their products? This cannot be undone."))
      dispatch(deleteDesigner(id));
  };

  const items = designers.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-1 border border-stone-200 bg-white">
          {[{ label: "All", val: undefined }, { label: "Verified", val: true }, { label: "Unverified", val: false }].map((f) => (
            <button key={f.label} onClick={() => setVerifiedFilter(f.val)}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                verifiedFilter === f.val ? "bg-charcoal-900 text-white" : "text-charcoal-500 hover:bg-stone-50"
              }`}>{f.label}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search designers..." className="border border-stone-200 px-4 py-2 text-sm w-60 focus:outline-none focus:border-charcoal-400" />
          <button onClick={handleSearch} className="bg-charcoal-900 text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-charcoal-800 transition-colors">Search</button>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-3">
        {items.length === 0 ? (
          <div className="bg-white border border-stone-200 p-8 text-center text-sm text-charcoal-400">{loading ? "Loading..." : "No designers found"}</div>
        ) : items.map((d) => (
          <div key={d._id} className="border border-stone-200 bg-white p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-charcoal-900 font-medium">{d.brandName || d.name}</p>
                <p className="text-[10px] text-charcoal-400">{d.studioCity || ","}</p>
              </div>
              <button onClick={() => toggleVerified(d._id, d.verified)}
                className={`text-[10px] px-2.5 py-1 transition-colors ${d.verified ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-charcoal-400"}`}>
                {d.verified ? "Verified" : "Unverified"}
              </button>
            </div>
            <p className="text-xs text-charcoal-500 font-mono">{d.email}</p>
            <div className="flex items-center gap-3 text-xs text-charcoal-500">
              <span>{d.category || ","}</span>
              <span>{d.productCount || 0} products</span>
              <span>{d.orderCount || 0} orders</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
              <select value={d.plan || "free"} onChange={(e) => changePlan(d._id, e.target.value)}
                className={`text-[10px] px-2 py-1.5 border-0 flex-1 ${planColors[d.plan] || planColors.free}`}>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <button onClick={() => handleDelete(d._id)} className="text-xs text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 border border-red-200">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block border border-stone-200 bg-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {["Designer", "Email", "Category", "Plan", "Products", "Orders", "Verified", "Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {items.map((d) => (
              <tr key={d._id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-5 py-3">
                  <p className="text-sm text-charcoal-900 font-medium">{d.brandName || d.name}</p>
                  <p className="text-[10px] text-charcoal-400">{d.studioCity || ","}</p>
                </td>
                <td className="px-5 py-3 text-xs text-charcoal-500 font-mono">{d.email}</td>
                <td className="px-5 py-3 text-xs text-charcoal-600">{d.category || ","}</td>
                <td className="px-5 py-3">
                  <select value={d.plan || "free"} onChange={(e) => changePlan(d._id, e.target.value)}
                    className={`text-[10px] px-2 py-1 border-0 ${planColors[d.plan] || planColors.free}`}>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-sm text-charcoal-700">{d.productCount || 0}</td>
                <td className="px-5 py-3 text-sm text-charcoal-700">{d.orderCount || 0}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleVerified(d._id, d.verified)}
                    className={`text-[10px] px-2.5 py-1 transition-colors ${d.verified ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-charcoal-400"}`}>
                    {d.verified ? "Verified" : "Unverified"}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => handleDelete(d._id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-8 text-center text-sm text-charcoal-400">{loading ? "Loading..." : "No designers found"}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
