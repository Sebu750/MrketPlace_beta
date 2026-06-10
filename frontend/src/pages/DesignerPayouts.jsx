import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayouts, fetchPayoutSummary } from "../store/payoutsSlice";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IconDownload = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IconCheck = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>;
const IconAlert = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconBank = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>;
const IconEdit = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconCalendar = (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

/* ── Status Styles ─────────────────────────────────────────────────── */
const statusStyles = {
  processed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-600 border-red-200",
  Processed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Failed: "bg-red-50 text-red-600 border-red-200",
};

/* ───────────────────────────────────────────────────────────────────── */
export default function DesignerPayouts() {
  const dispatch = useDispatch();
  const { items: payouts, loading, summary, pages } = useSelector((s) => s.payouts);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    dispatch(fetchPayouts({}));
    dispatch(fetchPayoutSummary());
  }, [dispatch]);

  const summaryData = summary || {};
  const monthlyRevenue = (summaryData.monthlyRevenue || []).map((m) => ({ month: m._id?.slice(-2) || "", amount: m.revenue || 0 }));
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.amount), 1);
  const totalEarnings = summaryData.totalEarnings || payouts.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmount = summaryData.pendingAmount || 0;
  const processedPayouts = payouts.filter((p) => p.status === "processed" || p.status === "Processed");
  const lastPayout = processedPayouts[0];

  const payoutHistory = payouts.map((p) => ({
    id: p.reference || p._id,
    date: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    amount: p.amount || 0,
    status: p.status?.charAt(0).toUpperCase() + p.status?.slice(1) || "Pending",
    method: `Bank Transfer${p.bankName ? ` (${p.bankName})` : ""}`,
  }));

  const taxDocs = [
    { label: "Q1 2026 Tax Report (Jan–Mar)", date: "Apr 1, 2026" },
    { label: "Q4 2025 Tax Report (Oct–Dec)", date: "Jan 2, 2026" },
    { label: "Annual Summary 2025", date: "Jan 15, 2026" },
  ];

  if (loading && payouts.length === 0) {
    return <div className="flex items-center justify-center py-20"><p className="text-sm text-charcoal-400">Loading payouts...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-bronze-500 mb-1">Payouts</p>
        <h2 className="font-serif text-3xl text-charcoal-900 font-light">Earnings & Payouts</h2>
        <p className="text-sm text-charcoal-400 mt-1">Track your revenue, payouts, and commission breakdown</p>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Earnings", value: `PKR ${totalEarnings.toLocaleString("en-PK")}` },
          { label: "Pending Payout", value: `PKR ${pendingAmount.toLocaleString("en-PK")}`, note: "Next payout: 1st / 15th" },
          { label: "Last Payout", value: lastPayout ? `PKR ${(lastPayout.amount || 0).toLocaleString("en-PK")}` : "—", note: lastPayout ? new Date(lastPayout.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "" },
          { label: "Commission Rate", value: `${summaryData.commissionRate || 10}%`, note: "Pro Plan" },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-stone-200 p-5">
            <p className="text-[9px] uppercase tracking-[0.25em] text-charcoal-400 mb-2">{card.label}</p>
            <p className="font-serif text-2xl text-charcoal-900 tabular-nums">{card.value}</p>
            {card.note && <p className="text-[10px] text-charcoal-400 mt-2">{card.note}</p>}
          </div>
        ))}
      </div>

      {/* ── Payout Schedule ─────────────────────────────────────── */}
      <div className="bg-ivory-50 border border-stone-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconCalendar className="w-5 h-5 text-bronze-500" />
          <div>
            <p className="text-sm text-charcoal-900 font-medium">Bi-Weekly Payout Schedule</p>
            <p className="text-xs text-charcoal-500">Payouts are processed on the 1st and 15th of each month</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">Next Payout</p>
          <p className="text-sm text-charcoal-900 font-medium tabular-nums">Jun 15, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Revenue Chart (Left 2/3) ──────────────────────────── */}
        <div className="lg:col-span-2 bg-white border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium">Revenue by Month</p>
            <div className="flex items-center gap-1">
              {["6m", "12m", "all"].map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] border transition-colors ${
                    period === p ? "bg-charcoal-900 text-white border-charcoal-900" : "text-charcoal-400 border-stone-200 hover:border-charcoal-300"
                  }`}>{p}</button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end gap-3 h-48">
            {monthlyRevenue.length === 0 && <p className="text-sm text-charcoal-400 mx-auto">No revenue data yet</p>}
            {monthlyRevenue.map((m) => {
              const h = (m.amount / maxRevenue) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-charcoal-500 tabular-nums">{(m.amount / 1000).toFixed(0)}k</span>
                  <div className="w-full bg-stone-100 relative" style={{ height: "100%" }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-bronze-400 transition-all duration-700 ease-out" style={{ height: `${h}%` }} />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-charcoal-400">{m.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-charcoal-500">
            <span>Total: <span className="text-charcoal-900 font-medium tabular-nums">PKR {monthlyRevenue.reduce((s, m) => s + m.amount, 0).toLocaleString("en-PK")}</span></span>
            <span>Avg/month: <span className="text-charcoal-900 font-medium tabular-nums">PKR {monthlyRevenue.length > 0 ? Math.round(monthlyRevenue.reduce((s, m) => s + m.amount, 0) / monthlyRevenue.length).toLocaleString("en-PK") : "0"}</span></span>
          </div>
        </div>

        {/* ── Bank Details (Right 1/3) ──────────────────────────── */}
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium">Bank Details</p>
            <button className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-bronze-500 hover:text-bronze-600 transition-colors">
              <IconEdit className="w-3.5 h-3.5" /> Update
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <IconBank className="w-5 h-5 text-charcoal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-charcoal-900 font-medium">Habib Bank Limited</p>
                <p className="text-xs text-charcoal-500 mt-0.5">Current Account</p>
              </div>
            </div>
            <div className="bg-stone-50 border border-stone-100 px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-xs"><span className="text-charcoal-400">Account Holder</span><span className="text-charcoal-900">Zara Ahmad</span></div>
              <div className="flex justify-between text-xs"><span className="text-charcoal-400">Account No.</span><span className="text-charcoal-900 tabular-nums">****4521</span></div>
              <div className="flex justify-between text-xs"><span className="text-charcoal-400">Branch</span><span className="text-charcoal-900">Gulberg III, Lahore</span></div>
              <div className="flex justify-between text-xs"><span className="text-charcoal-400">IBAN</span><span className="text-charcoal-900 tabular-nums">PK36HABB****4521</span></div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <IconCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] text-emerald-600">Verified</span>
            </div>
          </div>

          {/* Tax Documents */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium mb-3">Tax Documents</p>
            <div className="space-y-2">
              {taxDocs.map((doc) => (
                <button key={doc.label} className="w-full flex items-center justify-between text-left group hover:bg-stone-50 px-3 py-2 -mx-3 transition-colors">
                  <div>
                    <p className="text-xs text-charcoal-700 group-hover:text-bronze-500 transition-colors">{doc.label}</p>
                    <p className="text-[10px] text-charcoal-400">{doc.date}</p>
                  </div>
                  <IconDownload className="w-3.5 h-3.5 text-charcoal-300 group-hover:text-bronze-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Payout History ──────────────────────────────────────── */}
      <div className="bg-white border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-100">
          <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-400 font-medium">Payout History</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50">
                <th className="text-left px-6 py-3 text-[9px] uppercase tracking-[0.2em] text-charcoal-400 font-medium">Reference</th>
                <th className="text-left px-6 py-3 text-[9px] uppercase tracking-[0.2em] text-charcoal-400 font-medium">Date</th>
                <th className="text-right px-6 py-3 text-[9px] uppercase tracking-[0.2em] text-charcoal-400 font-medium">Amount</th>
                <th className="text-center px-6 py-3 text-[9px] uppercase tracking-[0.2em] text-charcoal-400 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-[9px] uppercase tracking-[0.2em] text-charcoal-400 font-medium hidden md:table-cell">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {payoutHistory.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-3.5 text-sm text-charcoal-900 tabular-nums">{p.id}</td>
                  <td className="px-6 py-3.5 text-xs text-charcoal-600">{p.date}</td>
                  <td className="px-6 py-3.5 text-sm text-charcoal-900 text-right tabular-nums font-medium">PKR {p.amount.toLocaleString("en-PK")}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border ${statusStyles[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-charcoal-500 hidden md:table-cell">{p.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
