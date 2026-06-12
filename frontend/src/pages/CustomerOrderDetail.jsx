import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCustomerOrder, clearCurrentOrder } from "../store/customerSlice";

const statusFlow = ["new", "in_production", "ready_to_ship", "shipped", "delivered"];
const statusLabels = {
  new: "New", in_production: "In Production", ready_to_ship: "Ready to Ship",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
};
const statusColors = {
  new: "bg-charcoal-100 text-charcoal-700",
  in_production: "bg-amber-50 text-amber-700",
  ready_to_ship: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function CustomerOrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((s) => s.customer.orders.current);
  const loading = useSelector((s) => s.customer.orders.loading);

  useEffect(() => {
    dispatch(fetchCustomerOrder(id));
    return () => { dispatch(clearCurrentOrder()); };
  }, [dispatch, id]);

  if (loading && !order) {
    return <div className="py-16 text-center text-sm text-charcoal-400">Loading order…</div>;
  }
  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-charcoal-400 mb-4">Order not found</p>
        <Link to="/dashboard/orders" className="text-xs uppercase tracking-[0.2em] text-bronze-600 hover:text-bronze-800">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStatusIdx = statusFlow.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  const designerName = order.designer?.name || order.designer?.brandName || "Designer";

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/dashboard/orders" className="text-[11px] uppercase tracking-[0.15em] text-charcoal-400 hover:text-charcoal-900 transition-colors mb-2 inline-block">
            ← Back to Orders
          </Link>
          <h2 className="font-serif text-2xl text-charcoal-900 font-light">Order {order.orderNumber}</h2>
          <p className="text-[12px] text-charcoal-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-PK", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <span className={`text-[11px] px-3 py-1.5 ${statusColors[order.status] || "bg-stone-100 text-charcoal-500"}`}>
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      {/* ── Status timeline ─────────────────────────────────── */}
      {!isCancelled && (
        <div className="border border-stone-200 p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-5">Order Progress</p>
          <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar -mx-2 px-2">
            <div className="flex items-center justify-between relative min-w-[400px]">
              {/* Progress line */}
              <div className="absolute top-[10px] left-0 right-0 h-[2px] bg-stone-200" />
              <div
                className="absolute top-[10px] left-0 h-[2px] bg-emerald-500 transition-all duration-700"
                style={{ width: `${currentStatusIdx >= 0 ? (currentStatusIdx / (statusFlow.length - 1)) * 100 : 0}%` }}
              />

              {statusFlow.map((step, idx) => {
                const isComplete = idx <= currentStatusIdx;
                const isCurrent = idx === currentStatusIdx;
                return (
                  <div key={step} className="relative flex flex-col items-center z-10 snap-start">
                    <div className={`w-5 h-5 flex items-center justify-center text-[10px] transition-colors ${
                      isComplete ? "bg-emerald-500 text-white" : "bg-stone-200 text-charcoal-400"
                    } ${isCurrent ? "ring-2 ring-emerald-200 ring-offset-2" : ""}`}>
                      {isComplete ? "✓" : idx + 1}
                    </div>
                    <p className={`mt-2 text-[9px] uppercase tracking-[0.15em] text-center max-w-[70px] ${
                      isComplete ? "text-charcoal-700" : "text-charcoal-300"
                    }`}>
                      {statusLabels[step]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Two column layout ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items , 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-stone-200">
            <div className="px-5 py-3 border-b border-stone-200">
              <p className="text-sm text-charcoal-900">Items ({order.items?.length || 0})</p>
            </div>
            <div className="divide-y divide-stone-100">
              {(order.items || []).map((item, i) => (
                <div key={i} className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  {item.image && (
                    <img src={item.image} alt="" className="w-16 h-16 object-cover bg-stone-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-charcoal-900">{item.name}</p>
                    <p className="text-[11px] text-charcoal-400 mt-0.5">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && " · "}
                      {item.color && `Color: ${item.color}`}
                      {` · Qty: ${item.quantity}`}
                    </p>
                  </div>
                  <p className="text-sm text-charcoal-900 shrink-0">{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          {order.shipping && (
            <div className="border border-stone-200 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-3">Shipping Address</p>
              <p className="text-sm text-charcoal-900">{order.shipping.name || order.customer?.name}</p>
              <p className="text-[12px] text-charcoal-500 mt-1">
                {order.shipping.address}
                {order.shipping.city && `, ${order.shipping.city}`}
                {order.shipping.postalCode && ` ${order.shipping.postalCode}`}
              </p>
              {order.shipping.phone && (
                <p className="text-[11px] text-charcoal-400 mt-1">Phone: {order.shipping.phone}</p>
              )}
            </div>
          )}
        </div>

        {/* Summary , 1/3 width */}
        <div className="space-y-4">
          {/* Financial summary */}
          <div className="border border-stone-200 p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-4">Order Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span>PKR {(order.financial?.subtotal || 0).toLocaleString("en-PK")}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Shipping</span>
                <span>{order.financial?.shipping ? `PKR ${order.financial.shipping.toLocaleString("en-PK")}` : "Free"}</span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between text-charcoal-900 font-medium">
                <span>Total</span>
                <span>PKR {(order.financial?.subtotal || 0).toLocaleString("en-PK")}</span>
              </div>
            </div>
          </div>

          {/* Designer */}
          <div className="border border-stone-200 p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">Designer</p>
            <p className="text-sm text-charcoal-900">{designerName}</p>
          </div>

          {/* Tracking */}
          {order.tracking?.number && (
            <div className="border border-stone-200 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-2">Tracking</p>
              <p className="text-sm text-charcoal-900">{order.tracking.carrier || "Carrier"}</p>
              <p className="text-[12px] text-bronze-600 mt-0.5">{order.tracking.number}</p>
              {order.tracking.url && (
                <a href={order.tracking.url} target="_blank" rel="noreferrer" className="text-[11px] text-charcoal-400 hover:text-charcoal-900 underline mt-1 inline-block">
                  Track shipment →
                </a>
              )}
            </div>
          )}

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="border border-stone-200 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-3">Timeline</p>
              <div className="space-y-3">
                {[...order.timeline].reverse().map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-charcoal-300 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[12px] text-charcoal-900">{statusLabels[t.status] || t.status}</p>
                      <p className="text-[10px] text-charcoal-400">
                        {new Date(t.timestamp).toLocaleDateString("en-PK", { month: "short", day: "numeric" })}
                        {t.notes && ` · ${t.notes}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
