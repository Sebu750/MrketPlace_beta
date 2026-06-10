import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlatformAnalytics, fetchPlatformStats } from "../store/adminSlice";

const fmt = (n) => "₨ " + Number(n || 0).toLocaleString("en-PK");
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const parseMonthLabel = (id) => {
  if (!id) return "—";
  // Backend returns "YYYY-MM" string
  if (typeof id === "string" && id.includes("-")) {
    const m = parseInt(id.split("-")[1], 10);
    return monthNames[m - 1] || id;
  }
  return `M${id}`;
};

export default function AdminReports() {
  const dispatch = useDispatch();
  const { analytics, stats } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchPlatformAnalytics({ months: 12 }));
    if (!stats) dispatch(fetchPlatformStats());
  }, [dispatch, stats]);

  const analyticsData = analytics?.data || analytics || {};
  const monthly = analyticsData.monthlyRevenue || [];
  const maxRev = Math.max(...monthly.map((m) => m.revenue || 0), 1);
  const topDesigners = analyticsData.topDesigners || [];
  const topCategories = analyticsData.topCategories || [];
  const paymentMethods = analyticsData.paymentMethods || [];
  const totalPayMethods = paymentMethods.reduce((s, p) => s + (p.count || 0), 0) || 1;

  return (
    <div className="space-y-8">
      {/* ── Monthly Revenue Chart ─────────────────────── */}
      <section>
        <h2 className="font-serif text-lg text-charcoal-800 mb-1">Monthly Revenue</h2>
        <p className="text-[11px] text-charcoal-400 mb-5">Last 12 months platform performance</p>
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex items-end gap-2 h-48">
            {monthly.length > 0 ? monthly.map((m, i) => {
              const pct = ((m.revenue || 0) / maxRev) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[9px] text-charcoal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {fmt(m.revenue)}
                  </span>
                  <div className="w-full relative" style={{ height: `${Math.max(pct, 2)}%` }}>
                    <div className="absolute inset-0 bg-neutral-900 group-hover:bg-red-600 transition-colors duration-300" />
                  </div>
                  <span className="text-[9px] text-charcoal-400 mt-1">
                    {parseMonthLabel(m._id)}
                  </span>
                </div>
              );
            }) : (
              <div className="flex-1 flex items-center justify-center text-charcoal-400 text-sm h-full">
                No revenue data available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Two-column: Top Designers + Categories ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Designers */}
        <section>
          <h2 className="font-serif text-lg text-charcoal-800 mb-1">Top Designers</h2>
          <p className="text-[11px] text-charcoal-400 mb-4">By total revenue contribution</p>
          <div className="bg-white border border-stone-200">
            {topDesigners.length > 0 ? topDesigners.slice(0, 8).map((d, i) => (
              <div key={d._id || i} className="flex items-center gap-4 px-5 py-3.5 border-b border-stone-50 last:border-0">
                <span className="w-6 h-6 flex items-center justify-center bg-neutral-900 text-white text-[10px] font-semibold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-charcoal-800 font-medium truncate">{d.brandName || d.name || "Unknown"}</p>
                  <p className="text-[10px] text-charcoal-400">{d.orders || 0} orders</p>
                </div>
                <span className="text-[13px] text-charcoal-700 font-medium shrink-0">{fmt(d.revenue)}</span>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-charcoal-400 text-sm">No designer data yet</div>
            )}
          </div>
        </section>

        {/* Top Categories */}
        <section>
          <h2 className="font-serif text-lg text-charcoal-800 mb-1">Top Categories</h2>
          <p className="text-[11px] text-charcoal-400 mb-4">Product sales distribution</p>
          <div className="bg-white border border-stone-200 p-5 space-y-4">
            {topCategories.length > 0 ? topCategories.map((c, i) => {
              const maxCat = Math.max(...topCategories.map((x) => x.count || 0), 1);
              const pct = ((c.count || 0) / maxCat) * 100;
              return (
                <div key={c._id || i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-charcoal-700">{c._id || "Unknown"}</span>
                    <span className="text-[11px] text-charcoal-400">{c.count} sales</span>
                  </div>
                  <div className="h-2 bg-stone-100 overflow-hidden">
                    <div className="h-full bg-neutral-800 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-charcoal-400 text-sm py-4">No category data yet</div>
            )}
          </div>
        </section>
      </div>

      {/* ── Payment Methods ───────────────────────────── */}
      <section>
        <h2 className="font-serif text-lg text-charcoal-800 mb-1">Payment Methods</h2>
        <p className="text-[11px] text-charcoal-400 mb-4">Order payment distribution</p>
        <div className="bg-white border border-stone-200 p-5">
          {paymentMethods.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((p, i) => (
                <div key={p._id || i} className="text-center p-4 border border-stone-100">
                  <div className="text-2xl font-serif text-charcoal-800 mb-1">{Math.round(((p.count || 0) / totalPayMethods) * 100)}%</div>
                  <p className="text-[11px] uppercase tracking-wider text-charcoal-500">{(p._id || "unknown").replace("_", " ")}</p>
                  <p className="text-[10px] text-charcoal-400 mt-0.5">{p.count} orders</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-charcoal-400 text-sm py-4">No payment data yet</div>
          )}
        </div>
      </section>

      {/* ── Quick Stats ────────────────────────────────── */}
      {stats && (
        <section>
          <h2 className="font-serif text-lg text-charcoal-800 mb-4">Platform Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: stats.kpis?.totalUsers || 0 },
              { label: "Total Designers", value: stats.kpis?.totalDesigners || 0 },
              { label: "Total Products", value: stats.kpis?.totalProducts || 0 },
              { label: "Total Orders", value: stats.kpis?.totalOrders || 0 },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-stone-200 p-4 text-center">
                <p className="text-2xl font-serif text-charcoal-800">{s.value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
