import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminOrders, adminUpdateOrderStatus } from "../store/adminSlice";

const statusLabel = { new: "New", in_production: "In Production", ready_to_ship: "Ready to Ship", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" };
const statusColor = { new: "bg-blue-50 text-blue-700", in_production: "bg-amber-50 text-amber-700", ready_to_ship: "bg-indigo-50 text-indigo-700", shipped: "bg-violet-50 text-violet-700", delivered: "bg-emerald-50 text-emerald-700", cancelled: "bg-red-50 text-red-600" };
const tabs = ["All", "New", "In Production", "Ready to Ship", "Shipped", "Delivered", "Cancelled"];
const fmt = (n) => `PKR ${(n || 0).toLocaleString()}`;

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.admin);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const status = tab === "All" ? null : Object.entries(statusLabel).find(([, v]) => v === tab)?.[0];
    dispatch(fetchAdminOrders({ status, search: search || null }));
  }, [dispatch, tab]);

  const handleSearch = () => {
    const status = tab === "All" ? null : Object.entries(statusLabel).find(([, v]) => v === tab)?.[0];
    dispatch(fetchAdminOrders({ status, search: search || null }));
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(adminUpdateOrderStatus({ id, status: newStatus })).then(() => {
      const status = tab === "All" ? null : Object.entries(statusLabel).find(([, v]) => v === tab)?.[0];
      dispatch(fetchAdminOrders({ status }));
    });
  };

  const items = orders.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-1 border border-stone-200 bg-white">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2 text-[11px] uppercase tracking-wider transition-colors ${
                tab === t ? "bg-charcoal-900 text-white" : "text-charcoal-500 hover:bg-stone-50"
              }`}>{t}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Order number..." className="border border-stone-200 px-4 py-2 text-sm w-48 focus:outline-none focus:border-charcoal-400" />
          <button onClick={handleSearch} className="bg-charcoal-900 text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-charcoal-800 transition-colors">Search</button>
        </div>
      </div>

      <div className="border border-stone-200 bg-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {["Order #", "Customer", "Designer", "Items", "Total", "Commission", "Status", "Date", ""].map((h) => (
                <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] text-charcoal-400 px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {items.map((o) => (
              <>
                <tr key={o._id} className="hover:bg-stone-50/50 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === o._id ? null : o._id)}>
                  <td className="px-5 py-3 text-xs text-charcoal-900 font-mono">{o.orderNumber}</td>
                  <td className="px-5 py-3 text-sm text-charcoal-700">{o.customer?.name || ","}</td>
                  <td className="px-5 py-3 text-sm text-charcoal-700">{o.designer?.brandName || o.designer?.name || ","}</td>
                  <td className="px-5 py-3 text-sm text-charcoal-600">{o.items?.length || 0} items</td>
                  <td className="px-5 py-3 text-sm text-charcoal-900 font-medium">{fmt(o.financial?.subtotal)}</td>
                  <td className="px-5 py-3 text-sm text-charcoal-500">{fmt(o.financial?.commission)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2 py-0.5 ${statusColor[o.status] || ""}`}>{statusLabel[o.status] || o.status}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-charcoal-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-xs text-charcoal-400">{expandedId === o._id ? "▲" : "▼"}</td>
                </tr>
                {expandedId === o._id && (
                  <tr key={`${o._id}-detail`} className="bg-stone-50">
                    <td colSpan={9} className="px-8 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-charcoal-400 mb-2">Shipping</p>
                          <p className="text-xs text-charcoal-700">{o.shipping?.address}, {o.shipping?.city}</p>
                          <p className="text-xs text-charcoal-500 mt-1">{o.shipping?.method || "Standard"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-charcoal-400 mb-2">Items</p>
                          {o.items?.map((item, i) => (
                            <p key={i} className="text-xs text-charcoal-700">{item.name} × {item.quantity} , {item.price}</p>
                          ))}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-charcoal-400 mb-2">Update Status</p>
                          <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className="text-xs border border-stone-200 px-3 py-1.5 focus:outline-none">
                            {Object.entries(statusLabel).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={9} className="px-6 py-8 text-center text-sm text-charcoal-400">{loading ? "Loading..." : "No orders found"}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
