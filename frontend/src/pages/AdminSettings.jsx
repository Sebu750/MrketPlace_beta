import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlatformStats } from "../store/adminSlice";

const fmt = (n) => "₨ " + Number(n || 0).toLocaleString("en-PK");

export default function AdminSettings() {
  const dispatch = useDispatch();
  const { stats } = useSelector((s) => s.admin);

  useEffect(() => {
    if (!stats) dispatch(fetchPlatformStats());
  }, [dispatch, stats]);

  const commission = stats?.revenue?.commissionRate || 15;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* ── Platform Info ─────────────────────────── */}
      <section>
        <h2 className="font-serif text-lg text-charcoal-800 mb-1">Platform Information</h2>
        <p className="text-[11px] text-charcoal-400 mb-5">Core platform configuration</p>
        <div className="bg-white border border-stone-200">
          {[
            { label: "Platform Name", value: "Adorzia" },
            { label: "Environment", value: import.meta.env.MODE || "development" },
            { label: "API Base", value: import.meta.env.VITE_API_URL || "/api" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-4 border-b border-stone-50 last:border-0">
              <span className="text-[12px] text-charcoal-500">{row.label}</span>
              <span className="text-[13px] text-charcoal-800 font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Financial Settings ─────────────────────── */}
      <section>
        <h2 className="font-serif text-lg text-charcoal-800 mb-1">Financial Settings</h2>
        <p className="text-[11px] text-charcoal-400 mb-5">Commission and payout configuration</p>
        <div className="bg-white border border-stone-200">
          {[
            { label: "Commission Rate", value: `${commission}%`, desc: "Platform fee on each sale" },
            { label: "Designer Payout", value: `${100 - commission}%`, desc: "Designer share of sale price" },
            { label: "Payout Currency", value: "PKR (₨)", desc: "Pakistani Rupee" },
            { label: "Payout Cycle", value: "Monthly", desc: "Payouts processed end of month" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-4 border-b border-stone-50 last:border-0">
              <div>
                <span className="text-[12px] text-charcoal-700 block">{row.label}</span>
                <span className="text-[10px] text-charcoal-400">{row.desc}</span>
              </div>
              <span className="text-[13px] text-charcoal-800 font-medium shrink-0">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform Health ────────────────────────── */}
      <section>
        <h2 className="font-serif text-lg text-charcoal-800 mb-1">Platform Health</h2>
        <p className="text-[11px] text-charcoal-400 mb-5">Current system status</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats?.kpis?.totalUsers || 0, color: "bg-emerald-500" },
            { label: "Designers", value: stats?.kpis?.totalDesigners || 0, color: "bg-blue-500" },
            { label: "Products", value: stats?.kpis?.totalProducts || 0, color: "bg-amber-500" },
            { label: "Orders", value: stats?.kpis?.totalOrders || 0, color: "bg-red-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-stone-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">{s.label}</span>
              </div>
              <p className="text-2xl font-serif text-charcoal-800">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Order Status Config ────────────────────── */}
      <section>
        <h2 className="font-serif text-lg text-charcoal-800 mb-1">Order Workflow</h2>
        <p className="text-[11px] text-charcoal-400 mb-5">Order status progression</p>
        <div className="bg-white border border-stone-200 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {["New", "Confirmed", "In Production", "Ready to Ship", "Shipped", "Delivered", "Cancelled"].map((s, i, arr) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border ${
                  s === "Cancelled"
                    ? "border-red-200 text-red-600 bg-red-50/50"
                    : "border-stone-200 text-charcoal-600 bg-stone-50"
                }`}>
                  {s}
                </span>
                {i < arr.length - 1 && s !== "Cancelled" && (
                  <span className="text-charcoal-300 text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Designer Plans ─────────────────────────── */}
      <section>
        <h2 className="font-serif text-lg text-charcoal-800 mb-1">Designer Plans</h2>
        <p className="text-[11px] text-charcoal-400 mb-5">Available subscription tiers</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Starter", price: "Free", features: ["5 Products", "Basic Analytics", "Standard Support"], color: "border-stone-200" },
            { name: "Professional", price: fmt(5000) + "/mo", features: ["Unlimited Products", "Advanced Analytics", "Priority Support", "Featured Badge"], color: "border-amber-300" },
            { name: "Enterprise", price: fmt(15000) + "/mo", features: ["Everything in Pro", "API Access", "Dedicated Manager", "Custom Branding"], color: "border-neutral-800" },
          ].map((plan) => (
            <div key={plan.name} className={`bg-white border ${plan.color} p-5`}>
              <p className="text-[14px] text-charcoal-800 font-medium mb-1">{plan.name}</p>
              <p className="text-[12px] text-charcoal-500 mb-3">{plan.price}</p>
              <ul className="space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="text-[11px] text-charcoal-500 flex items-center gap-1.5">
                    <span className="text-emerald-500 text-[10px]">●</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Danger Zone ────────────────────────────── */}
      <section>
        <h2 className="font-serif text-lg text-red-600 mb-1">Danger Zone</h2>
        <p className="text-[11px] text-charcoal-400 mb-5">Irreversible actions</p>
        <div className="bg-white border border-red-200 p-5 flex flex-wrap gap-3">
          <button className="px-4 py-2 text-[11px] uppercase tracking-wider text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
            Clear Cache
          </button>
          <button className="px-4 py-2 text-[11px] uppercase tracking-wider text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
            Rebuild Search Index
          </button>
        </div>
      </section>
    </div>
  );
}
