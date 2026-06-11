import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomerOrders } from "../store/customerSlice";

const statusTabs = [
  { label: "All", value: "" },
  { label: "In Progress", value: "active" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const statusColors = {
  new: "bg-charcoal-100 text-charcoal-700",
  in_production: "bg-amber-50 text-amber-700",
  ready_to_ship: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};
const statusLabels = {
  new: "New", in_production: "In Production", ready_to_ship: "Ready to Ship",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
};

export default function CustomerOrders() {
  const { orders } = useSelector((s) => s.customer);
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (status === "active") params.status = "new,in_production,ready_to_ship,shipped";
    else if (status) params.status = status;
    if (search) params.search = search;
    dispatch(fetchCustomerOrders(params));
  }, [dispatch, status, search, page]);

  const allItems = orders.items || [];
  const pagination = orders.pagination;

  return (
    <div className="space-y-6">
      {/* ── Status tabs ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1 border-b border-stone-200 pb-4">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1); }}
            className={`px-4 py-2 text-[12px] tracking-wide transition-colors ${
              status === tab.value
                ? "bg-charcoal-900 text-white"
                : "text-charcoal-500 hover:text-charcoal-900 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search ──────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by order number…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 max-w-xs px-4 py-2 text-sm border border-stone-200 focus:border-charcoal-400 focus:outline-none bg-white"
        />
      </div>

      {/* ── Order list ──────────────────────────────────────── */}
      {orders.loading ? (
        <div className="py-16 text-center text-sm text-charcoal-400">Loading orders…</div>
      ) : allItems.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-charcoal-400 mb-4">
            {search ? "No orders match your search" : "No orders yet"}
          </p>
          <Link to="/products" className="text-xs uppercase tracking-[0.2em] text-bronze-600 hover:text-bronze-800 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {allItems.map((order) => {
            const firstItem = order.items?.[0];
            const itemCount = order.items?.length || 0;
            const date = new Date(order.createdAt).toLocaleDateString("en-PK", {
              month: "short", day: "numeric", year: "numeric",
            });
            return (
              <Link
                key={order._id}
                to={`/dashboard/orders/${order._id}`}
                className="block border border-stone-200 hover:border-stone-400 transition-colors"
              >
                <div className="px-6 py-5">
                  {/* Top row: order number + status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-charcoal-900">{order.orderNumber}</span>
                      <span className="text-[11px] text-charcoal-400">{date}</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 ${statusColors[order.status] || "bg-stone-100 text-charcoal-500"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-4">
                    {firstItem?.image && (
                      <img src={firstItem.image} alt="" className="w-14 h-14 object-cover bg-stone-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal-900 truncate">{firstItem?.name || "Order"}</p>
                      <p className="text-[11px] text-charcoal-400 mt-0.5">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                        {order.designer?.name && ` · ${order.designer.name}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-charcoal-900">
                        {order.financial?.subtotal ? `PKR ${order.financial.subtotal.toLocaleString("en-PK")}` : ","}
                      </p>
                      {order.tracking?.number && (
                        <p className="text-[10px] text-charcoal-400 mt-0.5">Tracking: {order.tracking.number}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Pagination ──────────────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-[11px] border border-stone-200 disabled:opacity-30 hover:bg-stone-100 transition-colors"
          >
            Previous
          </button>
          <span className="text-[11px] text-charcoal-400 px-2">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page >= pagination.totalPages}
            className="px-3 py-1.5 text-[11px] border border-stone-200 disabled:opacity-30 hover:bg-stone-100 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
