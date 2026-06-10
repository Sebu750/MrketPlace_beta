import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnalytics, fetchDashboardKPIs } from "../store/designerSlice";

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerAnalytics() {
  const dispatch = useDispatch();
  const { analytics, dashboard, loading } = useSelector((s) => s.designer);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    dispatch(fetchAnalytics({ period: "12m" }));
    dispatch(fetchDashboardKPIs());
  }, [dispatch]);

  const kpi = dashboard?.kpis || {};
  const monthlyRevenue = (analytics?.monthlyRevenue || []).map((m) => ({
    month: m._id?.slice(-2) || "",
    amount: m.revenue || 0,
    orders: m.orders || 0,
  }));
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.amount), 1);
  const topProducts = (analytics?.topProducts || []).map((p) => ({
    name: p.name,
    collection: p.collection?.name || "",
    sales: p.totalSold || 0,
    revenue: (p.totalSold || 0) * (p.price || 0),
    views: p.viewCount || 0,
    img: p.images?.[0] || p.coverImage || "/assets/images/placeholder.webp",
  }));

  const kpiCards = [
    { label: "Revenue", value: `PKR ${(kpi.totalRevenue || 0).toLocaleString("en-PK")}`, change: "" },
    { label: "Orders", value: kpi.totalOrders || 0, change: "" },
    { label: "Products", value: kpi.totalProducts || 0, change: "" },
    { label: "Profile Views", value: (kpi.profileViews || 0).toLocaleString(), change: "" },
    { label: "Active Products", value: kpi.activeProducts || 0, change: "" },
  ];

  if (loading && !analytics && !dashboard) {
    return <div className="flex items-center justify-center py-20"><p className="text-sm text-charcoal-400">Loading analytics...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Analytics</p>
          <h2 className="font-serif text-3xl text-charcoal-900 font-light">Performance Insights</h2>
          <p className="text-sm text-charcoal-400 mt-1">Understand your sales, audience, and growth</p>
        </div>
        <div className="flex items-center gap-1">
          {["7d", "30d", "90d", "12m", "All"].map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-2 text-[10px] uppercase tracking-[0.15em] border transition-all duration-300 ${
                range === r ? "bg-charcoal-900 text-white border-charcoal-900" : "bg-white text-charcoal-400 border-stone-200 hover:border-charcoal-300"
              }`}>{r}</button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-stone-200 p-5">
            <p className="text-[9px] uppercase tracking-[0.25em] text-charcoal-400 mb-2">{kpi.label}</p>
            <p className="font-serif text-2xl text-charcoal-900 tabular-nums">{kpi.value}</p>
            {kpi.change && <span className="text-[10px] font-medium mt-1 inline-block text-emerald-600">{kpi.change}</span>}
          </div>
        ))}
      </div>

      {/* ── Revenue Chart ───────────────────────────────────────── */}
      <div className="bg-white border border-stone-200 p-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium mb-6">Revenue Trend</p>
        <div className="flex items-end gap-2 h-52">
          {monthlyRevenue.length === 0 && <p className="text-sm text-charcoal-400 mx-auto">No data yet</p>}
          {monthlyRevenue.map((m) => {
            const h = (m.amount / maxRevenue) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[9px] text-charcoal-500 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                  {(m.amount / 1000).toFixed(0)}k
                </span>
                <div className="w-full bg-stone-100 relative" style={{ height: "100%" }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-charcoal-800 group-hover:bg-bronze-400 transition-all duration-500 ease-out"
                    style={{ height: `${h}%` }} />
                </div>
                <span className="text-[8px] uppercase tracking-[0.15em] text-charcoal-400">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Top Products ──────────────────────────────────────── */}
        <div className="bg-white border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium">Top Products</p>
          </div>
          <div className="divide-y divide-stone-100">
            {topProducts.length === 0 && <div className="px-6 py-10 text-center"><p className="text-sm text-charcoal-400">No sales data yet</p></div>}
            {topProducts.map((p, i) => (
              <div key={i} className="px-6 py-3 flex items-center gap-3">
                <span className="text-[10px] text-charcoal-300 tabular-nums w-4 shrink-0">#{i + 1}</span>
                <div className="w-10 h-12 bg-stone-50 overflow-hidden shrink-0 border border-stone-100">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-charcoal-900 font-medium truncate">{p.name}</p>
                  <p className="text-[10px] text-charcoal-400">{p.sales} sales · {p.views} views</p>
                </div>
                <span className="text-xs text-charcoal-900 tabular-nums shrink-0">PKR {p.revenue.toLocaleString("en-PK")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Collection Performance ────────────────────────────── */}
        <div className="bg-white border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium">Collection Performance</p>
          </div>
          <div className="divide-y divide-stone-100">
            {(dashboard?.collections || []).map((c) => (
              <div key={c._id || c.name} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-charcoal-900 font-medium">{c.name}</p>
                    <p className="text-[11px] text-charcoal-400">{c.productCount || 0} products</p>
                  </div>
                  <span className="text-sm text-charcoal-900 tabular-nums font-medium">PKR {(c.totalRevenue || 0).toLocaleString("en-PK")}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-charcoal-500">
                  <span>{c.totalSold || 0} sales</span>
                </div>
                <div className="mt-2 h-1 bg-stone-100">
                  <div className="h-full bg-bronze-400 transition-all duration-700" style={{ width: `${Math.min(((c.totalRevenue || 0) / Math.max(...(dashboard?.collections || []).map((x) => x.totalRevenue || 0), 1)) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
            {(dashboard?.collections || []).length === 0 && <div className="px-6 py-10 text-center"><p className="text-sm text-charcoal-400">No collections yet</p></div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Customer Geography ────────────────────────────────── */}
        <div className="bg-white border border-stone-200 p-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium mb-4">Customer Geography</p>
          <p className="text-sm text-charcoal-400">Geographic data will be available once orders are placed.</p>
        </div>

        {/* ── Traffic Sources ───────────────────────────────────── */}
        <div className="bg-white border border-stone-200 p-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium mb-4">Traffic Sources</p>
          <p className="text-sm text-charcoal-400">Traffic data will be available once your storefront receives visits.</p>
        </div>
      </div>
    </div>
  );
}
