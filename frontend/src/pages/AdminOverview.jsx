import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlatformStats } from "../store/adminSlice";

const fmt = (n) => n >= 1000000 ? `PKR ${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `PKR ${(n / 1000).toFixed(0)}K` : `PKR ${n}`;
const statusLabel = { new: "New", in_production: "In Production", ready_to_ship: "Ready", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" };
const statusColor = { new: "bg-blue-50 text-blue-700", in_production: "bg-amber-50 text-amber-700", ready_to_ship: "bg-indigo-50 text-indigo-700", shipped: "bg-violet-50 text-violet-700", delivered: "bg-emerald-50 text-emerald-700", cancelled: "bg-red-50 text-red-600" };

export default function AdminOverview() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchPlatformStats()); }, [dispatch]);

  const kpis = stats?.data?.kpis || {};
  const revenue = stats?.data?.revenue || {};
  const ordersByStatus = stats?.data?.ordersByStatus || {};
  const monthly = stats?.data?.monthly || {};
  const recentOrders = stats?.data?.recentOrders || [];

  const kpiCards = [
    { label: "Total Users", value: kpis.totalUsers || 0, sub: `+${monthly.newUsers || 0} this month` },
    { label: "Designers", value: kpis.totalDesigners || 0, sub: `${kpis.pendingCollections || 0} collections pending` },
    { label: "Products", value: kpis.totalProducts || 0, sub: "active listings" },
    { label: "Orders", value: kpis.totalOrders || 0, sub: `+${monthly.newOrders || 0} this month` },
  ];

  const revenueCards = [
    { label: "Total GMV", value: fmt(revenue.totalGMV || 0) },
    { label: "Commission Earned", value: fmt(revenue.totalCommission || 0) },
    { label: "Net Payouts", value: fmt(revenue.totalPayout || 0) },
    { label: "Avg. Order Value", value: fmt(revenue.avgOrderValue || 0) },
  ];

  return (
    <div className="space-y-8">
      {/* Loading */}
      {loading && !stats && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-charcoal-300 border-t-charcoal-900 rounded-full animate-spin" />
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((k, i) => (
          <div key={i} className="border border-stone-200 bg-white p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">{k.label}</p>
            <p className="font-serif text-2xl text-charcoal-900">{k.value.toLocaleString()}</p>
            <p className="text-[11px] text-charcoal-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {revenueCards.map((r, i) => (
          <div key={i} className="border border-stone-200 bg-white p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">{r.label}</p>
            <p className="font-serif text-xl text-charcoal-900">{r.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="border border-stone-200 bg-white">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-sm font-medium text-charcoal-900">Orders by Status</h2>
          </div>
          <div className="p-6 space-y-3">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`text-[11px] px-2.5 py-1 ${statusColor[status] || "bg-stone-50 text-charcoal-600"}`}>
                  {statusLabel[status] || status}
                </span>
                <div className="flex items-center gap-3 flex-1 ml-4">
                  <div className="flex-1 bg-stone-100 h-1.5 overflow-hidden">
                    <div className="h-full bg-charcoal-800 transition-all duration-500"
                      style={{ width: `${Math.min((count / (kpis.totalOrders || 1)) * 100, 100)}%` }} />
                  </div>
                  <span className="text-sm text-charcoal-900 font-medium w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(ordersByStatus).length === 0 && (
              <p className="text-sm text-charcoal-400 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="border border-stone-200 bg-white">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="text-sm font-medium text-charcoal-900">Platform Health</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-stone-50">
              <span className="text-sm text-charcoal-500">Pending Payouts</span>
              <span className="text-sm font-medium text-charcoal-900">{kpis.pendingPayouts || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-stone-50">
              <span className="text-sm text-charcoal-500">Collections Pending Review</span>
              <span className="text-sm font-medium text-charcoal-900">{kpis.pendingCollections || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-stone-50">
              <span className="text-sm text-charcoal-500">Monthly Revenue</span>
              <span className="text-sm font-medium text-charcoal-900">{fmt(monthly.revenue || 0)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-charcoal-500">System Status</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs text-emerald-600">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border border-stone-200 bg-white">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-charcoal-900">Recent Orders</h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">Latest 8</span>
        </div>

        {/* Mobile card view */}
        <div className="sm:hidden divide-y divide-stone-100">
          {recentOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-charcoal-400">No orders yet</div>
          ) : (
            recentOrders.map((order) => (
              <div key={order._id} className="px-5 py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-charcoal-900">{order.orderNumber}</span>
                  <span className={`text-[10px] px-2 py-0.5 ${statusColor[order.status] || ""}`}>
                    {statusLabel[order.status] || order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-charcoal-500">
                  <span>{order.customer?.name || "Customer"}</span>
                  <span className="font-medium text-charcoal-900">{fmt(order.financial?.subtotal || 0)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-charcoal-400">
                  <span>{order.designer?.brandName || order.designer?.name || "Designer"}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Order</th>
                <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Customer</th>
                <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Designer</th>
                <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Total</th>
                <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Status</th>
                <th className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-3 text-sm text-charcoal-900 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-6 py-3 text-sm text-charcoal-700">{order.customer?.name || ","}</td>
                  <td className="px-6 py-3 text-sm text-charcoal-700">{order.designer?.brandName || order.designer?.name || ","}</td>
                  <td className="px-6 py-3 text-sm text-charcoal-900 font-medium">{fmt(order.financial?.subtotal || 0)}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] px-2 py-0.5 ${statusColor[order.status] || ""}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-charcoal-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-charcoal-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
