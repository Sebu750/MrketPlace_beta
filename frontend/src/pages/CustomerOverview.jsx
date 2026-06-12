import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomerOrders, fetchCustomerStats, fetchWishlist, fetchAddresses } from "../store/customerSlice";

/* ── Status badge helper ───────────────────────────────────────────── */
const statusColors = {
  new: "bg-charcoal-100 text-charcoal-700",
  in_production: "bg-amber-50 text-amber-700",
  ready_to_ship: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};
const statusLabels = {
  new: "New",
  in_production: "In Production",
  ready_to_ship: "Ready to Ship",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function CustomerOverview() {
  const { data: user } = useSelector((s) => s.user);
  const { orders, wishlist, addresses, stats: apiStats } = useSelector((s) => s.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomerOrders({ limit: 5 }));
    if (localStorage.getItem("token")) {
      dispatch(fetchCustomerStats());
      dispatch(fetchWishlist());
      dispatch(fetchAddresses());
    }
  }, [dispatch]);

  const allOrders = orders.items || [];
  const activeOrders = allOrders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const totalSpent = apiStats?.data?.lifetimeSpend || allOrders.reduce((sum, o) => {
    const raw = o.financial?.subtotal || 0;
    return sum + (typeof raw === "number" ? raw : 0);
  }, 0);

  const stats = [
    { label: "Total Orders", value: apiStats?.data?.totalOrders ?? (orders.pagination?.total || allOrders.length) },
    { label: "In Progress", value: apiStats?.data?.activeOrders ?? activeOrders.length },
    { label: "Wishlist", value: apiStats?.data?.wishlistCount ?? wishlist.length, sub: "pieces saved" },
    { label: "Addresses", value: apiStats?.data?.addressCount ?? addresses.length, sub: "saved" },
  ];

  const recentOrders = allOrders.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* ── Welcome ─────────────────────────────────────────── */}
      <div>
        <h2 className="font-serif text-3xl text-charcoal-900 font-light">
          Welcome back, <span className="text-bronze-600">{user?.name?.split(" ")[0] || "there"}</span>
        </h2>
        <p className="mt-1 text-sm text-charcoal-400">Track your orders, manage your wishlist, and explore new collections.</p>
      </div>

      {/* ── Stats grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="border border-stone-200 p-5 hover:border-stone-300 transition-colors">
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">{s.label}</p>
            <p className="font-serif text-2xl text-charcoal-900">{s.value}</p>
            {s.sub && <p className="text-[11px] text-charcoal-400 mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* ── Recent Orders ───────────────────────────────────── */}
      <div className="border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-medium text-charcoal-900">Recent Orders</h3>
          <Link to="/dashboard/orders" className="text-[11px] uppercase tracking-[0.15em] text-charcoal-400 hover:text-charcoal-900 transition-colors">
            View All
          </Link>
        </div>

        {orders.loading ? (
          <div className="px-6 py-12 text-center text-sm text-charcoal-400">Loading orders…</div>
        ) : recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-charcoal-400 mb-4">No orders yet</p>
            <Link to="/products" className="text-xs uppercase tracking-[0.2em] text-bronze-600 hover:text-bronze-800 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentOrders.map((order) => {
              const firstItem = order.items?.[0];
              const itemCount = order.items?.length || 0;
              return (
                <Link
                  key={order._id}
                  to={`/dashboard/orders/${order._id}`}
                  className="px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail */}
                    {firstItem?.image && (
                      <img src={firstItem.image} alt="" className="w-12 h-12 object-cover shrink-0 bg-stone-100" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-charcoal-900 truncate">{firstItem?.name || "Order"}</p>
                      <p className="text-[11px] text-charcoal-400 mt-0.5">
                        {order.orderNumber} · {new Date(order.createdAt).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" })}
                        {itemCount > 1 && ` · +${itemCount - 1} more`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm text-charcoal-900">
                      {order.financial?.subtotal ? `PKR ${order.financial.subtotal.toLocaleString("en-PK")}` : ","}
                    </p>
                    <span className={`inline-block text-[10px] px-2 py-0.5 mt-0.5 ${statusColors[order.status] || "bg-stone-100 text-charcoal-500"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Quick actions ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/products" className="border border-stone-200 p-6 hover:border-stone-400 transition-colors group">
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">Discover</p>
          <p className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-600 transition-colors">Browse Collections</p>
          <p className="text-[12px] text-charcoal-400 mt-1">Explore new arrivals from Pakistan's finest designers</p>
        </Link>
        <Link to="/dashboard/wishlist" className="border border-stone-200 p-6 hover:border-stone-400 transition-colors group">
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">Saved</p>
          <p className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-600 transition-colors">Your Wishlist</p>
          <p className="text-[12px] text-charcoal-400 mt-1">{wishlist.length} pieces waiting for you</p>
        </Link>
        <Link to="/designers" className="border border-stone-200 p-6 hover:border-stone-400 transition-colors group">
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">Connect</p>
          <p className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-600 transition-colors">Meet Our Designers</p>
          <p className="text-[12px] text-charcoal-400 mt-1">Follow creators and see their latest work</p>
        </Link>
      </div>

      {/* ── Total spent banner ───────────────────────────────── */}
      {totalSpent > 0 && (
        <div className="bg-stone-50 border border-stone-200 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">Lifetime Spend</p>
            <p className="font-serif text-xl text-charcoal-900 mt-1">PKR {totalSpent.toLocaleString("en-PK")}</p>
          </div>
          <p className="text-[11px] text-charcoal-400 sm:text-right">
            Thank you for supporting<br />Pakistan's design community
          </p>
        </div>
      )}
    </div>
  );
}
