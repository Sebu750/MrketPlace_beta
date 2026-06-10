import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDesignerOrders } from "../store/ordersSlice";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconSearch = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
const IconChevron = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 12 15 18 9"/></svg>;
const IconClock = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconFilter = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;

/* ── Status Helpers ─────────────────────────────────────────────────── */
const statusLabel = (s) => ({ new: "New", in_production: "In Production", ready_to_ship: "Ready to Ship", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" }[s] || s);
const statusValue = (s) => ({ "New": "new", "In Production": "in_production", "Ready to Ship": "ready_to_ship", "Shipped": "shipped", "Delivered": "delivered", "Cancelled": "cancelled" }[s] || s);
const statusTabs = ["All", "New", "In Production", "Ready to Ship", "Shipped", "Delivered", "Cancelled"];

const statusStyles = {
  "New": "bg-blue-50 text-blue-700 border-blue-200",
  "In Production": "bg-amber-50 text-amber-700 border-amber-200",
  "Ready to Ship": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Shipped": "bg-violet-50 text-violet-700 border-violet-200",
  "Delivered": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Cancelled": "bg-stone-50 text-charcoal-400 border-stone-200",
};

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerOrders() {
  const dispatch = useDispatch();
  const { items: rawOrders, loading, total } = useSelector((s) => s.orders);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const apiStatus = activeTab === "All" ? null : statusValue(activeTab);
    dispatch(fetchDesignerOrders({ status: apiStatus, search: search || null }));
  }, [dispatch, activeTab, search]);

  const orders = rawOrders.map((o) => ({
    id: o.orderNumber || o._id,
    _id: o._id,
    date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    customer: o.shippingAddress?.name || "Customer",
    items: (o.items || []).map((i) => ({ name: i.name, img: i.image || "/assets/images/placeholder.webp", size: i.size || "" })),
    total: o.financial?.subtotal || 0,
    status: statusLabel(o.status),
    itemCount: o.items?.length || 0,
  }));

  let filtered = [...orders];
  if (sort === "newest") filtered.sort((a, b) => b.id.localeCompare(a.id));
  if (sort === "oldest") filtered.sort((a, b) => a.id.localeCompare(b.id));
  if (sort === "total-high") filtered.sort((a, b) => b.total - a.total);
  if (sort === "total-low") filtered.sort((a, b) => a.total - b.total);

  const totalRevenue = rawOrders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + (o.financial?.subtotal || 0), 0);

  const statusCounts = {
    "All": total,
    "New": rawOrders.filter(o => o.status === "new").length,
    "In Production": rawOrders.filter(o => o.status === "in_production").length,
    "Ready to Ship": rawOrders.filter(o => o.status === "ready_to_ship").length,
    "Shipped": rawOrders.filter(o => o.status === "shipped").length,
    "Delivered": rawOrders.filter(o => o.status === "delivered").length,
    "Cancelled": rawOrders.filter(o => o.status === "cancelled").length,
  };

  if (loading && rawOrders.length === 0) {
    return <div className="flex items-center justify-center py-20"><p className="text-sm text-charcoal-400">Loading orders...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Orders</p>
          <h2 className="font-serif text-3xl text-charcoal-900 font-light">Order Management</h2>
          <p className="text-sm text-charcoal-400 mt-1">{total} orders · PKR {totalRevenue.toLocaleString("en-PK")} total</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="border border-stone-200 px-3 py-2 text-xs text-charcoal-600 bg-white focus:outline-none focus:border-bronze-300 appearance-none pr-8 transition-colors">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="total-high">Total: High → Low</option>
            <option value="total-low">Total: Low → High</option>
          </select>
        </div>
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div className="relative max-w-md">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
        <input type="text" placeholder="Search by order ID or customer name..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-stone-200 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-300 transition-colors" />
      </div>

      {/* ── Status Tabs ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1 flex-wrap">
        {statusTabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-[10px] uppercase tracking-[0.15em] border transition-all duration-300 ${
              activeTab === tab ? "bg-charcoal-900 text-white border-charcoal-900" : "bg-white text-charcoal-500 border-stone-200 hover:border-charcoal-300"
            }`}>
            {tab} <span className="ml-1 opacity-60 tabular-nums">{statusCounts[tab]}</span>
          </button>
        ))}
      </div>

      {/* ── Order List ──────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.map((o) => (
          <Link to={o._id} key={o._id}
            className="block bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-300 group">
            <div className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-4">
              {/* Order info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-sm font-medium text-charcoal-900 tabular-nums">{o.id}</span>
                  <span className={`text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border ${statusStyles[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-xs text-charcoal-500">{o.customer} · {o.date}</p>
              </div>

              {/* Items preview */}
              <div className="flex items-center gap-1.5">
                {o.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="w-10 h-12 bg-stone-50 overflow-hidden border border-stone-100 shrink-0" title={`${item.name} (${item.size})`}>
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-80" />
                  </div>
                ))}
                {o.itemCount > 3 && (
                  <span className="text-[10px] text-charcoal-400 ml-1">+{o.itemCount - 3}</span>
                )}
              </div>

              {/* Total */}
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-charcoal-900 tabular-nums">PKR {o.total.toLocaleString("en-PK")}</p>
                <p className="text-[10px] text-charcoal-400">{o.itemCount} {o.itemCount === 1 ? "item" : "items"}</p>
              </div>

              {/* Arrow */}
              <IconChevron className="w-4 h-4 text-charcoal-300 group-hover:text-charcoal-500 transition-colors shrink-0 hidden md:block" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Empty State ─────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white border border-stone-200">
          <IconClock className="w-8 h-8 text-charcoal-300 mx-auto mb-3" />
          <p className="font-serif text-xl text-charcoal-900 mb-2">No orders found</p>
          <p className="text-sm text-charcoal-400">
            {search ? `No results for "${search}".` : "Orders will appear here when customers place orders."}
          </p>
        </div>
      )}

      {/* ── Results Count ───────────────────────────────────────── */}
      {filtered.length > 0 && (
        <p className="text-[11px] text-charcoal-400 text-center">
          Showing {filtered.length} of {total} orders
        </p>
      )}
    </div>
  );
}
