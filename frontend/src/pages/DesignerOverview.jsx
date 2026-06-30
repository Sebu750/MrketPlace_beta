import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchDashboardKPIs, fetchOnboardingStatus } from "../store/designerSlice";
import OnboardingBanner from "../components/OnboardingBanner";

/* ── SVG Icons ─────────────────────────────────────────────────────── */
const IconArrowUp = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
const IconArrowDown = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>;
const IconPlus = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>;
const IconEye = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconStar = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>;
const IconTruck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconArrowRight = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
const IconEdit = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

/* ── Status Colors ─────────────────────────────────────────────────── */
const statusColors = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  in_production: "bg-amber-50 text-amber-700 border-amber-200",
  ready_to_ship: "bg-indigo-50 text-indigo-700 border-indigo-200",
  shipped: "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "New": "bg-blue-50 text-blue-700 border-blue-200",
  "In Production": "bg-amber-50 text-amber-700 border-amber-200",
  "Ready to Ship": "bg-blue-50 text-blue-700 border-blue-200",
  "Shipped": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Delivered": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const statusLabel = (s) => ({ new: "New", in_production: "In Production", ready_to_ship: "Ready to Ship", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" }[s] || s);

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerOverview() {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const { dashboard, loading, onboarding, profile } = useSelector((state) => state.designer);
  const firstName = user?.name?.split(" ")[0] || "Designer";

  useEffect(() => {
    dispatch(fetchDashboardKPIs());
    dispatch(fetchOnboardingStatus());
  }, [dispatch]);

  const kpi = dashboard?.kpis || {};
  const recentOrders = (dashboard?.recentOrders || []).map((o) => ({
    id: o.orderNumber || o._id,
    date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    item: o.items?.[0]?.name || "Order",
    customer: o.shippingAddress?.name || "Customer",
    status: statusLabel(o.status),
    total: `PKR ${o.financial?.subtotal?.toLocaleString("en-PK") || "0"}`,
    img: o.items?.[0]?.image || "/assets/images/placeholder.webp",
    _id: o._id,
  }));
  const collections = (dashboard?.collections || []).map((c) => ({
    name: c.name,
    pieces: c.productCount || 0,
    status: c.status === "published" ? "Published" : c.status === "in_review" ? "In Review" : "Draft",
    sales: c.totalSold || 0,
    revenue: c.totalRevenue || 0,
    image: c.coverImage || "/assets/images/placeholder.webp",
  }));
  const topPerformers = (dashboard?.topProducts || []).map((p) => ({
    name: p.name,
    sales: p.totalSold || 0,
    revenue: `PKR ${((p.totalSold || 0) * (p.price || 0)).toLocaleString("en-PK")}`,
    views: p.viewCount || 0,
    img: p.images?.[0] || p.coverImage || "/assets/images/placeholder.webp",
  }));

  if (loading && !dashboard) {
    return <div className="flex items-center justify-center py-20"><p className="text-sm text-charcoal-400">Loading dashboard...</p></div>;
  }

  return (
    <div className="space-y-8">
      {/* ── Onboarding Banner ─────────────────────────────────── */}
      <OnboardingBanner onboarding={onboarding} designerName={profile?.name || user?.name} />

      {/* ── Welcome ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Dashboard</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-light">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {firstName}
          </h2>
          <p className="text-sm text-charcoal-400 mt-1">Here's what's happening with your store today.</p>
        </div>
        <Link
          to="collections/new"
          className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors duration-300"
        >
          <IconPlus className="w-4 h-4" />
          New Collection
        </Link>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenue", value: `PKR ${(kpi.totalRevenue || 0).toLocaleString("en-PK")}`, sub: "total earned" },
          { label: "Orders", value: kpi.totalOrders || 0, sub: `${kpi.pendingOrders || 0} pending` },
          { label: "Products", value: kpi.totalProducts || 0, sub: `${kpi.activeProducts || 0} active` },
          { label: "Collections", value: kpi.totalCollections || 0, sub: `${kpi.profileViews || 0} profile views` },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-stone-200 p-6 hover:border-stone-300 transition-colors duration-300">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 mb-3">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <p className="font-serif text-2xl md:text-3xl text-charcoal-900 tabular-nums">{kpi.value}</p>
            </div>
            <p className="text-[11px] text-charcoal-300 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Two Column: Orders + Activity ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-sm font-medium text-charcoal-900">Recent Orders</h3>
            <Link to="orders" className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 hover:text-charcoal-900 transition-colors flex items-center gap-1">
              View All <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {recentOrders.length === 0 && (
              <div className="px-6 py-10 text-center"><p className="text-sm text-charcoal-400">No orders yet</p></div>
            )}
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                to={`orders/${order._id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/50 transition-colors duration-300 group"
              >
                {/* Thumbnail */}
                <div className="shrink-0 w-12 h-14 bg-stone-50 overflow-hidden">
                  <img src={order.img} alt={order.item} className="w-full h-full object-cover opacity-85" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal-900 group-hover:text-bronze-500 transition-colors truncate">{order.item}</p>
                  <p className="text-[11px] text-charcoal-400 mt-0.5">{order.id} · {order.customer}</p>
                </div>
                {/* Status + Total */}
                <div className="text-right shrink-0">
                  <p className="text-sm text-charcoal-900 tabular-nums">{order.total}</p>
                  <span className={`inline-block mt-1 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border ${statusColors[order.status] || "bg-stone-50 text-charcoal-400 border-stone-200"}`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-5 bg-white border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100">
            <h3 className="text-sm font-medium text-charcoal-900">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-5">
            {recentOrders.slice(0, 5).map((o, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-bronze-400" />
                <div>
                  <p className="text-sm text-charcoal-700 leading-snug">New order from {o.customer} , {o.item}</p>
                  <p className="text-[10px] text-charcoal-300 mt-0.5">{o.date}</p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-charcoal-400">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Two Column: Collections + Top Performers ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collections */}
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400">Your Collections</h3>
            <Link to="collections" className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 hover:text-charcoal-900 transition-colors flex items-center gap-1">
              Manage <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {collections.length === 0 && <p className="text-sm text-charcoal-400 px-4">No collections yet</p>}
            {collections.map((col) => (
              <div key={col.name} className="bg-white border border-stone-200 p-4 flex items-center gap-4 hover:border-stone-300 transition-colors duration-300 group cursor-pointer">
                <div className="shrink-0 w-16 h-20 bg-stone-50 overflow-hidden">
                  <img src={col.image} alt={col.name} className="w-full h-full object-cover opacity-85" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors">{col.name}</h4>
                  <p className="text-[11px] text-charcoal-400 mt-0.5">{col.pieces} pieces · {col.sales} sales</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border ${
                      col.status === "Published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {col.status}
                    </span>
                    {col.revenue > 0 && (
                      <span className="text-[11px] text-charcoal-400 tabular-nums">PKR {(col.revenue / 1000).toFixed(0)}K</span>
                    )}
                  </div>
                </div>
                <IconEdit className="w-4 h-4 text-stone-300 group-hover:text-charcoal-400 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="lg:col-span-7 bg-white border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100">
            <h3 className="text-sm font-medium text-charcoal-900">Top Performers</h3>
            <p className="text-[11px] text-charcoal-400 mt-0.5">Best selling pieces this month</p>
          </div>
          <div className="divide-y divide-stone-100">
            {topPerformers.length === 0 && <div className="px-6 py-10 text-center"><p className="text-sm text-charcoal-400">No sales yet</p></div>}
            {topPerformers.map((item, i) => (
              <div key={item.name} className="flex items-center gap-4 px-6 py-4">
                <span className="text-[10px] text-charcoal-300 w-4 tabular-nums">{i + 1}</span>
                <div className="shrink-0 w-12 h-14 bg-stone-50 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-85" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-charcoal-400 mt-0.5">{item.sales} sold · {item.views} views</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-charcoal-900 tabular-nums">{item.revenue}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <IconEye className="w-3 h-3 text-charcoal-300" />
                    <span className="text-[10px] text-charcoal-300 tabular-nums">{item.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: IconPlus, label: "New Collection", desc: "Upload pieces and launch your next collection", to: "collections/new" },
            { icon: IconStar, label: "Apply for Spotlight", desc: "Get featured on the Adorzia homepage", to: "#" },
            { icon: IconEye, label: "View Storefront", desc: "See how customers experience your brand", to: "/" },
            { icon: IconTruck, label: "Artisan Network", desc: "Find craft partners across Pakistan", to: "#" },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="bg-white border border-stone-200 p-5 hover:border-bronze-300/50 transition-all duration-300 group"
            >
              <action.icon className="w-5 h-5 text-charcoal-300 group-hover:text-bronze-500 transition-colors duration-300 mb-3" />
              <p className="font-serif text-base text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{action.label}</p>
              <p className="text-[11px] text-charcoal-400 mt-1 leading-relaxed">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
