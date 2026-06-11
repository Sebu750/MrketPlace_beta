import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrder, advanceOrderStatus, addTracking } from "../store/ordersSlice";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconArrowLeft = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const IconCheck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
const IconPrinter = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const IconDownload = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconMail = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>;
const IconMapPin = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconTruck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconSend = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;

/* ── Status Helpers ─────────────────────────────────────────────────── */
const statusApiMap = { "New": "new", "In Production": "in_production", "Ready to Ship": "ready_to_ship", "Shipped": "shipped", "Delivered": "delivered" };
const WORKFLOW = ["New", "In Production", "Ready to Ship", "Shipped", "Delivered"];

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerOrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading } = useSelector((s) => s.orders);
  const [trackingNum, setTrackingNum] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [dispatch, id]);

  if (loading || !order) {
    return <div className="flex items-center justify-center py-20"><p className="text-sm text-charcoal-400">Loading order...</p></div>;
  }

  const status = ({ new: "New", in_production: "In Production", ready_to_ship: "Ready to Ship", shipped: "Shipped", delivered: "Delivered" }[order.status] || order.status);
  const currentIdx = WORKFLOW.indexOf(status);

  const advanceStatus = () => {
    const next = WORKFLOW[currentIdx + 1];
    if (!next) return;
    const apiNext = statusApiMap[next];
    if (next === "Ready to Ship" && trackingNum) {
      dispatch(addTracking({ id: order._id, trackingNumber: trackingNum, carrier: "Standard", url: "" })).then(() => {
        dispatch(advanceOrderStatus({ id: order._id, status: apiNext }));
      });
    } else {
      dispatch(advanceOrderStatus({ id: order._id, status: apiNext }));
    }
  };

  const addNote = () => {
    if (!note.trim()) return;
    setNotes([...notes, { text: note.trim(), time: new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }) }]);
    setNote("");
  };

  const financial = order.financial || {};
  const shipping = order.shippingAddress || {};
  const customer = shipping || {};

  const statusStyles = {
    "New": "bg-blue-50 text-blue-700 border-blue-200",
    "In Production": "bg-amber-50 text-amber-700 border-amber-200",
    "Ready to Ship": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Shipped": "bg-violet-50 text-violet-700 border-violet-200",
    "Delivered": "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const orderId = order.orderNumber || order._id;
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const orderTime = new Date(order.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div>
        <Link to=".." className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-charcoal-400 hover:text-charcoal-900 transition-colors mb-3">
          <IconArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-3xl text-charcoal-900 font-light">{orderId}</h2>
              <span className={`text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 border ${statusStyles[status]}`}>{status}</span>
            </div>
            <p className="text-sm text-charcoal-400 mt-1">Placed on {orderDate} at {orderTime}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">
              <IconPrinter className="w-3.5 h-3.5" /> Packing Slip
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-charcoal-600 border border-stone-200 hover:border-charcoal-300 transition-colors">
              <IconDownload className="w-3.5 h-3.5" /> Invoice
            </button>
          </div>
        </div>
      </div>

      {/* ── Status Workflow Stepper ─────────────────────────────── */}
      <div className="bg-white border border-stone-200 p-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 mb-4">Order Progress</p>
        <div className="flex items-center">
          {WORKFLOW.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center text-center">
                <div className={`w-8 h-8 flex items-center justify-center text-[10px] font-medium border transition-all duration-500 ${
                  i < currentIdx ? "bg-bronze-500 text-white border-bronze-500" :
                  i === currentIdx ? "bg-charcoal-900 text-white border-charcoal-900" :
                  "bg-white text-charcoal-300 border-stone-200"
                }`}>
                  {i < currentIdx ? <IconCheck className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[9px] uppercase tracking-[0.15em] mt-2 whitespace-nowrap ${
                  i <= currentIdx ? "text-charcoal-900" : "text-charcoal-300"
                }`}>{s}</span>
              </div>
              {i < WORKFLOW.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-colors duration-500 ${
                  i < currentIdx ? "bg-bronze-500" : "bg-stone-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Advance button */}
        {currentIdx < WORKFLOW.length - 1 && (
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
            <p className="text-xs text-charcoal-400">Next: <span className="text-charcoal-700 font-medium">{WORKFLOW[currentIdx + 1]}</span></p>
            {WORKFLOW[currentIdx + 1] === "Ready to Ship" ? (
              <div className="flex items-center gap-2">
                <IconTruck className="w-4 h-4 text-charcoal-400" />
                <input type="text" placeholder="Tracking number" value={trackingNum} onChange={(e) => setTrackingNum(e.target.value)}
                  className="border border-stone-200 px-3 py-2 text-xs text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-300 w-48" />
                <button onClick={advanceStatus} className="px-4 py-2 text-[10px] uppercase tracking-[0.15em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
                  Mark Ready to Ship
                </button>
              </div>
            ) : (
              <button onClick={advanceStatus} className="px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
                Advance to {WORKFLOW[currentIdx + 1]}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-100">
              <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium">Order Items</p>
            </div>
            <div className="divide-y divide-stone-100">
              {(order.items || []).map((item, i) => (
                <div key={i} className="px-6 py-4 flex gap-4">
                  <div className="w-16 h-20 bg-stone-50 overflow-hidden shrink-0 border border-stone-100">
                    <img src={item.image || "/assets/images/placeholder.webp"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-charcoal-900 font-medium">{item.name}</p>
                    <p className="text-[11px] text-charcoal-400 mt-0.5">{item.collection || ""}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-charcoal-500">
                      <span>Size: {item.size || ","}</span>
                      <span>Color: {item.color || ","}</span>
                      <span>Qty: {item.quantity || 1}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-charcoal-900 tabular-nums">PKR {(item.price || 0).toLocaleString("en-PK")}</p>
                    {(item.quantity || 1) > 1 && <p className="text-[10px] text-charcoal-400">× {item.quantity}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium mb-4">Order Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-charcoal-600"><span>Subtotal</span><span className="tabular-nums">PKR {(financial.subtotal || 0).toLocaleString("en-PK")}</span></div>
              <div className="flex justify-between text-charcoal-600"><span>Platform Commission ({(financial.commissionRate || 10)}%)</span><span className="tabular-nums text-red-500">− PKR {(financial.commission || 0).toLocaleString("en-PK")}</span></div>
              <div className="flex justify-between text-charcoal-600"><span>Shipping</span><span className="tabular-nums">{(financial.shippingCost || 0) === 0 ? "Free" : `PKR ${financial.shippingCost.toLocaleString("en-PK")}`}</span></div>
              <div className="border-t border-stone-100 pt-2 flex justify-between text-charcoal-900 font-medium">
                <span>Net Payout</span>
                <span className="tabular-nums">PKR {(financial.netPayout || 0).toLocaleString("en-PK")}</span>
              </div>
            </div>
            <p className="text-[11px] text-charcoal-400 mt-3">Payment: {order.paymentMethod || "Online Payment"}</p>
          </div>

          {/* Notes */}
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium mb-4">Internal Notes</p>
            {notes.length > 0 && (
              <div className="space-y-2 mb-4">
                {notes.map((n, i) => (
                  <div key={i} className="bg-stone-50 border border-stone-100 px-4 py-2.5">
                    <p className="text-xs text-charcoal-700">{n.text}</p>
                    <p className="text-[10px] text-charcoal-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" placeholder="Add a note..." value={note} onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                className="flex-1 border border-stone-200 px-4 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none focus:border-bronze-300" />
              <button onClick={addNote} className="px-4 py-2 text-[10px] uppercase tracking-[0.15em] bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors">
                <IconSend className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column ─────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium mb-4">Customer</p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-charcoal-900 font-medium">{customer.name || "Customer"}</p>
                <p className="text-xs text-charcoal-500 mt-0.5">{customer.email || customer.phone || ""}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium mb-4">Shipping Address</p>
            <div className="flex gap-2.5">
              <IconMapPin className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-charcoal-900">{shipping.address || ""}</p>
                <p className="text-xs text-charcoal-500 mt-0.5">{shipping.city || ""} {shipping.province || ""} {shipping.zip || ""}</p>
                <p className="text-xs text-charcoal-500">{shipping.country || "Pakistan"}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-stone-200 p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium mb-4">Timeline</p>
            <div className="space-y-3">
              {(order.timeline || []).map((event, i, arr) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-bronze-500 mt-1.5" />
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-stone-200 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-charcoal-900 font-medium">{({ new: "Order Placed", in_production: "In Production", ready_to_ship: "Ready to Ship", shipped: "Shipped", delivered: "Delivered" }[event.status] || event.status)}</p>
                    <p className="text-[11px] text-charcoal-400">{new Date(event.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
