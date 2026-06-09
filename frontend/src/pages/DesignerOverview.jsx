import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

/* ── Mock data ──────────────────────────────────────────────────────── */
const stats = [
  { label: "Total Revenue", value: "PKR 1.24M", delta: "+18%", period: "vs last month" },
  { label: "Orders", value: "47", delta: "+12%", period: "this month" },
  { label: "Pieces Sold", value: "63", delta: "+8%", period: "this month" },
  { label: "Profile Views", value: "2,841", delta: "+34%", period: "this month" },
];

const recentOrders = [
  { id: "AD-2026-4821", date: "Jun 5, 2026", item: "Ajrak Architect Coat", customer: "Sarah K.", size: "M", status: "In Production", total: "PKR 48,000", img: "/assets/images/ajrak-architect-coat-adorzia1.webp" },
  { id: "AD-2026-4798", date: "Jun 2, 2026", item: "Phulkari Reborn Blazer", customer: "Amir R.", size: "L", status: "To Ship", total: "PKR 42,000", img: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
  { id: "AD-2026-4756", date: "May 28, 2026", item: "Khaddar Modern Suit", customer: "Fatima S.", size: "S", status: "Shipped", total: "PKR 36,500", img: "/assets/images/khaddar-modern-suit-adorzia.webp" },
  { id: "AD-2026-4721", date: "May 22, 2026", item: "Pashmina Wrap Dress", customer: "Elena M.", size: "XS", status: "Delivered", total: "PKR 29,500", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
];

const collections = [
  { name: "Geometry of Home", pieces: 8, published: "Mar 2026", sales: 24, revenue: "PKR 842,000", status: "Published", img: "/assets/images/ajrak-architect-coat-adorzia2.webp" },
  { name: "Threads of the Indus", pieces: 5, published: "Jun 2026", sales: 6, revenue: "PKR 198,000", status: "Published", img: "/assets/images/phulkari-reborn-blazer-adorzia.webp" },
  { name: "Monsoon Edit", pieces: 3, published: "—", sales: 0, revenue: "—", status: "Draft", img: "/assets/images/pashmina-wrap-dress-adorzia.webp" },
];

const activities = [
  { type: "order", text: "New order from Sarah K. — Ajrak Architect Coat (Size M)", time: "2 hours ago" },
  { type: "review", text: "5-star review on Phulkari Reborn Blazer by Amir R.", time: "5 hours ago" },
  { type: "shipping", text: "Khaddar Modern Suit marked as Shipped", time: "1 day ago" },
  { type: "milestone", text: "Geometry of Home crossed 20 sales", time: "3 days ago" },
  { type: "feature", text: "Your profile was featured in Editorial — \"Rising Voices in Pakistani Fashion\"", time: "1 week ago" },
];

/* ── Status badge helper ────────────────────────────────────────────── */
const statusBadge = (s) => {
  const map = {
    "In Production": "bg-amber-50 text-amber-700 border-amber-200",
    "To Ship": "bg-blue-50 text-blue-700 border-blue-200",
    "Shipped": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Delivered": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Published": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Draft": "bg-stone-100 text-charcoal-500 border-stone-200",
    "In Review": "bg-amber-50 text-amber-700 border-amber-200",
  };
  return map[s] || "bg-stone-50 text-charcoal-500 border-stone-200";
};

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerOverview() {
  const { data: user } = useSelector((state) => state.user);
  const firstName = user?.name?.split(" ")[0] || "Designer";

  return (
    <div className="space-y-10">
      {/* ── Welcome ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-bronze-500 mb-1">Dashboard</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-900 font-light">
            Welcome back, <span className="text-bronze-500">{firstName}</span>
          </h2>
          <p className="text-sm text-charcoal-400 mt-2">Here's what's happening with your store today.</p>
        </div>
        <Link
          to="collections/new"
          className="inline-flex items-center gap-2 bg-charcoal-900 text-white px-6 py-2.5 text-[11px] uppercase tracking-[0.18em] hover:bg-charcoal-800 transition-colors duration-500 shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          New Collection
        </Link>
      </div>

      {/* ── KPI Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 p-6 hover:border-stone-300 transition-colors duration-300">
            <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal-400 mb-3">{s.label}</p>
            <div className="flex items-end gap-3">
              <span className="font-serif text-3xl text-charcoal-900">{s.value}</span>
              <span className="text-[11px] text-emerald-600 font-medium mb-1">{s.delta}</span>
            </div>
            <p className="text-[11px] text-charcoal-300 mt-1.5">{s.period}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Recent Orders ──────────────────────────────────────── */}
        <div className="lg:col-span-8 bg-white border border-stone-200">
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-sm font-medium text-charcoal-900">Recent Orders</h3>
            <Link to="orders" className="text-[10px] uppercase tracking-[0.2em] text-bronze-500 hover:text-bronze-600 transition-colors">
              View All
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {recentOrders.map((o) => (
              <div key={o.id} className="px-6 py-4 flex items-center gap-4 group hover:bg-stone-50/50 transition-colors">
                <div className="w-12 h-14 bg-stone-50 overflow-hidden shrink-0">
                  <img src={o.img} alt={o.item} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal-900 truncate">{o.item}</p>
                  <p className="text-[11px] text-charcoal-400 mt-0.5">
                    {o.id} · {o.customer} · Size {o.size}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-charcoal-900 tabular-nums">{o.total}</p>
                  <span className={`inline-block mt-1 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border ${statusBadge(o.status)}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Activity Feed ──────────────────────────────────────── */}
        <div className="lg:col-span-4 bg-white border border-stone-200">
          <div className="px-6 py-5 border-b border-stone-100">
            <h3 className="text-sm font-medium text-charcoal-900">Activity</h3>
          </div>
          <div className="divide-y divide-stone-100">
            {activities.map((a, i) => (
              <div key={i} className="px-6 py-4">
                <p className="text-[13px] text-charcoal-600 leading-relaxed">{a.text}</p>
                <p className="text-[10px] text-charcoal-300 mt-1.5 uppercase tracking-wider">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Collections ─────────────────────────────────────────── */}
      <div className="bg-white border border-stone-200">
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-sm font-medium text-charcoal-900">Your Collections</h3>
          <Link to="collections" className="text-[10px] uppercase tracking-[0.2em] text-bronze-500 hover:text-bronze-600 transition-colors">
            Manage
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-100">
          {collections.map((c) => (
            <div key={c.name} className="p-6 group hover:bg-stone-50/50 transition-colors">
              <div className="aspect-[16/10] bg-stone-50 overflow-hidden mb-4">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif text-base text-charcoal-900">{c.name}</h4>
                  <p className="text-[11px] text-charcoal-400 mt-0.5">{c.pieces} pieces · {c.published}</p>
                </div>
                <span className={`text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border shrink-0 ${statusBadge(c.status)}`}>
                  {c.status}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[11px] text-charcoal-400">
                <span>{c.sales} sales</span>
                <span className="text-stone-300">|</span>
                <span>{c.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "New Collection", desc: "Upload pieces and launch your next collection", action: "Create", to: "collections/new" },
          { title: "Apply for Spotlight", desc: "Get featured on the Adorzia homepage editorial", action: "Grow", to: "/designer/plans" },
          { title: "Artisan Network", desc: "Connect with craft partners across Pakistan", action: "Connect", to: "/crafts" },
        ].map((qa) => (
          <Link key={qa.title} to={qa.to} className="bg-white border border-stone-200 p-6 hover:border-bronze-300/50 transition-all duration-300 group">
            <p className="text-[9px] uppercase tracking-[0.3em] text-bronze-500 mb-2">{qa.action}</p>
            <h4 className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-500 transition-colors duration-300">{qa.title}</h4>
            <p className="text-[13px] text-charcoal-400 mt-1.5">{qa.desc}</p>
          </Link>
        ))}
      </div>

      {/* ── Studio Info ─────────────────────────────────────────── */}
      <div className="bg-charcoal-950 border border-charcoal-800 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-bronze-400 mb-2">Your Studio</p>
          <h4 className="font-serif text-xl text-white">Adorzia Lahore</h4>
          <p className="text-sm text-charcoal-400 mt-1">Coworking space assigned · Active since Jan 2026</p>
        </div>
        <Link
          to="settings"
          className="text-[10px] uppercase tracking-[0.2em] text-bronze-400 hover:text-bronze-300 transition-colors border border-bronze-600/30 px-5 py-2.5 hover:border-bronze-500"
        >
          Manage Studio
        </Link>
      </div>
    </div>
  );
}
