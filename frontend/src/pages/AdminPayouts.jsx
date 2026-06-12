import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminPayouts, processPayout } from "../store/adminSlice";

const fmt = (n) => `PKR ${(n || 0).toLocaleString()}`;
const statusColor = { processed: "bg-emerald-50 text-emerald-700", pending: "bg-amber-50 text-amber-700", failed: "bg-red-50 text-red-600" };
const tabs = ["All", "Pending", "Processed", "Failed"];

export default function AdminPayouts() {
  const dispatch = useDispatch();
  const { payouts, loading } = useSelector((s) => s.admin);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    const status = tab === "All" ? null : tab.toLowerCase();
    dispatch(fetchAdminPayouts({ status }));
  }, [dispatch, tab]);

  const handleProcess = (id) => {
    dispatch(processPayout({ id, status: "processed" })).then(() => {
      const status = tab === "All" ? null : tab.toLowerCase();
      dispatch(fetchAdminPayouts({ status }));
    });
  };

  const items = payouts.items || [];
  const summary = payouts.summary || {};

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-stone-200 bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">Pending</p>
          <p className="font-serif text-xl text-charcoal-900">{summary.pending?.count || 0} payouts</p>
          <p className="text-xs text-charcoal-500 mt-1">{fmt(summary.pending?.total || 0)}</p>
        </div>
        <div className="border border-stone-200 bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">Processed</p>
          <p className="font-serif text-xl text-charcoal-900">{summary.processed?.count || 0} payouts</p>
          <p className="text-xs text-charcoal-500 mt-1">{fmt(summary.processed?.total || 0)}</p>
        </div>
        <div className="border border-stone-200 bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">Failed</p>
          <p className="font-serif text-xl text-charcoal-900">{summary.failed?.count || 0} payouts</p>
          <p className="text-xs text-charcoal-500 mt-1">{fmt(summary.failed?.total || 0)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border border-stone-200 bg-white w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
              tab === t ? "bg-charcoal-900 text-white" : "text-charcoal-500 hover:bg-stone-50"
            }`}>{t}</button>
        ))}
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-3">
        {items.length === 0 ? (
          <div className="bg-white border border-stone-200 p-8 text-center text-sm text-charcoal-400">{loading ? "Loading..." : "No payouts found"}</div>
        ) : items.map((p) => (
          <div key={p._id} className="border border-stone-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal-900 font-mono">{p.reference}</span>
              <span className={`text-[10px] px-2 py-0.5 ${statusColor[p.status] || ""}`}>{p.status}</span>
            </div>
            <p className="text-sm text-charcoal-700">{p.designer?.brandName || p.designer?.name || ","}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-charcoal-900 font-medium">{fmt(p.amount)}</span>
              <span className="text-charcoal-500">Commission: {fmt(p.commission)}</span>
            </div>
            <p className="text-[10px] text-charcoal-400">
              {new Date(p.periodStart).toLocaleDateString()} – {new Date(p.periodEnd).toLocaleDateString()}
            </p>
            {p.processedAt && (
              <p className="text-[10px] text-charcoal-400">Processed: {new Date(p.processedAt).toLocaleDateString()}</p>
            )}
            {p.status === "pending" && (
              <div className="pt-2 border-t border-stone-100">
                <button onClick={() => handleProcess(p._id)}
                  className="w-full text-xs bg-emerald-600 text-white px-3 py-2 hover:bg-emerald-700 transition-colors">
                  Process Payout
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block border border-stone-200 bg-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {["Reference", "Designer", "Amount", "Commission", "Period", "Status", "Processed", "Actions"].map((h) => (
                <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {items.map((p) => (
              <tr key={p._id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-5 py-3 text-xs text-charcoal-900 font-mono">{p.reference}</td>
                <td className="px-5 py-3 text-sm text-charcoal-700">{p.designer?.brandName || p.designer?.name || ","}</td>
                <td className="px-5 py-3 text-sm text-charcoal-900 font-medium">{fmt(p.amount)}</td>
                <td className="px-5 py-3 text-sm text-charcoal-500">{fmt(p.commission)}</td>
                <td className="px-5 py-3 text-xs text-charcoal-500">
                  {new Date(p.periodStart).toLocaleDateString()} , {new Date(p.periodEnd).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] px-2 py-0.5 ${statusColor[p.status] || ""}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-xs text-charcoal-400">
                  {p.processedAt ? new Date(p.processedAt).toLocaleDateString() : ","}
                </td>
                <td className="px-5 py-3">
                  {p.status === "pending" && (
                    <button onClick={() => handleProcess(p._id)}
                      className="text-xs bg-emerald-600 text-white px-3 py-1 hover:bg-emerald-700 transition-colors">
                      Process
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-8 text-center text-sm text-charcoal-400">{loading ? "Loading..." : "No payouts found"}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
